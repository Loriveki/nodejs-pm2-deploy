require('dotenv').config({ path: './.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REPO,
  DEPLOY_PATH,
  DEPLOY_REF = 'review',
  DEPLOY_SSH_KEY,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: 'dist/app.js',
      cwd: `${DEPLOY_PATH}/source/backend`,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      interpreter: 'node',
      autorestart: true,
    },
  ],
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: `origin/${DEPLOY_REF}`,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      ssh_options: DEPLOY_SSH_KEY ? `IdentityFile=${DEPLOY_SSH_KEY}` : '',
      'pre-deploy': `scp backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/source/backend/.env && ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}/source && cd ${DEPLOY_PATH}/source && git clone ${DEPLOY_REPO} . || git fetch && git checkout origin/${DEPLOY_REF}"`,
      'post-deploy': `cd ${DEPLOY_PATH}/source/backend && npm install && npm run build && pm2 startOrReload ${DEPLOY_PATH}/source/ecosystem-backend.config.js --only mesto-backend --env production`,
    },
  },
};
