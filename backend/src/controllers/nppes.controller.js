const nppesService = require("../services/nppes.service");
const Provider = require("../models/provider.model");
const Address = require("../models/address.model");
const Taxonomy = require("../models/taxonomy.model");

exports.fetchData = async (req, res) => {
    try {
        const data = await nppesService.fetchNppesData();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllProviders = async (req, res) => {
    try {
        const providers = await Provider.findAll({
            include: [
                {
                    model: Address,
                    required: false // LEFT JOIN to include providers even without addresses
                },
                {
                    model: Taxonomy,
                    required: false // LEFT JOIN to include providers even without taxonomies
                }
            ]
        });
        res.json({ success: true, data: providers, count: providers.length });
    } catch (error) {
        console.error('Error fetching providers:', error);
        res.status(500).json({ error: error.message });
    }
};
