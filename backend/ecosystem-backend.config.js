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
        echo "Changing to backend directory" &&
        cd ${DEPLOY_PATH}/current/backend || { echo "Failed to cd to ${DEPLOY_PATH}/current/backend"; exit 1; } &&
        echo "Installing typescript" &&
        npm install typescript || { echo "Failed to install typescript"; exit 1; } &&
        echo "Installing dependencies" &&
        npm install || { echo "Failed to install dependencies"; exit 1; } &&
        echo "Running build" &&
        npm run build || { echo "Build failed"; exit 1; } &&
        echo "Checking dist/app.js" &&
        ls -la dist/app.js || { echo "dist/app.js not found"; exit 1; } &&
        echo "Starting PM2" &&
        pm2 startOrReload ${path.resolve(__dirname, 'ecosystem-backend.config.js')} --env production || { echo "Failed to start PM2"; exit 1; }
      `,
    },
  },
};