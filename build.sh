#!/bin/bash
set -e

echo "Building Income Tracker..."

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
cd frontend
npm install
npm run build
cd ..

echo "Build completed successfully!"
