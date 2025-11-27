@echo off
REM Simple HTTP server to serve the front-end
cd "%~dp0Front"
python -m http.server 3000
