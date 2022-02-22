require('dotenv').config();
const _ = require('lodash');
const FirebaseServices = require('../services/FirebaseServices');
const FirebaseQuestionRepository = require('../repositories/QuestionRepositoryFirebase');

const serviceAccount = require(`./${process.env.SERVICE_ACCOUNT}`);
const storageBucket = process.env.STORAGE_BUCKET;
const {db, storage} = new FirebaseServices(serviceAccount, storageBucket);

module.exports = {
  questionRepository: new FirebaseQuestionRepository(db, storage),
  sampleGenerator: _.sampleSize,
};
