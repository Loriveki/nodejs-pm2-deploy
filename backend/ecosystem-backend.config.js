require('dotenv').config({ path: '.env.deploy' });

module.exports = {
  apps: [
    {
      name: 'mesto-backend',
      script: '/home/user/current/dist/app.js',
      cwd: '/home/user/current',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      env_production: {
        NODE_ENV: 'production',
        DOTENV_CONFIG_PATH: '/home/user/shared/.env',
      },
    },
  ],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER,
      host: process.env.DEPLOY_HOST,
      ref: process.env.DEPLOY_REF,
      repo: process.env.DEPLOY_REPO,
      path: process.env.DEPLOY_PATH,
      key: process.env.DEPLOY_SSH_KEY,
      'pre-deploy-local': `scp backend/.env ${process.env.DEPLOY_USER}@${process.env.DEPLOY_HOST}:/home/user/shared/.env`,
      'post-deploy': 'bash /home/user/current/post-deploy.sh',
    },
  },
};
