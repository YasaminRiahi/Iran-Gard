# Iran-Gard Deployment Guide

## Quick Start - Development

```bash
# 1. On your local machine
chmod +x scripts/*.sh
./scripts/setup_dev.sh
./deploy.sh dev

# 2. Check if it's running
./scripts/health_check.sh dev

# 3. View logs
./scripts/logs.sh backend -f
```

**Access:**

- Backend: http://localhost:8000
- API Docs: http://localhost:8000/api/docs
- Database: localhost:5432

---

## Production Deployment

### Step 1: Server Setup

```bash
# SSH to your server
ssh root@your.server.ip

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone your repository
cd /opt
git clone https://github.com/yourusername/iran-gard.git
cd iran-gard
```

### Step 2: Configure Production

```bash
# Make scripts executable
chmod +x scripts/*.sh deploy.sh

# Generate secret key
./scripts/generate_secret.sh
# Copy the output to backend/.env.prod as SECRET_KEY

# Setup environment
sudo ./scripts/setup_prod.sh

# Edit with your actual values
sudo nano backend/.env.prod
```

**Important values to set:**

- `POSTGRES_PASSWORD` - Strong password (min 16 chars)
- `DATABASE_URL` - Update password to match
- `SECRET_KEY` - From generate_secret.sh
- `BACKEND_CORS_ORIGINS` - Your domain
- `EMAIL_ADDRESS` - Gmail address
- `EMAIL_PASSWORD` - Gmail app password (not regular password)

### Step 3: Deploy

```bash
# Deploy application
./deploy.sh prod

# Verify everything is running
./scripts/health_check.sh prod

# View logs
./scripts/logs.sh backend -f
```

### Step 4: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy Nginx config and update domain
sudo cp nginx.conf /etc/nginx/sites-available/iran-gard
sudo sed -i 's/yourdomain.com/YOUR_ACTUAL_DOMAIN/g' /etc/nginx/sites-available/iran-gard
sudo ln -s /etc/nginx/sites-available/iran-gard /etc/nginx/sites-enabled/iran-gard

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Set up auto-renewal
sudo certbot renew --dry-run
```

### Step 5: Backup Strategy

```bash
# Create backup directory
mkdir -p backups

# Backup database (do this regularly)
./scripts/backup_db.sh prod

# Restore from backup if needed
./scripts/restore_db.sh backups/iran-gard_prod_20251128_120000.sql
```

---

## Monitoring & Maintenance

```bash
# Check health
./scripts/health_check.sh prod

# View specific logs
./scripts/logs.sh backend       # Backend only
./scripts/logs.sh postgres      # Database only
./scripts/logs.sh all -f        # All (follow)

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# Update application
git pull
./deploy.sh prod
```

---

## Troubleshooting

**API not responding:**

```bash
./scripts/health_check.sh prod
./scripts/logs.sh backend
```

**Database connection failed:**

```bash
./scripts/logs.sh postgres
docker-compose exec postgres psql -U postgres -d iran-gard -c "\d"
```

**Need to run migrations manually:**

```bash
docker-compose exec backend alembic upgrade head
```

**Restore database from backup:**

```bash
./scripts/restore_db.sh backups/iran-gard_prod_TIMESTAMP.sql
```

---

## Key Differences: Dev vs Prod

| Aspect       | Dev                   | Prod                   |
| ------------ | --------------------- | ---------------------- |
| `.env` file  | `.env.dev`            | `.env.prod`            |
| Database     | Local container       | Container (persistent) |
| Secret Key   | Hardcoded             | Generated securely     |
| CORS Origins | localhost             | Your domain            |
| SSL          | No                    | Yes (Let's Encrypt)    |
| Volumes      | Mounted (live reload) | Not mounted            |
| Email        | Optional              | Required               |
| Logging      | Console               | Files + Nginx          |

**The only difference:** Change `./deploy.sh dev` to `./deploy.sh prod`

---

## Files Created

1. **deploy.sh** - Main deployment script (dev or prod)
2. **docker-compose.yml** - Docker services configuration
3. **backend/Dockerfile** - Backend container image
4. **scripts/setup_dev.sh** - Initialize development environment
5. **scripts/setup_prod.sh** - Initialize production environment
6. **scripts/generate_secret.sh** - Generate production secret key
7. **scripts/backup_db.sh** - Backup database
8. **scripts/restore_db.sh** - Restore from backup
9. **scripts/health_check.sh** - Monitor application health
10. **scripts/logs.sh** - View container logs
11. **nginx.conf** - Nginx reverse proxy configuration
12. **DEPLOYMENT.md** - This documentation
