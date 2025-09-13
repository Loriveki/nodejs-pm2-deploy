require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF = 'origin/review',
  DEPLOY_REPO,
  DEPLOY_SSH_KEY,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'backend-service',
      script: './dist/app.js',
      cwd: './backend',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
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

      'pre-deploy-local': `scp -i ${DEPLOY_SSH_KEY} ./backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env`,

      'post-deploy': `
        export NVM_DIR="$HOME/.nvm" &&
        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" &&
        cd ${DEPLOY_PATH}/current/backend &&
        cp ${DEPLOY_PATH}/shared/.env ./.env &&
        npm install &&
        npx tsc &&
        pm2 startOrReload ecosystem-backend.config.js --env production
      `,
    },
  },
};
