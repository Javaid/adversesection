const axios = require("axios");
const { 
  Providerss, 
  ProviderssLocation, 
  ProviderssCompliance, 
  ProviderssIdentifiers, 
  ProviderssTaxonomy, 
  ProviderssHealthInfo 
} = require("../../models");
const { Op } = require("sequelize");

const { sequelize } = require("../../config/database");

let client = null;
try {
  client = require("../../config/elasticSearch");
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

// Get provider by NPI
exports.getProvider = async (req, res) => {
  try {
    const { npi } = req.params;
    const userCompanyId = req.user?.companyId;
    const userRole = req.user?.role;

    // CRITICAL: Validate companyId exists
    if (userCompanyId === null || userCompanyId === undefined) {
      return res.status(401).json({ success: false, message: "Authentication error: company not identified" });
    }

    if (!npi) {
      return res
        .status(400)
        .json({ success: false, message: "NPI is required" });
    }

    // Build where clause - Super Admin (companyId=0) can see all providers
    const whereClause = { npi: Number(npi) };
    if (userCompanyId !== 0) {
      whereClause.companyId = userCompanyId;
    }

    let provider = await Providerss.findOne({
      where: whereClause,
      attributes: [
        "id", "npi", "providerName", "speciality", "location", "npi_status",
        "mips_score", "payment", "medicare_status", "risk_level", "first_name",
        "last_name", "organization_name", "gender", "companyId"
      ],
      include: [
        {
          model: ProviderssLocation, as: "locations", required: false,
          attributes: ["id", "type", "name", "address", "city", "state", "zip", "country", "phone", "fax", "email"]
        },
        {
          model: ProviderssCompliance, as: "compliance", required: false,
          attributes: ["id", "provider_id", "npi_type", "start_date", "end_date", "enumeration_date", "sole_proprietor", "status"]
        },
        {
          model: ProviderssIdentifiers, as: "identifiers", required: false,
          attributes: ["id", "provider_id", "npi_number", "pac_id", "tax_id", "medicare_enrollment_id", "medicaid_enrollment_id", "value", "issuer", "state", "number", "other_issuer"]
        },
        {
          model: ProviderssTaxonomy, as: "taxonomy", required: false,
          attributes: ["id", "provider_id", "primary_taxonomy", "selected_taxonomy", "state", "license_number", "status", "document_link", "source_url"]
        },
        {
          model: ProviderssHealthInfo, as: "healthInfo", required: false,
          attributes: ["id", "provider_id", "endpoint_type", "endpoint", "endpoint_description", "use_type", "content_type", "affiliation", "endpoint_location"]
        }
      ],
    });

    if (provider) return res.json({ success: true, provider });

    // Fetch from NPPES
    const response = await axios.get(
      `https://npiregistry.cms.hhs.gov/api/?number=${npi}&version=2.1`,
    );
    if (!response.data.results || response.data.results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found in NPPES" });
    }

    const data = response.data.results[0];
    const newProvider = await Providerss.create({
      npi: data.number,
      providerName: data.basic?.organization_name ||
        `${data.basic?.first_name || ""} ${data.basic?.last_name || ""}`.trim(),
      speciality: data.taxonomies?.[0]?.desc || null,
      location: `${data.addresses?.[0]?.city || ""}, ${data.addresses?.[0]?.state || ""}`,
      npi_status: data.basic?.status === "A" ? "Active" : data.basic?.status === "I" ? "Inactive" : data.basic?.status || null,
      mips_score: 0,
      payment: 0,
      medicare_status: "Active",
      risk_level: "Clear",
      first_name: data.basic?.first_name || null,
      last_name: data.basic?.last_name || null,
      organization_name: data.basic?.organization_name || null,
      gender: data.basic?.gender || null,
      companyId: companyId,
      
    });

    // Insert locations
    if (data.addresses && data.addresses.length > 0) {
      let primaryAssigned = false;
      const locations = data.addresses.map((addr) => {
        let type = "secondary";
        if (addr.address_purpose === "MAILING") type = "mailing";
        if (addr.address_purpose === "LOCATION") {
          type = !primaryAssigned ? "primary" : "secondary";
          primaryAssigned = true;
        }
        return {
          provider_id: newProvider.id, type,
          name: addr.organization_name || `${data.basic?.first_name || ""} ${data.basic?.last_name || ""}`.trim(),
          address: addr.address_1 || "", city: addr.city || "", state: addr.state || "",
          zip: addr.postal_code || "", country: addr.country_code || "US",
          phone: addr.telephone_number || "", fax: addr.fax_number || "", email: addr.email || ""
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
        provider_id: newProvider.id, npi_number: data.number,
        number: data.number, value: "", issuer: "", state: null, other_issuer: null,
      });
    }
    if (data.other_identifiers && data.other_identifiers.length > 0) {
      data.other_identifiers.forEach((id) => {
        identifiers.push({
          provider_id: newProvider.id, value: id.type || "Other",
          issuer: id.issuer || null, state: id.state || null,
          number: id.number || null, other_issuer: id.other_issuer || null,
        });
      });
    }
    if (identifiers.length > 0) await ProviderssIdentifiers.bulkCreate(identifiers);

    await ProviderssTaxonomy.create({ provider_id: newProvider.id });
    await ProviderssHealthInfo.create({ provider_id: newProvider.id });

    // Fetch again with all includes
    provider = await Providerss.findOne({
      where: { id: newProvider.id },
      attributes: ["id", "npi", "providerName", "speciality", "location", "npi_status", "mips_score", "payment", "medicare_status", "risk_level", "first_name", "last_name", "organization_name", "gender", "companyId"],
      include: [
        { model: ProviderssLocation, as: "locations", required: false },
        { model: ProviderssCompliance, as: "compliance", required: false },
        { model: ProviderssIdentifiers, as: "identifiers", required: false },
        { model: ProviderssTaxonomy, as: "taxonomy", required: false },
        { model: ProviderssHealthInfo, as: "healthInfo", required: false }
      ],
    });

    await syncProviderToElastic({
      npi: newProvider.npi, providerName: newProvider.providerName,
      first_name: newProvider.first_name, last_name: newProvider.last_name,
      speciality: newProvider.speciality, location: newProvider.location,
      organization_name: newProvider.organization_name,
    });

    return res.json({ success: true, provider });
  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Get all providers
exports.getAllProviders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const npis = req.query.npis || "";
    const sortBy = req.query.sortBy || "providerName";
    const order = req.query.order || "ASC";
    const userCompanyId = req.user?.companyId;
    const userRole = req.user?.role;

    // CRITICAL: Validate companyId exists
    if (userCompanyId === null || userCompanyId === undefined) {
      return res.status(401).json({ success: false, message: "Authentication error: company not identified" });
    }

    const offset = (page - 1) * limit;

    // Validate sortBy to prevent SQL injection
    const validSortFields = ["id", "npi", "providerName", "speciality", "location", "npi_status", "mips_score", "payment", "medicare_status", "risk_level", "companyId"];
    const safeSort = validSortFields.includes(sortBy) ? sortBy : "providerName";
    const safeOrder = ["ASC", "DESC"].includes(order) ? order : "ASC";

    // Super Admin (companyId=0) can see all providers, regular users see only their company
    let whereCondition = userCompanyId === 0 ? {} : { companyId: userCompanyId };

    if (npis) {
      const npiArray = npis
        .split(",")
        .map((npi) => npi.trim())
        .filter((npi) => npi.length > 0);

      if (npiArray.length > 0) {
        whereCondition = {
          ...whereCondition,
          npi: { [Op.in]: npiArray },
        };
      }
    } else if (search) {
      const searchCondition = {
        [Op.or]: [
          { providerName: { [Op.like]: `%${search}%` } },
          { npi: { [Op.like]: `%${search}%` } },
          { speciality: { [Op.like]: `%${search}%` } },
        ],
      };
      
      if (userCompanyId === 0) {
        // Super Admin - search across all companies
        whereCondition = searchCondition;
      } else {
        // Regular user - search within their company only
        whereCondition = {
          [Op.and]: [
            { companyId: userCompanyId },
            searchCondition,
          ],
        };
      }
    }

    // Get count using separate query
    const count = await Providerss.count({
      where: whereCondition,
    });

    console.log(`[getAllProviders] Page ${page}, Limit ${limit}, Where:`, JSON.stringify(whereCondition), `Count: ${count}`);

    // Fetch providers with Sequelize
    const rows = await Providerss.findAll({
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
        "companyId",
      ],
      limit: limit,
      offset: offset,
      order: [[safeSort, safeOrder]],
    });

    console.log(`[getAllProviders] Returned ${rows.length} rows from database`);

    const mappedProviders = (rows || []).map((p) => ({
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
      companyId: p.companyId,
    }));

    console.log(`[getAllProviders] Returning ${mappedProviders.length} mapped providers`);

    return res.json({ 
      data: mappedProviders, 
      total: count, 
      page, 
      totalPages: Math.ceil(count / limit),
      debug: { page, limit, offset, count, returned: mappedProviders.length }
    });
  } catch (error) {
    console.error("❌ Error fetching providers:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get provider by DB ID
exports.getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userCompanyId = req.user?.companyId;

    // CRITICAL: Validate companyId exists
    if (userCompanyId === null || userCompanyId === undefined) {
      return res.status(401).json({ success: false, message: "Authentication error: company not identified" });
    }
    
    if (!id) return res.status(400).json({ success: false, message: "ID is required" });

    // Build where clause - Super Admin (companyId=0) can see all providers
    const whereClause = { id };
    if (userCompanyId !== 0) {
      whereClause.companyId = userCompanyId;
    }

    const provider = await Providerss.findOne({
      where: whereClause,
      attributes: ["id", "npi", "providerName", "speciality", "location", "npi_status", "mips_score", "payment", "medicare_status", "risk_level", "first_name", "last_name", "organization_name", "gender", "companyId"],
      include: [
        { model: ProviderssLocation, as: "locations", required: false },
        { model: ProviderssCompliance, as: "compliance", required: false },
        { model: ProviderssIdentifiers, as: "identifiers", required: false },
        { model: ProviderssTaxonomy, as: "taxonomy", required: false },
        { model: ProviderssHealthInfo, as: "healthInfo", required: false }
      ],
    });

    if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });
    return res.json({ success: true, provider });
  } catch (error) {
    console.error("Error fetching provider by ID:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Test procedure
exports.testProcedure = async (req, res) => {
  try {
    const { npi } = req.params;
    const [result] = await sequelize.query("CALL getProviderByNpi(:npi)", { replacements: { npi } });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Insert Provider (Procedure)
exports.insertProviderProcedure = async (req, res) => {
  try {
    const { npi, speciality, location, npi_status, mips_score, payment, medicare_status, risk_level, first_name, last_name, organization_name, gender, providerName } = req.body;

    await sequelize.query(`CALL InsertProvider(:npi, :speciality, :location, :npi_status, :mips_score, :payment, :medicare_status, :risk_level, :first_name, :last_name, :organization_name, :gender, :providerName)`, {
      replacements: { npi, speciality, location, npi_status, mips_score, payment, medicare_status, risk_level, first_name, last_name, organization_name, gender, providerName }
    });

    await syncProviderToElastic({ npi, providerName, first_name, last_name, speciality, location, organization_name });

    return res.status(201).json({ success: true, message: "Provider inserted successfully" });
  } catch (error) {
    console.error("Insert Provider Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Update Provider (Procedure)
exports.updateProviderProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    const { npi, speciality, location, npi_status, mips_score, payment, medicare_status, risk_level, first_name, last_name, organization_name, gender, providerName } = req.body;

    await sequelize.query(`CALL UpdateProvider(:id, :npi, :speciality, :location, :npi_status, :mips_score, :payment, :medicare_status, :risk_level, :first_name, :last_name, :organization_name, :gender, :providerName)`, {
      replacements: { id, npi, speciality, location, npi_status, mips_score, payment, medicare_status, risk_level, first_name, last_name, organization_name, gender, providerName }
    });

    return res.status(200).json({ success: true, message: "Provider updated successfully" });
  } catch (error) {
    console.error("Update Provider Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete Provider (Procedure)
exports.deleteProviderProcedure = async (req, res) => {
  try {
    const { id } = req.params;
    await sequelize.query(`CALL DeleteProvider(:id)`, { replacements: { id } });
    return res.status(200).json({ success: true, message: "Provider deleted successfully" });
  } catch (error) {
    console.error("Delete Provider Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Create Provider (Manual Creation by Admin)
exports.createProvider = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    
    // CRITICAL: Validate companyId exists (must check null/undefined, not just falsy!)
    if (companyId === null || companyId === undefined) {
      return res.status(401).json({ success: false, message: "Authentication error: company not identified" });
    }

    const { npi, providerName, speciality, location, npi_status, mips_score, payment, medicare_status, risk_level, first_name, last_name, organization_name, gender } = req.body;

    // Validate required fields
    if (!providerName || !speciality) {
      return res.status(400).json({ success: false, message: "Provider name and speciality are required" });
    }

    const newProvider = await Providerss.create({
      npi: npi || null,
      providerName,
      speciality,
      location: location || "",
      npi_status: npi_status || "Active",
      mips_score: parseFloat(mips_score) || 0,
      payment: parseFloat(payment) || 0,
      medicare_status: medicare_status || "Active",
      risk_level: risk_level || "Clear",
      first_name: first_name || null,
      last_name: last_name || null,
      organization_name: organization_name || null,
      gender: gender || null,
      companyId,
      
    });

    await syncProviderToElastic({
      npi: newProvider.npi,
      providerName: newProvider.providerName,
      first_name: newProvider.first_name,
      last_name: newProvider.last_name,
      speciality: newProvider.speciality,
      location: newProvider.location,
      organization_name: newProvider.organization_name
    });

    const provider = await Providerss.findOne({
      where: { id: newProvider.id },
      attributes: ["id", "npi", "providerName", "speciality", "location", "npi_status", "mips_score", "payment", "medicare_status", "risk_level", "first_name", "last_name", "organization_name", "gender", "companyId"],
      include: [
        { model: ProviderssLocation, as: "locations", required: false },
        { model: ProviderssCompliance, as: "compliance", required: false },
        { model: ProviderssIdentifiers, as: "identifiers", required: false },
        { model: ProviderssTaxonomy, as: "taxonomy", required: false },
        { model: ProviderssHealthInfo, as: "healthInfo", required: false }
      ]
    });

    return res.status(201).json({ success: true, message: "Provider created successfully", provider });
  } catch (error) {
    console.error("Error creating provider:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};