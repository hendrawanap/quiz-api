const AuthController = require('../../../interfaces/controllers/AuthController');

module.exports = {
  name: 'firebase-auth',
  version: '1.0.0',
  register: (server) => {
    server.auth.scheme('firebase-auth', () => ({
      authenticate: AuthController.verifyAccessToken,
    }));

    server.auth.strategy('firebase-auth-token', 'firebase-auth');
  },
};
