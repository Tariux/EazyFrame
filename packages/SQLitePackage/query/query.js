class Query {
  constructor(db) {
    this.db = db;
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
        throw new Error(`schema not found for query ${this.constructor.name}`)
    }
  }
}


module.exports = Query