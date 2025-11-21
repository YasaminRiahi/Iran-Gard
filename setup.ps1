# PowerShell Setup Script for Iran-Gard API

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Iran-Gard API - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "[1/6] Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check PostgreSQL
Write-Host "[2/6] Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version 2>&1
    Write-Host "✓ PostgreSQL found: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ WARNING: PostgreSQL not found in PATH" -ForegroundColor Yellow
    Write-Host "  Please ensure PostgreSQL is installed" -ForegroundColor Yellow
}
Write-Host ""

# Activate virtual environment
Write-Host "[3/6] Setting up virtual environment..." -ForegroundColor Yellow
if (Test-Path ".venv\Scripts\Activate.ps1") {
    & .\.venv\Scripts\Activate.ps1
    Write-Host "✓ Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
    & .\.venv\Scripts\Activate.ps1
    Write-Host "✓ Virtual environment created and activated" -ForegroundColor Green
}
Write-Host ""

# Install dependencies
Write-Host "[4/6] Installing dependencies..." -ForegroundColor Yellow
pip install -q --upgrade pip
pip install -q -r requirements.txt
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ ERROR: Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check .env file
Write-Host "[5/6] Checking environment configuration..." -ForegroundColor Yellow
if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host ""
    Write-Host "⚠ IMPORTANT: Please edit .env file and configure:" -ForegroundColor Yellow
    Write-Host "  - DATABASE_URL (PostgreSQL connection string)" -ForegroundColor Yellow
    Write-Host "  - SECRET_KEY (run: python -c 'import secrets; print(secrets.token_urlsafe(32))')" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✓ .env file exists" -ForegroundColor Green
}
Write-Host ""

# Generate secret key suggestion
Write-Host "[6/6] Generating suggested SECRET_KEY..." -ForegroundColor Yellow
$secretKey = python -c "import secrets; print(secrets.token_urlsafe(32))"
Write-Host "Suggested SECRET_KEY: $secretKey" -ForegroundColor Cyan
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure .env file with your database credentials" -ForegroundColor White
Write-Host "2. Create PostgreSQL database:" -ForegroundColor White
Write-Host "   CREATE DATABASE iran_gard;" -ForegroundColor Gray
Write-Host "3. Run database schema:" -ForegroundColor White
Write-Host "   psql -U postgres -d iran_gard -f Database\tables.sql" -ForegroundColor Gray
Write-Host "4. Seed initial data (optional):" -ForegroundColor White
Write-Host "   python -m app.db.init_db" -ForegroundColor Gray
Write-Host "5. Start the development server:" -ForegroundColor White
Write-Host "   uvicorn main:app --reload" -ForegroundColor Gray
Write-Host ""
Write-Host "API Documentation: http://localhost:8000/api/v1/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

