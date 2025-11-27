#!/bin/bash
# Simple Python HTTP server to serve the front-end
cd "$(dirname "$0")/Front"
python -m http.server 3000
