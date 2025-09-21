#!/bin/bash
set -e

# Отладка: выводим переменные окружения
echo "DEBUG: LOCAL_ENV_PATH=$LOCAL_ENV_PATH" > /home/loriveki/pre-deploy-error.log
echo "DEBUG: DEPLOY_USER=$DEPLOY_USER" >> /home/loriveki/pre-deploy-error.log
echo "DEBUG: DEPLOY_HOST=$DEPLOY_HOST" >> /home/loriveki/pre-deploy-error.log
echo "DEBUG: DEPLOY_SSH_KEY=$DEPLOY_SSH_KEY" >> /home/loriveki/pre-deploy-error.log

# Используем переменные окружения с fallback
ENV_FILE=${LOCAL_ENV_PATH:-/home/loriveki/nodejs-pm2-deploy/backend/.env}
DEPLOY_USER=${DEPLOY_USER:-user}
DEPLOY_HOST=${DEPLOY_HOST:-158.160.185.102}
DEPLOY_SSH_KEY=${DEPLOY_SSH_KEY:-/home/loriveki/.ssh/mesto_server}

# Проверка .env файла
if [ -f "$ENV_FILE" ]; then
  echo "File $ENV_FILE exists, proceeding with scp..." >> /home/loriveki/pre-deploy-error.log
  scp -i "$DEPLOY_SSH_KEY" "$ENV_FILE" "$DEPLOY_USER@$DEPLOY_HOST:/home/user/shared/.env" >> /home/loriveki/pre-deploy-error.log 2>&1 || { echo "Failed to copy .env file" >> /home/loriveki/pre-deploy-error.log; exit 1; }
else
  echo "File $ENV_FILE does not exist!" >> /home/loriveki/pre-deploy-error.log
  exit 1
fi