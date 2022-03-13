module.exports = (authenticator) => {
  async function execute(token) {
    return authenticator.verifyToken(token);
  }

  return {
    execute,
  };
};
