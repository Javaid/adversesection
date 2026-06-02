"use strict";

const rateLimit = require("express-rate-limit");
const { StatusCodes } = require("http-status-codes");
const config = require("../config");

/**
 * Default rate limiter applied globally.
 */
const globalLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({
            success: false,
            statusCode: StatusCodes.TOO_MANY_REQUESTS,
            message: "Too many requests — please slow down.",
        });
    },
});

/**
 * Stricter limiter for sensitive endpoints (auth, password reset, etc.)
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(StatusCodes.TOO_MANY_REQUESTS).json({
            success: false,
            statusCode: StatusCodes.TOO_MANY_REQUESTS,
            message: "Too many authentication attempts — try again later.",
        });
    },
});

module.exports = { globalLimiter, authLimiter };
