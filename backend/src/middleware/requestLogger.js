"use strict";

/**
 * Minimal structured request logger.
 * In production replace with morgan + a log-aggregation transport.
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 500 ? "ERROR" : res.statusCode >= 400 ? "WARN" : "INFO";

        console.log(
            `[${level}] ${new Date().toISOString()} ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
        );
    });

    next();
};

module.exports = requestLogger;
