const mysql = require("mysql2");

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, res) => {
        if (err) {
          console.log(err.sql);
          return reject(err);
        }
        resolve();
        console.table(res);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

module.exports = Database;
