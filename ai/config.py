"""
config.py
=========
Central configuration for the IranGard AI module.

- Loads environment variables from ../.env
- Defines model names
- Provides a single chat() helper that talks to Groq
"""

import os
import time
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq, RateLimitError

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------

# .env is one level above the "ai" folder
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError(f"GROQ_API_KEY not found. Checked: {ENV_PATH}")

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

CHAT_MODEL      = os.getenv("CHAT_MODEL", "openai/gpt-oss-120b")
EMBED_MODEL     = os.getenv("EMBEDDING_MODEL", "bge-m3")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

# ---------------------------------------------------------------------------
# Groq client
# ---------------------------------------------------------------------------

_client = Groq(api_key=GROQ_API_KEY)


def chat(messages: list[dict], temperature: float = 0.2, retries: int = 3) -> str:
    """
    Send a chat request to Groq and return the reply text.

    Args:
        messages:    List of {"role": ..., "content": ...} dicts.
        temperature: Sampling temperature (low = more deterministic).
        retries:     How many times to retry on rate-limit (429) errors.

    Returns:
        The assistant's reply as a string.
    """
    for attempt in range(retries):
        try:
            resp = _client.chat.completions.create(
                model=CHAT_MODEL,
                messages=messages,
                temperature=temperature,
            )
            return resp.choices[0].message.content or ""
        except RateLimitError:
            if attempt == retries - 1:
                raise
            wait = 2 ** attempt
            print(f"[Groq] Rate limit hit, retrying in {wait}s ...")
            time.sleep(wait)
    return ""