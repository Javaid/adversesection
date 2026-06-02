"use strict";

const dashboardService = require("../../services/dashboard.services");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

/**
 * POST /api/v1/dashboard/summary
 *
 * Returns: { stats: object }
 */
const dashboardStats = catchAsync(async (req, res) => {
    const companyId = req.user?.companyId;

    // CRITICAL: Validate companyId exists (must check null/undefined, not just falsy!)
    if (companyId === null || companyId === undefined) {
        return res.status(401).json({
            success: false,
            message: "Authentication error: company not identified",
        });
    }

    console.log(`[Dashboard] Fetching stats for companyId: ${companyId}`);
    const stats = await dashboardService.getDashboardStats(companyId);
    return ApiResponse.ok(res, "Dashboard stats retrieved", { stats });
});

module.exports = {
    dashboardStats,
};