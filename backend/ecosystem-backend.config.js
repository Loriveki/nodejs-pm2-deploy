require('dotenv').config({ path: './backend/.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_PATH,
  DEPLOY_REF = 'origin/master',
  DEPLOY_SSH_KEY,
} = process.env;

const path = require('path');

const localEnvPath = path.resolve(__dirname, '.env');

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      watch: false,
      autorestart: true,
      max_restarts: 10,
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
      'pre-deploy': `scp "${localEnvPath}" ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/.env`,
      'post-deploy': `
        cd ${DEPLOY_PATH}/current &&
        npm install &&
        npm run build &&
        pm2 reload backend/ecosystem-backend.config.js --env production
      `,
    },
  },
};
