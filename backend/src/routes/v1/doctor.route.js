"use strict";

const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/auth");
const { tenantValidation } = require("../../middleware/tenantValidation");
const { createDoctor, reindexAllDoctors, searchDoctors } = require("../../controllers/doctor/doctor.controller");

router.post("/create", authenticate, tenantValidation(), createDoctor);
router.post("/reindex", authenticate, tenantValidation(), reindexAllDoctors);
router.get("/search", authenticate, tenantValidation(), searchDoctors);

module.exports = router;
