class Share {
  constructor() {
    if (!Share.instance) {
      this.data = {};
      Share.instance = this;
    }

    return Share.instance;
  }

  add(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }

  getAll() {
    return this.data;
  }
}

const ShareZone = new Share();
Object.freeze(ShareZone);

exports.Share = ShareZone;
