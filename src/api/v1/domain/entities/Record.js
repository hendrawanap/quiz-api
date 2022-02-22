module.exports = class Record {
  constructor(topic, type, accuracy, score, duration, finishedAt, userId) {
    this.topic = topic;
    this.type = type;
    this.accuracy = accuracy;
    this.score = score;
    this.duration = duration;
    this.finishedAt = finishedAt;
    this.userId = userId;
  }
};
