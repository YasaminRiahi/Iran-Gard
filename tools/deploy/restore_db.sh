#!/bin/bash
# Restore database from backup
# Usage: ./scripts/restore_db.sh backups/iran-gard_prod_20251128_120000.sql

if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore_db.sh <backup_file>"
    echo ""
    echo "Available backups:"
    ls -lh backups/ 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  This will restore your database from: $BACKUP_FILE"
read -p "Are you sure? (type 'yes' to confirm): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

echo "🔄 Restoring database..."

# Drop existing database (optional - comment out to preserve)
docker-compose exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS \"iran-gard\";"

# Create fresh database
docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE \"iran-gard\";"

# Restore from backup
docker-compose exec -T postgres psql -U postgres -d iran-gard < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✓ Database restored successfully"
else
    echo "❌ Restore failed"
    exit 1
fi
