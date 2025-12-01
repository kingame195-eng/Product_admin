#!/bin/bash

# Script để khởi động cả backend và frontend cùng lúc (Linux/Mac)
# Usage: ./start-dev.sh

echo ""
echo "==================================="
echo "Starting Product Admin System Dev"
echo "==================================="
echo ""

# Kiểm tra node có cài không
if ! command -v node &> /dev/null; then
    echo "Error: Node.js not installed!"
    exit 1
fi

echo "Starting backend and frontend..."
echo ""

# Chạy câu lệnh npm start:all
npm run start:all
