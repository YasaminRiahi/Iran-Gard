"""
LLM Service Module - Grok AI Integration
Only keeps essential functions for your specific needs:
1. Review summarization (list of strings)
2. Website chatbot with context awareness
"""

import httpx
from app.core.config import settings
from app.core.prompts import (
    build_reviews_prompt,
    build_chatbot_system_prompt,
)
from typing import Optional, List, Dict, Generator
from groq import Groq
from pydantic import BaseModel


class ChatMessage(BaseModel):
    """Represents a chat message."""

    role: str  # "user", "assistant", "system"
    content: str


class LLMResponse(BaseModel):
    """Structured response from LLM."""

    content: str
    model: str
    stop_reason: Optional[str] = None
    usage: Optional[Dict[str, int]] = None


class StreamChunk(BaseModel):
    """Single chunk from a streaming response."""

    chunk: str
    model: str
    is_complete: bool = False
    stop_reason: Optional[str] = None
    usage: Optional[Dict[str, int]] = None


class GrokAIService:
    """
    Service for Grok AI interactions.
    Minimal focused API for summarization and chatbot.
    """

    def __init__(self, api_key: str, model: str = "", proxy: str = ""):
        """
        Initialize Grok AI Service.

        Args:
            api_key: Groq API key
            model: Model identifier
            proxy: Optional proxy URL
        """
        if proxy:
            http_client = httpx.Client(proxy=proxy)
            self.client = Groq(api_key=api_key, http_client=http_client)
        else:
            self.client = Groq(api_key=api_key)

        self.model = model
        self.conversation_history: List[ChatMessage] = []

    # ========================================================================
    # CHATBOT - Conversation with memory and context awareness
    # ========================================================================

    def chatbot_stream(
        self,
        user_message: str,
        website_context: Optional[str] = None,
        system_prompt: Optional[str] = None,
    ) -> Generator[StreamChunk, None, None]:
        """
        Stream chatbot response with memory and optional context.

        Args:
            user_message: User's question/message
            website_context: Information about website (e.g., FAQ, features) for context
            system_prompt: Custom system prompt (optional)

        Yields:
            StreamChunk objects as response arrives

        Usage:
            for chunk in service.chatbot_stream(
                "سوال مربوط به سایت",
                website_context="تاریخچه سایت..."
            ):
                if chunk.is_complete:
                    break
                print(chunk.chunk, end="")
        """
        # Add user message to history
        self.conversation_history.append(ChatMessage(role="user", content=user_message))

        # Build system prompt
        system_prompt = build_chatbot_system_prompt(system_prompt, website_context)

        # Prepare messages
        formatted_messages = [{"role": "system", "content": system_prompt}]
        formatted_messages.extend(
            [msg.model_dump() for msg in self.conversation_history]
        )

        # Stream response
        stream = self.client.chat.completions.create(
            messages=formatted_messages,
            model=self.model,
            temperature=0.7,
            stream=True,
        )

        full_response = ""

        for chunk in stream:
            if chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                full_response += content
                yield StreamChunk(
                    chunk=content,
                    model=self.model,
                    is_complete=False,
                )

            if chunk.choices[0].finish_reason:
                yield StreamChunk(
                    chunk="",
                    model=self.model,
                    is_complete=True,
                    stop_reason=chunk.choices[0].finish_reason,
                )

        # Add response to history
        self.conversation_history.append(
            ChatMessage(role="assistant", content=full_response)
        )

    def chatbot_complete(
        self,
        user_message: str,
        website_context: Optional[str] = None,
        system_prompt: Optional[str] = None,
    ) -> LLMResponse:
        """
        Get chatbot response as complete text (non-streaming).

        Args:
            user_message: User's question/message
            website_context: Information about website for context
            system_prompt: Custom system prompt (optional)

        Returns:
            LLMResponse with full response
        """
        # Add user message to history
        self.conversation_history.append(ChatMessage(role="user", content=user_message))

        # Build system prompt
        system_prompt = build_chatbot_system_prompt(system_prompt, website_context)

        # Prepare messages
        formatted_messages = [{"role": "system", "content": system_prompt}]
        formatted_messages.extend(
            [msg.model_dump() for msg in self.conversation_history]
        )

        # Get response
        response = self.client.chat.completions.create(
            messages=formatted_messages,
            model=self.model,
            temperature=0.7,
        )

        content = response.choices[0].message.content

        # Add to history
        self.conversation_history.append(ChatMessage(role="assistant", content=content))

        return LLMResponse(
            content=content,
            model=response.model,
            stop_reason=response.choices[0].finish_reason,
            usage={
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            },
        )

    def clear_history(self) -> None:
        """Clear conversation history."""
        self.conversation_history = []

    def get_history(self) -> List[ChatMessage]:
        """Get current conversation history."""
        return self.conversation_history.copy()

    # ========================================================================
    # SUMMARIZATION - Summarize list of review strings
    # ========================================================================

    def summarize_reviews(
        self,
        reviews: List[str],
    ) -> LLMResponse:
        """
        Summarize multiple reviews into a single coherent summary in Persian.

        Args:
            reviews: List of review strings to summarize

        Returns:
            LLMResponse with summary in Persian

        Usage:
            response = service.summarize_reviews([
                "جای خوبی بود",
                "من خیلی استفاده کردم",
                "توصیه می‌کنم"
            ])
            print(response.content)
        """
        if not reviews:
            return LLMResponse(
                content="هیچ بررسی برای خلاصه‌سازی وجود ندارد",
                model=self.model,
                stop_reason="error",
            )

        prompt = build_reviews_prompt(reviews)

        response = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=self.model,
            temperature=0.5,  # Lower temp for more consistent summaries
        )

        return LLMResponse(
            content=response.choices[0].message.content,
            model=response.model,
            stop_reason=response.choices[0].finish_reason,
            usage={
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            },
        )

    def summarize_reviews_stream(
        self,
        reviews: List[str],
    ) -> Generator[StreamChunk, None, None]:
        """
        Stream summarization of reviews (for large lists).

        Args:
            reviews: List of review strings

        Yields:
            StreamChunk objects as summary is generated
        """
        if not reviews:
            yield StreamChunk(
                chunk="",
                model=self.model,
                is_complete=True,
            )
            return

        prompt = build_reviews_prompt(reviews)

        stream = self.client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=self.model,
            temperature=0.5,
            stream=True,
        )

        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield StreamChunk(
                    chunk=chunk.choices[0].delta.content,
                    model=self.model,
                    is_complete=False,
                )

            if chunk.choices[0].finish_reason:
                yield StreamChunk(
                    chunk="",
                    model=self.model,
                    is_complete=True,
                    stop_reason=chunk.choices[0].finish_reason,
                )


def get_llm_service() -> GrokAIService | None:
    """Get LLM service if configured, returns None if disabled."""
    if not settings.LLM_ENABLED or not settings.GROQ_API_KEY:
        return None
    return GrokAIService(
        api_key=settings.GROQ_API_KEY,
        model=settings.LLM_MODEL,
        proxy=settings.LLM_PROXY,
    )
