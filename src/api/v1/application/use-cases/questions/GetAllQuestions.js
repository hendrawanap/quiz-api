module.exports = (questionRepository) => {
  async function execute() {
    const questions = await questionRepository.getAll();
    return questions;
  }
  return {
    execute,
  };
};
