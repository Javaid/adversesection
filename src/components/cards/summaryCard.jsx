import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { BsShieldFillCheck, BsShieldExclamation } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import api from "../../services/api";

function SummaryCard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProviders: 0,
    clear: 0,
    underReview: 0,
    atRisk: 0,
  });

  const fetchStats = async () => {
    try {
      const response = await api.get("/v1/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalProviders: 0,
        clear: 0,
        underReview: 0,
        atRisk: 0,
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="w-full px-4 py-6">

      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="bg-[#e8f3fa] rounded-md w-10 h-10 flex items-center justify-center border border-[#d8e4ef]">
          <FaUser className="text-[#4fa7d8] text-lg" />
        </div>

        <div className="ml-2">
          <h1 className="font-bold text-[#2e4358] text-xl text-left">
            Provider Monitoring
          </h1>

          <p className="text-sm text-[#6c8094] mt-1">
            Monitor and manage healthcare provider compliance and credentials
          </p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end -mt-2 mb-4">
        <button
          type="button"
          onClick={() => navigate("/add-provider")}
          className="bg-[#4fa7d8] text-white px-4 py-2 rounded-lg shadow-sm
                     hover:bg-[#2f8ec3] transition duration-300 ease-in-out"
        >
          + Add Providers
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6 w-full">

        {/* Total Providers */}
        <div className="flex items-center justify-start p-5 bg-white border border-[#d8e4ef] rounded-lg w-full min-w-0 border-l-4 border-l-[#4fa7d8] shadow-sm">
          <div>
            <span className="text-2xl font-bold text-[#2e4358] block text-left">
              {stats.totalProviders}
            </span>
            <span className="text-sm text-[#6c8094]">
              Total Providers
            </span>
          </div>
        </div>

        {/* Clear */}
        <div className="flex items-center gap-4 p-5 bg-white border border-[#d8e4ef] rounded-lg w-full min-w-0 border-l-4 border-l-[#67c26f] shadow-sm">
          <BsShieldFillCheck className="text-green-700 text-3xl" />
          <div>
            <span className="text-2xl font-bold text-green-700 block">
              {stats.clear}
            </span>
            <span className="text-sm text-[#6c8094]">
              Clear
            </span>
          </div>
        </div>

        {/* Under Review */}
        <div className="flex items-center gap-4 p-5 bg-white border border-[#d8e4ef] rounded-lg w-full min-w-0 border-l-4 border-l-[#e8c56c] shadow-sm">
          <IoWarningOutline className="text-yellow-400 text-3xl" />
          <div>
            <span className="text-2xl font-bold text-yellow-400 block text-left">
              {stats.underReview}
            </span>
            <span className="text-sm text-[#6c8094]">
              Under Review
            </span>
          </div>
        </div>

        {/* At Risk */}
        <div className="flex items-center gap-4 p-5 bg-white border border-[#d8e4ef] rounded-lg w-full min-w-0 border-l-4 border-l-[#ee7f7f] shadow-sm">
          <BsShieldExclamation className="text-red-700 text-3xl" />
          <div>
            <span className="text-2xl font-bold text-red-700 block text-left">
              {stats.atRisk}
            </span>
            <span className="text-sm text-[#6c8094]">
              At Risk
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SummaryCard;
