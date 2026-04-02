import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ searchQuery, setSearchQuery, setPage }) => {
  const [inputValue, setInputValue] = useState(searchQuery || "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Only set the actual search query
      setSearchQuery(inputValue);
      if (setPage) setPage(1);
    }, 300); // debounce 300ms

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return (
    <div className="max-w-7xl mx-auto mt-6">
      <div className="bg-white border border-gray-200 rounded-full shadow-sm px-4 py-2">
        <div className="relative flex items-center">
          <FaSearch className="text-gray-400 ml-2 mr-3" />

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name, NPI, or specialty..."
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />

          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                setSearchQuery("");
              }}
              className="text-gray-400 hover:text-gray-600 mr-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;