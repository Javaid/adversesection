import React, { useState, useMemo } from "react";

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


function ProviderPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");


  const Providers = [
    {
      firstName: "Dr. Sarah Elizabeth Mitchell",
      credentials: "MD, FACP",
      npi: "1234567890",
      speciality: "Internal Medicine",
      location: "New York, NY",
      status: "Active",
      Mips: "92.5/100",
      payment: "$45.7k",
      medicare: "Active",
      risk: "Clear",
    },
    {
      firstName: "Dr. James Robert Chen",
      credentials: "MD, PhD",
      npi: "9876543210",
      speciality: "Cardiology",
      location: "San Francisco, CA",
      status: "Active",
      Mips: "78.3/100",
      payment: "$89.2k",
      medicare: "Active",
      risk: "Review",
    },
    {
      firstName: "Dr. Maria Elena Rodriguez",
      credentials: "DO, FACOG",
      npi: "5678901234",
      speciality: "Obstetrics & Gynecology",
      location: "Houston, TX",
      status: "Active",
      Mips: "95.2/100",
      payment: "$12.5k",
      medicare: "Active",
      risk: "Clear",
    },
    {
      firstName: "Dr. William Thomas Anderson",
      credentials: "MD",
      npi: "3456789012",
      speciality: "Orthopedic Surgery",
      location: "Sarasota, FL",
      status: "Inactive",
      Mips: "0/100",
      payment: "$0.0k",
      medicare: "Active",
      risk: "Risk",
    },
    {
      firstName: "Dr. Patricia Ann Thompson",
      credentials: "MD, MPH",
      npi: "4567890123",
      speciality: "Family Medicine",
      location: "Seattle, WA",
      status: "Active",
      Mips: "88.7/100",
      payment: "$3.2k",
      medicare: "Active",
      risk: "Clear",
    },
  ];
const filteredProviders = useMemo(() => {
  return Providers.filter((p) => {
    const query = searchQuery.toLowerCase();

    return (
      p.firstName.toLowerCase().includes(query) ||
      p.npi.includes(query) ||
      p.speciality.toLowerCase().includes(query)
    );
  });
}, [searchQuery]);

  const getRiskIcon = (risk) => {
    if (risk === "Clear") return <BsShieldFillCheck className="w-4 h-4" />;
    if (risk === "Review") return <IoWarningOutline className="w-4 h-4" />;
    return <BsShieldExclamation className="w-4 h-4" />;
  };

  const getRiskStyles = (risk) => {
    if (risk === "Clear") return "bg-green-100 text-green-700";
    if (risk === "Review") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const medicareIcon = (status) =>
    status === "Active" ? (
      <BsCheckCircle className="text-green-600" />
    ) : (
      <IoWarningOutline className="text-yellow-500" />
    );

  return (
    <>
      <SummaryCard />
    <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />


      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-4 text-left font-medium min-w-[200px]">
                  Provider
                </th>
                <th className="px-6 py-4 text-left font-medium min-w-[150px]">
                  Speciality
                </th>
                <th className="px-6 py-4 text-left font-medium min-w-[150px]">
                  Location
                </th>
                <th className="px-6 py-4 text-left font-medium min-w-[100px]">
                  NPI Status
                </th>
                <th className="px-6 py-4 text-left font-medium min-w-[100px]">
                  MIPS Score
                </th>
                <th className="px-6 py-4 text-left font-medium min-w-[120px]">
                  2023 Payments
                </th>
                <th className="px-6 py-4 text-left font-medium min-w-[100px]">
                  Medicare
                </th>
                <th className="px-6 py-4 text-left font-medium min-w-[100px]">
                  Risk Level
                </th>
              
              </tr>
            </thead>

            <tbody>
              {filteredProviders.map((p, index) => {
                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => navigate(`/provider/${index}`)}
                  >
                    {/* Provider */}
                    <td className="px-6 py-4">
                      <p className="font-semibold truncate" title={p.firstName}>
                        {p.firstName}
                      </p>
                      <p className="text-xs text-gray-500">{p.credentials}</p>
                      <p className="text-xs text-gray-500 truncate" title={p.npi}>
                        NPI: {p.npi}
                      </p>
                    </td>

                    {/* Speciality */}
                    <td className="px-6 py-4">{p.speciality}</td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <IoLocationOutline className="mt-0.5" />
                        <span>{p.location}</span>
                      </div>
                    </td>

                    {/* NPI Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                          p.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* MIPS */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <AiOutlineRise />
                        {p.Mips}
                      </div>
                    </td>

                    {/* Payments */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <BsCurrencyDollar />
                        {p.payment}
                      </div>
                    </td>

                    {/* Medicare */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap text-green-700">
                        {medicareIcon(p.medicare)}
                        {p.medicare}
                      </div>
                    </td>

                    {/* Risk */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs whitespace-nowrap ${getRiskStyles(
                          p.risk
                        )}`}
                      >
                        {getRiskIcon(p.risk)}
                        {p.risk}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <IoChevronForward className="text-gray-400" size={18} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Outlet />
      </div>
    </>
  );
}

export default ProviderPage;
