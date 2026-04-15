const normalizeNpiStatus = (rawStatus) => {
    if (!rawStatus) return "Unknown";
    if (rawStatus === "A") return "Active";
    if (rawStatus === "I") return "Inactive";
    return rawStatus;
};

const getNpiStatusBadgeClass = (rawStatus) => {
    const status = normalizeNpiStatus(rawStatus).toLowerCase();
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "inactive") return "bg-red-100 text-red-700";
    return "bg-[#e8f3fa] text-[#2f8ec3]";
};

const normalizeRiskKey = (rawRisk) => {
    const value = String(rawRisk || "").trim().toLowerCase();

    if (["clear", "low"].includes(value)) return "clear";
    if (["review", "under review", "medium"].includes(value)) return "review";
    if (["high", "risk", "at risk"].includes(value)) return "risk";
    return "unknown";
};

const RISK_META = {
    clear: {
        label: "Clear",
        chipClassName: "bg-green-100 text-green-700",
        panelClassName: "bg-green-50 border-green-200 text-green-700",
    },
    review: {
        label: "Review",
        chipClassName: "bg-yellow-100 text-yellow-700",
        panelClassName: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    risk: {
        label: "Risk",
        chipClassName: "bg-red-100 text-red-700",
        panelClassName: "bg-red-50 border-red-200 text-red-700",
    },
    unknown: {
        label: "Unknown",
        chipClassName: "bg-[#e8f3fa] text-[#2f8ec3]",
        panelClassName: "bg-[#e8f3fa] border-[#cde2f2] text-[#2f8ec3]",
    },
};

const getRiskMeta = (rawRisk) => {
    const key = normalizeRiskKey(rawRisk);
    return RISK_META[key] || RISK_META.unknown;
};

export {
    getNpiStatusBadgeClass,
    getRiskMeta,
    normalizeNpiStatus,
    normalizeRiskKey,
};