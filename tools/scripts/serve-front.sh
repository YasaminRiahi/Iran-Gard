#!/bin/bash
# Live Server for front-end development
# Serves with hot reload - changes instantly reflect in browser
cd "$(dirname "$0")/../../frontend"
live-server --port=3000
