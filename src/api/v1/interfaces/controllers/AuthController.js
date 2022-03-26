const VerifyAccessToken = require('../../application/use-cases/VerifyAccessToken');

const verifyAccessToken = async (request, h) => {
  const { token } = request.query;
  const { authenticator, boom } = request.server.app.dependencies;
  if (!token) {
    return h.unauthenticated(boom.unauthorized('Unauthorized'));
  }
  try {
    const uid = await VerifyAccessToken(authenticator).execute(token);
    return h.authenticated({
      credentials: { uid },
    });
  } catch (error) {
    return h.unauthenticated(boom.unauthorized('Unauthorized'));
  }
};

module.exports = {
  verifyAccessToken,
};
