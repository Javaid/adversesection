const client = require('./config/elasticSearch');

async function addTestDoctors() {
    try {
        const testDoctors = [
            { id: 1, name: 'Dr. John Smith', speciality: 'Cardiology' },
            { id: 2, name: 'Dr. Sarah Johnson', speciality: 'Neurology' },
            { id: 3, name: 'Dr. Mike Brown', speciality: 'Orthopedics' },
            { id: 4, name: 'Dr. Lisa Davis', speciality: 'Pediatrics' },
            { id: 5, name: 'Dr. Robert Wilson', speciality: 'Cardiology' }
        ];

        for (const doctor of testDoctors) {
            await client.index({
                index: 'doctors',
                id: doctor.id,
                body: {
                    name: doctor.name,
                    speciality: doctor.speciality
                }
            });
            console.log(` Added: ${doctor.name} - ${doctor.speciality}`);
        }

        // Refresh index to make data searchable immediately
        await client.indices.refresh({ index: 'doctors' });
        console.log(' All test doctors added and index refreshed!');
        
    } catch (error) {
        console.error(' Error adding test data:', error.meta?.body || error.message);
    }
}

addTestDoctors();