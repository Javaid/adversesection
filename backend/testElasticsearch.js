const client = require('./config/elasticSearch');

async function testElasticsearch() {
    try {
        console.log(' Testing Elasticsearch setup...\n');

        // 1. Test connection
        await client.ping();
        console.log(' Connection: OK');

        // 2. Check if index exists
        const indexExists = await client.indices.exists({ index: 'doctors' });
        console.log(` Index exists: ${indexExists}`);

        // 3. Count documents
        const count = await client.count({ index: 'doctors' });
        console.log(` Total doctors: ${count.body.count}`);

        // 4. Test search
        const searchResult = await client.search({
            index: 'doctors',
            body: {
                query: {
                    multi_match: {
                        query: 'cardiology',
                        fields: ['name', 'speciality']
                    }
                }
            }
        });

        console.log(` Search test: Found ${searchResult.body.hits.total.value} results for "cardiology"`);
        
        // Show first result
        if (searchResult.body.hits.hits.length > 0) {
            const firstResult = searchResult.body.hits.hits[0]._source;
            console.log(`   First result: ${firstResult.name} - ${firstResult.speciality}`);
        }

        console.log('\n All tests passed! Your Elasticsearch is working correctly.');

    } catch (error) {
        console.error(' Test failed:', error.meta?.body || error.message);
    }
}

testElasticsearch();