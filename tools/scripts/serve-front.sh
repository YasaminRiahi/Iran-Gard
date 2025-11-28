#!/bin/bash
# Simple Python HTTP server to serve the front-end
# Navigate to frontend directory from tools/scripts/
cd "$(dirname "$0")/../../frontend"
python -m http.server 3000
