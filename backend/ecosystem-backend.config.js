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
        echo "Starting post-deploy..." &&
        echo "DEPLOY_PATH is ${DEPLOY_PATH}" &&
        cd ${DEPLOY_PATH}/current/backend || { echo "Failed to cd to ${DEPLOY_PATH}/current/backend"; exit 1; } &&
        chmod +x post-deploy.sh || { echo "Failed to chmod post-deploy.sh"; exit 1; } &&
        bash post-deploy.sh || { echo "Failed to run post-deploy.sh"; exit 1; }
      `,
    },
  },
};