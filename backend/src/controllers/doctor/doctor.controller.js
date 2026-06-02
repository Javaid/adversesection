// backend/controllers/doctorController.js
const Doctor = require("../../models/providers/doctor.model");
let client = null;
try {
  client = require("../../config/elasticSearch");
} catch (e) {
  console.warn("Elasticsearch not available:", e.message);
}
// Ensure Elasticsearch index exists


const ensureIndexExists = async () => {
  if (!client) return;
  try {
    await client.indices.get({ index: "doctors" });
  } catch (err) {
    if (err.meta && err.meta.statusCode === 404) {
      await client.indices.create({ index: "doctors" });
      console.log("Elasticsearch index 'doctors' created");
      
    } else {
      throw err;
    }
  }
};

// Create a new doctor
exports.createDoctor = async (req, res) => {
  
  console.log("CreateDoctor called:", req.body);
  

  try {
    const { first_name, last_name, name, npi, speciality, location, organization_name } = req.body;

    if (!npi) return res.status(400).json({ error: "NPI is required" });

    const docName = name || `${first_name || ""} ${last_name || ""}`.trim();

    // SECURITY: Attach companyId from tenant/request
    // Ensures doctor records are company-scoped
    const doctor = await Doctor.create({
      first_name,
      last_name,
      providerName: docName,
      npi,
      speciality,
      location,
      organization_name,
      companyId: req.companyId || 0,  // Attach company for isolation
    });

    console.log("Doctor saved in DB:", doctor.id || doctor.dataValues.id);

    // Ensure ES index exists
    await ensureIndexExists();

    // Index doctor in ES with companyId
    try {
      const indexResponse = await client.index({
        index: "doctors",
        id: String(doctor.id || doctor.dataValues.id),
        document: {
          name: docName,
          npi,
          speciality: speciality || "",
          location: location || "",
          organization_name: organization_name || "",
          companyId: req.companyId || 0,  // Add companyId to ES document for filtering
        },
        refresh: "wait_for", // immediate search
      });

      console.log("Doctor indexed in ES:", JSON.stringify(indexResponse, null, 2));
    } catch (esError) {
      console.error("ES Indexing failed:", esError);
    }

    res.status(201).json({ message: "Doctor created", doctor });

  } catch (err) {
    console.error("ERROR creating doctor:", err);
    res.status(500).json({ error: "Failed to create doctor", details: err.message });
  }
};

// Search doctors in Elasticsearch
exports.searchDoctors = async (req, res) => {

  try {
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("Surrogate-Control", "no-store");

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query is required" });

    // Check if Elasticsearch client is available
    if (!client) {
      console.error("Elasticsearch client is not initialized");
      return res.status(503).json({ error: "Search service unavailable. Elasticsearch is not connected." });
    }

    await ensureIndexExists();

    // SECURITY: Filter Elasticsearch query by companyId
    // Super admin (companyId === 0) sees all doctors; regular users see only their company's doctors
    const query = {
      bool: {
        must: [
          {
            multi_match: {
              query: q,
              fields: ["name", "speciality", "location", "organization_name"],
              fuzziness: "AUTO"
            }
          }
        ]
      }
    };

    // Add company filter for non-super-admin users
    if (req.companyId !== 0) {
      query.bool.filter = { term: { companyId: req.companyId } };
    }

    const response = await client.search({
      index: "doctors",
      query: query
    });

    const results = response.hits.hits.map(hit => ({
  ...hit._source,
  _score: hit._score,
}));

    res.json({ total: response.hits.total.value, results });

  } catch (err) {
    console.error("ERROR searching doctors:", err);
    res.status(500).json({ error: "Failed to search doctors", details: err.message });
  }
};
//reindex all doctors in ES (for testing)
exports.reindexAllDoctors = async (req, res) => {
  try {
    // SECURITY: Only reindex doctors for the current company
    // Super admin (companyId === 0) reindexes all; regular users reindex only their company's doctors
    const whereClause = req.companyId === 0 ? {} : { companyId: req.companyId };
    const doctors = await Doctor.findAll({ where: whereClause });

    await ensureIndexExists();

    let successCount = 0;

    for (const doctor of doctors) {
      const docName = doctor.providerName || `${doctor.first_name} ${doctor.last_name}`.trim();
      try {
        await client.index({
          index: "doctors",
          id: String(doctor.id || doctor.dataValues.id),
          document: {
            name: docName,
            npi: doctor.npi,
            speciality: doctor.speciality || "",
            location: doctor.location || "",
            organization_name: doctor.organization_name || "",
            companyId: doctor.companyId || 0,  // Add companyId to ES document
          },
          refresh: "wait_for",
        });
        successCount++;
      } catch (esError) {
        console.error(`Failed to index doctor ${doctor.id} (${docName}):`, esError.message);
      }
    }

    res.json({ message: "All doctors reindexed", total: doctors.length, success: successCount });

  } catch (err) {
    console.error("Failed to reindex doctors:", err.message);
    res.status(500).json({ error: "Failed to reindex doctors", details: err.message });
  }
};