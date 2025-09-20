#!/bin/bash
set -e

# Установка локали
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Логирование
/bin/echo "Starting post-deploy at $(/bin/date)..." > /home/user/post-deploy.log 2>&1
/bin/echo "DEPLOY_PATH is $DEPLOY_PATH" >> /home/user/post-deploy.log 2>&1
/bin/echo "Checking /home/user permissions..." >> /home/user/post-deploy.log 2>&1
/bin/ls -ld /home/user >> /home/user/post-deploy.log 2>&1 || { /bin/echo "Failed to list /home/user" >> /home/user/post-deploy-error.log; exit 1; }
/bin/echo "Checking /home/user/current/backend..." >> /home/user/post-deploy.log 2>&1
/bin/ls -ld /home/user/current/backend >> /home/user/post-deploy.log 2>&1 || { /bin/echo "Directory /home/user/current/backend not found" >> /home/user/post-deploy-error.log; exit 1; }
cd /home/user/current/backend || { /bin/echo "Failed to cd to /home/user/current/backend" >> /home/user/post-deploy-error.log; exit 1; }

# Инициализация NVM
/bin/echo "Initializing NVM..." >> /home/user/post-deploy.log 2>&1
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || { /bin/echo "Failed to initialize NVM" >> /home/user/post-deploy-error.log; exit 1; }

# Установка typescript
/bin/echo "Installing typescript..." >> /home/user/post-deploy.log 2>&1
/home/user/.nvm/versions/node/v18.20.8/bin/npm install typescript >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  /bin/echo "Failed to install typescript" >> /home/user/post-deploy.log 2>&1
  exit 1
fi

# Установка зависимостей
/bin/echo "Installing dependencies..." >> /home/user/post-deploy.log 2>&1
/home/user/.nvm/versions/node/v18.20.8/bin/npm install >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  /bin/echo "Failed to install dependencies" >> /home/user/post-deploy.log 2>&1
  exit 1
fi

# Сборка
/bin/echo "Running build..." >> /home/user/post-deploy.log 2>&1
/home/user/.nvm/versions/node/v18.20.8/bin/npm run build >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  /bin/echo "Build failed" >> /home/user/post-deploy.log 2>&1
  exit 1
fi

# Проверка dist/app.js
/bin/echo "Checking dist/app.js..." >> /home/user/post-deploy.log 2>&1
/bin/ls -la dist/app.js >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  /bin/echo "dist/app.js not found" >> /home/user/post-deploy.log 2>&1
  exit 1
fi

# Запуск PM2
/bin/echo "Starting PM2..." >> /home/user/post-deploy.log 2>&1
/home/user/.nvm/versions/node/v18.20.8/bin/pm2 startOrReload /home/user/current/backend/ecosystem-backend.config.js --env production >> /home/user/post-deploy.log 2>&1
if [ $? -ne 0 ]; then
  /bin/echo "Failed to start PM2" >> /home/user/post-deploy.log 2>&1
  exit 1
fi

/bin/echo "=== Post-deploy completed successfully ===" >> /home/user/post-deploy.log 2>&1