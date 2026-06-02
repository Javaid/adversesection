const ProviderssIdentifiers = require("../../models/providers/providersIdentifiers.model");
const Providerss = require("../models/providerss.model");

// Add or Update Identifier
exports.addOrUpdateIdentifier = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Providerss.findByPk(id);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    const payload = {
      provider_id: id,
      npi_number: req.body.npi_number || null,
      pac_id: req.body.pac_id || null,
      tax_id: req.body.tax_id || null,
      medicare_enrollment_id: req.body.medicare_enrollment_id || null,
      medicaid_enrollment_id: req.body.medicaid_enrollment_id || null,
      number: req.body.number || null,
      issuer: req.body.issuer || null,
      state: req.body.state || null,
      other_issuer: req.body.other_issuer || null,
      value: req.body.value || null,
    };

    await ProviderssIdentifiers.upsert({
      id: req.body.id || undefined,
      ...payload,
    });

    const identifiers = await ProviderssIdentifiers.findAll({
      where: { provider_id: id },
      order: [["id", "ASC"]],
    });

    return res.json({ identifiers });
  } catch (error) {
    console.error("Identifier error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get Identifiers By Provider
exports.getIdentifiersByProvider = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Providerss.findByPk(id);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    const identifiers = await ProviderssIdentifiers.findAll({
      where: { provider_id: id },
    });

    return res.json({ identifiers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Insert Identifier (Procedure)
exports.insertIdentifier = async (req, res) => {
  try {
    const {
      provider_id,
      npi_number,
      pac_id,
      tax_id,
      medicare_enrollment_id,
      medicaid_enrollment_id,
      value,
      issuer,
      state,
      number,
      other_issuer,
    } = req.body;

    if (!provider_id)
      return res.status(400).json({ message: "Provider ID is required" });
    
    const sequelize = require("../config/db");

    await sequelize.query(
      `CALL InsertProviderIdentifier(
        :provider_id,
        :npi_number,
        :pac_id,
        :tax_id,
        :medicare_enrollment_id,
        :medicaid_enrollment_id,
        :value,
        :issuer,
        :state,
        :number,
        :other_issuer
      )`,
      {
        replacements: {
          provider_id,
          npi_number,
          pac_id,
          tax_id,
          medicare_enrollment_id,
          medicaid_enrollment_id,
          value,
          issuer,
          state,
          number,
          other_issuer,
        },
      },
    );

    return res.status(201).json({
      success: true,
      message: "Identifier inserted successfully",
    });
  } catch (error) {
    console.error("Insert Identifier Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Update Identifier
exports.updateIdentifier = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      npi_number,
      pac_id,
      tax_id,
      medicare_enrollment_id,
      medicaid_enrollment_id,
      value,
      issuer,
      state,
      number,
      other_issuer,
    } = req.body;

    if (!id)
      return res.status(400).json({ message: "Identifier ID is required" });
    
    const sequelize = require("../config/db");
    await sequelize.query(
      `CALL UpdateProviderIdentifier(
        :id,
        :npi_number,
        :pac_id,
        :tax_id,
        :medicare_enrollment_id,
        :medicaid_enrollment_id,
        :value,
        :issuer,
        :state,
        :number,
        :other_issuer
      )`,
      {
        replacements: {
          id,
          npi_number,
          pac_id,
          tax_id,
          medicare_enrollment_id,
          medicaid_enrollment_id,
          value,
          issuer,
          state,
          number,
          other_issuer,
        },
      },
    );

    return res
      .status(200)
      .json({ success: true, message: "Identifier updated successfully" });
  } catch (error) {
    console.error("Update Identifier Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete Identifier
exports.deleteIdentifier = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Identifier ID is required" });
    
    const sequelize = require("../config/db");
    await sequelize.query(`CALL DeleteProviderIdentifier(:id)`, {
      replacements: { id },
    });

    return res
      .status(200)
      .json({ success: true, message: "Identifier deleted successfully" });
  } catch (error) {
    console.error("Delete Identifier Error:", error);
    return res.status(500).json({ message: error.message });
  }
};