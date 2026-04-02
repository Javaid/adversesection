import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';

function AddProvider() {
  const navigate = useNavigate();

  const [npi, setNpi] = useState('');
  const [formData, setFormData] = useState({
    providerName: '',
    speciality: '',
    location: '',
    NPI_Status: '',
    MIPS: '',
    Payment: '',
    Medicare: '',
    Risk: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle input ONLY (no API call here)
  const handleNpiChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // allow only numbers
    setNpi(value);

    // reset when less than 10 digits
    if (value.length < 10) {
      setFormData({
        providerName: '',
        speciality: '',
        location: '',
        NPI_Status: '',
        MIPS: '',
        Payment: '',
        Medicare: '',
        Risk: ''
      });
      setError('');
      setSuccess('');
    }
  };

  
  useEffect(() => {
    if (npi.length !== 10) return;

    const fetchProvider = async () => {
      setIsLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await api.get(`/providerss/npi/${npi}`);

        if (response.data && response.data.success && response.data.provider) {
          const p = response.data.provider;

          setFormData({
            providerName: p.providerName || '',
            speciality: p.speciality || '',
            location: p.location || '',
            NPI_Status: p.NPI_Status || '',
            MIPS: p.MIPS || '',
            Payment: p.Payment || '',
            Medicare: p.Medicare || '',
            Risk: p.Risk || ''
          });

          setSuccess('Provider fetched successfully!');
        } else {
          setError('Provider not found');
        }

      } catch (err) {
        console.error('NPI lookup error:', err);
        setError('Error fetching provider');
      } finally {
        setIsLoading(false);
      }
    };

    // ⏳ debounce to prevent multiple fast calls
    const timer = setTimeout(fetchProvider, 400);

    return () => clearTimeout(timer);

  }, [npi]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Provider added successfully!');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add New Provider</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Providers
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
       
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NPI Number *
            </label>
            <input
              type="text"
              value={npi}
              onChange={handleNpiChange}
              placeholder="Enter 10-digit NPI"
              maxLength="10"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {/* {isLoading && (
              <p className="text-blue-600 text-sm mt-1 flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Fetching provider data...
              </p>
            )} */}
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            {success && <p className="text-green-600 text-sm mt-1">{success}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider Name
              </label>
              <input
                type="text"
                value={formData.providerName}
                onChange={(e) => setFormData({...formData, providerName: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speciality
              </label>
              <input
                type="text"
                value={formData.speciality}
                onChange={(e) => setFormData({...formData, speciality: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NPI Status
              </label>
              <input
                type="text"
                value={formData.NPI_Status}
                onChange={(e) => setFormData({...formData, NPI_Status: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder=""
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
              disabled={!npi || npi.length !== 10}
            >
              Add Provider
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProvider;