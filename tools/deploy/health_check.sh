#!/bin/bash
# Health check and monitoring
# Usage: ./scripts/health_check.sh [dev|prod]

ENVIRONMENT=${1:-dev}

echo "🏥 Health check for $ENVIRONMENT environment"
echo ""

# Check Docker status
echo "Docker status:"
docker-compose ps

echo ""
echo "Container health:"
docker-compose ps --format "{{.Names}} {{.Status}}"

echo ""
echo "Checking API..."
if curl -f http://localhost:8000/api/docs > /dev/null 2>&1; then
    echo "✓ API is responding"
else
    echo "❌ API is not responding"
    echo "Logs:"
    docker-compose logs backend | tail -20
fi

echo ""
echo "Checking database..."
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✓ Database is responding"
else
    echo "❌ Database is not responding"
fi

echo ""
echo "Storage usage:"
docker system df
