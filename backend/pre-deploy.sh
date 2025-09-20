#!/bin/bash
echo "Current directory: $(pwd)"
echo "Checking .env file..."
ls -la /home/loriveki/nodejs-pm2-deploy/backend/.env
if [ $? -eq 0 ]; then
  echo "File exists, proceeding with scp..."
  scp -i /home/loriveki/.ssh/mesto_server /home/loriveki/nodejs-pm2-deploy/backend/.env user@158.160.185.102:/home/user/shared/.env
  if [ $? -eq 0 ]; then
    echo "Successfully copied .env file"
  else
    echo "Failed to copy .env file"
    exit 1
  fi
else
  echo "File does not exist!"
  exit 1
fi