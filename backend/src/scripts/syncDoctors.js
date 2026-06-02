const Providerss = require("../models/providerss.model"); // already working
const client = require("../config/elasticSearch");

async function syncDoctorsToElastic() {
  try {
    const doctors = await Providerss.findAll();
    console.log(`Found ${doctors.length} doctors in DB`);

    for (let doc of doctors) {
      await client.index({
        index: "doctors", // name of Elasticsearch index
        id: doc.npi, // unique id for Elasticsearch
        document: {
          name: (doc.first_name + " " + doc.last_name).trim() || doc.organization_name || doc.providerName,
          speciality: doc.speciality,
          location: doc.location,
          organization_name: doc.organization_name,
        },
      });
    }

    // Make sure Elasticsearch refreshes the index immediately for search
    await client.indices.refresh({ index: "doctors" });

    console.log(" All doctors synced to Elasticsearch!");
  } catch (error) {
    console.error(" Sync error:", error);
  }
}

syncDoctorsToElastic();