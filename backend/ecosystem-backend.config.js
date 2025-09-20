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

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'backend/dist/app.js',
      cwd: `${DEPLOY_PATH}/current`,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        DOTENV_CONFIG_PATH: `${DEPLOY_PATH}/shared/.env`,
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
        cd ${DEPLOY_PATH}/current/backend &&
        npm install typescript &&
        npm install &&
        npm run build && ls -la dist/app.js || echo "Build failed" &&
        pm2 startOrReload ${path.resolve(__dirname, 'ecosystem-backend.config.js')} --env production
      `,
    },
  },
};