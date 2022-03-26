const {
  index,
  show,
  store,
  destroy,
  update,
} = require('../controllers/QuestionController');

const BASE_PATH = '/questions';
const authStrategy = process.env.NODE_ENV === 'development' ? null : 'firebase-auth-token';

module.exports = (parentPath = '') => ({
  name: 'questions',
  version: '1.0.0',
  register: (server, options) => {
    server.route([
      {
        method: 'GET',
        path: parentPath + BASE_PATH,
        handler: index,
        options: {
          auth: authStrategy,
        },
      },
      {
        method: 'GET',
        path: `${parentPath + BASE_PATH}/{id}`,
        handler: show,
        options: {
          auth: authStrategy,
        },
      },
      {
        method: 'POST',
        path: parentPath + BASE_PATH,
        handler: store,
        options: {
          auth: authStrategy,
          payload: {
            output: 'stream',
            multipart: true,
            maxBytes: 20_000_000,
          },
        },
      },
      {
        method: 'PUT',
        path: `${parentPath + BASE_PATH}/{id}`,
        handler: update,
        options: {
          payload: {
            auth: authStrategy,
            output: 'stream',
            multipart: true,
            maxBytes: 20_000_000,
          },
        },
      },
      {
        method: 'DELETE',
        path: `${parentPath + BASE_PATH}/{id}`,
        handler: destroy,
        options: {
          auth: authStrategy,
        },
      },
    ]);
  },
});
