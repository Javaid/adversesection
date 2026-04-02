import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  BsCheckCircle,
  BsShieldFillCheck,
  BsShieldExclamation,
  BsCurrencyDollar,
} from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";
import {
  IoLocationOutline,
  IoChevronForward,
  IoWarningOutline,
} from "react-icons/io5";

import SummaryCard from "../Cards/SummaryCard";
import Search from "../SearchBar/Search";
import api from "../../api/api";
import { searchDoctors } from "../../api/search";

function ProviderPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("providerName");
  const [order, setOrder] = useState("ASC");

  // Convert NPI status codes
  const formatStatus = (status) => {
    const statusMap = { Active: "Active", I: "Inactive" };
    return statusMap[status] || status;
  };

  
// Fetch Elasticsearch search results
useEffect(() => {
  if (!searchQuery.trim()) {
    setSearchResults([]); // Clear if input is empty
    return;
  }

  let isCancelled = false; // for cleanup

  const fetchSearchResults = async () => {
    try {
      const response = await searchDoctors(searchQuery.trim());

      // Ensure backend returns an array
      const elasticResults = Array.isArray(response.results) ? response.results : [];

      if (elasticResults.length === 0) {
        if (!isCancelled) setSearchResults([]);
        return;
      }

      const npis = elasticResults.map(r => r.npi).filter(Boolean);
      if (npis.length === 0) {
        if (!isCancelled) setSearchResults([]);
        return;
      }

      const res = await api.get("/providerss", {
        params: { npis: npis.join(","), limit: 10 },
      });

      const mapped = res.data.data.map((p) => {
        const match = elasticResults.find(r => r.npi === p.npi);
        return {
          id: p.id,
          providerName: p.providerName,
          npi: p.npi,
          speciality: p.speciality,
          location: p.location,
          status: formatStatus(p.npi_status),
          score: match?._score || 0,
        };
      });

      mapped.sort((a, b) => b.score - a.score);

      if (!isCancelled) setSearchResults(mapped);
    } catch (err) {
      console.error("Search error:", err);
      if (!isCancelled) setSearchResults([]);
    }
  };

  fetchSearchResults();

  return () => {
    isCancelled = true; // cleanup if input changes quickly
  };
}, [searchQuery]);

  // Fetch providers for main table (always shows all providers)
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get("/providerss", {
          params: { page, limit: pageSize, sortBy, order },
        });
        
        const mapped = res.data.data.map((p) => ({
          id: p.id,
          providerName: p.providerName,
          npi: p.npi,
          speciality: p.speciality,
          location: p.location,
          status: formatStatus(p.npi_status),
          Mips: p.mips_score,
          payment: p.payment ? `$${p.payment}` : "$0",
          medicare: p.medicare_status,
          risk: p.risk_level,
        }));

        setProviders(mapped);
        setTotal(res.data.total);

        const totalPages = Math.ceil(res.data.total / pageSize);
        if (page > totalPages && totalPages > 0) {
          setPage(totalPages);
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
        setProviders([]);
      }
    };

    fetchProviders();
  }, [page, pageSize, sortBy, order]); // Removed searchQuery dependency

  // Risk Icon
  const getRiskIcon = (risk) => {
    if (risk === "Clear") return <BsShieldFillCheck className="w-4 h-4" />;
    if (risk === "Review") return <IoWarningOutline className="w-4 h-4" />;
    return <BsShieldExclamation className="w-4 h-4" />;
  };

  const getRiskStyles = (risk) => {
    switch (risk) {
      case "LOW":
        return "bg-green-100 text-green-700";
      case "MEDIUM":
      case "HIGH":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const medicareIcon = (status) =>
    status === "Active" ? (
      <BsCheckCircle className="text-green-600" />
    ) : (
      <IoWarningOutline className="text-yellow-500" />
    );

  const totalPages = total > 0 ? Math.ceil(Number(total) / pageSize) : 1;// Dynamic total pages

  return (
    <>
      <SummaryCard providers={providers} />
      <Search
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />

      {/* Google-style Search Results Above Table */}
      {searchResults.length > 0 && (
        <div className="max-w-7xl mx-auto mt-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              About {searchResults.length} results for "{searchQuery}"
            </p>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white p-4 rounded-lg border hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/provider/${result.id}`)}
                >
                  <h3 className="text-lg font-medium text-blue-600 hover:underline">
                    {result.providerName}
                  </h3>
                  <p className="text-sm text-green-600 mb-1">
                    NPI: {result.npi} • {result.speciality}
                  </p>
                  <p className="text-sm text-gray-600">
                     {result.location} • Status: {result.status}
                  </p>
                  {/* <div className="text-xs text-gray-400 mt-2">
                    Relevance Score: {result.score.toFixed(2)}
                  </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mt-6">
        {/* Page size selector */}
        <div className="flex justify-end mb-2">
          <label className="mr-2 text-sm font-medium">Rows per page:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1); // Reset page when pageSize changes
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b bg-gray-50">
                <th
                  className="px-6 py-4 text-left font-medium cursor-pointer"
                  onClick={() => {
                    setSortBy("providerName");
                    setOrder(order === "ASC" ? "DESC" : "ASC");
                  }}
                >
                  Provider
                </th>
                <th
                  className="px-6 py-4 text-left font-medium cursor-pointer"
                  onClick={() => {
                    setSortBy("speciality");
                    setOrder(order === "ASC" ? "DESC" : "ASC");
                  }}
                >
                  Specialty
                </th>
                <th className="px-6 py-4 text-left font-medium">Location</th>
                <th className="px-6 py-4 text-left font-medium">NPI Status</th>
                <th className="px-6 py-4 text-left font-medium">MIPS Score</th>
                <th className="px-6 py-4 text-left font-medium">
                  2023 Payments
                </th>
                <th className="px-6 py-4 text-left font-medium">Medicare</th>
                <th className="px-6 py-4 text-left font-medium">Risk Level</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>

            <tbody>
              {providers.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/provider/${p.id}`)}
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold truncate">{p.providerName}</p>
                    <p className="text-xs text-gray-500">NPI: {p.npi}</p>
                  </td>

                  <td className="px-6 py-4">{p.speciality}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <IoLocationOutline />
                      <span>{p.location}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium max-w-[200px] text-center leading-snug ${
                        p.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <AiOutlineRise />
                      {p.Mips}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <BsCurrencyDollar />
                      {p.payment}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {medicareIcon(p.medicare)}
                      {p.medicare}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${getRiskStyles(
                        p.risk,
                      )}`}
                    >
                      {getRiskIcon(p.risk)}
                      {p.risk}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <IoChevronForward className="text-gray-400" size={18} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>

        <Outlet />
      </div>
    </>
  );
}

export default ProviderPage; 