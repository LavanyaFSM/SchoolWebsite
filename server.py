#!/usr/bin/env python3
"""
Simple local development server for SchoolWebsite
Run this script to serve the website locally on http://localhost:8000
"""

import http.server
import socketserver
import os
from pathlib import Path

# Change to the script's directory
os.chdir(Path(__file__).parent)

PORT = 8000
HANDLER = http.server.SimpleHTTPRequestHandler

print(f"Starting server at http://localhost:{PORT}")
print("Press Ctrl+C to stop the server")
print("\nServing files from:", os.getcwd())

try:
    with socketserver.TCPServer(("", PORT), HANDLER) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
