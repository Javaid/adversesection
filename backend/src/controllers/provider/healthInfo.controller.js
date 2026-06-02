const ProviderssHealthInfo = require("../../models/providers/providersHealthInfo.model");
const Providerss = require("../models/providerss.model");
const axios = require("axios");

// Get Health Info
exports.getHealthInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Providerss.findByPk(id);
    if (!provider) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });
    }

    let records = await ProviderssHealthInfo.findAll({
      where: { provider_id: id },
    });

    const isEmpty =
      records.length === 0 ||
      records.every(
        (r) => !r.endpoint && !r.endpoint_type && !r.endpoint_description,
      );

    if (isEmpty) {
      const nppesRes = await axios.get(
        `https://npiregistry.cms.hhs.gov/api/?number=${provider.npi}&version=2.1`,
      );

      const nppesData = nppesRes.data.results?.[0] || null;

      if (nppesData) {
        const endpoints = nppesData.endpoints || [];
        const payloads =
          endpoints.length > 0
            ? endpoints.map((ep) => ({
                provider_id: id,
                endpoint_type: ep.endpoint_type || "",
                endpoint: ep.endpoint || "",
                endpoint_description: ep.endpoint_description || "",
                use_type: ep.use_type || "",
                content_type: ep.content_type || "",
                affiliation: ep.affiliation || "",
                endpoint_location: ep.endpoint_location || "",
              }))
            : [
                {
                  provider_id: id,
                  endpoint_type: "",
                  endpoint: "",
                  endpoint_description: "",
                  use_type: "",
                  content_type: "",
                  affiliation: "",
                  endpoint_location: "",
                },
              ];

        await ProviderssHealthInfo.destroy({ where: { provider_id: id } });
        await ProviderssHealthInfo.bulkCreate(payloads);
      } else {
        await ProviderssHealthInfo.create({
          provider_id: id,
          endpoint_type: "",
          endpoint: "",
          endpoint_description: "",
          use_type: "",
          content_type: "",
          affiliation: "",
          endpoint_location: "",
        });
      }

      records = await ProviderssHealthInfo.findAll({
        where: { provider_id: id },
      });
    }

    return res.json(records);
  } catch (error) {
    console.error("Error fetching health info:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add or Update Health Info
exports.addOrUpdateHealthInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      endpoint_type,
      endpoint,
      endpoint_description,
      use_type,
      content_type,
      affiliation,
      endpoint_location,
    } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Provider ID is required" });

    const provider = await Providerss.findByPk(id);
    if (!provider)
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });

    let record = await ProviderssHealthInfo.findOne({
      where: { provider_id: id, endpoint },
    });

    const payload = {
      provider_id: id,
      endpoint_type: endpoint_type || "",
      endpoint: endpoint || "",
      endpoint_description: endpoint_description || "",
      use_type: use_type || "",
      content_type: content_type || "",
      affiliation: affiliation || "",
      endpoint_location: endpoint_location || "",
    };

    if (record) {
      await record.update(payload);
    } else {
      record = await ProviderssHealthInfo.create(payload);
    }

    return res.status(201).json({ success: true, record });
  } catch (error) {
    console.error("Error adding/updating health info:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Health Info
exports.deleteHealthInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await ProviderssHealthInfo.findByPk(id);
    if (!record)
      return res
        .status(404)
        .json({ success: false, message: "Health info not found" });

    await record.destroy();
    return res.json({
      success: true,
      message: "Health info deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting health info:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Insert Health Info (Procedure)
exports.insertHealthInfo = async (req, res) => {
  try {
    const {
      provider_id,
      endpoint_type,
      endpoint,
      endpoint_description,
      use_type,
      content_type,
      affiliation,
      endpoint_location,
    } = req.body;

    if (!provider_id)
      return res.status(400).json({ message: "Provider ID is required" });

    const sequelize = require("../config/db");

    await sequelize.query(
      `CALL InsertHealthInformationExchange(
        :provider_id,
        :endpoint_type,
        :endpoint,
        :endpoint_description,
        :use_type,
        :content_type,
        :affiliation,
        :endpoint_location
      )`,
      {
        replacements: {
          provider_id,
          endpoint_type,
          endpoint,
          endpoint_description,
          use_type,
          content_type,
          affiliation,
          endpoint_location,
        },
      },
    );

    return res.status(201).json({
      success: true,
      message: "Health Information Exchange inserted successfully",
    });
  } catch (error) {
    console.error("Insert Health Info Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get Health Info By Provider
exports.getHealthInfoByProvider = async (req, res) => {
  try {
    const { provider_id } = req.params;

    if (!provider_id)
      return res.status(400).json({ message: "Provider ID is required" });

    const sequelize = require("../config/db");

    const [result] = await sequelize.query(
      `CALL GetHealthInfoByProviderId(:provider_id)`,
      {
        replacements: { provider_id },
      },
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Health Info Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Update Health Info (Procedure)
exports.updateHealthInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      endpoint_type,
      endpoint,
      endpoint_description,
      use_type,
      content_type,
      affiliation,
      endpoint_location,
    } = req.body;

    if (!id)
      return res.status(400).json({ message: "Health Info ID is required" });

    const sequelize = require("../config/db");

    await sequelize.query(
      `CALL UpdateHealthInformationExchange(
        :id,
        :endpoint_type,
        :endpoint,
        :endpoint_description,
        :use_type,
        :content_type,
        :affiliation,
        :endpoint_location
      )`,
      {
        replacements: {
          id,
          endpoint_type,
          endpoint,
          endpoint_description,
          use_type,
          content_type,
          affiliation,
          endpoint_location,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Health Information Exchange updated successfully",
    });
  } catch (error) {
    console.error("Update Health Info Error:", error);
    return res.status(500).json({ message: error.message });
  }
};