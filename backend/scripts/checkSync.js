const Providerss = require("../models/providerss.model");
const client = require("../config/elasticSearch");

async function checkSyncStatus() {
  try {
    // Count providers in database
    const dbCount = await Providerss.count();
    console.log(`Database providers: ${dbCount}`);

    // Count providers in Elasticsearch
    const esCount = await client.count({ index: "doctors" });
    console.log(`Elasticsearch providers: ${esCount.count}`);

    if (dbCount === esCount.count) {
      console.log(" Database and Elasticsearch are in sync!");
    } else {
      console.log(" Database and Elasticsearch are NOT in sync!");
      console.log(`Difference: ${Math.abs(dbCount - esCount.count)} providers`);
    }

  } catch (error) {
    console.error("Error checking sync status:", error);
  }
}

// Run if called directly
if (require.main === module) {
  checkSyncStatus().then(() => process.exit(0));
}

module.exports = checkSyncStatus;