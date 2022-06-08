require("dotenv").config();
const { Client } = require("pg");

let URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_URI_TEST
    : process.env.DB_URI;

if (process.env.NODE_ENV === "production") {
  URI = process.env.DATABASE_URL;
}

const db = new Client({
  connectionString: `postgresql:///${URI}`
});

db.connect();

module.exports = db;
