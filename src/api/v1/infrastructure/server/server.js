require('dotenv').config();
const hapi = require('@hapi/hapi');
const routes = require('../../interfaces/routes/index');

const init = async () => {
  const server = hapi.server({
    port: process.env.PORT || 5000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(routes);

  server.app.dependencies = require('../config/dependencies');

  await server.start();
  console.log(`Running on ${server.info.uri}`);
};

module.exports = {init};
