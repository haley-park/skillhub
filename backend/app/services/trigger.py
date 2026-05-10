from __future__ import annotations

import time

from anthropic import Anthropic

from app.config import settings

_client: Anthropic | None = None


def _get_client() -> Anthropic:
    global _client
    if _client is None:
        _client = Anthropic(api_key=settings.anthropic_api_key)
    return _client


def _estimate_cost(input_tokens: int, output_tokens: int, model: str) -> float:
    model_lower = model.lower()
    if "haiku" in model_lower:
        # Haiku: $0.25/1M input, $1.25/1M output
        return (input_tokens * 0.25 + output_tokens * 1.25) / 1_000_000
    elif "opus" in model_lower:
        # Opus: $15/1M input, $75/1M output
        return (input_tokens * 15 + output_tokens * 75) / 1_000_000
    else:
        # Sonnet: $3/1M input, $15/1M output
        return (input_tokens * 3 + output_tokens * 15) / 1_000_000


def test_trigger(skill_name: str, skill_description: str, prompt: str) -> dict:
    system = (
        f'You have access to one skill: {skill_name}. Description: "{skill_description}".\n'
        "If the user's message would benefit from this skill, respond with exactly:\n"
        "TRIGGER: <one-sentence reason>\n"
        "Otherwise respond with:\n"
        "SKIP: <one-sentence reason>"
    )

    client = _get_client()
    start = time.perf_counter()

    response = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=200,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )

    latency_ms = int((time.perf_counter() - start) * 1000)
    content = response.content[0].text.strip()

    triggered = content.startswith("TRIGGER:")
    if ":" in content:
        reason = content.split(":", 1)[1].strip()
    else:
        reason = content

    input_tokens = response.usage.input_tokens
    output_tokens = response.usage.output_tokens
    tokens_used = input_tokens + output_tokens
    cost_usd = _estimate_cost(input_tokens, output_tokens, settings.anthropic_model)

    return {
        "triggered": triggered,
        "reason": reason,
        "tokens_used": tokens_used,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "latency_ms": latency_ms,
        "cost_usd": cost_usd,
    }
