const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const ProviderssCompliance = sequelize.define(
  "provider_compliance",
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

  
    npi_type: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    enumeration_date: DataTypes.DATEONLY,
    sole_proprietor: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
    status: DataTypes.STRING,
  },
  {
    tableName: "provider_compliance",
    schema: "provider_table",
    timestamps: false,
  },
);

module.exports = ProviderssCompliance;
