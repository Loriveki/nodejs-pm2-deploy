#!/bin/bash
echo "=== Post-deploy started ===" >> /home/user/post-deploy.log
echo "Current directory: $(pwd)" >> /home/user/post-deploy.log

echo "Installing typescript..." >> /home/user/post-deploy.log
npm install typescript >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  echo "Failed to install typescript" >> /home/user/post-deploy.log
  exit 1
fi

echo "Installing dependencies..." >> /home/user/post-deploy.log
npm install >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  echo "Failed to install dependencies" >> /home/user/post-deploy.log
  exit 1
fi

echo "Running build..." >> /home/user/post-deploy.log
npm run build >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  echo "Build failed" >> /home/user/post-deploy.log
  exit 1
fi

echo "Checking dist/app.js..." >> /home/user/post-deploy.log
ls -la dist/app.js >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  echo "dist/app.js not found" >> /home/user/post-deploy.log
  exit 1
fi

echo "Starting PM2..." >> /home/user/post-deploy.log
pm2 startOrReload /home/user/current/backend/ecosystem-backend.config.js --env production >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  echo "Failed to start PM2" >> /home/user/post-deploy.log
  exit 1
fi

echo "=== Post-deploy completed successfully ===" >> /home/user/post-deploy.log