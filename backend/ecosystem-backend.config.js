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
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      ssh_options: DEPLOY_SSH_KEY ? `-i ${DEPLOY_SSH_KEY}` : undefined,

      'pre-deploy-local': `[ -f backend/.env ] && scp backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/backend/.env || echo "No .env file to copy"`,

      'post-deploy': `
        cd ${DEPLOY_PATH}/backend &&
        npm install &&
        npm run build &&
        pm2 startOrReload ${DEPLOY_PATH}/ecosystem-backend.config.js --only mesto-backend --env production
      `,
    },
  },
};
