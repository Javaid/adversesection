const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

// Add new provider (with NPI auto-fetch)
router.post('/add', providerController.addProvider);

// Get all providers
router.get('/', providerController.getAllProviders);

// Get provider by NPI
router.get('/:npi', providerController.getProviderByNPI);

// Preview provider data from NPPES (without saving)
router.get('/preview/:npi', providerController.previewProviderData);

module.exports = router;