"use strict";

const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");

/**
 * Global Express error handler. Must be registered AFTER all routes.
 *
 * Distinguishes between:
 *   - ApiError (operational)  → structured JSON response
 *   - Unknown errors          → generic 500 to avoid leaking internals
 */
const errorHandler = (err, req, res, _next) => {
    let error = err;

    // Wrap non-operational errors into a safe ApiError
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const message =
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : error.message || "Internal server error";

        error = new ApiError(statusCode, message, [], err.stack);
    }

    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        ...(error.errors?.length && { errors: error.errors }),
        ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
    };

    // Log server errors
    if (error.statusCode >= 500) {
        console.error("[ERROR]", {
            method: req.method,
            url: req.originalUrl,
            statusCode: error.statusCode,
            message: error.message,
            stack: error.stack,
        });
    }

    return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
