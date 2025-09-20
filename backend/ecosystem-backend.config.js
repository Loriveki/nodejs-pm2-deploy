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
        echo "Starting post-deploy at $(date)" > /home/user/post-deploy.log &&
        echo "DEPLOY_PATH is ${DEPLOY_PATH}" >> /home/user/post-deploy.log &&
        whoami >> /home/user/post-deploy.log &&
        pwd >> /home/user/post-deploy.log &&
        ls -la /home/user/current/backend/post-deploy.sh >> /home/user/post-deploy.log &&
        chmod +x /home/user/current/backend/post-deploy.sh >> /home/user/post-deploy.log 2>&1 &&
        bash /home/user/current/backend/post-deploy.sh >> /home/user/post-deploy.log 2>&1 || { echo "Failed to run post-deploy.sh" >> /home/user/post-deploy.log; exit 1; }
      `,
    },
  },
};