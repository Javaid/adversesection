"use strict";

const { sequelize } = require("../config/database");

// Models
const Providerss = require("./providers/providerss.model");
const ProviderssLocation = require("./providers/providersLocation.model");
const ProviderssCompliance = require("./providers/providersCompliance.model");
const ProviderssIdentifiers = require("./providers/providersIdentifiers.model");
const ProviderssTaxonomy = require("./providers/providersTaxonomy.model");
const ProviderssHealthInfo = require("./providers/providersHealthInfo.model");

const Case = require("./case.model");
const CaseAssignment = require("./caseAssignment.model");
const CaseEscalation = require("./caseEscalation.model");
const CaseNote = require("./caseNote.model");
const CaseStatusHistory = require("./caseStatusHistory.model");

const User = require("./providers/user");
const Doctor = require("./providers/doctor.model");

/* =========================
   ASSOCIATIONS (ONLY HERE)
========================= */

function applyAssociations() {

  // Provider → Locations
  Providerss.hasMany(ProviderssLocation, {
    foreignKey: "provider_id",
    as: "locations",
  });

  ProviderssLocation.belongsTo(Providerss, {
    foreignKey: "provider_id",
    as: "provider",
  });

  // Provider → Compliance
  Providerss.hasOne(ProviderssCompliance, {
    foreignKey: "provider_id",
    as: "compliance",
  });

  ProviderssCompliance.belongsTo(Providerss, {
    foreignKey: "provider_id",
    as: "provider",
  });

  // Provider → Identifiers
  Providerss.hasMany(ProviderssIdentifiers, {
    foreignKey: "provider_id",
    as: "identifiers",
  });

  ProviderssIdentifiers.belongsTo(Providerss, {
    foreignKey: "provider_id",
    as: "provider",
  });

  // Provider → Taxonomy
  Providerss.hasOne(ProviderssTaxonomy, {
    foreignKey: "provider_id",
    as: "taxonomy",
  });

  ProviderssTaxonomy.belongsTo(Providerss, {
    foreignKey: "provider_id",
    as: "provider",
  });

  // Provider → Health Info
  Providerss.hasMany(ProviderssHealthInfo, {
    foreignKey: "provider_id",
    as: "healthInfo",
  });

  ProviderssHealthInfo.belongsTo(Providerss, {
    foreignKey: "provider_id",
    as: "provider",
  });
}

const db = {
  sequelize,

  Providerss,
  ProviderssLocation,
  ProviderssCompliance,
  ProviderssIdentifiers,
  ProviderssTaxonomy,
  ProviderssHealthInfo,

  Case,
  CaseAssignment,
  CaseEscalation,
  CaseNote,
  CaseStatusHistory,

  User,
  Doctor,

  applyAssociations,
};

module.exports = db;