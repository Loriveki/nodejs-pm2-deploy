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
      cwd: '/home/user/current/backend',
      env: { NODE_ENV: 'production' },
      interpreter: 'node',
      autorestart: true,
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      repo: DEPLOY_REPO,
      ref: 'origin/review',
      path: '/home/user',
      ssh_options: `IdentityFile=${DEPLOY_SSH_KEY}`,

      'pre-deploy': `
        # создаём папки, чистим старое
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p /home/user/current /home/user/shared" &&
        ssh ${DEPLOY_USER}@${DEPLOY_HOST} "rm -rf /home/user/current/backend /home/user/current/frontend" &&
        git clone -b review ${DEPLOY_REPO} /home/user/current
      `,

      'post-deploy': `
        # --- Бэкенд ---
        cd /home/user/current/backend &&
        npm install &&
        npm run build &&
        pm2 reload /home/user/current/ecosystem.config.js --only mesto-backend --env production &&

        # --- Фронтенд ---
        cd /home/user/current/frontend &&
        npm install &&
        NODE_OPTIONS=--openssl-legacy-provider npm run build
        # nginx отдаёт статические файлы, pm2 для фронта не нужен
      `,
    },
  },
};
