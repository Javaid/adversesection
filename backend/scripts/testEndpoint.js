const http = require('http');

function testEndpoint() {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/doctors/search?query=JAVED',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log(`Response: Found ${jsonData.length} results`);
        if (jsonData.length > 0) {
          console.log('First result:', jsonData[0]._source);
        }
      } catch (error) {
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  req.end();
}

// Test if server is running
const testConnection = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
}, (res) => {
  console.log(' Server is running on port 5000');
  testEndpoint();
});

testConnection.on('error', (error) => {
  console.error(' Server is not running on port 5000:', error.message);
});

testConnection.end();