#!/bin/bash
# Development environment setup
# Usage: ./scripts/setup_dev.sh

echo "🔧 Setting up development environment..."

# Create .env.dev if it doesn't exist
if [ ! -f "backend/.env.dev" ]; then
    echo "Creating backend/.env.dev..."
    cat > backend/.env.dev << 'EOF'
# Development Environment
ENVIRONMENT=dev

# Database (local docker)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/iran-gard
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=iran-gard

# Security (DEV ONLY - change for production!)
SECRET_KEY=dev-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SIGNUP_TOKEN_EXPIRE_MINUTES=15

# Project
PROJECT_NAME=Iran-Gard API
VERSION=1.0.0
API_STR=/api

# CORS (localhost for development)
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]

# Email (optional in dev)
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_ADDRESS=
EMAIL_PASSWORD=

# Server Config
DB_PORT=5432
BACKEND_PORT=8000
EOF
    echo "✓ Created backend/.env.dev"
else
    echo "✓ backend/.env.dev already exists"
fi

echo ""
echo "✅ Development setup complete!"
echo "Next: ./deploy.sh dev"
