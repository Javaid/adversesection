const axios = require('axios');

class providerssService {
    static async getProviderByNPI(npi) {
        try {
            const response = await axios.get(`https://npiregistry.cms.hhs.gov/api/?number=${npi}&version=2.1`);
            
            if (response.data.result_count === 0) {
                throw new Error('Provider not found with this NPI');
            }

            const providerData = response.data.results[0];
            
            return {
                providerName: this.getProviderName(providerData),
                npi: providerData.number,
                speciality: this.getSpeciality(providerData),
                location: this.getLocation(providerData),
                NPI_Status: providerData.basic.status,
                MIPS: 'Not Available',
                Payment: 'Not Available', 
                Medicare: 'Not Available',
                Risk: 'Not Available'
            };
        } catch (error) {
            throw new Error(`Failed to fetch provider data: ${error.message}`);
        }
    }

    static getProviderName(providerData) {
        const basic = providerData.basic;
        if (basic.organization_name) {
            return basic.organization_name;
        } else {
            return `${basic.first_name} ${basic.last_name}`;
        }
    }

    static getSpeciality(providerData) {
        if (providerData.taxonomies && providerData.taxonomies.length > 0) {
            return providerData.taxonomies[0].desc;
        }
        return 'Not Specified';
    }

    static getLocation(providerData) {
        const address = providerData.addresses.find(addr => addr.address_purpose === 'LOCATION') || 
                       providerData.addresses[0];
        
        if (address) {
            return `${address.city}, ${address.state}`;
        }i
        return 'Not Available';
    }
}

module.exports = providerssService;