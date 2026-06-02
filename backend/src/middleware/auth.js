"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * Verifies the Bearer JWT on protected routes.
 * Attaches the decoded payload to req.user on success.
 */
const authenticate = catchAsync(async (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw ApiError.unauthorized("Missing or malformed Authorization header");
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
        decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            throw ApiError.unauthorized("Token has expired");
        }
        throw ApiError.unauthorized("Invalid token");
    }

    req.user = decoded;
    next();
});

module.exports = { authenticate };
