import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { BsCheckCircle } from "react-icons/bs";
import { FiAlertTriangle } from "react-icons/fi";
import { FiCopy } from "react-icons/fi";
import { RxCrossCircled } from "react-icons/rx";
import { MdVerified } from "react-icons/md";

import Sidebar from "../SideBar/sidebar";
import Header from "./Header/header";
import api from "../../services/api";

import Compliance from "../sections/compliance/Compliance";
import Identifiers from "../sections/Identifiers/identifiers";
import Taxonomy from "../sections/Taxonomy/taxonomy";
import HealthInfoExchange from "../sections/HealthInfoExchange/HealthInfoExchange";
import PracticeLocation from "../sections/PracticeLocation/practiceLocation";
import Education from "../sections/education/Education";
import Research from "../sections/Resaerch/research";
import DigitalPresence from "../sections/digitalPresence/DigitalPresence";

function Providerlayout() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchProvider = async () => {
            try {
                const res = await api.get(`/v1/providerss/${id}`);
                const providerData = res.data?.provider;

                if (!mounted) return;

                setProvider({
                    ...providerData,
                    overview: providerData?.overview || { compliance: [] },
                    overallRisk: providerData?.risk_level || "Low",
                    isActive: providerData?.npi_status === "Active",
                });
            } catch {
                if (mounted) setProvider(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProvider();
        return () => {
            mounted = false;
        };
    }, [id]);

    const status = useMemo(() => {
        if (!provider?.npi_status) return "Unknown";
        if (provider.npi_status === "I") return "Inactive";
        return provider.npi_status;
    }, [provider?.npi_status]);

    const issues = useMemo(() => {
        if (!provider) return [];
        const result = [];

        if (!provider.npi) {
            result.push({
                title: "Missing NPI",
                detail: "Provider record does not include an NPI identifier.",
                source: "National NPI Registry",
            });
        }

        if (!provider.providerName) {
            result.push({
                title: "Missing provider name",
                detail: "Provider name is empty in the profile.",
                source: "Internal Provider Profile",
            });
        }

        if (!provider.speciality && !(provider.overview?.specialties || []).length) {
            result.push({
                title: "No specialty found",
                detail: "Specialty is missing from both profile and professional classification.",
                source: "Internal Provider Profile",
            });
        }

        return result;
    }, [provider]);

    const sourceOfTruthFields = useMemo(() => {
        const taxonomyRows = Array.isArray(provider?.taxonomy) ? provider.taxonomy : [];

        const getValues = (key) => {
            const values = taxonomyRows
                .map((row) => row?.[key])
                .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
                .map((value) => String(value).trim());

            return values.length > 0 ? Array.from(new Set(values)).join(", ") : "-";
        };

        return [
            { label: "License Number", value: getValues("license_number") },
            { label: "Status", value: getValues("status") },
            { label: "Source URL", value: getValues("source_url") },
            { label: "Document Link", value: getValues("document_link") },
        ];
    }, [provider?.taxonomy]);

    const copyToClipboard = async (text) => {
        if (!text || text === "-") return;

        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // Silent fail to avoid interrupting user flow if clipboard API is unavailable.
        }
    };

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

    const risk = riskConfig[String(provider?.overallRisk || "low").toLowerCase()] || riskConfig.low;

    if (loading) return <div>Loading provider data...</div>;
    if (!provider) return <div>Provider not found</div>;

    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            <Header />

            <div className="flex flex-1 overflow-hidden">
            <div className="w-64 bg-[#f8fbfe] border-r border-[#d8e4ef] p-6 flex-shrink-0">
                <Sidebar />
            </div>

            <div className="flex-1 p-6 bg-[#eef3f8] overflow-x-hidden overflow-y-auto">
                <div className="max-w-[95rem] mx-auto">
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer text-[#6c8094] hover:text-[#2f8ec3] mb-4"
                    >
                        <span className="text-xl">←</span>
                        <span>Back to Providers</span>
                    </div>

                    <div className="bg-white border border-[#d8e4ef] rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 shadow-sm">
                        <div className="flex gap-4 flex-1 min-w-0">
                            <div className="w-14 h-14 rounded-full bg-[#e8f3fa] flex items-center justify-center text-[#2f8ec3] text-2xl flex-shrink-0">
                                👤
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-xl font-semibold text-[#2e4358] truncate">{provider.providerName}</h1>
                                <p className="text-[#6c8094] truncate">{provider.speciality}</p>

                                <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
                                    <span className="truncate">NPI: {provider.npi}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs flex-shrink-0 ${provider.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                                    >
                                        {status}
                                    </span>
                                    <span className="text-[#6c8094] truncate">{provider.location || "Location not available"}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-lg p-3 w-full md:w-44 flex items-center gap-2 flex-shrink-0 ${risk.bg} ${risk.border}`}>
                            {risk.icon}
                            <div className="text-left min-w-0">
                                <p className="text-sm text-[#6c8094]">OVERALL RISK</p>
                                <p className={`text-sm font-semibold ${risk.text}`}>{risk.label}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`rounded-xl border p-4 mb-6 ${issues.length > 0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                        <div className="flex items-start gap-3">
                            {issues.length > 0 ? (
                                <FiAlertTriangle className="text-amber-600 text-xl mt-0.5" />
                            ) : (
                                <MdVerified className="text-emerald-600 text-xl mt-0.5" />
                            )}
                            <div className="min-w-0 flex-1">
                                <h2 className={`text-sm font-semibold ${issues.length > 0 ? "text-amber-800" : "text-emerald-800"}`}>
                                    Source Of Truth Check
                                </h2>
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {sourceOfTruthFields.map((field) => (
                                        <div
                                            key={field.label}
                                            className={`rounded-lg border p-3 ${issues.length > 0 ? "bg-white/80 border-amber-200" : "bg-white/80 border-emerald-200"}`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs text-[#6c8094]">{field.label}</p>
                                                {(field.label === "Source URL" || field.label === "Document Link") && field.value !== "-" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(field.value)}
                                                        className="text-[#6c8094] hover:text-[#2f8ec3]"
                                                        title={`Copy ${field.label}`}
                                                        aria-label={`Copy ${field.label}`}
                                                    >
                                                        <FiCopy className="text-sm" />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-[#2e4358] mt-1 break-words">{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                                {issues.length > 0 ? (
                                    <div className="mt-3 space-y-2">
                                        {issues.map((issue, index) => (
                                            <div key={`${issue.title}-${index}`} className="bg-white/80 border border-amber-200 rounded-lg p-3">
                                                <p className="text-sm font-medium text-amber-900">{issue.title}</p>
                                                <p className="text-sm text-amber-800 mt-0.5">{issue.detail}</p>
                                                <p className="text-xs text-amber-700 mt-1">Source: {issue.source}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-emerald-700 mt-2">No data discrepancies detected across the current provider record.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div id="overview" className="mb-6">
                        <Outlet context={{ provider }} />
                    </div>

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
                    <div id="digitalPresence">
                        <DigitalPresence provider={provider} />
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Providerlayout;
