require('dotenv').config({ path: './.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_REPO, DEPLOY_PATH, DEPLOY_SSH_KEY,
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
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}/backend ${DEPLOY_PATH}/frontend" &&
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "rm -rf ${DEPLOY_PATH}/backend ${DEPLOY_PATH}/frontend" &&
        git clone -b review ${DEPLOY_REPO} ${DEPLOY_PATH}
      `,
      'post-deploy': `
        cd ${DEPLOY_PATH}/backend &&
        npm install &&
        npm run build &&
        pm2 reload ${DEPLOY_PATH}/ecosystem-backend.config.js --only mesto-backend
      `,
    },
  },
};
