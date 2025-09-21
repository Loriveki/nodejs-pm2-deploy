#!/bin/bash
set -e

# Переход в директорию
cd /home/user/current/backend || { echo "Failed to cd to /home/user/current/backend" > /home/user/post-deploy-error.log; exit 1; }

# Инициализация NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || { echo "Failed to initialize NVM" > /home/user/post-deploy-error.log; exit 1; }

# Установка зависимостей
/home/user/.nvm/versions/node/v18.20.8/bin/npm install >> /home/user/post-deploy-error.log 2>&1 || { echo "Failed to install dependencies" > /home/user/post-deploy-error.log; exit 1; }

# Сборка
/home/user/.nvm/versions/node/v18.20.8/bin/npm run build >> /home/user/post-deploy-error.log 2>&1 || { echo "Build failed" > /home/user/post-deploy-error.log; exit 1; }

# Запуск PM2
/home/user/.nvm/versions/node/v18.20.8/bin/pm2 startOrReload /home/user/current/backend/ecosystem-backend.config.js --env production >> /home/user/post-deploy-error.log 2>&1 || { echo "Failed to start PM2" > /home/user/post-deploy-error.log; exit 1; }