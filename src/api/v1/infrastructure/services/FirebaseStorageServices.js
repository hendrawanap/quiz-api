module.exports = class FirebaseStorageService {
  constructor(firebaseStorage, localStorage) {
    this.storage = firebaseStorage;
    this.localStorage = localStorage;
  }

  async upload(url, file) {
    return new Error('not implemented');
  }

  async getDownloadLink(url) {
    let signedUrl = null;
    const files = await this.storage.bucket().getFiles({prefix: url});

    if (files.length !== 0) {
      signedUrl = await files[0][0].getSignedUrl({
        action: 'read',
        expires: new Date(Date.now() + 3_600_000),
      });
    }

    return signedUrl;
  }

  async delete(url) {
    return new Error('not implemented');
  }
};
