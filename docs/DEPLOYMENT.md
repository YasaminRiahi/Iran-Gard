# Production Deployment Guide

## Project Architecture

- **Backend**: FastAPI (Python) on port 8000
- **Frontend**: Vanilla HTML/CSS/JS (static files)
- **Database**: PostgreSQL
- **Config**: Environment-based (.env.prod for production)

---

## Recommended Approach: Docker + Nginx

**Why Docker?**

- Industry standard (80%+ of production deployments)
- Reproducible - same on dev/staging/prod
- Easy scaling - multiple containers
- Isolated - backend isolated from system
- Secure - container boundary

**Architecture:**

```
Server
├── Docker Container: Backend (FastAPI + Gunicorn)
├── Docker Container: PostgreSQL
├── Nginx (reverse proxy, static files)
└── SSL/TLS (Let's Encrypt)
```

---

## Step-by-Step Deployment

### 1. SSH & Initial Setup

```bash
ssh root@your.server.ip

# Update system
apt update && apt upgrade -y

# Install Docker + Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install -y docker-compose
```

### 2. Clone Project

```bash
cd /opt
git clone https://github.com/yourusername/iran-gard.git
cd iran-gard

# Create production environment file
nano backend/.env.prod
```

### 3. Configure .env.prod

Edit `backend/.env.prod`:

```dotenv
# Database (use docker service name, NOT localhost)
DATABASE_URL=postgresql://postgres:strongpassword@postgres:5432/iran-gard

# Security (GENERATE NEW SECRET KEY!)
SECRET_KEY=<generate-with-python>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SIGNUP_TOKEN_EXPIRE_MINUTES=15

# Environment
ENVIRONMENT=prod

# Project Info
PROJECT_NAME=Iran-Gard API
VERSION=1.0.0
API_STR=/api

# CORS (your domain)
BACKEND_CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]

# Email Configuration (required for signup/password reset)
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_ADDRESS=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# PostgreSQL (for docker-compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=strongpassword
POSTGRES_DB=iran-gard
```

**Generate SECRET_KEY:**

```python
python3 -c 'import secrets; print(secrets.token_urlsafe(32))'
```

### 4. Create docker-compose.yml

**Location:** Project root

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: iran-gard-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: iran-gard-backend
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      ENVIRONMENT: prod
    env_file:
      - backend/.env.prod
    ports:
      - "8000:8000"
    restart: always
    # Don't use volumes in production - use image only
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/docs"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
```

### 5. Create backend/Dockerfile

```dockerfile
FROM python:3.13-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy app
COPY . .

# Run migrations (important for Alembic!)
RUN ENVIRONMENT=prod alembic upgrade head || true

# Run with gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "--access-logfile", "-", "main:app"]
```

### 6. Create requirements.txt

Already done in `backend/requirements.txt`. For production, add Gunicorn:

```bash
cd backend
pip install gunicorn==21.2.0
pip freeze > requirements.txt
```

Your current requirements.txt has:

- FastAPI, Uvicorn
- SQLAlchemy, Alembic, Psycopg
- Pydantic, Email-validator
- Python-JOSE, Bcrypt, Cryptography
- Python-dotenv, Python-multipart

### 7. Create Nginx Configuration

**File:** `nginx.conf` (in project root)

```nginx
upstream backend {
    server backend:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend - Static HTML/CSS/JS files from /frontend/public/
    location / {
        alias /app/frontend/public/;
        try_files $uri $uri/ /index.html =404;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }

    # API Documentation
    location /api/docs {
        proxy_pass http://backend/api/docs;
        proxy_set_header Host $host;
    }

    location /api/redoc {
        proxy_pass http://backend/api/redoc;
        proxy_set_header Host $host;
    }
}
```

---

## Deployment Commands

```bash
# SSH to server
ssh root@your.server.ip
cd /opt/iran-gard

# First time setup
docker-compose up -d
docker-compose logs backend  # Check if migrations ran

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Check status
docker-compose ps

# Run migrations manually if needed
docker-compose exec backend alembic upgrade head

# Stop services
docker-compose down

# Update (pull new code and rebuild)
git pull
docker-compose up -d --build

# Check API is working
curl https://yourdomain.com/api/docs
```

---

## SSL Certificate (Let's Encrypt)

```bash
# Install certbot
apt install -y certbot python3-certbot-nginx

# Generate certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (automatic in background)
certbot renew --dry-run
```

---

## Environment Variables Reference

| Variable               | Dev              | Prod             | Notes                    |
| ---------------------- | ---------------- | ---------------- | ------------------------ |
| `DATABASE_URL`         | `localhost:5432` | `postgres:5432`  | Docker uses service name |
| `SECRET_KEY`           | Test key         | **New key**      | Generate with secrets    |
| `BACKEND_CORS_ORIGINS` | `localhost:3000` | `yourdomain.com` | Frontend domain          |
| `ENVIRONMENT`          | `dev`            | `prod`           | Determines .env file     |
| `EMAIL_ADDRESS`        | Can be empty     | **Required**     | Gmail address            |
| `EMAIL_PASSWORD`       | Can be empty     | **App password** | NOT regular password     |

---

## Common Issues & Solutions

| Issue                       | Solution                                            |
| --------------------------- | --------------------------------------------------- |
| "Connection refused"        | Use docker service name `postgres`, not `localhost` |
| "CORS error"                | Update `BACKEND_CORS_ORIGINS` to your domain        |
| "Email not sending"         | Gmail: enable 2FA, use app password                 |
| "Port 8000 in use"          | `docker ps`, `docker stop <container-id>`           |
| "SSL expired"               | `certbot renew` (automatic with cron)               |
| "Database connection error" | Check `DATABASE_URL` has service name not IP        |

---

## Monitoring & Maintenance

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Backup database
docker-compose exec postgres pg_dump -U postgres iran-gard > backup.sql

# Restore from backup
cat backup.sql | docker-compose exec -T postgres psql -U postgres

# Restart service
docker-compose restart backend

# View system stats
docker stats
```

---

## Quick Checklist

- [ ] SSH to server, install Docker
- [ ] Clone repository
- [ ] Create `.env.prod` with all secrets
- [ ] Generate new `SECRET_KEY`
- [ ] Create `docker-compose.yml`
- [ ] Create `backend/Dockerfile`
- [ ] Create `requirements.txt`
- [ ] Create `nginx.conf`
- [ ] Get SSL certificate from Let's Encrypt
- [ ] `docker-compose up -d`
- [ ] Test backend: `curl https://yourdomain.com/api/docs`
- [ ] Test frontend: `curl https://yourdomain.com/`
- [ ] Set up backups
- [ ] Set up monitoring (optional)

---

## Why This Approach?

✅ Industry standard (AWS, DigitalOcean, Heroku all use Docker internally)
✅ Same setup everywhere (dev/staging/prod consistency)
✅ Easy rollbacks - `git revert` + `docker-compose up -d --build`
✅ Easy scaling - add more containers with orchestration (Kubernetes)
✅ Easy monitoring - `docker logs` and Docker stats
✅ Security - containers isolated from host system
