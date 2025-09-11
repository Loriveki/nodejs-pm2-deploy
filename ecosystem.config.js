require('dotenv').config({ path: './.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_PATH,
  DEPLOY_SSH_KEY,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      cwd: `${DEPLOY_PATH}/backend`,
      env: { NODE_ENV: 'production' },
      interpreter: 'node',
      autorestart: true,
    },
    {
      name: 'mesto-frontend',
      script: 'npx',
      args: 'serve -s build -l 3001',
      cwd: `${DEPLOY_PATH}/frontend`,
      env: { NODE_ENV: 'production' },
      autorestart: true,
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      repo: DEPLOY_REPO,
      ref: 'origin/review',
      path: DEPLOY_PATH,
      ssh_options: `IdentityFile=${DEPLOY_SSH_KEY}`,

      'pre-deploy': `
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}" &&
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "rm -rf ${DEPLOY_PATH}/backend ${DEPLOY_PATH}/frontend" &&
        git clone -b review ${DEPLOY_REPO} ${DEPLOY_PATH}
      `,

      'post-deploy': `
        # --- Бэкенд ---
        cd ${DEPLOY_PATH}/current/backend &&
        npm install &&
        npm run build &&
        pm2 reload ${DEPLOY_PATH}/ecosystem.config.js --only mesto-backend --env production &&

        # --- Фронтенд ---
        cd ${DEPLOY_PATH}/current/frontend &&
        npm install &&
        NODE_OPTIONS=--openssl-legacy-provider npm run build &&
        pm2 reload ${DEPLOY_PATH}/ecosystem.config.js --only mesto-frontend --env production
      `,
    },
  },
};
