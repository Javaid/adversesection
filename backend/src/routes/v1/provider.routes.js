"use strict";

const { Router } = require("express");
const providerController = require("../../controllers/provider.controller");
const { authenticate } = require("../../middleware/auth");
const { tenantValidation } = require("../../middleware/tenantValidation");
const validate = require("../../middleware/validate");
const { providerSearchValidation } = require("../../validators/provider.validator");

const router = Router();

/**
 * @route  POST /api/v1/providers/search
 * @desc   Search providers via NPI Registry
 * @access Protected (tenant-aware)
 */
router.post(
    "/",
    authenticate,
    tenantValidation(),
    providerSearchValidation,
    validate,
    providerController.searchProviders
);

module.exports = router;
