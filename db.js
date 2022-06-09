require("dotenv").config();
const { Client } = require("pg");

const URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_URI_TEST
    : process.env.DB_URI;

const db = new Client({
  connectionString: process.env.DATABASE_URL || `postgresql:///${URI}`,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect();

db.query(
  "SELECT table_schema, table_name FROM information_schema.tables;",
  (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    //db.end();
  }
);

module.exports = db;
