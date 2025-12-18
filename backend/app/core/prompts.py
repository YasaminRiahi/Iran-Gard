"""
LLM Prompts Loader
Loads all prompts from text files in the prompts directory.
"""

from pathlib import Path
from typing import Dict

# Get the directory where this module is located
PROMPTS_DIR = Path(__file__).parent / "prompts"


def load_prompt(filename: str) -> str:
    """
    Load a prompt from a text file.

    Args:
        filename: Name of the prompt file (e.g., 'chatbot_default.txt')

    Returns:
        Content of the prompt file
    """
    filepath = PROMPTS_DIR / filename
    if not filepath.exists():
        raise FileNotFoundError(f"Prompt file not found: {filepath}")

    return filepath.read_text(encoding="utf-8")


def load_all_prompts() -> Dict[str, str]:
    """
    Load all prompts from the prompts directory.

    Returns:
        Dictionary with prompt names and their content
    """
    prompts = {}
    if PROMPTS_DIR.exists():
        for prompt_file in PROMPTS_DIR.glob("*.txt"):
            key = prompt_file.stem  # filename without extension
            prompts[key] = prompt_file.read_text(encoding="utf-8")

    return prompts


# Load prompts at module initialization
_all_prompts = load_all_prompts()

# Export commonly used prompts
CHATBOT_DEFAULT_SYSTEM_PROMPT = _all_prompts.get(
    "chatbot_default"
)
CHATBOT_CONTEXT_TEMPLATE = _all_prompts.get(
    "chatbot_context"
)
REVIEWS_SUMMARY_PROMPT = _all_prompts.get(
    "reviews_summary"
)


def build_reviews_prompt(reviews_list: list[str]) -> str:
    """
    Build the review summarization prompt from a list of reviews.

    Args:
        reviews_list: List of review strings

    Returns:
        Formatted prompt string
    """
    reviews_text = "\n".join([f"- {review}" for review in reviews_list])
    return REVIEWS_SUMMARY_PROMPT.format(reviews=reviews_text)


def build_chatbot_system_prompt(
    base_prompt: str | None = None, website_context: str | None = None
) -> str:
    """
    Build chatbot system prompt with optional context.

    Args:
        base_prompt: Custom base prompt (uses default if None)
        website_context: Website context to include (optional)

    Returns:
        Formatted system prompt
    """
    prompt = base_prompt or CHATBOT_DEFAULT_SYSTEM_PROMPT

    if website_context:
        prompt = CHATBOT_CONTEXT_TEMPLATE.format(
            base_prompt=prompt, context=website_context
        )

    return prompt
