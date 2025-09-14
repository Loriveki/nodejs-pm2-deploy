require('dotenv').config({ path: '.env.deploy' });

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
      script: 'dist/app.js',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
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
  key: '/home/loriveki/.ssh/new_key/private_key',
  'pre-deploy': 'scp ./backend/.env user@158.160.185.102:/home/user/shared/.env',
  'post-deploy': `
    cd ${DEPLOY_PATH}/current &&
    npm install &&
    npm run build &&
    pm2 reload backend/ecosystem-backend.config.js --env production
  `,
},
},
};
