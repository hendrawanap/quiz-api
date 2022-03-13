const Joi = require('joi');
const {
  index,
  show,
  store,
  destroy,
  update,
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
        options: {
          auth: 'firebase-auth-token',
        },
      },
      {
        method: 'GET',
        path: `${parentPath + BASE_PATH}/{id}`,
        handler: show,
      },
      {
        method: 'POST',
        path: parentPath + BASE_PATH,
        handler: store,
        options: {
          payload: {
            output: 'stream',
            multipart: true,
            maxBytes: 20_000_000,
          },
          // validate: {
          //   payload: Joi.object({
          //     question: Joi.string().required(),
          //     answer: Joi.string().required(),
          //     topic: Joi.string().required(),
          //   }),
          // },
        },
      },
      {
        method: 'PUT',
        path: `${parentPath + BASE_PATH}/{id}`,
        handler: update,
        options: {
          payload: {
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
      },
    ]);
  },
});
