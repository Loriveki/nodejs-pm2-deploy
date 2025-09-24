#!/bin/bash
set -e

ENV_FILE=${LOCAL_ENV_PATH:-/home/loriveki/nodejs-pm2-deploy/frontend/frontend.env}
DEPLOY_USER=${DEPLOY_USER:-user}
DEPLOY_HOST=${DEPLOY_HOST:-158.160.185.102}
DEPLOY_SSH_KEY=${DEPLOY_SSH_KEY:-/home/loriveki/.ssh/mesto_server}

if [ -f "$ENV_FILE" ]; then
  echo "Copying $ENV_FILE to $DEPLOY_USER@$DEPLOY_HOST:/home/user/shared/frontend.env..." >&2
  scp -i "$DEPLOY_SSH_KEY" "$ENV_FILE" "$DEPLOY_USER@$DEPLOY_HOST:/home/user/shared/frontend.env" >> /home/loriveki/pre-deploy-frontend-error.log 2>&1 || { echo "Failed to copy frontend.env file" >> /home/loriveki/pre-deploy-frontend-error.log; exit 1; }
  echo "Successfully copied frontend.env file" >&2
else
  echo "File $ENV_FILE does not exist!" >> /home/loriveki/pre-deploy-frontend-error.log
  exit 1
fi