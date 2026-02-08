const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");
require("dotenv").config();

const hashPassword = (password) => {
  return crypto.pbkdf2Sync(password, 'salt', 10000, 64, 'sha512').toString('hex');
};

const login = async (username, password) => {
  const pwd = hashPassword(password);

  const results = await sequelize.query(
    "SELECT * FROM login WHERE username = :username AND password = :pwd",
    {
      replacements: { username, pwd },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  if (results.length === 0) {
    throw new Error("Invalid username or password");
  }

  const user = results[0];

  const token = jwt.sign(
    { id: user.user_id, username: user.username, role:user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { user, token };
};

module.exports = { login };
