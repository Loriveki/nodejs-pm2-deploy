require('dotenv').config({ path: '../.env.deploy' });

module.exports = {
  apps: [
    {
      name: 'mesto-frontend',
      script: 'npx',
      args: 'serve -s build -l 3001',
      cwd: '/home/user/current/frontend',
      watch: false,
     autorestart: false,
      max_restarts: 10,
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER,
      host: process.env.DEPLOY_HOST,
      ref: process.env.DEPLOY_REF,
      repo: process.env.DEPLOY_REPO,
      path: process.env.DEPLOY_PATH + '/frontend',
      key: process.env.DEPLOY_SSH_KEY,
      'post-deploy': 'bash /home/user/current/frontend/post-deploy.sh',
    },
  },
};