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
    <div className="w-full px-4 py-8 bg-[#eef3f8] min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2e4358]">Add New Provider</h1>
            <p className="text-sm text-[#6c8094] mt-1">
              Search by NPI and verify the provider details before adding.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-[#5f7890] hover:text-[#2f8ec3] text-sm font-medium"
          >
            ← Back to Providers
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#d8e4ef] shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#2e4358] mb-2">
                NPI Number *
              </label>
              <input
                type="text"
                value={npi}
                onChange={handleNpiChange}
                placeholder="Enter 10-digit NPI"
                maxLength="10"
                className="w-full p-3 border border-[#d8e4ef] rounded-lg bg-[#fbfdff] focus:ring-2 focus:ring-[#4fa7d8] focus:border-[#4fa7d8] outline-none"
                required
              />
              <div className="mt-2 min-h-6">
                {isLoading && (
                  <p className="text-[#2f8ec3] text-sm">Fetching provider data...</p>
                )}
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-sm font-medium text-[#5f7890] mb-2">
                  Provider Name
                </label>
                <input
                  type="text"
                  value={formData.providerName}
                  onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                  className="w-full p-3 border border-[#d8e4ef] rounded-lg bg-[#fbfdff] focus:ring-2 focus:ring-[#4fa7d8] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5f7890] mb-2">
                  Speciality
                </label>
                <input
                  type="text"
                  value={formData.speciality}
                  onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  className="w-full p-3 border border-[#d8e4ef] rounded-lg bg-[#fbfdff] focus:ring-2 focus:ring-[#4fa7d8] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5f7890] mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 border border-[#d8e4ef] rounded-lg bg-[#fbfdff] focus:ring-2 focus:ring-[#4fa7d8] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5f7890] mb-2">
                  NPI Status
                </label>
                <input
                  type="text"
                  value={formData.NPI_Status}
                  onChange={(e) => setFormData({ ...formData, NPI_Status: e.target.value })}
                  className="w-full p-3 border border-[#d8e4ef] rounded-lg bg-[#fbfdff] focus:ring-2 focus:ring-[#4fa7d8] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="sm:flex-1 bg-[#4fa7d8] text-white py-3 px-6 rounded-lg hover:bg-[#2f8ec3] transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!npi || npi.length !== 10 || isLoading}
              >
                Add Provider
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="sm:flex-1 bg-[#e8f3fa] text-[#2f8ec3] py-3 px-6 rounded-lg hover:bg-[#d9ecf8] transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProvider;