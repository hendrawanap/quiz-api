const Question = require('../../../domain/entities/Question');

module.exports = (questionRepository) => {
  async function execute(questionData, fileStream = null) {
    const {
      id, question, answer, choices, imgUrl, topic,
    } = questionData;
    const questionInstance = new Question(id, question, answer, choices, imgUrl, topic);
    const updateTime = await questionRepository.update(questionInstance, fileStream);
    return updateTime;
  }
  return {
    execute,
  };
};
