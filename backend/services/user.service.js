const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");
require("dotenv").config();

const hashPassword = (password) => {
  return crypto.createHash("md5").update(password).digest("hex");
};

const login = async (username, password) => {
  let results = await sequelize.query(
    "SELECT * FROM login WHERE username = :username AND password = :password",
    {
      replacements: { username, password },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

  if (results.length === 0) {
    const pwd = hashPassword(password);
    results = await sequelize.query(
      "SELECT * FROM login WHERE username = :username AND password = :pwd",
      {
        replacements: { username, pwd },
        type: Sequelize.QueryTypes.SELECT,
      },
    );
  }

  if (results.length === 0) {
    throw new Error("Invalid username or password");
  }

  const user = results[0];

  const token = jwt.sign(
    {
      id: user.id || user.user_id,
      username: user.username,
      role: user.role || "user",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { user, token };
};

module.exports = { login };
