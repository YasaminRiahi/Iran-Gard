"""
llm.py
======
LLM interface module for IranGard.

Responsibilities:
    - Translate Persian natural-language questions into SQL queries (Text-to-SQL)
    - Generate friendly Persian answers from raw database results
    - Provide a direct chat interface for general questions
"""

import re
from config import chat
from database import DB_SCHEMA


# ---------------------------------------------------------------------------
# Text-to-SQL
# ---------------------------------------------------------------------------

def question_to_sql(question: str) -> str:
    """
    Translate a Persian natural-language question into a SQL SELECT query
    using the local LLM and the database schema as context.

    The prompt uses few-shot examples (defined in DB_SCHEMA) to guide
    the model toward correct table/column usage.

    Args:
        question: Persian-language question from the user.

    Returns:
        A single SQL SELECT query string (may need cleaning).

    Raises:
        ValueError: If the LLM returns something that is not a SELECT query.
    """
    system_prompt = f"""You are an expert PostgreSQL query writer for the IranGard travel app.

DATABASE SCHEMA:
{DB_SCHEMA}

STRICT RULES:
1. Return ONLY a single SQL SELECT query — no explanations, no markdown, no backticks.
2. The query MUST start with SELECT.
3. Always add LIMIT 20 unless the question asks for a count or aggregate.
4. Use exact table and column names from the schema above.
5. For Persian city/province names, use them exactly as written in the question.
6. Never use INSERT, UPDATE, DELETE, DROP or any write operation.
7. There is NO 'categories' table. NEVER use JOIN with categories.
"""

    raw = chat([
    {"role": "system", "content": system_prompt},
    {"role": "user",   "content": f"Question: {question}\nSQL:"},
    ]).strip()

    # Strip markdown code fences if the model adds them (e.g. ```sql ... ```)
    cleaned = re.sub(r"```(?:sql)?", "", raw, flags=re.IGNORECASE).strip()
    cleaned = cleaned.strip("`").strip()
    cleaned = re.sub(r"\bLIMIT\s*(\d+)", r"LIMIT \1", cleaned, flags=re.IGNORECASE)

    # Keep only the first statement in case the model outputs multiple
    if ";" in cleaned:
        cleaned = cleaned.split(";")[0].strip()

    print(f"[LLM] Generated SQL: {cleaned}")

    # Validate that the result is a SELECT query
    if not cleaned.upper().startswith("SELECT"):
        raise ValueError(f"LLM returned a non-SELECT query: {cleaned[:80]}")

    return cleaned


# ---------------------------------------------------------------------------
# Answer generation from DB results
# ---------------------------------------------------------------------------

def generate_answer(question: str, data: list[dict]) -> str:
    """
    Generate a friendly Persian answer from raw database query results.

    Args:
        question: The original Persian question from the user.
        data:     List of dicts returned by run_query().

    Returns:
        A natural, friendly Persian answer based strictly on the data.
    """
    if not data:
        return "متأسفانه نتیجه‌ای در دیتابیس پیدا نشد."

    # Truncate data to avoid exceeding context window
    # Show at most 15 rows to the LLM
    truncated = data[:15]
    has_more  = len(data) > 15

    data_text = "\n".join(
        [", ".join(f"{k}: {v}" for k, v in row.items()) for row in truncated]
    )

    if has_more:
        data_text += f"\n... و {len(data) - 15} مورد دیگر"

    prompt = f"""You are a friendly travel assistant for IranGard.
The user asked a question and we fetched the following data from the database.
Write a helpful, natural Persian answer based ONLY on this data.
Do not add information that is not in the data.

User question: {question}

Data from database:
{data_text}

Answer in Persian:"""

    return chat([
    {"role": "system", "content": "You are a helpful Persian-speaking travel assistant for IranGard. Always reply in Persian. Be friendly and concise."},
    {"role": "user",   "content": prompt},
    ])


# ---------------------------------------------------------------------------
# General chat (no DB or RAG)
# ---------------------------------------------------------------------------

def general_chat(question: str) -> str:
    """
    Handle general travel-related questions that don't require database
    access or RAG retrieval (e.g. 'what should I pack for a trip to Isfahan?').

    Args:
        question: Persian-language question from the user.

    Returns:
        A helpful Persian answer from the LLM's general knowledge.
    """
    return chat([
    {"role": "system", "content": "You are a knowledgeable Persian-speaking travel assistant for IranGard, an Iranian travel app. Answer travel-related questions helpfully and concisely in Persian. If the question is unrelated to travel or Iran, politely redirect the user."},
    {"role": "user",   "content": question},
    ])


# ---------------------------------------------------------------------------
# Entry point — smoke test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("IranGard — LLM Module")
    print("=" * 60)

    # Test 1: Text-to-SQL
    print("\n--- Test 1: Text-to-SQL ---")
    test_questions = [
        "جاذبه‌های تاریخی اصفهان رو نشون بده",
        "پرلایک‌ترین جاذبه‌ها کدومان؟",
        "چند تا جاذبه طبیعی در شیراز داریم؟",
    ]

    for q in test_questions:
        print(f"\nQ: {q}")
        try:
            sql = question_to_sql(q)
            print(f"SQL: {sql}")
        except ValueError as e:
            print(f"ERROR: {e}")

    # Test 2: Answer generation with mock data
    print("\n--- Test 2: Answer Generation ---")
    mock_data = [
        {"place_name": "میدان نقش جهان", "description": "میدانی تاریخی در مرکز اصفهان"},
        {"place_name": "مسجد جامع اصفهان", "description": "قدیمی‌ترین مسجد اصفهان"},
    ]
    answer = generate_answer("جاذبه‌های اصفهان", mock_data)
    print(f"Answer: {answer}")