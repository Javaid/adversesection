import React, { useState, useEffect } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebbar/Sidebar";
import { BsCheckCircle } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { RxCrossCircled } from "react-icons/rx"; 

import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;


import Compliance from "./Compliance";
import Identifiers from "./Identifiers";
import Taxonomy from "./taxonomy";
import HealthInfoExchange from "./HealthInfoExchange";

import PracticeLocation from "./PracticeLocation";
import Education from "./Education";
import Research from "./Research";
import Payment from "./Payment";
import DigitalPresence from "./DigitalPresence";

function Providerlayout() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching provider ID:", id);

    const fetchProvider = async () => {
      try {
      const res = await axios.get(`${BASE_URL}/api/providerss/${id}`);

        console.log("Provider fetch response:", res.data);

        const providerData = res.data.provider; 

        setProvider({
          ...providerData,
          overview: providerData.overview || { compliance: [] },
          statusOverview: providerData.statusOverview || [
            { label: "OIG STATUS", status: "Clear" },
            { label: "SAM.GOV", status: "Clear" },
            { label: "FDA ACTIONS", status: "Resolved" },
            { label: "STATE BOARDS", status: "Clear" },
          ],
          overallRisk: providerData.risk_level || "Low",
          isActive: providerData.npi_status === "Active",
        });
      } catch (err) {
        console.error("Provider fetch error:", err);
        setProvider(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (loading) return <div>Loading provider data...</div>;
  if (!provider) return <div>Provider not found</div>;

  const riskConfig = {
    low: {
      label: "LOW RISK",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: <BsCheckCircle className="text-green-600 text-xl flex-shrink-0" />,
    },
    medium: {
      label: "MEDIUM RISK",
      bg: "bg-pink-50",
      border: "border-red-200",
      text: "text-yellow-700",
      icon: <FiAlertTriangle className="text-yellow-600 text-xl flex-shrink-0" />,
    },
    high: {
      label: "HIGH RISK",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: <RxCrossCircled className="text-red-600 text-xl flex-shrink-0" />,
    },
    review: {
      label: "UNDER REVIEW",
      bg: "bg-blue-50",
      border: "border-red-200",
      text: "text-blue-700",
      icon: <RxCrossCircled className="text-blue-600 text-xl flex-shrink-0" />,
    },
  };

  const risk = riskConfig[provider.overallRisk.toLowerCase()] || riskConfig.low;

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-gray-50 overflow-x-hidden">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2.5 cursor-pointer text-gray-600 hover:text-blue-600 mb-4"
        >
          <span className="text-xl">←</span>
          <span>Back to Providers</span>
        </div>

        {/* Provider top card */}
        <div className="bg-white border rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl flex-shrink-0">
              👤
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-semibold truncate">{provider.providerName}</h1>
              <p className="text-gray-500 truncate">{provider.speciality}</p>

              <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
                <span className="truncate">NPI: {provider.npi}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${
                    provider.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {provider.npi_status}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg p-3 w-full md:w-44 flex items-center gap-2 flex-shrink-0 ${risk.bg} ${risk.border}`}
          >
            {risk.icon}
            <div className="text-left min-w-0">
              <p className="text-sm text-gray-600">OVERALL RISK</p>
              <p className={`text-sm font-semibold ${risk.text}`}>
                {risk.label}
              </p>
            </div>
          </div>
        </div>

        {/* Child routes */}
        <div id="overview">
          <Outlet context={{ provider }} />
        </div>

        {/* Sections */}
        <div id="compliance">
          <Compliance provider={provider} />
        </div>
        <div id="identifiers">
          <Identifiers provider={provider} />
        </div>
        <div id="taxonomy">
          <Taxonomy provider={provider} />
        </div>
        <div id="healthInfoExchange">
          <HealthInfoExchange provider={provider} />
        </div>
        <div id="practiceLocation">
          <PracticeLocation provider={provider} />
        </div>
        <div id="education">
          <Education provider={provider} />
        </div>
        <div id="research">
          <Research provider={provider} />
        </div>
        <div id="payment">
          <Payment provider={provider} />
        </div>
        <div id="digitalPresence">
          <DigitalPresence provider={provider} />
        </div>
      </div>
    </div>
  );
}

export default Providerlayout;
