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
      cwd: './backend',
      env: { NODE_ENV: 'production' },
      interpreter: 'node',
    },
    {
      name: 'mesto-frontend',
      script: 'npx',
      args: 'serve -s build -l 3001',
      cwd: './frontend',
      env: { NODE_ENV: 'production' },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: 'origin/review',
      repo: DEPLOY_REPO,
      path: `${DEPLOY_PATH}/backend`,
      ssh_options: `IdentityFile=${DEPLOY_SSH_KEY}`,
      'pre-deploy': `
        # создаём папку backend на сервере, если её нет
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}/backend"
      `,
      'post-deploy': `
        # Бэкенд
        npm install &&
        npm run build &&
        pm2 reload ecosystem.config.js --only mesto-backend --env production &&

        # Фронтенд
        scp -r ../frontend/build/* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/frontend/build &&
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "cd ${DEPLOY_PATH}/frontend && pm2 reload ecosystem.config.js --only mesto-frontend --env production"
      `,
    },
  },
};
