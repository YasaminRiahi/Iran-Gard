#!/bin/bash
# Backup production database
# Usage: ./scripts/backup_db.sh [prod|dev]

ENVIRONMENT=${1:-prod}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"

mkdir -p $BACKUP_DIR

echo "🔄 Backing up $ENVIRONMENT database..."

docker-compose exec -T postgres pg_dump \
    -U ${POSTGRES_USER:-postgres} \
    -d ${POSTGRES_DB:-iran-gard} \
    --no-password \
    > "$BACKUP_DIR/iran-gard_${ENVIRONMENT}_${TIMESTAMP}.sql"

if [ $? -eq 0 ]; then
    echo "✓ Backup created: $BACKUP_DIR/iran-gard_${ENVIRONMENT}_${TIMESTAMP}.sql"
    ls -lh "$BACKUP_DIR/iran-gard_${ENVIRONMENT}_${TIMESTAMP}.sql"
else
    echo "❌ Backup failed"
    exit 1
fi
