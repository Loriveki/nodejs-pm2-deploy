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
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      key: DEPLOY_SSH_KEY,
      'pre-deploy-local': `bash ${path.resolve(__dirname, 'pre-deploy.sh')}`,
      'post-deploy': `
        set -e &&
        echo "Starting post-deploy..." &&
        echo "DEPLOY_PATH is ${DEPLOY_PATH}" &&
        cd /home/user/current/backend &&
        chmod +x post-deploy.sh &&
        source /etc/profile &&
        bash post-deploy.sh
      `,
    },
  },
};