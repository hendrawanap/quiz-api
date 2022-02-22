const Quiz = require('../../domain/entities/Quiz');

module.exports = (questionRepository, sampleGenerator) => {
  async function execute(topic, questionQty) {
    const questions = await questionRepository.getByTopic(topic);
    const quiz = new Quiz(topic, sampleGenerator(questions, questionQty));
    return quiz;
  }
  return {
    execute,
  };
};
