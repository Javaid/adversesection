const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

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
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      index: true,  // Index for company-scoped queries
    },
  },
  {
    tableName: "users",
    schema: "provider_table",
    timestamps: true,
  }
);

module.exports = User;
