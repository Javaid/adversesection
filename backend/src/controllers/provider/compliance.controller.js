const ProviderssCompliance = require("../../models/providers/providersCompliance.model");
const Providerss = require("../models/providerss.model");

// Add Compliance
exports.addCompliance = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      npiType,
      startDate,
      endDate,
      enumerationDate,
      soleProprietor,
      status,
    } = req.body;

    if (!id)
      return res.status(400).json({ message: "Provider ID is required" });

    const provider = await Providerss.findByPk(id);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    let compliance = await ProviderssCompliance.findOne({
      where: { provider_id: id },
    });
    const payload = {
      provider_id: id,
      npi_type: npiType || null,
      start_date: startDate ? new Date(startDate) : null,
      end_date: endDate ? new Date(endDate) : null,
      enumeration_date: enumerationDate ? new Date(enumerationDate) : null,
      sole_proprietor: soleProprietor ? true : false,
      status: status || null,
    };
    if (compliance) {
      await compliance.update(payload);
    } else {
      compliance = await ProviderssCompliance.create(payload);
    }

    return res.status(201).json({ success: true, compliance });
  } catch (error) {
    console.error("Error adding compliance:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Compliance
exports.deleteCompliance = async (req, res) => {
  try {
    const { complianceId } = req.params;
    if (!complianceId)
      return res.status(400).json({ message: "Compliance ID is required" });

    const compliance = await ProviderssCompliance.findByPk(complianceId);
    if (!compliance)
      return res.status(404).json({ message: "Compliance not found" });

    await compliance.destroy();
    return res.json({ success: true, message: "Compliance deleted" });
  } catch (error) {
    console.error("Error deleting compliance:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Insert Compliance (Procedure)
exports.insertComplianceProcedure = async (req, res) => {
  try {
    const {
      provider_id,
      npi_type,
      start_date,
      end_date,
      enumeration_date,
      sole_proprietor,
      status,
    } = req.body;

    if (!provider_id) {
      return res.status(400).json({ message: "Provider ID is required" });
    }

    const sequelize = require("../config/db");

    await sequelize.query(
      `CALL InsertProviderCompliance(
        :provider_id,
        :npi_type,
        :start_date,
        :end_date,
        :enumeration_date,
        :sole_proprietor,
        :status
      )`,
      {
        replacements: {
          provider_id,
          npi_type,
          start_date,
          end_date,
          enumeration_date,
          sole_proprietor,
          status,
        },
      },
    );

    return res.status(201).json({
      success: true,
      message: "Compliance inserted successfully using stored procedure",
    });
  } catch (error) {
    console.error("Procedure Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get Compliance By Provider
exports.getComplianceByProvider = async (req, res) => {
  try {
    const { provider_id } = req.params;
    if (!provider_id)
      return res.status(400).json({ message: "Provider ID is required" });
    
    const sequelize = require("../config/db");

    const [result] = await sequelize.query(
      `CALL GetComplianceByProviderId(:provider_id)`,
      { replacements: { provider_id } },
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Procedure Select Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Update Compliance
exports.updateCompliance = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      npi_type,
      start_date,
      end_date,
      enumeration_date,
      sole_proprietor,
      status,
    } = req.body;

    if (!id)
      return res.status(400).json({ message: "Compliance ID is required" });

    const sequelize = require("../config/db");

    await sequelize.query(
      `CALL UpdateProviderCompliance(
        :id,
        :npi_type,
        :start_date,
        :end_date,
        :enumeration_date,
        :sole_proprietor,
        :status
      )`,
      {
        replacements: {
          id,
          npi_type,
          start_date,
          end_date,
          enumeration_date,
          sole_proprietor,
          status,
        },
      },
    );

    return res
      .status(200)
      .json({ success: true, message: "Compliance updated successfully" });
  } catch (error) {
    console.error("Procedure Update Error:", error);
    return res.status(500).json({ message: error.message });
  }
};