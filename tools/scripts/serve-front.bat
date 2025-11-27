@echo off
REM Simple HTTP server to serve the front-end
REM Navigate to frontend directory from tools/scripts/
cd "%~dp0..\..\frontend"
python -m http.server 3000
