"""
Utility functions for authentication and verification.
"""

import secrets
import string


def generate_verification_code(length: int = 6) -> str:
    """
    Generate a random verification code (digits only).

    Args:
        length: Length of the code (default 6 digits)

    Returns:
        Random 6-digit code as string
    """
    return "".join(secrets.choice(string.digits) for _ in range(length))
