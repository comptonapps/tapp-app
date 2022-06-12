require("dotenv").config();
const { Client } = require("pg");

let URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_URI_TEST
    : process.env.DB_URI;

if (process.env.NODE_ENV === "production") {
  URI = process.env.DATABASE_URL;
}

const config =
  process.env.NODE_ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL || `postgresql:///${URI}`,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        connectionString: process.env.DATABASE_URL || `postgresql:///${URI}`
      };

const db = new Client(config);

db.connect();

module.exports = db;
