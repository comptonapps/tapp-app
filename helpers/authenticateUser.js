const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError } = require("../expressError");
const User = require("../models/User");

async function authenticateUser(username, password) {
  const result = await db.query("SELECT * FROM users WHERE username=$1", [
    username
  ]);
  const user = result.rows[0];
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      delete user.password;
      const userResult = await User.queryById(user.id);
      return userResult.rows[0];
    }
  }
  throw new BadRequestError("Invalid username or password");
}

module.exports = authenticateUser;
