const fs = require('fs');
const path = require('path');
const IStorageServices = require('../interfaces/IStorageServices');

module.exports = class LocalStorageServices extends IStorageServices {
  constructor() {
    super();
    this.STORAGE_PATH = '../../../storage/public';
  }

  async upload(url, file) {
    fs.writeFile(path.join(__dirname, this.STORAGE_PATH, url));
  }

  async getDownloadLink(url) {
    throw new Error('not implemented');
  }

  async delete(url) {
    throw new Error('not implemented');
  }
};
