module.exports = (questionRepository) => {
  async function execute(id) {
    const question = await questionRepository.getById(id);
    return question;
  }
  return {
    execute,
  };
};
