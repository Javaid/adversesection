"use strict";

const { StatusCodes } = require("http-status-codes");

/**
 * Operational error class used throughout the API.
 * Throw an ApiError instead of a generic Error so the global error handler
 * can distinguish operational errors (expected, safe to expose) from
 * programmer errors (unexpected, should not leak details).
 */
class ApiError extends Error {
    /**
     * @param {number}  statusCode  - HTTP status code
     * @param {string}  message     - Human-readable description (safe to send to client)
     * @param {Array}   [errors]    - Optional array of field-level validation errors
     * @param {string}  [stack]     - Optional pre-existing stack trace
     */
    constructor(
        statusCode,
        message,
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // ── Convenience factories ─────────────────────────────────────────────────

    static badRequest(message, errors) {
        return new ApiError(StatusCodes.BAD_REQUEST, message, errors);
    }

    static unauthorized(message = "Unauthorized") {
        return new ApiError(StatusCodes.UNAUTHORIZED, message);
    }

    static forbidden(message = "Forbidden") {
        return new ApiError(StatusCodes.FORBIDDEN, message);
    }

    static notFound(message = "Resource not found") {
        return new ApiError(StatusCodes.NOT_FOUND, message);
    }

    static internal(message = "Internal server error") {
        return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, message);
    }
}

module.exports = ApiError;
