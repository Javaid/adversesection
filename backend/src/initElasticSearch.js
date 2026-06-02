const client = require('./config/elasticSearch');

async function initializeElasticsearch() {
    try {
        // Test connection first
        await client.ping();
        console.log(' Elasticsearch connection successful');
        
        // Check if doctors index exists
        const indexExists = await client.indices.exists({ index: 'doctors' });
        
        if (!indexExists) {
            // Create the doctors index with proper mapping
            await client.indices.create({
                index: 'doctors',
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
                            }
                        }
                    }
                }
            });
            console.log(' Doctors index created successfully');
        } else {
            console.log(' Doctors index already exists');
        }
        
    } catch (error) {
        console.error(' Error initializing Elasticsearch:', error.meta?.body || error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    initializeElasticsearch();
}

module.exports = initializeElasticsearch;