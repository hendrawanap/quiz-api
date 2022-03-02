const QuestionRepository = require('../../domain/repositories/QuestionRepository');
const Question = require('../../domain/entities/Question');

module.exports = class QuestionRepositoryFirebase extends QuestionRepository {
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

    const result = await this.db.collection(this.collection).add(questionData);
    return result.id;
  }

  async update(questionInstance, file) {
    const {id, question, answer, choices, img, topic} = questionInstance;
    let questionData;

    if (img) {
      questionData = {question, answer, choices, img, topic};
      const snapshot = await this.db.collection(this.collection).doc(id).get();
      if (!snapshot.exists) {
        throw new Error('Not Found');
      }
      const oldImg = snapshot.get('img');
      const promises = [
        this.storage.delete(oldImg),
        this.storage.upload(img, file),
      ];
      await Promise.all(promises);
    } else {
      questionData = {question, answer, choices, topic};
    }

    const {writeTime} = await this.db.collection(this.collection).doc(id).update(questionData);
    return writeTime.toDate();
  }

  async delete(questionId) {
    const docRef = this.db.collection(this.collection).doc(questionId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      throw new Error('Not Found');
    }

    const deleteTime = await this.db.runTransaction(async (transaction) => {
      await transaction.delete(docRef);
      const {img} = docSnapshot.data();
      img ? await this.storage.delete(img) : null;
      return new Date().toJSON();
    });

    return deleteTime;
  }

  async getById(questionId) {
    const snapshot = await this.db.collection(this.collection).doc(questionId).get();
    if (snapshot.exists) {
      const {id, question, answer, choices, img, topic} = {id: snapshot.id, ...snapshot.data()};
      const imgUrl = await this.storage.getDownloadLink(img);
      return new Question(id, question, answer, choices, imgUrl, topic);
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
    const questions = docs.map(({id, question, answer, choices, topic}, index) => {
      let imgUrl;

      if (settled[index].status === 'fulfilled') {
        [imgUrl] = settled[index].value;
      } else if (settled[index].status === 'rejected') {
        imgUrl = null;
      }

      return new Question(id, question, answer, choices, imgUrl, topic);
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
    const questions = docs.map(({id, question, answer, choices, topic}, index) => {
      let imgUrl;

      if (settled[index].status === 'fulfilled') {
        [imgUrl] = settled[index].value;
      } else if (settled[index].status === 'rejected') {
        imgUrl = null;
      }

      return new Question(id, question, answer, choices, imgUrl, topic);
    });

    return questions;
  }
};
