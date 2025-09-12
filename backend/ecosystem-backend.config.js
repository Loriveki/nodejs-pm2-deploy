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
      cwd: `${DEPLOY_PATH}/backend`,
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

      // Создание папки и клонирование репозитория
      'pre-deploy': `
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "
          mkdir -p ${DEPLOY_PATH} &&
          cd ${DEPLOY_PATH} &&
          if [ -d backend ]; then
            cd backend && git fetch && git reset --hard ${DEPLOY_REF} && git checkout ${DEPLOY_REF}
          else
            git clone -b ${DEPLOY_REF} ${DEPLOY_REPO} backend
          fi
        "
      `,

      // Установка зависимостей, билд и перезапуск
      'post-deploy': `
        cd ${DEPLOY_PATH}/backend &&
        npm install &&
        npm run build &&
        pm2 reload ecosystem-backend.config.js --only mesto-backend --env production
      `,
    },
  },
};
