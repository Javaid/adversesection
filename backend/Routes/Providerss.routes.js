const express = require('express');
const router = express.Router();
const controller = require('../controllers/providerss.controller');

// Get provider by NPI (existing)
router.get("/npi/:npi", controller.getProvider);

// Get all providers with search and pagination
router.get("/", controller.getAllProviders);

//for identifiers (MUST be before /:id route)
router.post("/:id/identifiers", controller.addOrUpdateIdentifier);
router.get("/:id/identifiers", controller.getIdentifiersByProvider);

//for locations (MUST be before /:id route)
router.post("/:id/locations", controller.addOrUpdateLocation);
router.get("/:id/locations", controller.getLocationsByProvider);

// NEW: Get provider by DB ID
router.get("/:id", controller.getProviderById);
// Add Compliance
router.post("/:id/compliance", controller.addCompliance);

// Update Compliance
router.put("/compliance/:complianceId", controller.deleteCompliance);

//for taxonomy 
router.get("/:id/taxonomy", controller.getTaxonomies);
router.post("/:id/taxonomy", controller.addOrUpdateTaxonomy);
router.put("/:id/taxonomy/:taxonomyId", controller.addOrUpdateTaxonomy);
router.delete("/taxonomy/:taxonomyId", controller.deleteTaxonomy);

//for health information exchange
router.get("/:id/healthinfo", controller.getHealthInfo);
router.post("/:id/healthinfo", controller.addOrUpdateHealthInfo);
router.delete("/health_info/:infoId", controller.deleteHealthInfo);

//for procedures routes of compliance
router.post("/compliance/procedure", controller.insertComplianceProcedure);
router.get("/compliance/procedure/provider/:provider_id", controller.getComplianceByProvider);
router.put("/compliance/procedure/:id", controller.updateCompliance);
router.delete("/compliance/procedure/:id", controller.deleteCompliance);

// Identifiers CRUD using procedures
router.post("/identifiers/procedure", controller.insertIdentifier); 
router.get("/identifiers/procedure/provider/:provider_id", controller.getIdentifiersByProvider); 
router.put("/identifiers/procedure/:id", controller.updateIdentifier); 
router.delete("/identifiers/procedure/:id", controller.deleteIdentifier); 

// TAXONOMY PROCEDURE ROUTES
router.post("/taxonomy/procedure", controller.insertTaxonomyProcedure);
router.get("/taxonomy/procedure/provider/:provider_id", controller.getTaxonomyByProvider);
router.put("/taxonomy/procedure/:id", controller.updateTaxonomyProcedure);
router.delete("/taxonomy/procedure/:id", controller.deleteTaxonomyProcedure);

// HEALTH INFORMATION EXCHANGE PROCEDURE ROUTES
router.post("/health/procedure", controller.insertHealthInfo);
router.get("/health/procedure/provider/:provider_id", controller.getHealthInfoByProvider);
router.put("/health/procedure/:id", controller.updateHealthInfo);
router.delete("/health/procedure/:id", controller.deleteHealthInfo);

// PROVIDER LOCATIONS PROCEDURE ROUTES
router.post("/locations/procedure", controller.insertLocation);
router.get("/locations/procedure/provider/:provider_id", controller.getLocationsByProvider);
router.put("/locations/procedure/:id", controller.updateLocation);
router.delete("/locations/procedure/:id", controller.deleteLocation);

// PROVIDERS PROCEDURE ROUTES
router.post("/providers/procedure", controller.insertProviderProcedure);
router.put("/providers/procedure/:id", controller.updateProviderProcedure);
router.delete("/providers/procedure/:id", controller.deleteProviderProcedure);

module.exports = router;
