const question = require('./questions');
const quizzes = require('./quizzes');
const BASE_PATH = '/api/v1';

const routes = [
  question,
  quizzes,
].map((routeMaker) => routeMaker(BASE_PATH));

module.exports = routes;
