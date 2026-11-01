"""
router.py
=========
Intelligent multi-source query router for IranGard.

Routing strategy (3 tiers):

    Tier 1 — Structured data (DB + RAG combined)
        - Classify question intent using LLM
        - If DB-answerable: run Text-to-SQL, fetch results
        - In parallel: search RAG knowledge base for enrichment
        - Merge both sources into one rich answer

    Tier 2 — Community knowledge (DB reviews)
        - If Tier 1 yields no results, search place_reviews table
        - Summarize real user experiences as the answer

    Tier 3 — General LLM knowledge
        - If no internal source has relevant data
        - Answer from LLM's general knowledge
"""

from config import chat
from database import run_query, DB_SCHEMA
from llm import question_to_sql, generate_answer, general_chat
from rag_engine import rag_answer, retrieve


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _rows_to_text(rows: list[dict], limit: int = 15) -> str:
    """Convert DB rows into a compact text block for the LLM prompt."""
    text = "\n".join(
        ", ".join(f"{k}: {v}" for k, v in row.items())
        for row in rows[:limit]
    )
    if len(rows) > limit:
        text += f"\n... و {len(rows) - limit} مورد دیگر"
    return text


# ---------------------------------------------------------------------------
# Intent classification
# ---------------------------------------------------------------------------

def classify_intent(question: str) -> dict:
    """
    Classify the user's question to determine which data sources to query.

    Returns a dict with:
        - use_db  (bool): Question can be answered with a SQL query
        - use_rag (bool): Question benefits from knowledge base context
        - db_type (str):  'stats' | 'list' | 'search' | 'none'

    The result is parsed from a simple key:value format to avoid
    JSON parsing failures.
    """
    prompt = f"""Analyze this Persian travel app question and classify it.
Answer with EXACTLY this format (no extra text):
use_db: yes/no
use_rag: yes/no
db_type: stats/list/search/none

Rules:
- use_db=yes if question asks about counts, lists of places, trips, users, likes, expenses
- use_rag=yes if question asks WHY a place is famous, WHEN to visit, WHAT to bring, history
- db_type=stats for COUNT/SUM questions
- db_type=list for listing places/trips/users
- db_type=search for finding specific places by city/category
- db_type=none if use_db=no

DATABASE SCHEMA (brief):
{DB_SCHEMA[:500]}

Question: {question}"""

    raw = chat([
        {"role": "system", "content": "You are a query classifier. Reply ONLY in the exact format requested."},
        {"role": "user",   "content": prompt},
    ]).lower()

    # Parse key:value pairs safely
    result = {
        "use_db":  "use_db: yes"  in raw,
        "use_rag": "use_rag: yes" in raw,
        "db_type": "none",
    }

    for db_type in ["stats", "list", "search"]:
        if f"db_type: {db_type}" in raw:
            result["db_type"] = db_type
            break

    print(f"[Router] Intent: use_db={result['use_db']}, "
          f"use_rag={result['use_rag']}, db_type={result['db_type']}")

    return result


# ---------------------------------------------------------------------------
# Tier 1 — DB + RAG combined
# ---------------------------------------------------------------------------

def tier1_db_and_rag(question: str, intent: dict) -> str | None:
    """
    Attempt to answer using structured database data, enriched with
    RAG knowledge base context when available.

    Returns:
        A merged Persian answer string, or None if no data was found.
    """
    db_data = []
    rag_context = ""
    db_success = False  # tracks whether the DB query actually returned rows

    # --- DB path ---
    if intent["use_db"]:
        try:
            sql = question_to_sql(question)
            db_data = run_query(sql)
            db_success = len(db_data) > 0
            print(f"[Tier1] DB returned {len(db_data)} rows")
        except Exception as e:
            print(f"[Tier1] DB error: {e}")
            # db_success stays False — RAG can still save the answer

    # --- RAG path ---
    if intent["use_rag"]:
        try:
            rag_chunks = retrieve(question, top_k=2)
            if rag_chunks:
                rag_context = "\n\n".join(rag_chunks)
                print(f"[Tier1] RAG returned {len(rag_chunks)} chunks")
        except Exception as e:
            print(f"[Tier1] RAG error: {e}")

    # Nothing found in either source → fall through to Tier 2
    if not db_success and not rag_context:
        return None

    # Pass only the sources that actually have data
    return _merge_answer(question, db_data if db_success else [], rag_context)


def _merge_answer(question: str, db_data: list[dict], rag_context: str) -> str:
    """
    Combine database rows and RAG context into a single natural answer.

    If only one source has data, it answers from that source alone.
    If both have data, it synthesizes them into one coherent response.
    """

    # ------------------------------------------------------------------ #
    # Path A — RAG only (DB returned nothing or was not queried)          #
    # ------------------------------------------------------------------ #
    if not db_data and rag_context:
        return chat([
            {
                "role": "system",
                "content": (
                    "You are a professional Persian travel assistant for IranGard. "
                    "Always reply in Persian. Be helpful, natural, and concise. "
                    "Avoid being overly enthusiastic or robotic."
                ),
            },
            {
                "role": "user",
                "content": f"""You are a professional Persian travel guide for the IranGard app.

Your job:
- Use the context below as your PRIMARY source of information.
- You MAY enrich the answer with your own general knowledge if needed.
- Write in natural, fluent Persian — like a knowledgeable friend, not a robot.
- Be informative and concise. Do NOT use filler phrases or be overly enthusiastic.
- If the context does not contain the answer, say so honestly.

---CONTEXT---
{rag_context}
---END CONTEXT---

Question: {question}
Answer in Persian:""",
            },
        ])

    # ------------------------------------------------------------------ #
    # Path B — DB only (RAG returned nothing or was not queried)          #
    # ------------------------------------------------------------------ #
    if db_data and not rag_context:
        db_text = _rows_to_text(db_data)

        return chat([
            {
                "role": "system",
                "content": (
                    "You are a professional Persian travel assistant for IranGard. "
                    "Always reply in Persian. Be helpful, natural, and concise."
                ),
            },
            {
                "role": "user",
                "content": f"""Answer the question below using ONLY the database results provided.
Present the information clearly and naturally in Persian.
Do not add information that is not in the data.

--- Database Results ---
{db_text}
--- End Results ---

Question: {question}
Answer in Persian:""",
            },
        ])

    # ------------------------------------------------------------------ #
    # Path C — Both DB and RAG have data → synthesize                     #
    # ------------------------------------------------------------------ #
    db_text = _rows_to_text(db_data)

    return chat([
        {
            "role": "system",
            "content": (
                "You are a professional Persian travel assistant for IranGard. "
                "Synthesize information from multiple sources into one clear answer. "
                "Always reply in Persian. Be concise and natural."
            ),
        },
        {
            "role": "user",
            "content": f"""Answer the question below by combining both sources naturally.
The database results give concrete facts; the knowledge base gives rich context.
Write a single, complete and coherent Persian answer — do not list sources separately.

--- Database Results ---
{db_text}
--- End Results ---

--- Knowledge Base ---
{rag_context}
--- End Knowledge Base ---

Question: {question}
Answer in Persian:""",
        },
    ])


# ---------------------------------------------------------------------------
# Tier 2 — Community reviews
# ---------------------------------------------------------------------------

def tier2_comments(question: str) -> str | None:
    """
    Search user reviews in the database for relevant experiences.

    Extracts a place name from the question, fetches recent reviews for
    matching places and summarizes them as a community-driven answer.

    Returns:
        A Persian answer based on user reviews, or None if none found.
    """
    print("[Tier2] Searching community reviews ...")

    place_name = _extract_place_name(question)

    if not place_name:
        print("[Tier2] Could not extract place name from question")
        return None

    print(f"[Tier2] Looking for reviews on: {place_name}")

    # Escape quotes and LIKE wildcards so the name cannot break the query
    safe_name = (
        place_name.replace("'", "''")
                  .replace("%", "")
                  .replace("_", " ")
                  .replace(";", " ")
    )

    try:
        sql = f"""
            SELECT
                pr.review,
                pr.rating,
                pr.created_at,
                p.place_name,
                p.city_name
            FROM place_reviews pr
            JOIN places p ON pr.place_id = p.place_id
            WHERE p.place_name ILIKE '%{safe_name}%'
               OR p.city_name  ILIKE '%{safe_name}%'
            ORDER BY pr.created_at DESC
            LIMIT 10
        """
        reviews = run_query(sql)

        if not reviews:
            print("[Tier2] No reviews found")
            return None

        print(f"[Tier2] Found {len(reviews)} reviews")

        # Include rating so the LLM can judge sentiment accurately
        reviews_text = "\n".join(
            f"- (rating: {r['rating']}/5) {r['review']}"
            for r in reviews
            if r.get("review")
        )

        if not reviews_text:
            return None

        prompt = f"""These are real user reviews from IranGard about the topic.
Summarize them into a helpful Persian answer for the question below.
Be objective. If reviews are mixed (positive and negative), reflect that honestly.
Mention the general rating trend if relevant.

User reviews:
{reviews_text}

Question: {question}
Answer in Persian:"""

        return chat([
            {
                "role": "system",
                "content": (
                    "You summarize user travel reviews in Persian. "
                    "Be objective and helpful. Always reply in Persian."
                ),
            },
            {"role": "user", "content": prompt},
        ])

    except Exception as e:
        print(f"[Tier2] Reviews query error: {e}")
        return None


def _extract_place_name(question: str) -> str:
    """
    Use the LLM to extract the main place or city name from a question.

    Returns:
        Extracted place name string, or empty string if none found.
    """
    result = chat([
        {
            "role": "system",
            "content": (
                "Extract the main place name, city name, or tourist attraction "
                "from the question. Reply with ONLY the name, written in Persian "
                "exactly as it appears in the question — nothing else. "
                "If there is no place name, reply with: none"
            ),
        },
        {"role": "user", "content": question},
    ]).strip()

    return "" if result.lower() in ["none", "هیچ", "ندارد"] else result


# ---------------------------------------------------------------------------
# Tier 3 — General LLM fallback
# ---------------------------------------------------------------------------

def tier3_general_fallback(question: str) -> str:
    """
    Final fallback: answer from the LLM's general knowledge.

    Returns:
        A Persian answer based on general knowledge.
    """
    print("[Tier3] Falling back to general LLM knowledge ...")

    answer = chat([
        {
            "role": "system",
            "content": (
                "You are a knowledgeable Persian travel assistant. "
                "Answer from general knowledge in Persian, in at least 4 complete sentences. "
                "IMPORTANT: Do NOT name specific restaurants, hotels, shops or other "
                "businesses, and do not invent addresses or prices, because you cannot "
                "verify them. Instead give general guidance: which areas or neighborhoods "
                "are known for it, what dishes or types of places to look for, and how to "
                "find reliable options."
            ),
        },
        {"role": "user", "content": question},
    ])

    return answer + "\n\n(توجه: این پاسخ بر اساس اطلاعات عمومی است و از پایگاه داده‌ی ایران‌گرد نیامده.)"

# ---------------------------------------------------------------------------
# Main router
# ---------------------------------------------------------------------------

def route(question: str) -> dict:
    """
    Main entry point for routing a user question through all tiers.

    Routing flow:
        1. Classify intent (DB / RAG / both)
        2. Try Tier 1: DB + RAG combined
        3. Try Tier 2: community reviews (if Tier 1 fails)
        4. Use Tier 3: general LLM fallback (always succeeds)

    Returns:
        dict with keys:
            - answer (str):  Final Persian answer
            - source (str):  'db+rag' | 'comments' | 'general'
            - tier   (int):  Which tier answered (1, 2, or 3)
    """
    print(f"\n{'='*60}")
    print(f"[Router] Routing question: {question}")
    print('='*60)

    # Step 1 — Classify intent
    intent = classify_intent(question)

    # Step 2 — Tier 1: DB + RAG
    answer = tier1_db_and_rag(question, intent)
    if answer:
        return {"answer": answer, "source": "db+rag", "tier": 1}

    # Step 3 — Tier 2: Community reviews
    answer = tier2_comments(question)
    if answer:
        return {"answer": answer, "source": "comments", "tier": 2}

    # Step 4 — Tier 3: General fallback (always returns something)
    answer = tier3_general_fallback(question)
    return {"answer": answer, "source": "general", "tier": 3}


# ---------------------------------------------------------------------------
# Entry point — smoke test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("IranGard — Router Module")
    print("=" * 60)

    test_questions = [
        "جاذبه‌های تاریخی اصفهان کدومان؟",                            # Tier 1: DB + RAG
        "بهتره چه زمانی به غار علیصدر بریم و چه وسایلی ببریم؟",        # Tier 1: RAG
        "بالاترین میانگین نظرات در مورد جاذبه‌های ایران کدومان؟",       # Tier 1: DB
        "بهترین رستوران‌های تهران کجاست؟",                            # Tier 3: general fallback
    ]

    for q in test_questions:
        result = route(q)
        print(f"\nQ: {q}")
        print(f"Source: {result['source']} (Tier {result['tier']})")
        print(f"A: {result['answer']}")
        print("-" * 60)