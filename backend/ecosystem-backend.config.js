require('dotenv').config({ path: '.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_REPO,
  DEPLOY_SSH_KEY,
  LOCAL_ENV_PATH,
} = process.env;

const NODE_INTERPRETER = '/home/user/.nvm/versions/node/v22.19.0/bin/node';

module.exports = {
  apps: [
    {
      name: 'backend-service',
      script: './dist/app.js',
      cwd: './backend',
      interpreter: NODE_INTERPRETER,
      watch: false,
      instances: 1,
      autorestart: true,
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
      key: DEPLOY_SSH_KEY,
      'pre-deploy-local': `echo "Pre-deploy local hook executed"`,
      'post-deploy': `
        # Скопировать .env с локальной машины на сервер
        scp -i ${DEPLOY_SSH_KEY} ${LOCAL_ENV_PATH} ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/backend/.env &&

        # Зайти в директорию backend на сервере
        cd ${DEPLOY_PATH}/backend &&

        # Установить зависимости и собрать TypeScript
        npm install &&
        npx tsc &&

        # Перезапустить сервис через PM2
        pm2 startOrReload ${DEPLOY_PATH}/backend/ecosystem-backend.config.js --env production
      `,
    },
  },
};
