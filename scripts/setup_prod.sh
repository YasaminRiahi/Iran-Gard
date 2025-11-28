#!/bin/bash
# Production environment setup (run on server)
# Usage: ./scripts/setup_prod.sh

echo "🔧 Setting up production environment..."
echo "⚠️  This script must be run on the production server!"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ This script must be run as root"
    exit 1
fi

# Create .env.prod if it doesn't exist
if [ ! -f "backend/.env.prod" ]; then
    echo "Creating backend/.env.prod..."
    cat > backend/.env.prod << 'EOF'
# Production Environment
ENVIRONMENT=prod

# Database (docker service name)
DATABASE_URL=postgresql://postgres:CHANGE_ME@postgres:5432/iran-gard
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGE_ME
POSTGRES_DB=iran-gard

# Security (GENERATE WITH: ./scripts/generate_secret.sh)
SECRET_KEY=CHANGE_ME
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SIGNUP_TOKEN_EXPIRE_MINUTES=15

# Project
PROJECT_NAME=Iran-Gard API
VERSION=1.0.0
API_STR=/api

# CORS (YOUR DOMAIN)
BACKEND_CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]

# Email (REQUIRED for production)
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server Config
DB_PORT=5432
BACKEND_PORT=8000
EOF
    echo "✓ Created backend/.env.prod"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env.prod and set:"
    echo "   • POSTGRES_PASSWORD (strong password)"
    echo "   • DATABASE_URL password"
    echo "   • SECRET_KEY (run: ./scripts/generate_secret.sh)"
    echo "   • BACKEND_CORS_ORIGINS (your domain)"
    echo "   • EMAIL_ADDRESS and EMAIL_PASSWORD"
else
    echo "✓ backend/.env.prod already exists"
    echo "⚠️  Verify all settings are correct before deploying"
fi

echo ""
echo "Next steps:"
echo "1. Edit backend/.env.prod with production values"
echo "2. Run: chmod +x deploy.sh && ./deploy.sh prod"
