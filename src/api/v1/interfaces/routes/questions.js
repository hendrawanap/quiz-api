const {
  index,
  show,
} = require('../controllers/QuestionController');

const BASE_PATH = '/questions';

module.exports = (parentPath) => ({
  name: 'questions',
  version: '1.0.0',
  register: (server, options) => {
    server.route([
      {
        method: 'GET',
        path: parentPath + BASE_PATH,
        handler: index,
      },
      {
        method: 'GET',
        path: `${parentPath + BASE_PATH}/{id}`,
        handler: show,
      },
    ]);
  },
});
