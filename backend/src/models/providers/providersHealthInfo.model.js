const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");
 const ProviderssHealthInfo = sequelize.define(
  "healthInfo",
  {
    provider_id: DataTypes.INTEGER,

    endpoint_type: DataTypes.STRING,

    endpoint: {
      type: DataTypes.STRING,
      field: "endpoint",
    },

    endpoint_description: DataTypes.STRING,
    use_type: DataTypes.STRING,
    content_type: DataTypes.STRING,
    affiliation: DataTypes.STRING,
    endpoint_location: DataTypes.STRING,
  },
  {
    tableName: "health_information_exchange",
    schema: "provider_table",
    timestamps: false,
  }
);
   module.exports = ProviderssHealthInfo;