"use strict";

const providerService = require("../services/provider.services");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

/**
 * POST /api/v1/providers/search
 *
 * Body: { query: string, limit?: number }
 * Returns: { total, providers: [] }
 */
const searchProviders = catchAsync(async (req, res) => {
    const { query, limit } = req.body;
    const result = await providerService.searchProviders({ query, limit });
    return ApiResponse.ok(res, "Provider search completed", result);
});

module.exports = {
    searchProviders,
};
