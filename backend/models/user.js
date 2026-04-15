const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Capitalized model name (convention)
const User = sequelize.define(
  "User",          // model name
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: false → passwords can be same
    },
  },
  {
    tableName: "users", // optional: matches table name in DB
    timestamps: true,   // adds createdAt/updatedAt
  }
);

module.exports = User;
