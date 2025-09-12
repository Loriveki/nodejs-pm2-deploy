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
      cwd: `${DEPLOY_PATH}/current/backend`,
      env: { NODE_ENV: 'production', PORT: 3000 },
      interpreter: 'node',
      autorestart: true,
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      repo: DEPLOY_REPO,
      ref: `origin/${DEPLOY_REF}`,
      path: DEPLOY_PATH,
      ssh_options: DEPLOY_SSH_KEY ? `IdentityFile=${DEPLOY_SSH_KEY}` : '',

      'pre-setup': `
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}"
      `,

      'post-setup': `
        git clone -b ${DEPLOY_REF} ${DEPLOY_REPO} ${DEPLOY_PATH}/source
      `,

      'post-deploy': `
        cd ${DEPLOY_PATH}/current/backend &&
        npm install &&
        npm run build &&
        pm2 startOrReload ecosystem-backend.config.js --env production
      `,
    },
  },
};
