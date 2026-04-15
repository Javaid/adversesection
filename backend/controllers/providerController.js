const Provider = require('../models/providers');
const NPPESService = require('../services/providerss.service');
const client = require('../config/elasticSearch');
const Providerss = require('../models/providerss.model');

// Helper function to sync provider to Elasticsearch
const syncProviderToElastic = async (provider) => {
  try {
    await client.index({
      index: "doctors",
      id: provider.npi,
      document: {
        name: provider.providerName || provider.name,
        speciality: provider.speciality,
        location: provider.location,
        organization_name: provider.organization_name || provider.providerName,
      },
    });
    console.log(`Provider ${provider.npi} synced to Elasticsearch`);
  } catch (error) {
    console.error(`Error syncing provider ${provider.npi} to Elasticsearch:`, error);
  }
};

const providerController = {
    // Add provider with NPI auto-fetch
    async addProvider(req, res) {
        try {
            const { npi, providerName, speciality, location } = req.body;

            if (!npi) {
                return res.status(400).json({ error: 'NPI is required' });
            }

            // Check if provider already exists
            const existingProvider = await Provider.findOne({ where: { npi } });
            if (existingProvider) {
                return res.status(400).json({ error: 'Provider with this NPI already exists' });
            }

            let providerData;

            // If only NPI is provided, fetch from NPPES
            if (!providerName || !speciality || !location) {
                try {
                    providerData = await NPPESService.getProviderByNPI(npi);
                } catch (error) {
                    return res.status(404).json({ error: error.message });
                }
            } else {
                // Use provided data
                providerData = {
                    providerName,
                    npi,
                    speciality,
                    location,
                    NPI_Status: 'Active',
                    MIPS: 'Not Available',
                    Payment: 'Not Available',
                    Medicare: 'Not Available',
                    Risk: 'Not Available'
                };
            }

            const newProvider = await Provider.create(providerData);
            
            // Sync to Elasticsearch
            await syncProviderToElastic(providerData);
            
            res.status(201).json({
                message: 'Provider added successfully',
                provider: newProvider
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get all providers
    async getAllProviders(req, res) {
        try {
            const providers = await Provider.findAll();
            res.json(providers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get provider by NPI
    async getProviderByNPI(req, res) {
        try {
            const { npi } = req.params;
            const provider = await Provider.findOne({ where: { npi } });
            
            if (!provider) {
                return res.status(404).json({ error: 'Provider not found' });
            }
            
            res.json(provider);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Preview provider data from NPPES (without saving)
    async previewProviderData(req, res) {
        try {
            const { npi } = req.params;
            const providerData = await NPPESService.getProviderByNPI(npi);
            res.json(providerData);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
};

module.exports = providerController;