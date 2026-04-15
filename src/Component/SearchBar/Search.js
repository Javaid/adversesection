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
    <div className="w-full px-4 mt-6">
      <div className="bg-white border border-[#d8e4ef] rounded-full shadow-sm px-4 py-2">
        <div className="relative flex items-center">
          <FaSearch className="text-[#89a0b5] ml-2 mr-3" />

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name, NPI, or specialty..."
            className="w-full bg-transparent outline-none text-[#2e4358] placeholder-[#8aa0b5]"
          />

          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                setSearchQuery("");
              }}
              className="text-[#8aa0b5] hover:text-[#2f8ec3] mr-2"
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