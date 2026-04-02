import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { BsShieldFillCheck, BsShieldExclamation } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import api from "../../api/api";

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
      const response = await api.get("/stats");
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="bg-gray-200 rounded-md w-10 h-10 flex items-center justify-center">
          <FaUser className="text-gray-600 text-lg" />
        </div>

        <div className="ml-2">
          <h1 className="font-bold text-gray-900 text-xl text-left">
            Provider Monitoring
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage healthcare provider compliance and credentials
          </p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end -mt-2 mb-4">
        <button
          type="button"
          onClick={() => navigate("/addproviders")}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md 
                     hover:bg-blue-900 transition duration-300 ease-in-out"
        >
          + Add Providers
        </button>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-6 mt-6">

        {/* Total Providers */}
        <div className="flex items-center justify-start p-5 bg-white border border-gray-200 rounded-lg w-72">
          <div>
            <span className="text-2xl font-bold text-gray-900 block text-left">
              {stats.totalProviders}
            </span>
            <span className="text-sm text-gray-500">
              Total Providers
            </span>
          </div>
        </div>

        {/* Clear */}
        <div className="flex items-center gap-4 p-5 bg-white border border-green-700 rounded-lg w-72">
          <BsShieldFillCheck className="text-green-700 text-3xl" />
          <div>
            <span className="text-2xl font-bold text-green-700 block">
              {stats.clear}
            </span>
            <span className="text-sm text-gray-500">
              Clear
            </span>
          </div>
        </div>

        {/* Under Review */}
        <div className="flex items-center gap-4 p-5 bg-white border border-yellow-400 rounded-lg w-72">
          <IoWarningOutline className="text-yellow-400 text-3xl" />
          <div>
            <span className="text-2xl font-bold text-yellow-400 block text-left">
              {stats.underReview}
            </span>
            <span className="text-sm text-gray-500">
              Under Review
            </span>
          </div>
        </div>

        {/* At Risk */}
        <div className="flex items-center gap-4 p-5 bg-white border border-red-700 rounded-lg w-72">
          <BsShieldExclamation className="text-red-700 text-3xl" />
          <div>
            <span className="text-2xl font-bold text-red-700 block text-left">
              {stats.atRisk}
            </span>
            <span className="text-sm text-gray-500">
              At Risk
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SummaryCard;
