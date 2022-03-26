const Question = require('../../../domain/entities/Question');

module.exports = (questionRepository) => {
  async function execute(questionData, fileStream = null) {
    const {
      question, answer, choices, imgUrl, topic,
    } = questionData;
    const questionInstance = new Question(
      null,
      question,
      answer,
      choices,
      imgUrl,
      topic,
    );
    const questionId = await questionRepository.add(
      questionInstance,
      fileStream,
    );
    return questionId;
  }
  return {
    execute,
  };
};
