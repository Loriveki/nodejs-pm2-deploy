require('dotenv').config({ path: '.env.deploy' });
const path = require('path');

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_SSH_KEY,
} = process.env;

const LOCAL_ENV = path.resolve(__dirname, '.env');

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: '/home/user/current/backend/dist/app.js',
      cwd: '/home/user/current/backend',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      env_production: {
        NODE_ENV: 'production',
        DOTENV_CONFIG_PATH: '/home/user/shared/.env',
      },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER || 'user',
      host: DEPLOY_HOST || '158.160.185.102',
      ref: DEPLOY_REF || 'origin/review',
      repo: DEPLOY_REPO || 'https://github.com/Loriveki/nodejs-pm2-deploy.git',
      path: DEPLOY_PATH || '/home/user',
      key: DEPLOY_SSH_KEY || '/home/loriveki/.ssh/mesto_server',
      'pre-deploy-local': `bash ${path.resolve(__dirname, 'pre-deploy.sh')}`,
      'post-deploy': `
        set -e &&
        echo "Starting post-deploy at $(date)..." > /home/user/post-deploy.log &&
        echo "DEPLOY_PATH is ${DEPLOY_PATH}" >> /home/user/post-deploy.log &&
        cd /home/user/current/backend &&
        chmod +x post-deploy.sh &&
        bash post-deploy.sh >> /home/user/post-deploy.log 2>&1
      `,
    },
  },
};