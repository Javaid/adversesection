import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaUserMd } from "react-icons/fa";

const StandaloneSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchDoctors = async (text) => {
    if (!text.trim()) {
      setDoctors([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Searching for:', text);
      const res = await fetch(`/api/doctors/search?query=${encodeURIComponent(text)}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Search results:', data);
      setDoctors(data);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchDoctors(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Search</h1>
          <p className="text-gray-600">Search for doctors by name, specialty, or location</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialty, or location..."
              className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="space-y-4">
            {doctors.length > 0 ? (
              <>
                <div className="text-sm text-gray-600 mb-4">
                  Found {doctors.length} result{doctors.length !== 1 ? 's' : ''}
                </div>
                {doctors.map((doc, index) => (
                  <div key={doc._id || index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUserMd className="text-blue-600 text-2xl" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {doc._source?.name || 'Unknown Name'}
                        </h3>
                        
                        <div className="space-y-2">
                          {doc._source?.speciality && (
                            <div className="flex items-center text-gray-600">
                              <FaUserMd className="mr-2 text-sm" />
                              <span>{doc._source.speciality}</span>
                            </div>
                          )}
                          
                          {doc._source?.location && (
                            <div className="flex items-center text-gray-600">
                              <FaMapMarkerAlt className="mr-2 text-sm" />
                              <span>{doc._source.location}</span>
                            </div>
                          )}
                          
                          {doc._source?.organization_name && (
                            <div className="text-sm text-gray-500">
                              Organization: {doc._source.organization_name}
                            </div>
                          )}
                        </div>
                        
                        {/* Score indicator */}
                        {doc._score && (
                          <div className="mt-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Match Score: {doc._score.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              searchQuery && (
                <div className="text-center py-12">
                  <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-600 text-lg">No doctors found for "{searchQuery}"</p>
                  <p className="text-gray-500 text-sm mt-2">Try searching with different keywords</p>
                </div>
              )
            )}
          </div>
        )}

        {/* Empty state */}
        {!searchQuery && !loading && (
          <div className="text-center py-12">
            <FaSearch className="mx-auto text-gray-300 text-6xl mb-4" />
            <p className="text-gray-500 text-lg">Start typing to search for doctors</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StandaloneSearch;