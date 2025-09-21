#!/bin/bash
set -e

# Используем переменные окружения
ENV_FILE=${LOCAL_ENV_PATH}
DEPLOY_USER=${DEPLOY_USER}
DEPLOY_HOST=${DEPLOY_HOST}
DEPLOY_SSH_KEY=${DEPLOY_SSH_KEY}

# Проверка .env файла
if [ -f "$ENV_FILE" ]; then
  scp -i "$DEPLOY_SSH_KEY" "$ENV_FILE" "$DEPLOY_USER@$DEPLOY_HOST:/home/user/shared/.env" >> /home/loriveki/pre-deploy.log 2>&1 || { echo "Failed to copy .env file" > /home/loriveki/pre-deploy.log; exit 1; }
else
  echo "File $ENV_FILE does not exist!" > /home/loriveki/pre-deploy.log
  exit 1
fi