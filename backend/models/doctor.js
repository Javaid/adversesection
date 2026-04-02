// models/doctor.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
  },
  {
    tableName: "providers", 
    timestamps: false,      
  }
);

module.exports = Doctor;