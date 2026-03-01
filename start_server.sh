#!/bin/bash
# Quick start script for Enchantment Engine Server

echo "=========================================="
echo "  Enchantment Game Engine Server"
echo "=========================================="
echo ""

# Check if executable exists
if [ ! -f "src/server/build/enchantment_server" ]; then
    echo "ERROR: Server executable not found!"
    echo "Please run build_server.sh first to compile the server."
    echo ""
    exit 1
fi

# Start server
echo "Starting server on port 8080..."
echo "Web interface: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

./src/server/build/enchantment_server --port 8080 --project .
