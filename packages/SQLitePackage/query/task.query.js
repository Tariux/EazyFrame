const Query = require("./query");

/**
 * Represents a query for user-related operations in the database.
 * @extends Query
 */
export default class TaskQuery extends Query {

  constructor(db) {
    const table = 'tasks';
    const schema = `
    CREATE TABLE IF NOT EXISTS ${table} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      due_date TIMESTAMP,
      priority INTEGER,
      assigned_to TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT
    )
    `;
    super(db, schema, table);
  }
}
