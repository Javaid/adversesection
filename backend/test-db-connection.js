const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('provider_table', 'sa', 'Maryam!12', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
            instanceName: 'SQLEXPRESS',
        },
    },
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('Error code:', error.code);
    } finally {
        await sequelize.close();
    }
}

testConnection();
