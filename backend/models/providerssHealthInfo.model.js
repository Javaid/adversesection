const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
  const ProviderssHealthInfo = sequelize.define(
    "ProviderssHealthInfo",
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
   
        endpoint_type: DataTypes.STRING,

       endpoint: {
        type: DataTypes.STRING,
        field: "ENDPOINT",
      },
       endpoint_description: DataTypes.STRING,
       use_type: DataTypes.STRING,
       content_type: DataTypes.STRING,
       affiliation: DataTypes.STRING,
       endpoint_location: DataTypes.STRING,
     
     
     },
     {
       tableName: "health_information_exchange",
       timestamps: false,
     },
   );
   module.exports = ProviderssHealthInfo;