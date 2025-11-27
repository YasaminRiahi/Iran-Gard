"""
Utility script to generate a secure SECRET_KEY for JWT authentication.
Run this script to generate a new secret key and add it to your .env file.

Usage:
    python -m app.utils.secret_key_generator
"""

import secrets
import string


def generate_secret_key(length: int = 64) -> str:
    """
    Generate a secure random secret key suitable for JWT signing.

    Args:
        length: Length of the secret key (default: 64 characters)

    Returns:
        A random string of uppercase, lowercase, digits, and special characters
    """
    # Use alphanumeric characters and special characters
    alphabet = string.ascii_letters + string.digits + string.punctuation
    secret_key = "".join(secrets.choice(alphabet) for _ in range(length))
    return secret_key


if __name__ == "__main__":
    print("=" * 70)
    print("SECRET KEY GENERATOR FOR IRAN-GARD API")
    print("=" * 70)
    print()

    # Generate a new secret key
    secret_key = generate_secret_key()

    print("Generated Secret Key:")
    print("-" * 70)
    print(secret_key)
    print("-" * 70)
    print()
