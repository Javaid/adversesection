const client = require("../config/elasticSearch");

async function testSearch() {
  try {
    console.log("Testing Elasticsearch search...");
    
    // Test 1: Check if index exists and has data
    const count = await client.count({ index: "doctors" });
    console.log(`Total doctors in index: ${count.count}`);
    
    // Test 2: Simple search
    const searchResult = await client.search({
      index: "doctors",
      body: {
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: "JAVED",
                  fields: ["name^3", "speciality^2", "location", "organization_name"],
                  type: "phrase_prefix"
                }
              },
              {
                multi_match: {
                  query: "JAVED",
                  fields: ["name^2", "speciality", "location", "organization_name"],
                  fuzziness: "AUTO"
                }
              }
            ]
          }
        },
        size: 5
      }
    });
    
    console.log(`Search results for "JAVED": ${searchResult.hits.hits.length} found`);
    
    if (searchResult.hits.hits.length > 0) {
      console.log("Sample results:");
      searchResult.hits.hits.forEach((hit, index) => {
        console.log(`${index + 1}. ${hit._source.name} - ${hit._source.speciality} - ${hit._source.location}`);
      });
    }
    
    // Test 3: Get all documents (first 10)
    const allDocs = await client.search({
      index: "doctors",
      body: {
        query: { match_all: {} },
        size: 10
      }
    });
    
    console.log(`\nFirst 10 doctors in index:`);
    allDocs.hits.hits.forEach((hit, index) => {
      console.log(`${index + 1}. ${hit._source.name} - ${hit._source.speciality}`);
    });
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run if called directly
if (require.main === module) {
  testSearch().then(() => process.exit(0));
}

module.exports = testSearch;