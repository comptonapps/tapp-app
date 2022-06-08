require("dotenv").config();
const { Client } = require("pg");

const URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_URI_TEST
    : process.env.DB_URI;

const db = new Client({
  connectionString: process.env.DATABASE_URL || `postgresql:///${URI}`
});

db.connect();

module.exports = db;
