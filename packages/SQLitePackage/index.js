const { logThe } = require('../../utility/Logger');
const UserQuery = require('./query/user.query');

const sqlite3 = require('sqlite3').verbose();

class SQLitePackage {
  constructor() {
    this.mainDatabasePath = __dirname + '/storage/main.db'
    this.connect();
    this.initQueries()
  }

  initQueries() {
    this.query = {
        user: new UserQuery(this.db),
      }
  }

  connect() {
    this.db = new sqlite3.Database(this.mainDatabasePath, (err) => {
      if (err) {
        return console.error(err.message);
      }
      logThe('Connected to the SQLite database.');
    });
  }

  disconnect() {
    // Close the database connection
    this.db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      logThe('Close the database connection.');
    });
  }


}

module.exports = SQLitePackage;
