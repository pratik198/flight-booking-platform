#!/bin/bash

# Flight Booking Platform - Quick Start Script
# Run this script to start the entire application

echo "🚀 Flight Booking Platform - Starting Services"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Start Backend
echo ""
echo "📦 Starting Backend Server..."
cd server 2>/dev/null || { echo "❌ Cannot find server directory"; exit 1; }
npm run dev &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID) on http://localhost:5000"

# Wait for backend to start
sleep 3

# Start Frontend  
echo ""
echo "🎨 Starting Frontend Server..."
cd ../client 2>/dev/null || { echo "❌ Cannot find client directory"; exit 1; }
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID) on http://localhost:5176"

echo ""
echo "================================================"
echo "🎉 Application is running!"
echo ""
echo "📍 Open your browser: http://localhost:5176"
echo ""
echo "To stop the application, press Ctrl+C"
echo "================================================"

# Keep script running
wait
