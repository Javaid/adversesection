import api from "./api";

const DEFAULT_DASHBOARD_SUMMARY = {
    totalProviders: 0,
    clearProviders: 0,
    underReviewProviders: 0,
    atRiskProviders: 0,
};

function normalizeDashboardSummary(payload) {
    return {
        totalProviders: Number(payload?.totalProviders ?? payload?.total ?? DEFAULT_DASHBOARD_SUMMARY.totalProviders),
        clearProviders: Number(payload?.clearProviders ?? payload?.clear ?? DEFAULT_DASHBOARD_SUMMARY.clearProviders),
        underReviewProviders: Number(payload?.underReviewProviders ?? payload?.underReview ?? DEFAULT_DASHBOARD_SUMMARY.underReviewProviders),
        atRiskProviders: Number(payload?.atRiskProviders ?? payload?.atRisk ?? DEFAULT_DASHBOARD_SUMMARY.atRiskProviders),
    };
}

export async function getDashboardSummary() {

    try {
        const res = await api.post("/v1/dashboard/summary");
        const data = res.data?.data?.stats;
        return normalizeDashboardSummary(data);
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        return DEFAULT_DASHBOARD_SUMMARY;
    }
}

export { DEFAULT_DASHBOARD_SUMMARY };