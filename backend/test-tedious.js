const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const config = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: 'Maryam!12',
        },
    },
    options: {
        database: 'AdverseSection',
        encrypt: true,
        trustServerCertificate: true,
        instanceName: 'SQLEXPRESS',
        port: 1433,
    },
};

const connection = new Connection(config);

connection.on('connect', () => {
    console.log('✅ Connected to SQL Server');
    
    const request = new Request('SELECT @@VERSION as version', (err) => {
        if (err) {
            console.error('Error executing query:', err);
        }
        connection.close();
    });
    
    request.on('row', (columns) => {
        console.log('SQL Server Version:', columns[0].value);
    });
    
    connection.execSql(request);
});

connection.on('error', (err) => {
    console.error('❌ Connection error:', err.message);
});

connection.connect();
