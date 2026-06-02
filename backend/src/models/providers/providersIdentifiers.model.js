const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");
const ProviderssIdentifiers = sequelize.define(
  "provider_identifiers",
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
    npi_number: DataTypes.STRING,
    pac_id: DataTypes.STRING,
    tax_id: DataTypes.STRING,
    medicare_enrollment_id: DataTypes.STRING,
    medicaid_enrollment_id: DataTypes.STRING,

    value: DataTypes.STRING,
    issuer: DataTypes.STRING,
    state: DataTypes.STRING,
    number: DataTypes.STRING,
    other_issuer: DataTypes.STRING,
  },
  {
    tableName: "provider_identifiers",
    schema: "provider_table",
    timestamps: false,
  },
);
module.exports = ProviderssIdentifiers;
