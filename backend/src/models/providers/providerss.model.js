"use strict";

const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Providerss = sequelize.define(
  "providers",
  {
    npi: { type: DataTypes.STRING, allowNull: true, unique: true },
    speciality: DataTypes.STRING,
    location: DataTypes.STRING,
    npi_status: DataTypes.STRING,
    mips_score: DataTypes.FLOAT,
    payment: DataTypes.FLOAT,
    medicare_status: DataTypes.STRING,
    risk_level: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    organization_name: DataTypes.STRING,
    gender: DataTypes.STRING,
    providerName: DataTypes.STRING,
    companyId: { type: DataTypes.INTEGER, field:"company_id",allowNull: false },
    
  },
  {
    tableName: "providers",
    schema: "provider_table",
    timestamps: false,
  }
);

module.exports = Providerss;