const Joi = require('joi');
const {
  generateQuiz,
} = require('../controllers/QuizController');

const BASE_PATH = '/quizzes';

module.exports = (parentPath) => ({
  name: 'quizzes',
  version: '1.0.0',
  register: (server, options) => {
    server.route([
      {
        method: 'GET',
        path: parentPath + BASE_PATH,
        handler: generateQuiz,
        options: {
          validate: {
            query: Joi.object({
              topic: Joi.string().valid('Ikon', 'Makanan', 'Wisata').required(),
              qty: Joi.number().required(),
            }),
          },
        },
      },
    ]);
  },
});
