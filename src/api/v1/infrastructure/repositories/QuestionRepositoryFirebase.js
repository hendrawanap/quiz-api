const QuestionRepository = require('../../domain/repositories/QuestionRepository');
const Question = require('../../domain/entities/Question');

module.exports = class FirebaseQuestionRepository extends QuestionRepository {
  constructor(db, storage) {
    super();
    this.db = db;
    this.storage = storage;
    this.collection = 'questions';
  }

  async add(questionInstance, file) {
    const {question, answer, choices, img, topic} = questionInstance;
    let questionData;

    if (img) {
      await this.storage.upload(img, file);
      questionData = {question, answer, choices, img, topic};
    } else {
      questionData = {question, answer, choices, topic};
    }

    return this.db.collection(this.collection).add(questionData);
  }

  async update(questionInstance, file) {
    const {id, question, answer, choices, img, topic} = questionInstance;
    let questionData;

    if (img) {
      questionData = {question, answer, choices, img, topic};
      const snapshot = await this.db.collection(this.collection).doc(id).get();
      const oldImg = snapshot.get('img');
      const promises = [
        this.storage.delete(oldImg),
        this.storage.upload(img, file),
      ];
      await Promise.all(promises);
    } else {
      questionData = {question, answer, choices, topic};
    }

    return this.db.collection(this.collection).doc(id).set(questionData, {merge: true});
  }

  async delete(questionId) {
    return this.db.collection(this.collection).doc(questionId).delete();
  }

  async getById(questionId) {
    const snapshot = await this.db.collection(this.collection).doc(questionId).get();
    if (snapshot.exists) {
      const doc = {id: snapshot.id, ...snapshot.data()};
      const imgUrl = await this.storage.getDownloadLink(doc.img);

      return new Question(
          doc.id,
          doc.question,
          doc.answer,
          doc.choices,
          imgUrl,
          doc.topic,
      );
    } else {
      throw new Error('Not Found');
    }
  }

  async getByTopic(questionTopic) {
    const snapshot = await this.db.collection(this.collection)
        .where('topic', '==', questionTopic)
        .get();
    const docs = [];

    if (!snapshot.empty) {
      snapshot.forEach((doc) => docs.push({id: doc.id, ...doc.data()}));
    }

    const promises = docs.map((doc) => this.storage.getDownloadLink(doc.img));
    const settled = await Promise.allSettled(promises);
    const questions = docs.map((doc, index) => {
      let imgUrl;

      if (settled[index].status === 'fulfilled') {
        [imgUrl] = settled[index].value;
      } else if (settled[index].status === 'rejected') {
        imgUrl = null;
      }

      return new Question(
          doc.id,
          doc.question,
          doc.answer,
          doc.choices,
          imgUrl,
          doc.topic,
      );
    });

    return questions;
  }

  async getAll() {
    const snapshot = await this.db.collection(this.collection).get();
    const docs = [];

    if (!snapshot.empty) {
      snapshot.forEach((doc) => docs.push({id: doc.id, ...doc.data()}));
    }

    const promises = docs.map((doc) => this.storage.getDownloadLink(doc.img));
    const settled = await Promise.allSettled(promises);
    const questions = docs.map((doc, index) => {
      let imgUrl;

      if (settled[index].status === 'fulfilled') {
        [imgUrl] = settled[index].value;
      } else if (settled[index].status === 'rejected') {
        imgUrl = null;
      }

      return new Question(
          doc.id,
          doc.question,
          doc.answer,
          doc.choices,
          imgUrl,
          doc.topic,
      );
    });

    return questions;
  }
};
