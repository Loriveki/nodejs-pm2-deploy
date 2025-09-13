const NODE_INTERPRETER = '/home/user/.nvm/versions/node/v22.19.0/bin/node';

module.exports = {
  apps: [
    {
      name: 'backend-service',
      script: '/home/user/current/backend/dist/app.js',
      cwd: './backend',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    production: {
      user: 'user',
      host: '158.160.185.102',
      ref: 'origin/review',
      repo: 'https://github.com/Loriveki/nodejs-pm2-deploy.git',
      path: '/home/user',
      key: '/home/loriveki/.ssh/new_key/private_key',

      'pre-deploy-local': `
      echo "Copying .env to server..." &&
      ssh -i /home/loriveki/.ssh/new_key/private_key user@158.160.185.102 "mkdir -p /home/user/shared" &&
      scp -i /home/loriveki/.ssh/new_key/private_key ./backend/.env user@158.160.185.102:/home/user/shared/.env
      `,

      'post-deploy': `
        echo "Post-deploy started" &&
        export NVM_DIR="$HOME/.nvm" &&
        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" &&
        cd /home/user/current/backend &&
        cp /home/user/shared/.env ./.env &&
        npm install &&
        npx tsc &&
        pm2 startOrReload ecosystem-backend.config.js --env production &&
        echo "Post-deploy finished"
      `,
    },
  },
};
