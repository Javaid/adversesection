const client = require('./config/elasticSearch');

const initUserIndex = async () => {
  try {
    // Check if index exists
    const indexExists = await client.indices.exists({ index: 'users' });
    
    if (!indexExists) {
      // Create users index with mapping
      await client.indices.create({
        index: 'users',
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: { type: 'text', analyzer: 'standard' },
              email: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' }
            }
          }
        }
      });
      console.log('Users index created successfully');
    } else {
      console.log('Users index already exists');
    }
  } catch (error) {
    console.error('Error initializing users index:', error);
  }
};

module.exports = { initUserIndex };