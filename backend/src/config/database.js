"use strict";

const { Sequelize } = require("sequelize");
const config = require("./index");

const dbConfig = config.database;

const isTrusted = process.env.DB_TRUSTED_CONNECTION === "true";

// Build connection config - port and instanceName are mutually exclusive in tedious
const sequelizeConfig = {
    host: dbConfig.host,
    dialect: "mssql",
    logging: false,
    schema: dbConfig.schema,
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true,
            trustedConnection: isTrusted,
        },
    },
    pool: dbConfig.pool,
};

// Only add port if no instance is specified, otherwise add instance name
if (dbConfig.instance) {
    sequelizeConfig.dialectOptions.options.instanceName = dbConfig.instance;
} else {
    sequelizeConfig.port = dbConfig.port;
}

const sequelize = new Sequelize(
    dbConfig.name,
    isTrusted ? null : dbConfig.username,
    isTrusted ? null : dbConfig.password,
    sequelizeConfig
);

async function connectDatabase() {
    if (!dbConfig.enabled) {
        console.log("[DB] Sequelize is disabled (set DB_ENABLED=true to enable)");
        return;
    }

    try {
        await sequelize.authenticate();
        console.log("[DB] MSSQL connection established through Sequelize");
    } catch (error) {
        console.error("[DB] Failed to connect to database:", error.message);
        console.error("[DB] Server continuing without database connection. Check your DB_HOST, DB_USER, DB_PASSWORD, and ensure SQL Server is running.");
    }
}

async function closeDatabase() {
    if (!dbConfig.enabled) return;

    await sequelize.close();
    console.log("[DB] Sequelize connection closed");
}

module.exports = {
    sequelize,
    connectDatabase,
    closeDatabase,
};