#!/bin/bash
# Deploy Iran-Gard application (Development or Production)
# Usage: ./deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Deploying Iran-Gard ($ENVIRONMENT environment)"

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "Usage: ./deploy.sh [dev|prod]"
    exit 1
fi

# Check prerequisites
echo "✓ Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    exit 1
fi
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not installed"
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env.$ENVIRONMENT" ]; then
    echo "❌ Missing backend/.env.$ENVIRONMENT file"
    exit 1
fi

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build and start containers
echo "Building and starting containers..."
ENVIRONMENT=$ENVIRONMENT docker-compose up -d

# Wait for database to be ready
echo "Waiting for database..."
sleep 5
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
        echo "✓ Database is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Database failed to start"
        docker-compose logs postgres
        exit 1
    fi
    sleep 1
done

# Run migrations
echo "Running database migrations..."
if docker-compose exec -T backend alembic upgrade head; then
    echo "✓ Migrations completed"
else
    echo "⚠️  Migrations failed or skipped"
fi

# Verify API is running
echo "Verifying API..."
for i in {1..30}; do
    if docker-compose exec -T backend curl -f http://localhost:8000/api/docs > /dev/null 2>&1; then
        echo "✓ API is running"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ API failed to start"
        docker-compose logs backend
        exit 1
    fi
    sleep 1
done

echo ""
echo "✅ Deployment successful!"
echo ""
echo "Environment: $ENVIRONMENT"
docker-compose ps
echo ""
echo "📝 Next steps:"
if [ "$ENVIRONMENT" = "dev" ]; then
    echo "  • Backend: http://localhost:8000"
    echo "  • API Docs: http://localhost:8000/api/docs"
    echo "  • View logs: docker-compose logs -f backend"
else
    echo "  • Set up Nginx with SSL"
    echo "  • Configure domain in BACKEND_CORS_ORIGINS"
    echo "  • View logs: docker-compose logs -f backend"
fi
