const axios = require("axios");
const Provider = require("../models/provider.model");
const Address = require("../models/address.model");
const Taxonomy = require("../models/taxonomy.model");

exports.fetchNppesData = async () => {
    const url = `https://npiregistry.cms.hhs.gov/api/?number=${npi}&version=2.1`; 
    const response = await axios.get(url);
    return response.data.results || [];
};

// exports.getAllProvidersFromDB = async () => {
//     try {
//         const providers = await Provider.findAll({
//             include: [
//                 {
//                     model: Address,
//                     as: 'addresses' // Make sure this matches your association alias
//                 },
//                 {
//                     model: Taxonomy,
//                     as: 'taxonomy' // Make sure this matches your association alias
//                 }
//             ]
//         });
//         return providers;
//     } catch (error) {
//         console.error('Error fetching providers from DB:', error);
//         throw error;
//     }
// };

exports.importNppesData = async (npi) => {
  try {
    // Build API URL
    const url = `https://npiregistry.cms.hhs.gov/api/?version=2.1&limit=200` +
                `&npi=${encodeURIComponent(npi)}` ;
               

    console.log('NPPES API URL:', url); // Debug log
    
    const response = await axios.get(url);
    // console.log('NPPES API Response:', {
    //   resultCount: response.data.result_count,
    //   results: response.data.results?.length || 0
    // }); // Debug log
    
    const providers = response.data.results || [];

    for (const item of providers) {
      console.log('Processing provider:', item.number, item.basic?.first_name, item.basic?.last_name); // Debug log
      
      try {
        const [providerInstance, created] = await Provider.findOrCreate({
          where: { npi: item.number },
          defaults: {
            npi: item.number, 
            first_name: item.basic?.first_name || null,
            last_name: item.basic?.last_name || null,
            organization_name: item.basic?.organization_name || null,
            gender: item.basic?.gender || null,
          },
        });
        
        console.log('Provider created/found:', providerInstance.id, created ? 'created' : 'found');

        if (item.addresses) {
          for (const addr of item.addresses) {
            try {
              await Address.findOrCreate({
                where: { providerId: providerInstance.id, address: addr.address_1 },
                defaults: {
                  address: addr.address_1,
                  city: addr.city || null,
                  state: addr.state || null,
                  postal_code: addr.postal_code || null,
                  phone: addr.telephone_number || null,
                  address_type: addr.address_purpose || null,
                  providerId: providerInstance.id, 
                },
              });
            } catch (addrError) {
              console.error('Address creation error:', addrError.message);
            }
          }
        }

        if (item.taxonomies) {
          for (const tax of item.taxonomies) {
            try {
              await Taxonomy.findOrCreate({
                where: { providerId: providerInstance.id, taxonomy_code: tax.code },
                defaults: {
                  taxonomy_code: tax.code,
                  taxonomy_description: tax.desc || tax.description || null,
                  is_primary: tax.primary || false,
                  providerId: providerInstance.id, 
                },
              });
            } catch (taxError) {
              console.error('Taxonomy creation error:', taxError.message);
            }
          }
        }
      } catch (providerError) {
        console.error('Provider creation error:', providerError.message);
        continue; 
      }
    }

    console.log('Total providers imported:', providers.length); 
    return providers.length;
  } catch (error) {
    console.error("Error importing NPPES data:", error.message);
    console.error("Full error:", error.response?.data || error);
    throw error;
  }
};
