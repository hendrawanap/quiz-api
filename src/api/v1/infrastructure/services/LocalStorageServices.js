const {createWriteStream} = require('fs');
const {unlink} = require('fs/promises');
const path = require('path');

module.exports = class LocalStorageServices {
  constructor() {
    this.STORAGE_PATH = '../../../../storage/temp';
  }

  async upload(url, fileStream) {
    const targetUrl = path.join(__dirname, this.STORAGE_PATH, url);
    const writeStream = createWriteStream(targetUrl);
    const streamPromise = new Promise((resolve, reject) => {
      writeStream.on('error', (error) => reject(error));
      writeStream.on('finish', () => {
        writeStream.close();
        resolve(targetUrl);
      });
      fileStream.pipe(writeStream);
    });

    return streamPromise;
  }

  async getDownloadLink(url) {
    return path.join(__dirname, this.STORAGE_PATH, url);
  }

  async delete(url) {
    const targetUrl = path.join(__dirname, this.STORAGE_PATH, url);
    await unlink(targetUrl);
    return `Success deleted: ${url}`;
  }
};
