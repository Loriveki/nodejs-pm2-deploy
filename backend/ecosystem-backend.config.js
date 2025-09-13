require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_REPO,
  DEPLOY_SSH_KEY,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'backend-service',
      script: './dist/app.js',
      watch: false,
      instances: 1,
      autorestart: true,
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
      'pre-deploy-local': `scp -i ${DEPLOY_SSH_KEY} ./backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env`,
      'post-deploy': 'export NVM_DIR="$HOME/.nvm" && source $NVM_DIR/nvm.sh && npm install && npm run build && cp ../shared/.env ./.env && pm2 reload ecosystem-backend.config.js --env production',
    },
  },
};
