#!/bin/bash

echo "🔧 MongoDB Connection Troubleshooter"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    echo "📥 Install from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker found"
echo ""

# Check if MongoDB container exists
if docker ps -a --format '{{.Names}}' | grep -q "^mongodb$"; then
    echo "🔄 MongoDB container exists"
    echo "🛑 Stopping old container..."
    docker stop mongodb 2>/dev/null || true
    docker rm mongodb 2>/dev/null || true
else
    echo "📦 No MongoDB container found"
fi

echo ""
echo "🚀 Starting fresh MongoDB container..."
docker run -d -p 27017:27017 --name mongodb mongo:latest

echo ""
echo "⏳ Waiting for MongoDB to start..."
sleep 3

# Test connection
echo ""
echo "🧪 Testing connection..."
cd backend 2>/dev/null || cd $(dirname "$0")/backend
npm run test-db

echo ""
echo "✨ Done! If test passed:"
echo "   1️⃣  npm run seed       (populate database)"
echo "   2️⃣  npm run dev        (start backend)"
echo "   3️⃣  npm run dev        (in frontend folder for frontend)"
