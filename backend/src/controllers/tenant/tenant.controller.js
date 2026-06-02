"use strict";

const ApiResponse = require("../../utils/ApiResponse");
const tenantService = require("../../services/tenant.service");

function getBootstrap(req, res) {
    return ApiResponse.ok(res, "Tenant bootstrap retrieved", {
        tenant: tenantService.getBootstrapPayload(req.tenant),
    });
}

module.exports = { getBootstrap };