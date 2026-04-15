const axios = require("axios");
const Providerss = require("../models/providerss.model");
const ProviderssLocation = require("../models/providerssLocation.model");
const ProviderssCompliance = require("../models/providerssCompliance.model");
const ProviderssIdentifiers = require("../models/providerssIdentifiers.model");
const providerssTaxonomy = require("../models/providerssTaxonomy.model");
const taxonomy = require("../models/taxonomy.model");
const ProviderssHealthInfo = require("../models/providerssHealthInfo.model");
const sequelize = require("../config/db");
const { Op } = require("sequelize");
let client = null;
try {
  client = require("../config/elasticSearch");
} catch (e) {
  console.warn("Elasticsearch not available:", e.message);
}

// Helper function to sync provider to Elasticsearch
const syncProviderToElastic = async (provider) => {
  if (!client) return;
  try {
    const name =
      provider.providerName ||
      `${provider.first_name || ""} ${provider.last_name || ""}`.trim() ||
      provider.organization_name ||
      "Unknown";

    await client.index({
      index: "doctors",
      id: provider.npi,
      document: {
        name: name,
        speciality: provider.speciality || "",
        location: provider.location || "",
        organization_name: provider.organization_name || "",
      },
      refresh: true,
    });
    console.log(`Provider ${provider.npi} synced to Elasticsearch`);
  } catch (error) {
    console.error(`Error syncing provider ${provider.npi} to Elasticsearch:`, error.message);
  }
};
// Fetch provider by NPI (existing)
exports.getProvider = async (req, res) => {
  try {
    const { npi } = req.params;

    if (!npi) {
      return res
        .status(400)
        .json({ success: false, message: "NPI is required" });
    }

    // Try DB first
    let provider = await Providerss.findOne({
       where: { npi: Number(npi) },
      attributes: [
        "id",
        "npi",
        "providerName",
        "speciality",
        "location",
        "npi_status",
        "mips_score",
        "payment",
        "medicare_status",
        "risk_level",
        "first_name",
        "last_name",
        "organization_name",
        "gender",
      ],
      include: [
        {
          model: ProviderssLocation,
          as: "locations",
          required: false,
          attributes: [
            "id",
            "type",
            "name",
            "address",
            "city",
            "state",
            "zip",
            "country",
            "phone",
            "fax",
            "email",
          ],
        },
        {
          model: ProviderssCompliance,
          as: "compliance",
          required: false,
          attributes: [
            "id",
            "provider_id",

            "npi_type",
            "start_date",
            "end_date",
            "enumeration_date",
            "sole_proprietor",
            "status",
          ],
        },
        {
          model: ProviderssIdentifiers,
          as: "identifiers",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "npi_number",
            "pac_id",
            "tax_id",
            "medicare_enrollment_id",
            "medicaid_enrollment_id",
            "value",
            "issuer",
            "state",
            "number",
            "other_issuer",
          ],
        },
        {
          model: providerssTaxonomy,
          as: "taxonomy",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "primary_taxonomy",
            "selected_taxonomy",
            "state",
            "license_number",
            "status",
            "document_link",
            "source_url",
          ],
        },
        {
          model: ProviderssHealthInfo,
          as: "ProviderssHealthInfo",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "endpoint_type",
            "endpoint",
            "endpoint_description",
            "use_type",
            "content_type",
            "affiliation",
            "endpoint_location",
          ],
        },
      ],
    });

    // If provider exists in DB
    if (provider) return res.json({ success: true, provider });

    // Else fetch from NPPES
    const response = await axios.get(
      `https://npiregistry.cms.hhs.gov/api/?number=${npi}&version=2.1`,
    );
    if (!response.data.results || response.data.results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found in NPPES" });
    }

    const data = response.data.results[0];

    // Save new provider
    const newProvider = await Providerss.create({
      npi: data.number,
      providerName:
        data.basic?.organization_name ||
        `${data.basic?.first_name || ""} ${data.basic?.last_name || ""}`.trim(),
      speciality: data.taxonomies?.[0]?.desc || null,
      location: `${data.addresses?.[0]?.city || ""}, ${data.addresses?.[0]?.state || ""}`,
      npi_status:
        data.basic?.status === "A"
          ? "Active"
          : data.basic?.status === "I"
            ? "Inactive"
            : data.basic?.status || null,
      mips_score: 0,
      payment: 0,
      medicare_status: "Active",
      risk_level: "Clear",
      first_name: data.basic?.first_name || null,
      last_name: data.basic?.last_name || null,
      organization_name: data.basic?.organization_name || null,
      gender: data.basic?.gender || null,
    });
    console.log(newProvider)
    if (client) {
      await client.index({
        index: "doctors",
        id: newProvider?.dataValues.id,
        body: {
          name: newProvider?.dataValues?.providerName,
          npi: newProvider?.dataValues.npi,
          speciality: newProvider?.dataValues?.speciality || "",
          location: newProvider?.dataValues?.location || "",
          organization_name: newProvider?.dataValues?.organization_name || "",
        },
      });
      await client.indices.refresh({ index: "doctors" });
    }
    // Insert locations

    if (data.addresses && data.addresses.length > 0) {
      let primaryAssigned = false;

      const locations = data.addresses.map((addr) => {
        let type = "secondary";

        if (addr.address_purpose === "MAILING") {
          type = "mailing";
        }

        if (addr.address_purpose === "LOCATION") {
          if (!primaryAssigned) {
            type = "primary";
            primaryAssigned = true;
          } else {
            type = "secondary";
          }
        }

        return {
          provider_id: newProvider.id,
          type,
          name:
            addr.organization_name ||
            `${data.basic?.first_name || ""} ${data.basic?.last_name || ""}`.trim(),
          address: addr.address_1 || "",
          city: addr.city || "",
          state: addr.state || "",
          zip: addr.postal_code || "",
          country: addr.country_code || "US",
          phone: addr.telephone_number || "",
          fax: addr.fax_number || "",
          email: addr.email || "",
        };
      });

      await ProviderssLocation.bulkCreate(locations);
    }

    // Insert compliance
    await ProviderssCompliance.create({
      provider_id: newProvider.id,

      npi_type: data.enumeration_type || null,
      start_date: data.basic?.start_date || null,
      end_date: data.basic?.end_date || null,
      enumeration_date: data.basic?.enumeration_date || null,
      sole_proprietor: data.basic?.sole_proprietor === "YES",
      status: data.basic?.status || null,
    });

    // Insert Identifiers
    const identifiers = [];
    if (data.basic) {
      identifiers.push({
        provider_id: newProvider.id,
        npi_number: data.number,
        pac_id: null,
        tax_id: null,
        medicare_enrollment_id: null,
        medicaid_enrollment_id: null,
        value: "",
        issuer: "",
        state: null,
        number: data.number,
        other_issuer: null,
      });
    }
    // Add other identifiers from data.other_identifiers if available
    if (data.other_identifiers && data.other_identifiers.length > 0) {
      data.other_identifiers.forEach((id) => {
        identifiers.push({
          provider_id: newProvider.id,
          value: id.type || "Other",
          issuer: id.issuer || null,
          state: id.state || null,
          number: id.number || null,
          other_issuer: id.other_issuer || null,
        });
      });
    }
    if (identifiers.length > 0)
      await ProviderssIdentifiers.bulkCreate(identifiers);

    await providerssTaxonomy.create({
      provider_id: newProvider.id,
      primary_taxonomy: "",
      selected_taxonomy: "",
      state: "",
      license_number: "",
      status: "",
      document_link: "",
      source_url: "",
    });

    await ProviderssHealthInfo.create({
      provider_id: newProvider.id,
      endpoint_type: "",
      endpoint: "",
      endpoint_description: "",
      use_type: "",
      content_type: "",
      affiliation: "",
      endpoint_location: "",
    });

    // Fetch again with locations & compliance
    provider = await Providerss.findOne({
      where: { id: newProvider.id },
      attributes: [
        "id",
        "npi",
        "providerName",
        "speciality",
        "location",
        "npi_status",
        "mips_score",
        "payment",
        "medicare_status",
        "risk_level",
        "first_name",
        "last_name",
        "organization_name",
        "gender",
      ],
      include: [
        {
          model: ProviderssLocation,
          as: "locations",
          required: false,
          attributes: [
            "id",
            "type",
            "name",
            "address",
            "city",
            "state",
            "zip",
            "country",
            "phone",
            "fax",
            "email",
          ],
        },
        {
          model: ProviderssCompliance,
          as: "compliance",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "npi_type",
            "start_date",
            "end_date",
            "enumeration_date",
            "sole_proprietor",
            "status",
          ],
        },
        {
          model: ProviderssIdentifiers,
          as: "identifiers",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "npi_number",
            "pac_id",
            "tax_id",
            "medicare_enrollment_id",
            "medicaid_enrollment_id",
            "value",
            "issuer",
            "state",
            "number",
            "other_issuer",
          ],
        },
        {
          model: providerssTaxonomy,
          as: "taxonomy",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "primary_taxonomy",
            "selected_taxonomy",
            "state",
            "license_number",
            "status",
            "source_url",
            "document_link",
          ],
        },
        {
          model: ProviderssHealthInfo,
          as: "ProviderssHealthInfo",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "endpoint_type",
            "endpoint",
            "endpoint_description",
            "use_type",
            "content_type",
            "affiliation",
            "endpoint_location",
          ],
        },
      ],
    });

    // Sync new provider to Elasticsearch immediately
    await syncProviderToElastic({
      npi: newProvider.npi,
      providerName: newProvider.providerName,
      first_name: newProvider.first_name,
      last_name: newProvider.last_name,
      speciality: newProvider.speciality,
      location: newProvider.location,
      organization_name: newProvider.organization_name,
    });

    return res.json({ success: true, provider });
  } catch (error) {
  console.error("❌ FULL ERROR:", error);

  return res.status(500).json({
    success: false,
    message: error.message,  // 👈 THIS IS THE KEY FIX
  });
}
};

// Get all providers

exports.getAllProviders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const npis = req.query.npis || ""; // New: NPIs from Elasticsearch
    const sortBy = req.query.sortBy || "providerName";
    const order = req.query.order || "ASC";

    const offset = (page - 1) * limit;

    let whereCondition = {};

    if (npis) {
      // Filter by specific NPIs from Elasticsearch
      const npiArray = npis.split(",").filter((npi) => npi.trim());
      whereCondition = {
        npi: { [Op.in]: npiArray },
      };
    } else if (search) {
      // Fallback database search (shouldn't be used now)
      whereCondition = {
        [Op.or]: [
          { providerName: { [Op.like]: `%${search}%` } },
          { npi: { [Op.like]: `%${search}%` } },
          { speciality: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const { rows, count } = await Providerss.findAndCountAll({
      where: whereCondition,
      attributes: [
        "id",
        "npi",
        "providerName",
        "speciality",
        "location",
        "npi_status",
        "mips_score",
        "payment",
        "medicare_status",
        "risk_level",
      ],
      include: [
        {
          model: ProviderssLocation,
          as: "locations",
          required: false,
          attributes: [
            "id",
            "type",
            "name",
            "address",
            "city",
            "state",
            "zip",
            "country",
            "phone",
            "fax",
            "email",
          ],
        },
        {
          model: ProviderssCompliance,
          as: "compliance",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "npi_type",
            "start_date",
            "end_date",
            "enumeration_date",
            "sole_proprietor",
            "status",
          ],
        },
        {
          model: ProviderssIdentifiers,
          as: "identifiers",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "npi_number",
            "pac_id",
            "tax_id",
            "medicare_enrollment_id",
            "medicaid_enrollment_id",
            "value",
            "issuer",
            "state",
            "number",
            "other_issuer",
          ],
        },
        {
          model: providerssTaxonomy,
          as: "taxonomy",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "primary_taxonomy",
            "selected_taxonomy",
            "state",
            "license_number",
            "status",
            "source_url",
            "document_link",
          ],
        },
        {
          model: ProviderssHealthInfo,
          as: "ProviderssHealthInfo",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "endpoint_type",
            "endpoint",
            "endpoint_description",
            "use_type",
            "content_type",
            "affiliation",
            "endpoint_location",
          ],
        },
      ],
      limit: npis ? undefined : limit, // No limit when filtering by NPIs
      offset: npis ? undefined : offset, // No offset when filtering by NPIs
      order: [[sortBy, order]],
      distinct:true,
    });

    const mappedProviders = rows.map((p) => ({
      id: p.id,
      npi: p.npi,
      providerName: p.providerName || "N/A",
      speciality: p.speciality || "N/A",
      location: p.location || "N/A",
      npi_status: p.npi_status || "Unknown",
      mips_score: p.mips_score || 0,
      payment: p.payment || 0,
      medicare_status: p.medicare_status || "Unknown",
      risk_level: p.risk_level || "Unknown",
      locations: p.locations,
      compliance: p.compliance,
      identifiers: p.identifiers,
      taxonomy: p.taxonomy,
      healthInfo: p.ProviderssHealthInfo,
    }));

    return res.json({
      data: mappedProviders,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get provider by DB ID (with locations & compliance)
exports.getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });

    const provider = await Providerss.findOne({
      where: { id },
      attributes: [
        "id",
        "npi",
        "providerName",
        "speciality",
        "location",
        "npi_status",
        "mips_score",
        "payment",
        "medicare_status",
        "risk_level",
        "first_name",
        "last_name",
        "organization_name",
        "gender",
      ],
      include: [
        {
          model: ProviderssLocation,
          as: "locations",
          required: false,
          attributes: [
            "id",
            "type",
            "name",
            "address",
            "city",
            "state",
            "zip",
            "country",
            "phone",
            "fax",
            "email",
          ],
        },
        {
          model: ProviderssCompliance,
          as: "compliance",
          required: false,
          attributes: [
            "id",
            "provider_id",

            "npi_type",
            "start_date",
            "end_date",
            "enumeration_date",
            "sole_proprietor",
            "status",
          ],
        },
        {
          model: ProviderssIdentifiers,
          as: "identifiers",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "npi_number",
            "pac_id",
            "tax_id",
            "medicare_enrollment_id",
            "medicaid_enrollment_id",
            "value",
            "issuer",
            "state",
            "number",
            "other_issuer",
          ],
        },
        {
          model: providerssTaxonomy,
          as: "taxonomy",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "primary_taxonomy",
            "selected_taxonomy",
            "state",
            "license_number",
            "status",
            "source_url",
            "document_link",
          ],
        },
        {
          model: ProviderssHealthInfo,
          as: "ProviderssHealthInfo",
          required: false,
          attributes: [
            "id",
            "provider_id",
            "endpoint_type",
            "endpoint",
            "endpoint_description",
            "use_type",
            "content_type",
            "affiliation",
            "endpoint_location",
          ],
        },
      ],
    });

    if (!provider)
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });
    return res.json({ success: true, provider });
  } catch (error) {
    console.error("Error fetching provider by ID:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
//for add compliance
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

// Add or Update Identifiers
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

//for taxonomies
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
// ADD or UPDATE taxonomy

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
      // Update existing by ID
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
      // Create new
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

// DELETE taxonomy

exports.deleteTaxonomy = async (req, res) => {
  try {
    const { id } = req.params; // taxonomy id

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

//for health information exchange

exports.getHealthInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Providerss.findByPk(id);
    if (!provider) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });
    }

    // Fetch existing HIE records from DB
    let records = await ProviderssHealthInfo.findAll({
      where: { provider_id: id },
    });

    // If no records exist or all records are empty, fetch from NPPES
    const isEmpty =
      records.length === 0 ||
      records.every(
        (r) => !r.endpoint && !r.endpoint_type && !r.endpoint_description,
      );

    if (isEmpty) {
      // Fetch from NPPES
      const nppesRes = await axios.get(
        `https://npiregistry.cms.hhs.gov/api/?number=${provider.npi}&version=2.1`,
      );

      const nppesData = nppesRes.data.results?.[0] || null;

      if (nppesData) {
        const endpoints = nppesData.endpoints || []; // NPPES HIE endpoints array
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

        // Delete any existing empty records
        await ProviderssHealthInfo.destroy({ where: { provider_id: id } });

        // Save new records to DB
        await ProviderssHealthInfo.bulkCreate(payloads);
      } else {
        // If NPPES has no endpoint info, create one empty record
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

      // Re-fetch after saving
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

    // Check if record exists for this endpoint
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

//  procedure function to test raw SQL query for fetching provider by NPI
exports.testProcedure = async (req, res) => {
  try {
    const { npi } = req.params;

    const sequelize = require("../config/db");

    const [result] = await sequelize.query("CALL getProviderByNpi(:npi)", {
      replacements: { npi },
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//procedure for compliance procedure function for testing
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

//for grtting compliance
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

//for updating compliance
exports.updateCompliance = async (req, res) => {
  try {
    const { id } = req.params; // compliance record ID
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

//delete procedure compliance
exports.deleteCompliance = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Compliance ID is required" });

    const sequelize = require("../config/db");

    await sequelize.query(`CALL DeleteProviderCompliance(:id)`, {
      replacements: { id },
    });

    return res
      .status(200)
      .json({ success: true, message: "Compliance deleted successfully" });
  } catch (error) {
    console.error("Procedure Delete Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//procedure function for identifiers
// INSERT
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

// UPDATE by id
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

// DELETE by id
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

// PROCEDURE for TAXONOMY

// INSERT TAXONOMY
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
        :license_number
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

// GET TAXONOMY BY PROVIDER
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

// UPDATE TAXONOMY
exports.updateTaxonomyProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const { primary_taxonomy, selected_taxonomy, state, license_number } =
      req.body;

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
        :source_url,
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

// DELETE TAXONOMY
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

//function for health information exchange procedure
// INSERT HEALTH INFO
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

// GET HEALTH INFO BY PROVIDER
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

// UPDATE HEALTH INFO
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

// DELETE HEALTH INFO
exports.deleteHealthInfo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "Health Info ID is required" });

    const sequelize = require("../config/db");

    await sequelize.query(`CALL DeleteHealthInformationExchange(:id)`, {
      replacements: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Health Information Exchange deleted successfully",
    });
  } catch (error) {
    console.error("Delete Health Info Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//location procedure

// INSERT LOCATION
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

// GET BY PROVIDER
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

// UPDATE LOCATION
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

// DELETE LOCATION
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

//procedure function for providers
// INSERT PROVIDER
exports.insertProviderProcedure = async (req, res) => {
  try {
    const {
      npi,
      speciality,
      location,
      npi_status,
      mips_score,
      payment,
      medicare_status,
      risk_level,
      first_name,
      last_name,
      organization_name,
      gender,
      providerName,
    } = req.body;

    const sequelize = require("../config/db");

    await sequelize.query(
      `CALL InsertProvider(
        :npi,
        :speciality,
        :location,
        :npi_status,
        :mips_score,
        :payment,
        :medicare_status,
        :risk_level,
        :first_name,
        :last_name,
        :organization_name,
        :gender,
        :providerName
      )`,
      {
        replacements: {
          npi,
          speciality,
          location,
          npi_status,
          mips_score,
          payment,
          medicare_status,
          risk_level,
          first_name,
          last_name,
          organization_name,
          gender,
          providerName,
        },
      },
    );

    // Sync to Elasticsearch with proper data
    await syncProviderToElastic({
      npi,
      providerName,
      first_name,
      last_name,
      speciality,
      location,
      organization_name,
    });

    return res.status(201).json({
      success: true,
      message: "Provider inserted successfully",
    });
  } catch (error) {
    console.error("Insert Provider Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//update provider
exports.updateProviderProcedure = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      npi,
      speciality,
      location,
      npi_status,
      mips_score,
      payment,
      medicare_status,
      risk_level,
      first_name,
      last_name,
      organization_name,
      gender,
      providerName,
    } = req.body;

    const sequelize = require("../config/db");

    await sequelize.query(
      `CALL UpdateProvider(
        :id,
        :npi,
        :speciality,
        :location,
        :npi_status,
        :mips_score,
        :payment,
        :medicare_status,
        :risk_level,
        :first_name,
        :last_name,
        :organization_name,
        :gender,
        :providerName
      )`,
      {
        replacements: {
          id,
          npi,
          speciality,
          location,
          npi_status,
          mips_score,
          payment,
          medicare_status,
          risk_level,
          first_name,
          last_name,
          organization_name,
          gender,
          providerName,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Provider updated successfully",
    });
  } catch (error) {
    console.error("Update Provider Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//delete provider
exports.deleteProviderProcedure = async (req, res) => {
  try {
    const { id } = req.params;

    const sequelize = require("../config/db");

    await sequelize.query(`CALL DeleteProvider(:id)`, { replacements: { id } });

    return res.status(200).json({
      success: true,
      message: "Provider deleted successfully",
    });
  } catch (error) {
    console.error("Delete Provider Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

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
