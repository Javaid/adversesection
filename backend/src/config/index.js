"use strict";

require("dotenv").config();

function requireEnv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function parseBoolean(value, defaultValue = false) {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }

    return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function parseJson(value, fallbackValue) {
    if (value === undefined || value === null || value === "") {
        return fallbackValue;
    }

    try {
        return JSON.parse(value);
    } catch {
        throw new Error(`Invalid JSON in environment variable payload: ${value}`);
    }
}

function parseTrustProxy(value, defaultValue = false) {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }

    const normalized = String(value).trim().toLowerCase();

    if (["1", "true", "yes", "on"].includes(normalized)) {
        return true;
    }

    if (["0", "false", "no", "off"].includes(normalized)) {
        return false;
    }

    if (/^\d+$/.test(normalized)) {
        return parseInt(normalized, 10);
    }

    // Allow proxy-addr values such as IPs/subnets or named ranges.
    return String(value).trim();
}

const config = {
    env: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "3000", 10),

    jwt: {
        secret: requireEnv("JWT_SECRET"),
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },

    cors: {
        allowedOrigins: (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
            .split(",")
            .map((o) => o.trim()),
    },

    tenant: {
        baseDomain: (process.env.BASE_DOMAIN || "").trim().toLowerCase(),
        trustProxy: parseTrustProxy(process.env.TRUST_PROXY, false),
        catalog: parseJson(process.env.TENANT_CATALOG, []),
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
        max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    },

    database: {
        enabled: parseBoolean(process.env.DB_ENABLED, false),
        host: process.env.DB_HOST || "localhost",
        instance: process.env.DB_INSTANCE || "",
        port: parseInt(process.env.DB_PORT || "1433", 10),
        name: process.env.DB_NAME || "adverse_section",
        schema: process.env.DB_SCHEMA || "provider_table",
        username: process.env.DB_USER || "sa",
        password: process.env.DB_PASSWORD || "Maryam!12",
        encrypt: parseBoolean(process.env.DB_ENCRYPT, true),
        trustServerCertificate: parseBoolean(
            process.env.DB_TRUST_SERVER_CERT,
            true
        ),
        pool: {
            max: parseInt(process.env.DB_POOL_MAX || "10", 10),
            min: parseInt(process.env.DB_POOL_MIN || "0", 10),
            idle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
            acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
        },
    },
};

module.exports = config;
