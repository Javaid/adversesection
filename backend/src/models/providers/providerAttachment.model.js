const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");
const Providerss = require("./providerss.model");

const ProviderAttachment = sequelize.define(
  "providerAttachments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "providers",
        key: "id",
      },
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "providerAttachments",
    schema: "provider_table",
    timestamps: false,
  }
);

// Associations
Providerss.hasMany(ProviderAttachment, {
  foreignKey: "provider_id",
  as: "attachments",
});

ProviderAttachment.belongsTo(Providerss, {
  foreignKey: "provider_id",
});

module.exports = ProviderAttachment;
