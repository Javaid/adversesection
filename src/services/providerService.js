import api from "./api";

const DEFAULT_PROVIDER_SEARCH = {
    total: 0,
    providers: [],
};

export async function searchProviders(query, limit = 8) {
    try {
        const res = await api.post("/v1/providers/search", { query, limit });
        const payload = res.data?.data;

        return {
            total: Number(payload?.total ?? 0),
            providers: Array.isArray(payload?.providers) ? payload.providers : [],
        };
    } catch (error) {
        const message = error?.response?.data?.message || "Provider search failed";
        throw new Error(message);
    }
}

export { DEFAULT_PROVIDER_SEARCH };
