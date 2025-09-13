require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_REPO,
  DEPLOY_SSH_KEY,
  LOCAL_ENV_PATH,
} = process.env;

const NODE_INTERPRETER = '/home/user/.nvm/versions/node/v22.19.0/bin/node';

module.exports = {
  apps: [
    {
      name: 'backend-service',
      script: './dist/app.js',
      cwd: './backend',
      interpreter: NODE_INTERPRETER,
      watch: false,
      instances: 1,
      autorestart: true,
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

      'pre-deploy-local': `
        echo "Copying .env to server shared folder..." &&
        scp -i ${DEPLOY_SSH_KEY} ${LOCAL_ENV_PATH} ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/shared/.env
      `,

      'post-deploy': `
        export NVM_DIR="$HOME/.nvm" &&
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" &&
        cd ${DEPLOY_PATH}/current/backend &&
        cp ${DEPLOY_PATH}/shared/.env ./.env &&
        npm install &&
        npx tsc &&
        pm2 startOrReload ${DEPLOY_PATH}/current/backend/ecosystem-backend.config.js --env production
      `,
    },
  },
};
