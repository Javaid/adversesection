import { useQuery } from "@tanstack/react-query";
import { DEFAULT_DASHBOARD_SUMMARY, getDashboardSummary } from "../services/dashboardService";

export function useDashboardSummary() {
    return useQuery({
        queryKey: ["dashboard", "summary"],
        queryFn: getDashboardSummary,
        placeholderData: DEFAULT_DASHBOARD_SUMMARY,
    });
}