"use strict";

const { Router } = require("express");
const dashboardController = require("../../controllers/dashboard/dashboard.controller");
const { authenticate } = require("../../middleware/auth");
const { tenantValidation } = require("../../middleware/tenantValidation");

const router = Router();

/**
 * @route  POST /api/v1/dashboard/stats
 * @desc   Fetch dashboard statistics
 * @access Protected (tenant-aware)
 */
router.post("/summary", authenticate, tenantValidation(), dashboardController.dashboardStats);

module.exports = router;
