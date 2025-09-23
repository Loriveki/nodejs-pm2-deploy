#!/bin/bash
set -e

# Установка локали
export LANG=C.UTF-8
export LC_ALL=C.UTF-8

# Переход в директорию
cd /home/user/current/frontend || { echo "Failed to cd to /home/user/current/frontend" > /home/user/post-deploy-frontend-error.log; exit 1; }

# Инициализация NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || { echo "Failed to initialize NVM" > /home/user/post-deploy-frontend-error.log; exit 1; }

# Установка зависимостей и сборка
/home/user/.nvm/versions/node/v18.20.8/bin/npm install && /home/user/.nvm/versions/node/v18.20.8/bin/npm run build >> /home/user/post-deploy-frontend-error.log 2>&1 || { echo "Failed to install dependencies or build" > /home/user/post-deploy-frontend-error.log; exit 1; }

# Запуск PM2
/home/user/.nvm/versions/node/v18.20.8/bin/pm2 startOrReload /home/user/current/frontend/ecosystem-frontend.config.js --env production >> /home/user/post-deploy-frontend-error.log 2>&1 || { echo "Failed to start PM2" > /home/user/post-deploy-frontend-error.log; exit 1; }