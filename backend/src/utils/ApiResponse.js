"use strict";

const { StatusCodes } = require("http-status-codes");

/**
 * Structured API response envelope.
 *
 * Success shape:
 *   { success: true, statusCode, message, data }
 *
 * Error shape is handled by ApiError + errorHandler middleware.
 */
class ApiResponse {
    /**
     * @param {number}  statusCode - HTTP status code
     * @param {string}  message    - Human-readable description
     * @param {*}       [data]     - Response payload
     */
    constructor(statusCode, message, data = null) {
        this.success = statusCode < 400;
        this.statusCode = statusCode;
        this.message = message;
        if (data !== null && data !== undefined) {
            this.data = data;
        }
    }

    send(res) {
        return res.status(this.statusCode).json(this);
    }

    // ── Convenience factories ─────────────────────────────────────────────────

    static ok(res, message, data) {
        return new ApiResponse(StatusCodes.OK, message, data).send(res);
    }

    static created(res, message, data) {
        return new ApiResponse(StatusCodes.CREATED, message, data).send(res);
    }
}

module.exports = ApiResponse;
