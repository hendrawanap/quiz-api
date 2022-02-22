const {
  GetAllQuestions,
  GetQuestionsByTopic,
  GetQuestion,
} = require('../../application/use-cases/questions/index');

const index = async (request, h) => {
  const {questionRepository} = request.server.app.dependencies;
  const {topic} = request.query;
  let questions;
  let response;

  if (topic) {
    try {
      questions = await GetQuestionsByTopic(questionRepository).execute(topic);
    } catch (error) {
      response = h.response({
        message: error.message,
      });
      response.code(500);
      return response;
    }
  } else {
    try {
      questions = await GetAllQuestions(questionRepository).execute();
    } catch (error) {
      response = h.response({
        message: error.message,
      });
      response.code(500);
      return response;
    }
  }

  response = h.response(questions);
  response.code(200);
  return response;
};

const show = async (request, h) => {
  const {questionRepository} = request.server.app.dependencies;
  const {id} = request.params;
  let question;
  let response;

  try {
    question = await GetQuestion(questionRepository).execute(id);
    response = h.response(question);
    response.code(200);
  } catch (error) {
    if (error.message === 'Not Found') {
      response = h.response({
        message: error.message,
      });
      response.code(404);
    } else {
      response = h.response({
        message: error.message,
      });
      response.code(500);
    }
  } finally {
    return response;
  }
};

module.exports = {
  index,
  show,
};
