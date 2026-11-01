"""
rag_engine.py
=============
Retrieval-Augmented Generation (RAG) engine for IranGard.

Pipeline:
    1. Extract text from the knowledge base PDF
    2. Clean Persian/Arabic invisible characters
    3. Split text by place separator (===) instead of fixed-size chunks
    4. Generate embeddings for each place-chunk using a local Ollama model
    5. Store embeddings in a persistent ChromaDB vector database
    6. At query time, retrieve the most relevant chunks via cosine similarity
       and filter out low-confidence results using a distance threshold
    7. Pass retrieved context to the LLM to generate a grounded Persian answer
"""

import os
import re
import chromadb
import ollama
from config import chat, EMBED_MODEL, OLLAMA_BASE_URL

_ollama = ollama.Client(host=OLLAMA_BASE_URL)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
PDF_PATH    = os.path.join(BASE_DIR, "places_knowledge.txt")
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")

COLLECTION_NAME = "irangard_places"

# Number of chunks to retrieve per query
TOP_K = 3

# Cosine distance threshold — chunks with distance above this are discarded.
# Range: 0.0 (identical) → 2.0 (completely different). 0.5 is a safe default.
SIMILARITY_THRESHOLD = 0.5


# ---------------------------------------------------------------------------
# Persian text cleaning
# ---------------------------------------------------------------------------

def clean_persian_text(text: str) -> str:
    """
    Remove invisible Unicode control characters that are common in Persian/Arabic
    PDFs and can corrupt embeddings or break text matching.

    Characters removed:
        - RTL/LTR embedding and override markers
        - Zero-width spaces, joiners, and non-joiners
        - Byte-order mark and soft hyphen
    """
    invisible_chars = [
        '\u202a', '\u202b', '\u202c', '\u202d', '\u202e',  # directional embeddings
        '\u200f', '\u200e',                                  # RTL / LTR marks
        '\u200b', '\u200c', '\u200d',                        # zero-width chars
        '\ufeff', '\u00ad',                                  # BOM, soft hyphen
    ]
    for ch in invisible_chars:
        text = text.replace(ch, '')

    # Collapse multiple whitespace characters into a single space
    text = re.sub(r'\s+', ' ', text)

    # Strip non-printable ASCII control characters
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)

    return text.strip()


# ---------------------------------------------------------------------------
# PDF processing
# ---------------------------------------------------------------------------

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract and clean all text from a PDF file.
    Each page is prefixed with its page number for traceability.

    Args:
        pdf_path: Absolute path to the knowledge base PDF.

    Returns:
        Full cleaned text as a single string.
    """
    print(f"[TXT] Reading: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    print(f"[TXT] Read {len(text):,} characters")
    return text


# ---------------------------------------------------------------------------
# Place-based chunking
# ---------------------------------------------------------------------------

def split_by_place(text: str) -> list[str]:
    """
    Split the document into one chunk per tourist place using the '==='
    separator defined in the knowledge base PDF.

    This approach is far superior to fixed-size chunking for Q&A because:
        - Each chunk contains exactly one place's complete information
        - No place's data bleeds into another chunk
        - The LLM receives coherent, self-contained context

    PDF format expected:
        === Place Name (City) ===
        سوال : ...جواب : ...
        ...
        === Next Place ===

    Args:
        text: Full extracted PDF text.

    Returns:
        List of non-empty place chunks, each prefixed with its header.
    """
    # Split on lines that contain === markers
    raw_chunks = re.split(r'(===.+?===)', text)

    chunks   = []
    i        = 0
    header   = ""

    while i < len(raw_chunks):
        part = raw_chunks[i].strip()

        # Identify a place header  (=== ... ===)
        if re.match(r'^===.+?===$', part):
            header = part
        elif part and header:
            # Combine the header with its body content
            combined = f"{header}\n{part}".strip()
            if len(combined) > 50:  # skip near-empty chunks
                chunks.append(combined)
            header = ""
        i += 1

    print(f"[Chunker] Created {len(chunks)} place-based chunks")
    return chunks


# ---------------------------------------------------------------------------
# Embedding
# ---------------------------------------------------------------------------

def embed(text: str) -> list[float]:
    """
    Generate a vector embedding for the given text using the local Ollama
    embedding model. Text is cleaned before embedding.

    Args:
        text: Raw input text (Persian or mixed).

    Returns:
        Embedding vector as a list of floats.
    """
    clean_text = clean_persian_text(text)
    response = _ollama.embeddings(model=EMBED_MODEL, prompt=clean_text)
    return response["embedding"]


# ---------------------------------------------------------------------------
# Vector database management
# ---------------------------------------------------------------------------

def _get_client() -> chromadb.PersistentClient:
    """Return a persistent ChromaDB client at CHROMA_PATH."""
    return chromadb.PersistentClient(path=CHROMA_PATH)


def db_exists() -> bool:
    """
    Check whether the vector database has already been built and is non-empty.

    Returns:
        True if the collection exists and contains at least one document.
    """
    try:
        collection = _get_client().get_collection(COLLECTION_NAME)
        return collection.count() > 0
    except Exception:
        return False


def build_vector_db() -> None:
    """
    Build the ChromaDB vector database from the knowledge base PDF.

    This function is idempotent — it drops and recreates the collection on
    every call, so re-running it after updating the PDF is always safe.

    To force a rebuild manually, delete the chroma_db/ directory and re-run:
        rm -rf chroma_db/
        python rag_engine.py
    """
    print("[VectorDB] Building vector database ...")
    client = _get_client()

    # Drop stale collection if it exists
    try:
        client.delete_collection(COLLECTION_NAME)
        print("[VectorDB] Dropped existing collection")
    except Exception:
        pass

    collection = client.create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )

    text   = extract_text_from_pdf(PDF_PATH)
    chunks = split_by_place(text)

    print(f"[VectorDB] Embedding {len(chunks)} chunks with '{EMBED_MODEL}' ...")

    success_count = 0
    for i, chunk in enumerate(chunks):
        try:
            vector = embed(chunk)
            collection.add(
                ids=[f"place_{i}"],
                embeddings=[vector],
                documents=[chunk],
                metadatas=[{"chunk_index": i}],
            )
            success_count += 1

            if (i + 1) % 10 == 0:
                print(f"[VectorDB] Progress: {i + 1}/{len(chunks)}")

        except Exception as exc:
            print(f"[VectorDB] WARNING: Failed to embed chunk {i}: {exc}")

    print(f"[VectorDB] Done. {success_count}/{len(chunks)} chunks stored.")


def _load_collection() -> chromadb.Collection:
    """Load and return the existing ChromaDB collection."""
    return _get_client().get_collection(COLLECTION_NAME)


# ---------------------------------------------------------------------------
# Retrieval
# ---------------------------------------------------------------------------

def retrieve(query: str, top_k: int = TOP_K) -> list[str]:
    """
    Hybrid retrieval: keyword match first, vector similarity as fallback.
    """
    collection = _load_collection()

    # Step 1 — Try keyword match on place headers first
    all_docs = collection.get(include=["documents"])
    all_chunks = all_docs["documents"] if all_docs["documents"] else []

    keyword_matches = []
    query_clean = clean_persian_text(query.lower())

    for chunk in all_chunks:
        # Extract header line (=== Place Name ===)
        first_line = chunk.split('\n')[0]
        header_clean = clean_persian_text(first_line.lower())

        # Check if any word from query appears in the header
        query_words = [w for w in query_clean.split() if len(w) > 2]
        if any(word in header_clean for word in query_words):
            keyword_matches.append(chunk)

    if keyword_matches:
        print(f"[Retrieval] Keyword match found: {len(keyword_matches)} chunks")
        return keyword_matches[:top_k]

    # Step 2 — Fallback to vector search if no keyword match
    print(f"[Retrieval] No keyword match — falling back to vector search")
    query_vector = embed(query)

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k,
        include=["documents", "distances"],
    )

    documents = results["documents"][0] if results["documents"] else []
    distances = results["distances"][0] if results["distances"] else []

    print(f"[Retrieval] Raw distances: {[round(d, 3) for d in distances]}")

    filtered = [
        doc for doc, dist in zip(documents, distances)
        if dist < SIMILARITY_THRESHOLD
    ]

    print(f"[Retrieval] {len(documents)} candidates → "
          f"{len(filtered)} passed threshold ({SIMILARITY_THRESHOLD})")

    return filtered


# ---------------------------------------------------------------------------
# Answer generation
# ---------------------------------------------------------------------------

def rag_answer(question: str) -> str:
    """
    Answer a user question using the full RAG pipeline:
        retrieve → augment prompt → generate grounded answer.

    The prompt explicitly instructs the LLM to:
        - Answer ONLY from the provided context
        - Never guess or use prior knowledge
        - Respond in Persian

    Args:
        question: Persian-language question from the user.

    Returns:
        Persian-language answer, or a polite "not found" message.
    """
    print(f"\n[RAG] Question: {question}")

    # Step 1 — Retrieve relevant chunks
    chunks = retrieve(question)

    if not chunks:
        return "متأسفانه اطلاعاتی درباره این موضوع در پایگاه دانش ایران‌گرد پیدا نشد."

    context = "\n\n---\n\n".join(chunks)

    # Step 2 — Build the augmented prompt
    prompt = f"""You are a travel assistant for the IranGard application.

STRICT RULES — you must follow these without exception:
1. Answer ONLY using the information inside ---CONTEXT---.
2. Do NOT use any prior knowledge or make assumptions.
3. If you dont find any answer in the context, respond with exactly:
   "اطلاعاتی در پایگاه دانش پیدا نشد."
4. Always reply in Persian (Farsi) with a friendly and helpful tone.

---CONTEXT---
{context}
---END CONTEXT---

Question: {question}
Answer:"""

    # Step 3 — Generate answer
    return chat([
    {"role": "system", "content": "You are a strict, helpful Persian-speaking travel assistant for IranGard. You only answer from the provided context. You never hallucinate or use outside knowledge. Always reply in Persian."},
    {"role": "user",   "content": prompt},
    ])


# ---------------------------------------------------------------------------
# Entry point — smoke test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("IranGard — RAG Engine")
    print("=" * 60)

    # Delete chroma_db/ folder if you want to force a rebuild
    if not db_exists():
        print("\n[Init] Vector DB not found — building from PDF ...")
        build_vector_db()
    else:
        print("\n[Init] Vector DB already exists — skipping build")

    # Smoke test — change this question to test different places
    print("\n--- Smoke Test ---")
    sample_question = "دربند چرا معروفه؟"
    answer = rag_answer(sample_question)
    print(f"\nQ: {sample_question}")
    print(f"A: {answer}")

