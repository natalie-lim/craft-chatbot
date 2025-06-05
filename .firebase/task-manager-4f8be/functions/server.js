const { onRequest } = require('firebase-functions/v2/https');
  const server = import('firebase-frameworks');
  exports.ssrtaskmanager4f8be = onRequest({"region":"us-west1"}, (req, res) => server.then(it => it.handle(req, res)));
  