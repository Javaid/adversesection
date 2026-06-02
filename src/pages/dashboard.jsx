import StatCard from "../components/StatCard";
import { useState } from "react";
import { useDashboardSummary } from "../hooks/useDashboardSummary";
import { useTenantSubdomainValidation } from "../hooks/useTenantSubdomainValidation";
import { searchProviders } from "../services/providerService";

const statCardDefinitions = [
    {
        key: "totalProviders",
        label: "Total Providers",
        badge: "Total",
        badgeColor: "bg-sky-100 text-sky-700",
        desc: "All registered providers",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        iconBg: "bg-sky-100 text-sky-700",
    },
    {
        key: "clearProviders",
        label: "Clear",
        badge: "Clear",
        badgeColor: "bg-green-100 text-green-700",
        desc: "No active concerns",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        iconBg: "bg-green-100 text-green-700",
    },
    {
        key: "underReviewProviders",
        label: "Under Review",
        badge: "Pending",
        badgeColor: "bg-amber-100 text-amber-700",
        desc: "Providers awaiting assessment",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        iconBg: "bg-amber-100 text-amber-700",
    },
    {
        key: "atRiskProviders",
        label: "At Risk",
        badge: "Alert",
        badgeColor: "bg-red-100 text-red-700",
        desc: "Providers requiring intervention",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        iconBg: "bg-red-100 text-red-700",
    },
];

const Dashboard = () => {
    // 🔐 SECURITY: Validate user's tenant matches the URL subdomain
    // If accessing via localhost without proper subdomain, redirect to correct subdomain
    useTenantSubdomainValidation();
    
    const summaryQuery = useDashboardSummary();
    const statCards = statCardDefinitions.map((card) => ({
        ...card,
        value: summaryQuery.data?.[card.key] ?? 0,
    }));

    const [providerQuery, setProviderQuery] = useState("");
    const [providerResults, setProviderResults] = useState([]);
    const [providerTotal, setProviderTotal] = useState(0);
    const [providerSearching, setProviderSearching] = useState(false);
    const [providerError, setProviderError] = useState("");
    const [providerSearched, setProviderSearched] = useState(false);

    const handleProviderSearch = async (e) => {
        e.preventDefault();

        const query = providerQuery.trim();
        if (query.length < 2) {
            setProviderError("Enter at least 2 characters, or a full 10-digit NPI.");
            setProviderResults([]);
            setProviderTotal(0);
            setProviderSearched(false);
            return;
        }

        setProviderError("");
        setProviderSearching(true);

        try {
            const data = await searchProviders(query, 8);
            setProviderResults(data.providers);
            setProviderTotal(data.total);
            setProviderSearched(true);
        } catch (error) {
            setProviderError(error.message || "Unable to search providers right now.");
            setProviderResults([]);
            setProviderTotal(0);
            setProviderSearched(true);
        } finally {
            setProviderSearching(false);
        }
    };

    const openOigForProvider = (provider) => {
        const searchSeed = [provider?.name, provider?.npi].filter(Boolean).join(" ");
        const url = new URL("https://exclusions.oig.hhs.gov/");
        if (searchSeed) {
            url.hash = `lookup=${encodeURIComponent(searchSeed)}`;
        }
        window.open(url.toString(), "_blank", "noopener,noreferrer");
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 leading-tight">Dashboard</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Monitor active cases, compliance status, and section activity in real time.</p>
                </div>
            </div>
            {summaryQuery.isError ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Dashboard summary could not be loaded. The cards below are showing fallback values.
                </div>
            ) : null}
            {/* Provider Finder */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-800">Provider Finder</h2>
                            <p className="text-xs text-slate-400">Search by provider name or 10-digit NPI. Then verify in OIG LEIE.</p>
                        </div>
                    </div>
                    <a
                        href="https://exclusions.oig.hhs.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-sky-600 hover:text-sky-700 shrink-0"
                    >
                        Open OIG Site ↗
                    </a>
                </div>
                <form onSubmit={handleProviderSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Provider Name or NPI</label>
                        <input
                            type="text"
                            placeholder="e.g. Sara Jenkins or 1234567890"
                            value={providerQuery}
                            onChange={(e) => setProviderQuery(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={providerSearching}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-medium transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {providerSearching ? "Searching..." : "Find Provider"}
                        </button>
                    </div>
                </form>
                {providerError ? (
                    <p className="mt-2.5 text-xs text-red-600">{providerError}</p>
                ) : null}

                {providerSearched ? (
                    <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-slate-50 px-3 py-2 text-xs text-slate-600 flex items-center justify-between">
                            <span>Matches found: {providerTotal}</span>
                            <span>Showing up to 8 records</span>
                        </div>

                        {providerResults.length === 0 ? (
                            <div className="px-3 py-6 text-sm text-slate-500 text-center">
                                No provider found for this search.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {providerResults.map((provider) => (
                                    <div key={`${provider.npi}-${provider.name}`} className="px-3 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{provider.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                NPI: <span className="font-medium text-slate-700">{provider.npi || "N/A"}</span>
                                                {provider.taxonomy ? ` | ${provider.taxonomy}` : ""}
                                                {provider.city || provider.state ? ` | ${provider.city || ""}${provider.city && provider.state ? ", " : ""}${provider.state || ""}` : ""}
                                            </p>
                                            {(provider.credential || provider.providerType) ? (
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    {provider.credential || "No credential"}
                                                    {provider.providerType ? ` • ${provider.providerType}` : ""}
                                                </p>
                                            ) : null}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => openOigForProvider(provider)}
                                            className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                                        >
                                            Verify in OIG
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="mt-2.5 text-xs text-slate-400">
                        Use this finder for direct provider lookup, then use OIG verification for exclusion checks.
                    </p>
                )}
            </div>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {summaryQuery.isLoading
                    ? statCardDefinitions.map((card) => (
                        <div key={card.label} className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 animate-pulse">
                            <div className="flex items-start justify-between gap-3">
                                <div className="h-11 w-11 rounded-xl bg-slate-100 shrink-0"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-24 rounded bg-slate-100"></div>
                                    <div className="h-8 w-14 rounded bg-slate-100"></div>
                                </div>
                                <div className="h-5 w-14 rounded-full bg-slate-100"></div>
                            </div>
                            <div className="h-3 w-full rounded bg-slate-100"></div>
                        </div>
                    ))
                    : statCards.map((card) => (
                        <StatCard
                            key={card.label}
                            label={card.label}
                            value={card.value}
                            badge={card.badge}
                            badgeColor={card.badgeColor}
                            desc={card.desc}
                            icon={card.icon}
                            iconBg={card.iconBg}
                        />
                    ))}
            </div>
            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Risk Distribution */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-800">Risk Distribution</h2>
                        <button className="text-slate-400 hover:text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <circle cx="4" cy="10" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="16" cy="10" r="1.5" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Donut chart */}
                        <div className="relative shrink-0">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <g transform="rotate(-90 60 60)">
                                    {/* Low/No Risk */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#c7d2fe" strokeWidth="16"
                                        strokeDasharray="234.68 282.74" strokeDashoffset="-48.07" />
                                    {/* Moderate Risk */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#fde68a" strokeWidth="16"
                                        strokeDasharray="36.19 282.74" strokeDashoffset="-11.88" />
                                    {/* Critical High */}
                                    <circle cx="60" cy="60" r="45" fill="none" stroke="#f87171" strokeWidth="16"
                                        strokeDasharray="11.88 282.74" strokeDashoffset="0" />
                                </g>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-base font-bold text-slate-800">100%</span>
                                <span className="text-xs text-slate-400 tracking-wide">AUDITED</span>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="space-y-3 flex-1">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-400 shrink-0"></span>
                                    <span className="text-xs text-slate-600">Critical High</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-700">4.2%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-amber-200 shrink-0"></span>
                                    <span className="text-xs text-slate-600">Moderate Risk</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-700">12.8%</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-indigo-200 shrink-0"></span>
                                    <span className="text-xs text-slate-600">Low/No Risk</span>
                                </div>
                                <span className="text-xs font-semibold text-slate-700">83.0%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Exclusion Activity */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-800">Recent Exclusion Activity</h2>
                        <button className="text-xs font-medium text-sky-600 hover:text-sky-700">View All Feed</button>
                    </div>
                    <div className="space-y-4">
                        {/* OIG Exclusion Detected */}
                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-semibold text-slate-800">OIG Exclusion Detected</p>
                                    <span className="text-xs text-slate-400 shrink-0">2 hours ago</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Provider <span className="font-semibold text-slate-700">Dr. Marcus Thorne (NPI: 109283774)</span> matched OIG LEIE list for &ldquo;Fraudulent Claims&rdquo;.
                                </p>
                                <div className="flex gap-1.5 mt-1.5">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">CRITICAL</span>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">ACTION REQUIRED</span>
                                </div>
                            </div>
                        </div>
                        {/* SAM.gov Status Update */}
                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-semibold text-slate-800">SAM.gov Status Update</p>
                                    <span className="text-xs text-slate-400 shrink-0">5 hours ago</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Entity <span className="font-semibold text-slate-700">Horizon Diagnostics LLC</span> clearance verified. Active status confirmed.
                                </p>
                                <div className="flex gap-1.5 mt-1.5">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-600">VERIFIED</span>
                                </div>
                            </div>
                        </div>
                        {/* NPI Registry Conflict */}
                        <div className="flex gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-xs font-semibold text-slate-800">NPI Registry Conflict</p>
                                    <span className="text-xs text-slate-400 shrink-0">Yesterday</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    License expiration detected for <span className="font-semibold text-slate-700">Sara Jenkins, NP</span>. Registry mismatch with state board.
                                </p>
                                <div className="flex gap-1.5 mt-1.5">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">WARNING</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
