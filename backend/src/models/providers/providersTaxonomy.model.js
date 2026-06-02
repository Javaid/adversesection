const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const ProviderssTaxonomy = sequelize.define(
  "provider_taxonomy",
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

    primary_taxonomy: DataTypes.STRING,
    selected_taxonomy: DataTypes.STRING,
    state: DataTypes.STRING,
    license_number: DataTypes.STRING,
    status: DataTypes.STRING,
    document_link: DataTypes.TEXT,
    source_url: DataTypes.TEXT,
  
  
  },
  {
    tableName: "taxonomy",
    schema: "provider_table",
    timestamps: false,
  },
);

module.exports = ProviderssTaxonomy;
