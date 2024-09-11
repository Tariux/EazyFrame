const Query = require("./query");

/**
 * Represents a query for user-related operations in the database.
 * @extends Query
 */
export default class UserQuery extends Query {


  constructor(db) {
    const table = 'users'
    const schema = `
    CREATE TABLE IF NOT EXISTS ${table} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INTEGER,
      address TEXT,
      phone_number TEXT,
      password TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT
    )
    `;
    super(db , schema , table);

  }

}
