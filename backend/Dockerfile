FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend ./backend

# Copy database migrations and files
COPY database ./database

# Copy static files
COPY static ./static

# Expose port
EXPOSE ${BACKEND_PORT}

# Run migrations and start uvicorn
WORKDIR /app/backend
CMD sh -c "alembic upgrade head && exec uvicorn main:app --host 0.0.0.0 --port 8000"