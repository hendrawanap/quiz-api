const _ = require('lodash');
const Boom = require('@hapi/boom');
const FirebaseServices = require('../services/FirebaseServices');
const FirebaseQuestionRepository = require('../repositories/QuestionRepositoryFirebase');

const {serviceAccount} = require('./service-account');
const storageBucket = process.env.SERVICE_ACCOUNT_STORAGE_BUCKET;
const {db, storage, auth} = new FirebaseServices(serviceAccount, storageBucket);

module.exports = {
  questionRepository: new FirebaseQuestionRepository(db, storage),
  sampleGenerator: _.sampleSize,
  authenticator: auth,
  boom: Boom,
};
