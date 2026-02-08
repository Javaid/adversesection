import React from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebbar/Sidebar";
import { BsCheckCircle } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { RxCrossCircled } from "react-icons/rx"; 

import Compliance from "./Compliance";
import Identifiers from "./Identifiers";
import PracticeLocation from "./PracticeLocation";
import Education from "./Education";
import Research from "./Research";
import Payment from "./Payment";
import DigitalPresence from "./DigitalPresence";

import doctorData from "../../Data/doctorData";

function Providerlayout() {
  const navigate = useNavigate();
  const { id } = useParams();

  const provider = doctorData.find((doc) => doc.id === String(id));

  if (!provider) {
    return <div>Provider not found</div>;
  }

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
      icon: (
        <FiAlertTriangle className="text-yellow-600 text-xl flex-shrink-0" />
      ),
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

  const risk = riskConfig[provider.RiskLevel.toLowerCase()] || riskConfig.low;

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-gray-50">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2.5 cursor-pointer text-gray-600 hover:text-blue-600 mb-4"
        >
          <span className="text-xl">←</span>
          <span>Back to Providers</span>
        </div>

        <div className="bg-white border rounded-xl p-6 flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl">
              👤
            </div>

            <div>
              <h1 className="text-xl font-semibold">{provider.name}</h1>
              <p className="text-gray-500">{provider.speciality}</p>

              <div className="flex items-center gap-3 mt-2 text-sm">
                <span>NPI: {provider.npi}</span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {provider.status}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg p-3 w-44 flex items-center gap-2 ${risk.bg} ${risk.border}`}
          >
            {risk.icon}
            <div className="text-left">
              <p className="text-sm text-gray-600">OVERALL RISK</p>
              <p className={`text-sm font-semibold ${risk.text}`}>
                {risk.label}
              </p>
            </div>
          </div>
        </div>

        <div id="overview">
          <Outlet context={{ provider }} />
        </div>

        <Compliance provider={provider} />

        <div id="identifiers">
          <Identifiers provider={provider} />
        </div>

        <div id="practice">
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

        <div id="Digital-Presence">
          <DigitalPresence provider={provider} />
        </div>
      </div>
    </div>
  );
}

export default Providerlayout;
