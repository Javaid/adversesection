const axios = require('axios');

async function testSearchFlow() {
  try {
    console.log('Testing complete search flow...\n');
    
    // Test 1: Elasticsearch search
    console.log('1. Testing Elasticsearch search for "asma abbas":');
    const searchResponse = await axios.get('http://localhost:5000/api/doctors/search?query=asma abbas');
    console.log(`   Found ${searchResponse.data.length} results in Elasticsearch`);
    
    if (searchResponse.data.length > 0) {
      const firstResult = searchResponse.data[0];
      console.log(`   First result: ${firstResult._source.name} (NPI: ${firstResult._id})`);
      
      // Test 2: Get provider details from database using NPI
      console.log('\n2. Testing database lookup with NPI:');
      const npi = firstResult._id;
      const dbResponse = await axios.get(`http://localhost:5000/api/providerss?npis=${npi}`);
      console.log(`   Found ${dbResponse.data.data.length} providers in database`);
      
      if (dbResponse.data.data.length > 0) {
        const provider = dbResponse.data.data[0];
        console.log(` Provider: ${provider.providerName} (ID: ${provider.id})`);
        console.log(' Search flow working correctly!');
      } else {
        console.log('    No provider found in database');
      }
    } else {
      console.log(' No results found in Elasticsearch');
    }
    
    // Test 3: Test exact search
    console.log('\n3. Testing exact search for "ASMA ABBAS":');
    const exactSearch = await axios.get('http://localhost:5000/api/doctors/search?query=ASMA ABBAS');
    console.log(`   Found ${exactSearch.data.length} results`);
    exactSearch.data.forEach(result => {
      console.log(`   - ${result._source.name} (Score: ${result._score})`);
    });
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSearchFlow();