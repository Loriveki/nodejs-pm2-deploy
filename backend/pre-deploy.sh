#!/bin/bash
set -e

# Проверка .env файла
if [ -f "$LOCAL_ENV_PATH" ]; then
  echo "Copying $LOCAL_ENV_PATH to $DEPLOY_USER@$DEPLOY_HOST:/home/user/shared/.env..." >&2
  scp -i "$DEPLOY_SSH_KEY" "$LOCAL_ENV_PATH" "$DEPLOY_USER@$DEPLOY_HOST:/home/user/shared/.env" || { echo "Failed to copy .env file" > /home/loriveki/pre-deploy-error.log; exit 1; }
  echo "Successfully copied .env file" >&2
else
  echo "File $LOCAL_ENV_PATH does not exist!" > /home/loriveki/pre-deploy-error.log
  exit 1
fi