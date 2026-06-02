// models/doctor.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Doctor = sequelize.define(
  "Doctor",
  {
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    providerName: { type: DataTypes.STRING },
    npi: { type: DataTypes.STRING, unique: true },
    speciality: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    organization_name: { type: DataTypes.STRING },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      index: true,  // Index for fast company-scoped queries
    },
  },
  {
    tableName: "providers", 
    timestamps: false,      
  }
);

module.exports = Doctor;