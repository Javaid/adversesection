"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../../controllers/provider/providerss.controller");
const { authenticate } = require("../../middleware/auth");
const { tenantValidation } = require("../../middleware/tenantValidation");

// Get all providers with search and pagination (Protected, tenant-aware)
router.get("/", authenticate, tenantValidation(), controller.getAllProviders);

// Get provider by NPI (Protected, tenant-aware)
router.get("/npi/:npi", authenticate, tenantValidation(), controller.getProvider);

// Get provider by DB ID (Protected, tenant-aware)
router.get("/:id", authenticate, tenantValidation(), controller.getProviderById);

// Create new provider manually (Protected, tenant-aware)
router.post("/create", authenticate, tenantValidation(), controller.createProvider);

// Provider CRUD via stored procedures (Protected, tenant-aware)
router.post("/procedure", authenticate, tenantValidation(), controller.insertProviderProcedure);
router.put("/procedure/:id", authenticate, tenantValidation(), controller.updateProviderProcedure);
router.delete("/procedure/:id", authenticate, tenantValidation(), controller.deleteProviderProcedure);

module.exports = router;
