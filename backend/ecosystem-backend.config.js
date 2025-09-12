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
      ref: `origin/${DEPLOY_REF}`,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      ssh_options: DEPLOY_SSH_KEY ? `IdentityFile=${DEPLOY_SSH_KEY}` : '',

      'pre-setup': `
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}/current/backend"
      `,

      'post-deploy': `
        cd ${DEPLOY_PATH}/current/backend &&
        if [ ! -d ".git" ]; then
          git clone -b ${DEPLOY_REF} ${DEPLOY_REPO} .;
        else
          git reset --hard;
          git pull origin ${DEPLOY_REF};
        fi &&
        npm install &&
        npm run build &&
        pm2 startOrReload ${DEPLOY_PATH}/current/backend/ecosystem-backend.config.js --only mesto-backend --env production
      `,
    },
  },
};
