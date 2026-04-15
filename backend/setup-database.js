const sequelize = require('./config/db');
const crypto = require('crypto');

const hashPassword = (password) => {
  return crypto.pbkdf2Sync(password, 'salt', 10000, 64, 'sha512').toString('hex');
};

async function setupDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Create users table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created');

    // Add test users
    const adminPassword = hashPassword('123456');
    const userPassword = hashPassword('password');

    await sequelize.query(
      'INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
      {
        replacements: ['admin', adminPassword, 'admin', 'user1', adminPassword, 'user', 'john', userPassword, 'user']
      }
    );
    console.log('Test users added');
    console.log('Setup complete!');
    
  } catch (error) {
    console.error('Setup failed:', error.message);
  } finally {
    process.exit();
  }
}

setupDatabase();