const sequelize = require('./config/db');

async function resetDatabase() {
  try {
    // Drop all tables with CASCADE to handle foreign keys
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Database reset successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();