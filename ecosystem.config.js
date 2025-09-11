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
      autorestart: true,
    },
    {
      name: 'mesto-frontend',
      script: 'npx',
      args: 'serve -s build -l 3001',
      cwd: './frontend',
      env: { NODE_ENV: 'production' },
      autorestart: true,
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: 'origin/review',
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      ssh_options: `IdentityFile=${DEPLOY_SSH_KEY}`,

      'pre-deploy': `
        # Создать папки
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}/backend ${DEPLOY_PATH}/frontend" &&
        # Копируем env-файлы
        scp ./backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/backend/.env
      `,

      'post-deploy': `
        # --- Бэкенд ---
        cd backend &&
        npm install &&
        npm run build &&
        pm2 reload ecosystem.config.js --only mesto-backend --env production &&

        # --- Фронтенд ---
        cd ../frontend &&
        npm install &&
        NODE_OPTIONS=--openssl-legacy-provider npm run build &&
        pm2 reload ecosystem.config.js --only mesto-frontend --env production
      `,
    },
  },
};
