#!/bin/bash
set -e

ENV_FILE=${LOCAL_ENV_PATH:-/home/loriveki/nodejs-pm2-deploy/backend/.env}
DEPLOY_USER=${DEPLOY_USER:-user}
DEPLOY_HOST=${DEPLOY_HOST:-158.160.185.102}
DEPLOY_SSH_KEY=${DEPLOY_SSH_KEY:-/home/loriveki/.ssh/mesto_server}

echo "Current directory: $(pwd)" > /home/loriveki/pre-deploy.log
echo "Checking .env file..." >> /home/loriveki/pre-deploy.log
ls -la "$ENV_FILE" >> /home/loriveki/pre-deploy.log 2>&1
if [ $? -eq 0 ]; then
  echo "File exists, proceeding with scp..." >> /home/loriveki/pre-deploy.log
  scp -i "$DEPLOY_SSH_KEY" "$ENV_FILE" "$DEPLOY_USER@$DEPLOY_HOST:/home/user/shared/.env" >> /home/loriveki/pre-deploy.log 2>&1
  if [ $? -eq 0 ]; then
    echo "Successfully copied .env file" >> /home/loriveki/pre-deploy.log
  else
    echo "Failed to copy .env file" >> /home/loriveki/pre-deploy.log
    exit 1
  fi
else
  echo "File $ENV_FILE does not exist!" >> /home/loriveki/pre-deploy.log
  exit 1
fi