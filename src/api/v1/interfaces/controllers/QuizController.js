const GenerateQuiz = require('../../application/use-cases/GenerateQuiz');

const index = async (request, h) => {
  const {questionRepository, sampleGenerator} = request.server.app.dependencies;
  const {topic, qty} = request.query;
  let quiz;
  let response;

  try {
    quiz = await GenerateQuiz(questionRepository, sampleGenerator).execute(topic, qty);
    response = h.response(quiz);
    response.code(200);
  } catch (error) {
    response = h.response({
      message: error.message,
    });
    response.code(500);
  }

  return response;
};

module.exports = {
  index,
};
