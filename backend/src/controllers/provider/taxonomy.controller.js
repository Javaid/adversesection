const providerssTaxonomy = require("../../models/providers/providersTaxonomy.model");
const Providerss = require("../../models/providers/providerss.model");
const axios = require("axios");

// Get Taxonomies
exports.getTaxonomies = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Providerss.findByPk(id);

    if (!provider) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });
    }

    let taxonomies = await providerssTaxonomy.findAll({
      where: { provider_id: id },
    });

    const isEmpty =
      taxonomies.length === 0 ||
      taxonomies.every((t) => !t.primary_taxonomy && !t.selected_taxonomy);

    if (isEmpty) {
      const nppesRes = await axios.get(
        `https://npiregistry.cms.hhs.gov/api/?number=${provider.npi}&version=2.1`,
      );

      const nppesTaxonomies = nppesRes.data.results?.[0]?.taxonomies || [];

      await providerssTaxonomy.destroy({
        where: { provider_id: id },
      });

      for (const t of nppesTaxonomies) {
        await providerssTaxonomy.create({
          provider_id: id,
          primary_taxonomy: t.primary ? t.desc : null,
          selected_taxonomy: t.code || null,
          state: t.state || null,
          license_number: t.license || null,
        });
      }

      taxonomies = await providerssTaxonomy.findAll({
        where: { provider_id: id },
      });
    }

    return res.json(taxonomies);
  } catch (error) {
    console.error("Error fetching taxonomy:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add or Update Taxonomy
exports.addOrUpdateTaxonomy = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      taxonomyId,
      primary_taxonomy,
      selected_taxonomy,
      state,
      license_number,
      status,
      document_link,
      source_url,
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

    let taxonomy;

    if (taxonomyId) {
      taxonomy = await providerssTaxonomy.findOne({
        where: { id: taxonomyId, provider_id: id },
      });

      if (!taxonomy) {
        return res
          .status(404)
          .json({ success: false, message: "Taxonomy not found" });
      }

      await taxonomy.update({
        primary_taxonomy: primary_taxonomy || null,
        selected_taxonomy: selected_taxonomy || null,
        state: state || null,
        license_number: license_number || null,
        status: status || null,
        document_link: document_link || null,
        source_url: source_url || null,
      });
    } else {
      taxonomy = await providerssTaxonomy.create({
        provider_id: id,
        primary_taxonomy: primary_taxonomy || null,
        selected_taxonomy: selected_taxonomy || null,
        state: state || null,
        license_number: license_number || null,
        status: status || null,
        document_link: document_link || null,
        source_url: source_url || null,
      });
    }

    return res.status(201).json({ success: true, taxonomy });
  } catch (error) {
    console.error("Error adding/updating taxonomy:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Taxonomy
exports.deleteTaxonomy = async (req, res) => {
  try {
    const { id } = req.params;

    const taxonomy = await providerssTaxonomy.findByPk(id);
    if (!taxonomy)
      return res
        .status(404)
        .json({ success: false, message: "Taxonomy not found" });

    await taxonomy.destroy();

    return res.json({
      success: true,
      message: "Taxonomy deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting taxonomy:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Insert Taxonomy (Procedure)
exports.insertTaxonomyProcedure = async (req, res) => {
  try {
    const {
      provider_id,
      primary_taxonomy,
      selected_taxonomy,
      state,
      license_number,
      status,
      document_link,
      source_url,
    } = req.body;

    if (!provider_id)
      return res.status(400).json({ message: "Provider ID is required" });

    const sequelize = require("../config/db");

    await sequelize.query(
      `CALL InsertProviderTaxonomy(
        :provider_id,
        :primary_taxonomy,
        :selected_taxonomy,
        :state,
        :license_number,
        :status,
        :document_link,
        :source_url
      )`,
      {
        replacements: {
          provider_id,
          primary_taxonomy,
          selected_taxonomy,
          state,
          license_number,
          status,
          document_link,
          source_url,
        },
      },
    );

    return res.status(201).json({
      success: true,
      message: "Taxonomy inserted successfully",
    });
  } catch (error) {
    console.error("Insert Taxonomy Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get Taxonomy By Provider
exports.getTaxonomyByProvider = async (req, res) => {
  try {
    const { provider_id } = req.params;

    if (!provider_id)
      return res.status(400).json({ message: "Provider ID is required" });

    const sequelize = require("../config/db");

    const [result] = await sequelize.query(
      `CALL GetTaxonomyByProviderId(:provider_id)`,
      {
        replacements: { provider_id },
      },
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Taxonomy Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Update Taxonomy (Procedure)
exports.updateTaxonomyProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      primary_taxonomy, 
      selected_taxonomy, 
      state, 
      license_number,
      status,
      document_link,
      source_url 
    } = req.body;

    if (!id)
      return res.status(400).json({ message: "Taxonomy ID is required" });

    const sequelize = require("../config/db");

    await sequelize.query(
      `CALL UpdateProviderTaxonomy(
        :id,
        :primary_taxonomy,
        :selected_taxonomy,
        :state,
        :license_number,
        :status,
        :document_link,
        :source_url
      )`,
      {
        replacements: {
          id,
          primary_taxonomy,
          selected_taxonomy,
          state,
          license_number,
          status,
          document_link,
          source_url,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Taxonomy updated successfully",
    });
  } catch (error) {
    console.error("Update Taxonomy Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete Taxonomy (Procedure)
exports.deleteTaxonomyProcedure = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "Taxonomy ID is required" });

    const sequelize = require("../config/db");

    await sequelize.query(`CALL DeleteProviderTaxonomy(:id)`, {
      replacements: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Taxonomy deleted successfully",
    });
  } catch (error) {
    console.error("Delete Taxonomy Error:", error);
    return res.status(500).json({ message: error.message });
  }
};