@echo off
REM Setup script for Iran-Gard API

echo ========================================
echo Iran-Gard API - Setup Script
echo ========================================
echo.

REM Check Python
echo [1/6] Checking Python installation...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)
echo ✓ Python found
echo.

REM Check PostgreSQL
echo [2/6] Checking PostgreSQL...
psql --version
if errorlevel 1 (
    echo WARNING: PostgreSQL not found in PATH
    echo Please ensure PostgreSQL is installed
)
echo.

REM Activate virtual environment
echo [3/6] Activating virtual environment...
if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
    echo ✓ Virtual environment activated
) else (
    echo Creating virtual environment...
    python -m venv .venv
    call .venv\Scripts\activate.bat
    echo ✓ Virtual environment created and activated
)
echo.

REM Install dependencies
echo [4/6] Installing dependencies...
pip install -q --upgrade pip
pip install -q -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Check .env file
echo [5/6] Checking environment configuration...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠ IMPORTANT: Please edit .env file and configure:
    echo   - DATABASE_URL
    echo   - SECRET_KEY
    echo.
    pause
) else (
    echo ✓ .env file exists
)
echo.

REM Summary
echo [6/6] Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure .env file with your database credentials
echo 2. Create PostgreSQL database: CREATE DATABASE iran_gard;
echo 3. Run database schema: psql -U postgres -d iran_gard -f Database\tables.sql
echo 4. Seed initial data: python -m app.db.init_db
echo 5. Start server: uvicorn main:app --reload
echo.
echo Visit http://localhost:8000/api/v1/docs for API documentation
echo.
echo ========================================
pause

