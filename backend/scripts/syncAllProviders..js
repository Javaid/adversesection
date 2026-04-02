const Providerss = require("./models/providerss.model");
const client = require("./config/elasticSearch");

// Your existing sync function
const syncProviderToElastic = async (provider) => {
  try {
    if (!provider.npi) return;

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
        npi: provider.npi,
        speciality: provider.speciality || "",
        location: provider.location || "",
        organization_name: provider.organization_name || "",
      },
      refresh: true,
    });

    console.log(`Provider ${provider.npi} synced to Elasticsearch`);
  } catch (error) {
    console.error(`Error syncing provider ${provider.npi} to Elasticsearch:`, error);
  }
};
// Main function
const syncAllProviders = async () => {
  try {
    const providers = await Providerss.findAll();
    for (const p of providers) {
      await syncProviderToElastic(p);
    }
    console.log("All providers synced to Elasticsearch");
    process.exit(0);
  } catch (err) {
    console.error("Error syncing all providers:", err);
    process.exit(1);
  }
};

syncAllProviders();