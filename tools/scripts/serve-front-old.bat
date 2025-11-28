@echo off
REM Live Server for front-end development
REM Serves with hot reload - changes instantly reflect in browser
cd "%~dp0..\..\frontend"
live-server --port=3000
