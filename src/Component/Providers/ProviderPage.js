import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  BsCheckCircle,
  BsShieldFillCheck,
  BsShieldExclamation,
} from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";
import {
  IoLocationOutline,
  IoChevronForward,
  IoWarningOutline,
} from "react-icons/io5";
import { FiGrid, FiUsers, FiSearch, FiCheckSquare } from "react-icons/fi";

import SummaryCard from "../Cards/SummaryCard";
import Search from "../SearchBar/Search";
import api from "../../api/api";
import { searchDoctors } from "../../api/search";
import {
  getNpiStatusBadgeClass,
  getRiskMeta,
  normalizeNpiStatus,
  normalizeRiskKey,
} from "../../constants/providerDisplay";

function ProviderPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("npi_status");
  const [order, setOrder] = useState("ASC");

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
            status: normalizeNpiStatus(p.npi_status),
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
          status: normalizeNpiStatus(p.npi_status),
          Mips: p.mips_score,
          // payment: p.payment ? `$${p.payment}` : "$0",
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
    const riskKey = normalizeRiskKey(risk);
    if (riskKey === "clear") return <BsShieldFillCheck className="w-4 h-4" />;
    if (riskKey === "review") return <IoWarningOutline className="w-4 h-4" />;
    return <BsShieldExclamation className="w-4 h-4" />;
  };

  const medicareIcon = (status) =>
    status === "Active" ? (
      <BsCheckCircle className="text-green-600" />
    ) : (
      <IoWarningOutline className="text-yellow-500" />
    );

  const totalPages = total > 0 ? Math.ceil(Number(total) / pageSize) : 1;// Dynamic total pages

  const sidebarItems = [
    { label: "Provider Monitoring", icon: FiGrid, active: true },
    { label: "All Providers", icon: FiUsers, active: false },
    { label: "Advanced Search", icon: FiSearch, active: false },
    { label: "Compliance Tasks", icon: FiCheckSquare, active: false },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#eef3f8]">
      <aside className="hidden lg:block w-64 bg-white border-r border-[#d8e4ef] px-4 py-6">
        <div className="mb-6 px-2">
          <p className="text-xs uppercase tracking-wide text-[#8aa0b5]">Navigation</p>
        </div>
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${item.active
                  ? "bg-[#e8f3fa] text-[#2f8ec3] border border-[#cde2f2]"
                  : "text-[#6c8094] hover:bg-[#f5f9fd]"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 py-2">
        <SummaryCard providers={providers} />
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />

        {/* Google-style Search Results Above Table */}
        {searchResults.length > 0 && (
          <div className="w-full px-4 mt-4">
            <div className="mb-4">
              <p className="text-sm text-[#6c8094] mb-3">
                About {searchResults.length} results for "{searchQuery}"
              </p>
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white p-4 rounded-lg border border-[#d8e4ef] hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/provider/${result.id}`)}
                  >
                    <h3 className="text-lg font-medium text-[#2f8ec3] hover:underline">
                      {result.providerName}
                    </h3>
                    <p className="text-sm text-[#4b8f68] mb-1">
                      NPI: {result.npi} • {result.speciality}
                    </p>
                    <p className="text-sm text-[#6c8094]">
                      {result.location} • Status: {result.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="w-full px-4 mt-6">
          <div className="flex justify-end mb-2">
            <label className="mr-2 text-sm font-medium text-[#6c8094]">Rows per page:</label>
            <select
              className="border border-[#d8e4ef] bg-white rounded px-2 py-1 text-sm text-[#2e4358]"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-[#d8e4ef] rounded-lg overflow-x-auto shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#6c8094] border-b border-[#d8e4ef] bg-[#f6f9fc]">
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
                  <th
                    className="px-6 py-4 text-left font-medium cursor-pointer"
                    onClick={() => {
                      setSortBy("npi_status");
                      setOrder(order === "ASC" ? "DESC" : "ASC");
                    }}
                  >
                    NPI Status
                  </th>
                  <th className="px-6 py-4 text-left font-medium">MIPS Score</th>
                  <th className="px-6 py-4 text-left font-medium">Medicare</th>
                  <th className="px-6 py-4 text-left font-medium">Risk Level</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {providers.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[#edf3f8] hover:bg-[#f8fbfe] transition cursor-pointer"
                    onClick={() => navigate(`/provider/${p.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#2e4358] truncate">{p.providerName}</p>
                      <p className="text-xs text-[#7f96ab]">NPI: {p.npi}</p>
                    </td>

                    <td className="px-6 py-4">{p.speciality}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <IoLocationOutline className="text-[#7f96ab]" />
                        <span>{p.location}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium max-w-[200px] text-center leading-snug ${getNpiStatusBadgeClass(p.status)}`}
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
                        {medicareIcon(p.medicare)}
                        {p.medicare}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {(() => {
                        const riskMeta = getRiskMeta(p.risk);
                        return (
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${riskMeta.chipClassName}`}
                          >
                            {getRiskIcon(p.risk)}
                            {riskMeta.label}
                          </span>
                        );
                      })()}
                    </td>

                    <td className="px-6 py-4">
                      <IoChevronForward className="text-[#9eb3c5]" size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 px-4">
            <button
              className="px-4 py-2 bg-[#e8f3fa] text-[#2f8ec3] rounded disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span className="text-sm text-[#6c8094]">
              Page {page} of {totalPages}
            </span>

            <button
              className="px-4 py-2 bg-[#e8f3fa] text-[#2f8ec3] rounded disabled:opacity-50"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ProviderPage; 