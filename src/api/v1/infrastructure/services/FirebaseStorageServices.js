module.exports = class FirebaseStorageService {
  constructor(firebaseStorage, localStorage) {
    this.storage = firebaseStorage;
    this.localStorage = localStorage;
  }

  async upload(url, fileStream) {
    const localUrl = await this.localStorage.upload(url, fileStream);
    const response = await this.storage.bucket().upload(localUrl, { destination: url });
    this.localStorage.delete(url);
    return response[1];
  }

  async getDownloadLink(url) {
    let signedUrl = null;
    if (!url) {
      throw new Error('URL can\'t be null');
    }
    const files = await this.storage.bucket().getFiles({ prefix: url });

    if (files.length !== 0) {
      signedUrl = await files[0][0].getSignedUrl({
        action: 'read',
        expires: new Date(Date.now() + 3_600_000),
      });
    }

    return signedUrl;
  }

  async delete(url) {
    if (!url) {
      throw new Error('URL can\'t be null');
    }
    await this.storage.bucket().deleteFiles({ prefix: url });
    return `Success deleted: ${url}`;
  }
};
