require('dotenv').config({ path: './.env.deploy' });

const { DEPLOY_USER, DEPLOY_HOST, DEPLOY_REPO, DEPLOY_REF, DEPLOY_PATH, DEPLOY_SSH_KEY } = process.env;

module.exports = {
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      repo: DEPLOY_REPO,
      ref: DEPLOY_REF,
      path: DEPLOY_PATH,
      ssh_options: `IdentityFile=${DEPLOY_SSH_KEY}`,
      'pre-deploy': `ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}/source && cd ${DEPLOY_PATH}/source && git clone ${DEPLOY_REPO} . || git fetch && git checkout ${DEPLOY_REF}"`,
      'post-deploy': `cd ${DEPLOY_PATH}/source/frontend && npm install && NODE_OPTIONS=--openssl-legacy-provider npm run build && chgrp -R www-data ${DEPLOY_PATH}/source/frontend/build && chmod -R g+rw ${DEPLOY_PATH}/source/frontend/build`,
    },
  },
};
