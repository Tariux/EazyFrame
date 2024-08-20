class History {
  constructor() {
    if (!History.instance) {
      this.data = {};
      History.instance = this;
    }

    return History.instance;
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

const HistoryZone = new History();
Object.freeze(HistoryZone);

exports.History = HistoryZone;
