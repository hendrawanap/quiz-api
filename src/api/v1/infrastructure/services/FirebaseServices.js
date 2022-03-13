const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
const {getStorage} = require('firebase-admin/storage');
const {getAuth} = require('firebase-admin/auth');
const FirebaseStorageServices = require('./FirebaseStorageServices');
const LocalStorageServices = require('./LocalStorageServices');

module.exports = class FirebaseServices {
  constructor(serviceAccount, storageBucket) {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket,
    });

    this.db = getFirestore();
    this.storage = new FirebaseStorageServices(getStorage(), new LocalStorageServices());
    this._auth = getAuth();
    this.auth = {
      verifyToken: async (token) => {
        const {uid} = await this._auth.verifyIdToken(token);
        return uid;
      },
    };
  }
};
