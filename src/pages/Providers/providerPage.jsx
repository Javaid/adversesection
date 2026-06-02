import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTenantSubdomainValidation } from "../../hooks/useTenantSubdomainValidation";
import { BsCheckCircle, BsShieldFillCheck, BsShieldExclamation } from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";
import { IoLocationOutline, IoChevronForward, IoWarningOutline, IoAddOutline, IoCloseOutline } from "react-icons/io5";

import SummaryCard from "../../components/cards/summaryCard";
import Search from "../../components/SearchBar/searchbar";
import api from "../../services/api";
import { searchDoctors } from "../../services/search";

function ProviderPage() {
  // 🔐 SECURITY: Validate user's tenant matches the URL subdomain
  useTenantSubdomainValidation();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("providerName");
  const [order, setOrder] = useState("ASC");
  
  // Add Provider Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    providerName: "",
    speciality: "",
    location: "",
    npi_status: "Active",
    mips_score: 0,
    medicare_status: "Active",
    risk_level: "Clear",
    organization_name: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const formatStatus = (status) => {
    const statusMap = { Active: "Active", I: "Inactive" };
    return statusMap[status] || status;
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new provider
  const handleSubmitProvider = async () => {
    if (!formData.providerName.trim() || !formData.speciality.trim()) {
      alert("Provider name and speciality are required!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post("/v1/providerss/create", formData);
      
      if (response.data.success) {
        alert("Provider created successfully!");
        setFormData({
          providerName: "",
          speciality: "",
          location: "",
          npi_status: "Active",
          mips_score: 0,
          medicare_status: "Active",
          risk_level: "Clear",
          organization_name: ""
        });
        setShowAddModal(false);
        setPage(1);
        // Refresh provider list by fetching from API (no page reload needed)
        try {
          const res = await api.get("/v1/providerss", { params: { page: 1, limit: pageSize, sortBy, order } });
          const mapped = res.data.data.map((p) => ({
            id: p.id, providerName: p.providerName, npi: p.npi, speciality: p.speciality,
            location: p.location, status: formatStatus(p.npi_status), Mips: p.mips_score,
            medicare: p.medicare_status, risk: p.risk_level,
          }));
          setProviders(mapped);
          setTotal(res.data.total);
        } catch (error) {
          console.error("Error refreshing providers:", error);
        }
      }
    } catch (error) {
      console.error("Error creating provider:", error);
      alert(error.response?.data?.message || "Error creating provider");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    let isCancelled = false;
    const fetchSearchResults = async () => {
      try {
        const response = await searchDoctors(searchQuery.trim());
        const elasticResults = Array.isArray(response.results) ? response.results : [];
        if (elasticResults.length === 0) { if (!isCancelled) setSearchResults([]); return; }
        const npis = elasticResults.map(r => r.npi).filter(Boolean);
        if (npis.length === 0) { if (!isCancelled) setSearchResults([]); return; }
        const res = await api.get("/v1/providerss", { params: { npis: npis.join(","), limit: 10 } });
        const mapped = res.data.data.map((p) => {
          const match = elasticResults.find(r => r.npi === p.npi);
          return { id: p.id, providerName: p.providerName, npi: p.npi, speciality: p.speciality, location: p.location, status: formatStatus(p.npi_status), score: match?._score || 0 };
        });
        mapped.sort((a, b) => b.score - a.score);
        if (!isCancelled) setSearchResults(mapped);
      } catch (err) {
        console.error("Search error:", err);
        if (!isCancelled) setSearchResults([]);
      }
    };
    fetchSearchResults();
    return () => { isCancelled = true; };
  }, [searchQuery]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await api.get("/v1/providerss", { params: { page, limit: pageSize, sortBy, order } });
        const mapped = res.data.data.map((p) => ({
          id: p.id, providerName: p.providerName, npi: p.npi, speciality: p.speciality,
          location: p.location, status: formatStatus(p.npi_status), Mips: p.mips_score,
          medicare: p.medicare_status, risk: p.risk_level,
        }));
        setProviders(mapped);
        setTotal(res.data.total);
        const totalPages = Math.ceil(res.data.total / pageSize);
        if (page > totalPages && totalPages > 0) setPage(totalPages);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setProviders([]);
      }
    };
    fetchProviders();
  }, [page, pageSize, sortBy, order]);

  const getRiskIcon = (risk) => {
    if (risk === "Clear") return <BsShieldFillCheck className="w-4 h-4" />;
    if (risk === "Review") return <IoWarningOutline className="w-4 h-4" />;
    return <BsShieldExclamation className="w-4 h-4" />;
  };

  const getRiskStyles = (risk) => {
    if (risk === "LOW") return "bg-green-100 text-green-700";
    if (risk === "MEDIUM" || risk === "HIGH") return "bg-red-100 text-red-700";
    return "bg-[#e8f3fa] text-[#2f8ec3]";
  };

  const medicareIcon = (status) =>
    status === "Active" ? <BsCheckCircle className="text-green-600" /> : <IoWarningOutline className="text-yellow-500" />;

  const totalPages = total > 0 ? Math.ceil(Number(total) / pageSize) : 1;

  return (
    <div className="space-y-6">
      <SummaryCard />
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} setPage={setPage} />

      {searchResults.length > 0 && (
        <div>
          <p className="text-sm text-[#6c8094] mb-3">About {searchResults.length} results for "{searchQuery}"</p>
          <div className="space-y-3">
            {searchResults.map((result) => (
              <div key={result.id} className="bg-white p-4 rounded-lg border border-[#d8e4ef] hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/provider/${result.id}`)}>
                <h3 className="text-lg font-medium text-[#2f8ec3] hover:underline">{result.providerName}</h3>
                <p className="text-sm text-[#4b8f68] mb-1">NPI: {result.npi} • {result.speciality}</p>
                <p className="text-sm text-[#6c8094]">{result.location} • Status: {result.status}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2f8ec3] text-white rounded hover:bg-[#1e5fa1] transition"
            title="Add new provider"
          >
            <IoAddOutline size={20} />
            <span>Add Provider</span>
          </button>
          <div>
            <label className="mr-2 text-sm font-medium text-[#6c8094]">Rows per page:</label>
            <select className="border border-[#d8e4ef] bg-white rounded px-2 py-1 text-sm text-[#2e4358]" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              {[5, 10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white border border-[#d8e4ef] rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#6c8094] border-b border-[#d8e4ef] bg-[#f6f9fc]">
                <th className="px-6 py-4 text-left font-medium cursor-pointer" onClick={() => { setSortBy("providerName"); setOrder(order === "ASC" ? "DESC" : "ASC"); }}>Provider</th>
                <th className="px-6 py-4 text-left font-medium cursor-pointer" onClick={() => { setSortBy("speciality"); setOrder(order === "ASC" ? "DESC" : "ASC"); }}>Specialty</th>
                <th className="px-6 py-4 text-left font-medium">Location</th>
                <th className="px-6 py-4 text-left font-medium cursor-pointer" onClick={() => { setSortBy("npi_status"); setOrder(order === "ASC" ? "DESC" : "ASC"); }}>NPI Status</th>
                <th className="px-6 py-4 text-left font-medium">MIPS Score</th>
                <th className="px-6 py-4 text-left font-medium">Medicare</th>
                <th className="px-6 py-4 text-left font-medium">Risk Level</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} className="border-b border-[#edf3f8] hover:bg-[#f8fbfe] transition cursor-pointer" onClick={() => navigate(`/provider/${p.id}`)}>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#2e4358] truncate">{p.providerName}</p>
                    <p className="text-xs text-[#7f96ab]">NPI: {p.npi || "N/A"}</p>
                  </td>
                  <td className="px-6 py-4">{p.speciality}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2"><IoLocationOutline className="text-[#7f96ab]" /><span>{p.location}</span></div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${p.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2"><AiOutlineRise />{p.Mips}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">{medicareIcon(p.medicare)}{p.medicare}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${getRiskStyles(p.risk)}`}>{getRiskIcon(p.risk)}{p.risk}</span>
                  </td>
                  <td className="px-6 py-4"><IoChevronForward className="text-[#9eb3c5]" size={18} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button className="px-4 py-2 bg-[#e8f3fa] text-[#2f8ec3] rounded disabled:opacity-50" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span className="text-sm text-[#6c8094]">Page {page} of {totalPages}</span>
          <button className="px-4 py-2 bg-[#e8f3fa] text-[#2f8ec3] rounded disabled:opacity-50" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>

      {/* Add Provider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-lg max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-[#2e4358]">Add New Provider</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-[#6c8094] hover:text-[#2e4358]"
              >
                <IoCloseOutline size={28} />
              </button>
            </div>

            <div className="space-y-4">
              {/* First Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2e4358] mb-2">Provider Name *</label>
                  <input 
                    type="text"
                    name="providerName"
                    value={formData.providerName}
                    onChange={handleFormChange}
                    placeholder="e.g., John Doe Clinic"
                    className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2f8ec3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2e4358] mb-2">Speciality *</label>
                  <input 
                    type="text"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleFormChange}
                    placeholder="e.g., Cardiology"
                    className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2f8ec3]"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-[#2e4358] mb-2">NPI *</label>
                  <input 
                    type="text"
                    name="speciality"
                    value={formData.npi}
                    onChange={handleFormChange}
                    placeholder="e.g., 1234567890"
                    className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2f8ec3]"
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2e4358] mb-2">Location</label>
                  <input 
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="e.g., New York, NY"
                    className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2f8ec3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2e4358] mb-2">Organization</label>
                  <input 
                    type="text"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleFormChange}
                    placeholder="e.g., ABC Health Network"
                    className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2f8ec3]"
                  />
                </div>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2e4358] mb-2">NPI Status</label>
                  <select 
                    name="npi_status"
                    value={formData.npi_status}
                    onChange={handleFormChange}
                    className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2f8ec3]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2e4358] mb-2">Medicare Status</label>
                  <select 
                    name="medicare_status"
                    value={formData.medicare_status}
                    onChange={handleFormChange}
                    className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2f8ec3]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Fourth Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2e4358] mb-2">Risk Level</label>
                  <select 
                    name="risk_level"
                    value={formData.risk_level}
                    onChange={handleFormChange}
                    className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2f8ec3]"
                  >
                    <option value="Clear">Clear</option>
                    <option value="Review">Review</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2e4358] mb-2">MIPS Score</label>
                  <input 
                    type="number"
                    name="mips_score"
                    value={formData.mips_score}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full border border-[#d8e4ef] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2f8ec3]"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6 justify-end">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-[#d8e4ef] text-[#2e4358] rounded hover:bg-[#f6f9fc] transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitProvider}
                disabled={submitting}
                className="px-6 py-2 bg-[#2f8ec3] text-white rounded hover:bg-[#1e5fa1] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? "Creating..." : "Create Provider"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderPage;
