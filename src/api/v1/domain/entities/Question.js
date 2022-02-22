module.exports = class Question {
  constructor(id, question, answer, choices, img = null, topic) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.choices = choices;
    this.img = img;
    this.topic = topic;
  }
};
