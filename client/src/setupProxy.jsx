// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.coingecko.com', // Base URL of the API
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove /api from the request path
      },
    })
  );
};
