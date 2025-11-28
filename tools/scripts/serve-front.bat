@echo off
REM Live Server for front-end development
REM Serves with hot reload - changes instantly reflect in browser
@REM npm install -g live-server --registry https://registry.npmmirror.com
cd "%~dp0..\..\frontend"
live-server --port=3000
pause
