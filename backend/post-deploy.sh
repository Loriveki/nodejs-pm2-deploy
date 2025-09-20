#!/bin/bash
set -e
source /etc/profile
echo "=== Post-deploy started at $(date) ==="
echo "Current directory: $(pwd)"

echo "Installing typescript..."
/usr/bin/npm install typescript
if [ $? -ne 0 ]; then
  echo "Failed to install typescript"
  exit 1
fi

echo "Installing dependencies..."
/usr/bin/npm install
if [ $? -ne 0 ]; then
  echo "Failed to install dependencies"
  exit 1
fi

echo "Running build..."
/usr/bin/npm run build
if [ $? -ne 0 ]; then
  echo "Build failed"
  exit 1
fi

echo "Checking dist/app.js..."
ls -la dist/app.js
if [ $? -ne 0 ]; then
  echo "dist/app.js not found"
  exit 1
fi

echo "Starting PM2..."
/usr/bin/pm2 startOrReload /home/user/current/backend/ecosystem-backend.config.js --env production
if [ $? -ne 0 ]; then
  echo "Failed to start PM2"
  exit 1
fi

echo "=== Post-deploy completed successfully ==="