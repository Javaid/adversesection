"use strict";

const { Router } = require("express");
const tenantController = require("../../controllers/tenant/tenant.controller");

const router = Router();

router.get("/bootstrap", tenantController.getBootstrap);

module.exports = router;