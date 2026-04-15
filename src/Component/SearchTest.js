import React, { useState } from 'react';

const SearchTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      const response = await fetch('/api/doctors/search?query=JAVED');
      const data = await response.json();
      
      setTestResult(`Success! Found ${data.length} results. First result: ${data[0]?._source?.name || 'No results'}`);
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testServer = async () => {
    setLoading(true);
    setTestResult('Testing server connection...');
    
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        setTestResult('Server is reachable!');
      } else {
        setTestResult(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      setTestResult(`Cannot reach server: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Search Connection Test</h2>
      
      <div className="space-y-4">
        <button 
          onClick={testServer}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Server Connection
        </button>
        
        <button 
          onClick={testConnection}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Search API
        </button>
        
        {testResult && (
          <div className="p-3 bg-gray-100 rounded">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTest;