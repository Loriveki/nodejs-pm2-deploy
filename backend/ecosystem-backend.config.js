require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_REPO,
  DEPLOY_SSH_KEY,
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
      'pre-deploy-local': `echo "Pre-deploy local hook executed"`,
      'post-deploy': `
        export NVM_DIR="$HOME/.nvm" &&
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" &&
        cd backend &&
        npm install &&
        npx tsc &&
        cp ../shared/.env ./.env &&
        pm2 startOrReload ../ecosystem-backend.config.js --env production
      `,
    },
  },
};
