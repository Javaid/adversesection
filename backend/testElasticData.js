const client = require('./config/elasticSearch');

async function testElasticData() {
  try {
    // Check if index exists
    const indexExists = await client.indices.exists({ index: 'doctors' });
    console.log('Index exists:', indexExists);

    // Get count of documents
    const count = await client.count({ index: 'doctors' });
    console.log('Total documents:', count.count);

    // Get some sample documents
    const search = await client.search({
      index: 'doctors',
      body: {
        query: { match_all: {} },
        size: 5
      }
    });

    console.log('Sample documents:');
    search.hits.hits.forEach(hit => {
      console.log(`ID: ${hit._id}, Name: ${hit._source.name}, Specialty: ${hit._source.speciality}`);
    });

    // Test search for "asma"
    const searchResult = await client.search({
      index: 'doctors',
      body: {
        query: {
          multi_match: {
            query: 'asma',
            fields: ['name', 'speciality', 'location', 'organization_name'],
            fuzziness: 'AUTO'
          }
        }
      }
    });

    console.log('\nSearch results for "asma":');
    searchResult.hits.hits.forEach(hit => {
      console.log(`Score: ${hit._score}, Name: ${hit._source.name}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

testElasticData();