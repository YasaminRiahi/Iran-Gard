#!/bin/bash
# Generate secret key for production
# Usage: ./scripts/generate_secret.sh

python3 -c 'import secrets; print(secrets.token_urlsafe(32))' | tee secret.key
echo ""
echo "✓ Secret key generated and saved to secret.key"
echo "⚠️  Copy this value to backend/.env.prod as SECRET_KEY"
