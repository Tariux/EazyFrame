class Query {
  constructor(db, schmea, table) {
    this.db = db;
    this.schema = schmea;
    this.table = table;
    this.init();
  }
  init() {
    if (this.schema) {
      // Create a table
      this.db.run(this.schema, (err) => {
        if (err) {
          console.error(err.message);
        }
      });
    } else {
      throw new Error(
        `schema not found for query ${this.constructor.name} ${this.table}`
      );
    }
  }

  async getAll() {
    return await new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM ${this.table}`, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }
  async get(id) {
    return await new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        [id],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  }
  async delete(id) {
    return await new Promise((resolve, reject) => {
      this.db.get(
        `DELETE FROM ${this.table} WHERE id = ?`,
        [id],
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  }

  async create(data) {
    const { sqlPattern, valuesArray } = this.createSQLPattern(data);
    return await new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO ${this.table} ${sqlPattern}`,
        valuesArray,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  }

  async update(data) {
    const { sqlPattern, valuesArray } = this.updateSQLPattern(data);
    return await new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE ${this.table} SET ${sqlPattern}`,
        valuesArray,
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  }

  createSQLPattern(data) {
    const keys = Object.keys(data).join(', ');
    const sqlPattern = `(${keys}) VALUES (${Object.keys(data)
      .map(() => '?')
      .join(', ')})`;
    const valuesArray = Object.values(data);

    return {
      sqlPattern,
      valuesArray,
    };
  }

  updateSQLPattern(data) {
    const keys = Object.keys(data);
    const valuesArray = Object.values(data);
    const setClause = keys.map((key) => `${key} = ?`).join(', ');

    return {
      setClause,
      valuesArray,
    };
  }
}

module.exports = Query;
