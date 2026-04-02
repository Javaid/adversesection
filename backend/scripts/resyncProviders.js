const Providerss = require("../models/providerss.model");
const client = require("../config/elasticSearch");

async function resyncAllProviders() {
  try {
    console.log("Starting full provider sync to Elasticsearch...");
    
    // Get all providers from database
    const providers = await Providerss.findAll();
    console.log(`Found ${providers.length} providers in database`);

    // Clear existing doctors index
    try {
      await client.indices.delete({ index: "doctors" });
      console.log("Cleared existing doctors index");
    } catch (error) {
      console.log("No existing doctors index to clear");
    }

    // Recreate doctors index
    await client.indices.create({
      index: "doctors",
      body: {
        mappings: {
          properties: {
            name: { 
              type: 'text',
              analyzer: 'standard'
            },
            speciality: { 
              type: 'text',
              analyzer: 'standard'
            },
            location: {
              type: 'text'
            },
            organization_name: {
              type: 'text'
            }
          }
        }
      }
    });
    console.log("Created new doctors index");

    // Sync all providers
    for (let provider of providers) {
      await client.index({
        index: "doctors",
        id: provider.npi,
        document: {
          name: (provider.first_name + " " + provider.last_name).trim() || provider.organization_name || provider.providerName,
          speciality: provider.speciality,
          location: provider.location,
          organization_name: provider.organization_name,
        },
      });
    }

    // Refresh index
    await client.indices.refresh({ index: "doctors" });

    console.log(` Successfully synced ${providers.length} providers to Elasticsearch!`);
    
    // Verify count
    const count = await client.count({ index: "doctors" });
    console.log(` Elasticsearch now has ${count.count} providers`);
    
  } catch (error) {
    console.error(" Error during sync:", error);
  }
}

// Run if called directly
if (require.main === module) {
  resyncAllProviders().then(() => process.exit(0));
}

module.exports = resyncAllProviders;