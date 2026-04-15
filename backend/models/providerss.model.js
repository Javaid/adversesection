const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ProviderssLocation = require("./providerssLocation.model");
const ProviderssCompliance = require("./providerssCompliance.model");
const ProviderssIdentifiers = require("./providerssIdentifiers.model");
const providerssTaxonomy = require("./providerssTaxonomy.model");
const ProviderssHealthInfo = require("./providerssHealthInfo.model");

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
  },
  {
    timestamps: false,
  },
);
//associations
//for location
Providerss.hasMany(ProviderssLocation, {
  foreignKey: "provider_id",
  as: "locations",
});


ProviderssLocation.belongsTo(Providerss, {
  foreignKey: "provider_id",
});
//for compliance
Providerss.hasMany(ProviderssCompliance,{
  foreignKey:"provider_id",
  as:"compliance"
})
ProviderssCompliance.belongsTo(Providerss,{
  foreignKey:"provider_id",
})
//for identifiers
Providerss.hasMany(ProviderssIdentifiers,{
  foreignKey:"provider_id",
  as:"identifiers"
});
ProviderssIdentifiers.belongsTo(Providerss,{
  foreignKey:"provider_id",
});
//for taxonomy
Providerss.hasMany(providerssTaxonomy,{
  foreignKey:"provider_id",
  as:"taxonomy"
});
providerssTaxonomy.belongsTo(Providerss,{
  foreignKey:"provider_id",
});

//for health information exchange
Providerss.hasMany(ProviderssHealthInfo,{
  foreignKey:"provider_id",
  as:"ProviderssHealthInfo"
});
ProviderssHealthInfo.belongsTo(Providerss,{
  foreignKey:"provider_id",
});

module.exports = Providerss;
