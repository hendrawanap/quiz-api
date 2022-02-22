module.exports = (questionRepository) => {
  async function execute(topic) {
    const questions = await questionRepository.getByTopic(topic);
    return questions;
  }
  return {
    execute,
  };
};
