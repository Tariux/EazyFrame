const Query = require("./query");

/**
 * Represents a query for user-related operations in the database.
 * @extends Query
 */
class UserQuery extends Query {
  /**
   * Creates an instance of UserQuery.
   * @param {object} db - The database connection.
   */
  constructor(db) {
    super(db);
    this.schema = `
    CREATE TABLE IF NOT EXISTS users (
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
    this.init();
  }

  /**
   * Retrieves all users from the database.
   * @returns {Array} All users in the database.
   */
  getAll() {
    return this.db.all("SELECT * FROM users");
  }

  /**
   * Retrieves a user by their ID.
   * @param {number} id - The ID of the user to retrieve.
   * @returns {object} The user with the specified ID.
   */
  get(id) {
    return this.db.get("SELECT * FROM users WHERE id = ?", [id]);
  }

  /**
   * Creates a new user in the database.
   * @param {string} name - The name of the user.
   * @param {string} username - The username of the user.
   * @param {string} email - The email of the user.
   * @param {number} age - The age of the user.
   * @param {string} address - The address of the user.         
   * @param {string} phone_number - The phone number of the user.
   * @param {string} password - The password of the user.
   * @param {string} created_by - The creator of the user.
   * @returns {object} The result of the insertion operation.
   */
  create(name, username, email, age, address, phone_number, password, created_by) {
    return this.db.run("INSERT INTO users (name, username, email, age, address, phone_number, password, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [name, username, email, age, address, phone_number, password, created_by]);
  }

  /**
   * Updates a user's information in the database.
   * @param {number} id - The ID of the user to update.
   * @param {string} name - The new name of the user.
   * @param {string} username - The new username of the user.
   * @param {string} email - The new email of the user.
   * @param {number} age - The new age of the user.
   * @param {string} address - The new address of the user.
   * @param {string} phone_number - The new phone number of the user.
   * @param {string} password - The new password of the user.
   * @param {string} updated_at - The updated timestamp.
   * @param {string} created_by - The creator of the user.
   * @returns {object} The result of the update operation.
   */
  update(id, name, username, email, age, address, phone_number, password, updated_at, created_by) {
    return this.db.run("UPDATE users SET name = ?, username = ?, email = ?, age = ?, address = ?, phone_number = ?, password = ?, updated_at = ?, created_by = ? WHERE id = ?", [name, username, email, age, address, phone_number, password, updated_at, created_by, id]);
  }

  /**
   * Deletes a user from the database.
   * @param {number} id - The ID of the user to delete.
   * @returns {object} The result of the deletion operation.
   */
  delete(id) {
    return this.db.run("DELETE FROM users WHERE id = ?", [id]);
  }
}

module.exports = UserQuery;
