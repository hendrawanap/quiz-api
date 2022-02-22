const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const {getStorage} = require('firebase-admin/storage');
const FirebaseStorageServices = require('./FirebaseStorageServices');

module.exports = class FirebaseServices {
  constructor(serviceAccount, storageBucket) {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket,
    });

    this.db = getFirestore();
    this.storage = new FirebaseStorageServices(getStorage());
  }
};
