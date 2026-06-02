const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const ProviderssLocation = sequelize.define(
  "provider_locations",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },

    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    country: DataTypes.STRING,
    phone: DataTypes.STRING,
    fax: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  {
    tableName: "provider_locations",
    schema: "provider_table",
    timestamps: false,
  }
);

module.exports = ProviderssLocation;
