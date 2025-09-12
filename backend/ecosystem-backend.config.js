require('dotenv').config({ path: './.env.deploy' });

const {
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_REPO, DEPLOY_REF, DEPLOY_PATH, DEPLOY_SSH_KEY,
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
      repo: DEPLOY_REPO,
      ref: DEPLOY_REF,
      path: DEPLOY_PATH,
      ssh_options: `IdentityFile=${DEPLOY_SSH_KEY}`,
      'pre-deploy': `scp backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/source/backend/.env && ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}/source && cd ${DEPLOY_PATH}/source && git clone ${DEPLOY_REPO} . || git fetch && git checkout ${DEPLOY_REF}"`,
      'post-deploy': `cd ${DEPLOY_PATH}/source/backend && npm install && npm run build && pm2 reload ecosystem-backend.config.js --only mesto-backend --env production`,
    },
  },
};
