const Providerss = require('./models/providerss.model');
const client = require('./config/elasticSearch');

async function syncAllProvidersToElastic() {
  try {
    console.log('Starting sync of all providers to Elasticsearch...');
    
    // Get all providers from database
    const providers = await Providerss.findAll({
      attributes: ['npi', 'providerName', 'speciality', 'location', 'first_name', 'last_name', 'organization_name']
    });
    
    console.log(`Found ${providers.length} providers in database`);
    
    // Sync each provider to Elasticsearch
    for (const provider of providers) {
      const name = provider.providerName || 
                   `${provider.first_name || ""} ${provider.last_name || ""}`.trim() ||
                   provider.organization_name || "Unknown";
      
      try {
        await client.index({
          index: 'doctors',
          id: provider.npi,
          document: {
            name: name,
            speciality: provider.speciality || "",
            location: provider.location || "",
            organization_name: provider.organization_name || "",
          },
          refresh: true
        });
        
        console.log(` Synced: ${name} (NPI: ${provider.npi})`);
      } catch (error) {
        console.error(` Failed to sync ${provider.npi}:`, error.message);
      }
    }
    
    // Check final count
    const count = await client.count({ index: 'doctors' });
    console.log(`\n Sync complete! Elasticsearch now has ${count.count} documents`);
    
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

syncAllProvidersToElastic();