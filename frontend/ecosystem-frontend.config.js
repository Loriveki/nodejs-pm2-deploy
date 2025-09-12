require('dotenv').config({ path: './.env.deploy' });

const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_REPO, DEPLOY_PATH, DEPLOY_SSH_KEY } = process.env;

module.exports = {
  apps: [
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
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}/frontend" &&
        git clone -b review ${DEPLOY_REPO} ${DEPLOY_PATH}/frontend
      `,
      'post-deploy': `
        cd ${DEPLOY_PATH}/frontend &&
        npm install &&
        NODE_OPTIONS=--openssl-legacy-provider npm run build &&
        sudo chown -R www-data:www-data ${DEPLOY_PATH}/frontend/build &&
        sudo chmod -R 755 ${DEPLOY_PATH}/frontend/build &&
        pm2 reload ${DEPLOY_PATH}/ecosystem-frontend.config.js --only mesto-frontend
      `,
    },
  },
};
