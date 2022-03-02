module.exports = (questionRepository) => {
  async function execute(questionId) {
    const deleteTime = await questionRepository.delete(questionId);
    return deleteTime;
  }
  return {
    execute,
  };
};
