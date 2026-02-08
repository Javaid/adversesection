import React from "react";
import { FaSearch } from "react-icons/fa";

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="max-w-7xl mx-auto mt-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, NPI, or specialty..."
            className="
              w-full pl-10 pr-4 py-2
              bg-gray-50 border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent
              text-gray-700 placeholder-gray-500
            "
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
