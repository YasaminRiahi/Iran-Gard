# Development Commands

## Start Development Server
```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Database Operations

### Initialize Database with Seed Data
```powershell
python -m app.db.init_db
```

### Run SQL Schema
```powershell
psql -U postgres -d iran_gard -f Database/tables.sql
```

### Create Database
```sql
CREATE DATABASE iran_gard;
```

## Testing

### Test Endpoint with cURL
```bash
# Register User
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"test\",\"email\":\"test@example.com\",\"password\":\"test123\"}"

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"
```

### Python Quick Test
```python
import requests

# Register
response = requests.post(
    "http://localhost:8000/api/v1/auth/register",
    json={"username": "ali", "email": "ali@test.com", "password": "password123"}
)
print(response.json())

# Login
response = requests.post(
    "http://localhost:8000/api/v1/auth/login",
    data={"username": "ali@test.com", "password": "password123"}
)
token = response.json()["access_token"]
print(f"Token: {token}")

# Get current user
response = requests.get(
    "http://localhost:8000/api/v1/users/me",
    headers={"Authorization": f"Bearer {token}"}
)
print(response.json())
```

## Generate Secret Key
```powershell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Check Installed Packages
```powershell
pip list | Select-String -Pattern "fastapi|pydantic|sqlalchemy"
```

## Database Migration (Future)
```powershell
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head
```

## Code Quality

### Format Code
```powershell
pip install black
black app/
```

### Lint Code
```powershell
pip install flake8
flake8 app/
```

### Type Checking
```powershell
pip install mypy
mypy app/
```

## Docker (Future)
```powershell
# Build image
docker build -t iran-gard-api .

# Run container
docker run -p 8000:8000 iran-gard-api
```

## Useful URLs
- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc
- OpenAPI JSON: http://localhost:8000/api/v1/openapi.json
- Health Check: http://localhost:8000/health

