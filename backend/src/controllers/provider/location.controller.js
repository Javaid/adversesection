const ProviderssLocation = require("../../models/providers/providersLocation.model");
const Providerss = require("../models/providerss.model");

// Add or Update Location
exports.addOrUpdateLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Providerss.findByPk(id);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    const payload = {
      provider_id: id,
      type: req.body.type || "secondary",
      name: req.body.name || null,
      address: req.body.address || null,
      city: req.body.city || null,
      state: req.body.state || null,
      zip: req.body.zip || null,
      country: req.body.country || "US",
      phone: req.body.phone || null,
      fax: req.body.fax || null,
      email: req.body.email || null,
    };

    await ProviderssLocation.upsert({
      id: req.body.id || undefined,
      ...payload,
    });

    const locations = await ProviderssLocation.findAll({
      where: { provider_id: id },
      order: [["id", "ASC"]],
    });

    return res.json({ locations });
  } catch (error) {
    console.error("Location error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Insert Location (Procedure)
exports.insertLocation = async (req, res) => {
  try {
    const {
      provider_id,
      type,
      name,
      address,
      city,
      state,
      zip,
      country,
      phone,
      fax,
      email,
    } = req.body;

    if (!provider_id)
      return res.status(400).json({ message: "Provider ID is required" });
    
    const sequelize = require("../config/db");
    await sequelize.query(
      `CALL InsertProviderLocation(
        :provider_id, :type, :name, :address, :city, :state, :zip, :country, :phone, :fax, :email
      )`,
      {
        replacements: {
          provider_id,
          type,
          name,
          address,
          city,
          state,
          zip,
          country,
          phone,
          fax,
          email,
        },
      },
    );

    return res
      .status(201)
      .json({ success: true, message: "Location inserted successfully" });
  } catch (error) {
    console.error("Insert Location Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get Locations By Provider
exports.getLocationsByProvider = async (req, res) => {
  try {
    const { provider_id } = req.params;
    if (!provider_id)
      return res.status(400).json({ message: "Provider ID is required" });
    
    const sequelize = require("../config/db");
    const [result] = await sequelize.query(
      `CALL GetLocationsByProviderId(:provider_id)`,
      { replacements: { provider_id } },
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Locations Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Update Location
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      name,
      address,
      city,
      state,
      zip,
      country,
      phone,
      fax,
      email,
    } = req.body;

    if (!id)
      return res.status(400).json({ message: "Location ID is required" });
    
    const sequelize = require("../config/db");
    await sequelize.query(
      `CALL UpdateProviderLocation(
        :id, :type, :name, :address, :city, :state, :zip, :country, :phone, :fax, :email
      )`,
      {
        replacements: {
          id,
          type,
          name,
          address,
          city,
          state,
          zip,
          country,
          phone,
          fax,
          email,
        },
      },
    );

    return res
      .status(200)
      .json({ success: true, message: "Location updated successfully" });
  } catch (error) {
    console.error("Update Location Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete Location
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Location ID is required" });
    
    const sequelize = require("../config/db");
    await sequelize.query(`CALL DeleteProviderLocation(:id)`, {
      replacements: { id },
    });

    return res
      .status(200)
      .json({ success: true, message: "Location deleted successfully" });
  } catch (error) {
    console.error("Delete Location Error:", error);
    return res.status(500).json({ message: error.message });
  }
};