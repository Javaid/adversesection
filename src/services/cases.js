import api from "./api";

export const listCases = async (params = {}) => {
    const { data } = await api.get("/cases", { params });
    return data;
};

export const createCase = async (payload) => {
    const { data } = await api.post("/cases", payload);
    return data;
};

export const updateCaseStatus = async (caseId, payload) => {
    const { data } = await api.patch(`/cases/${caseId}/status`, payload);
    return data;
};

export const assignCase = async (caseId, payload) => {
    const { data } = await api.patch(`/cases/${caseId}/assignee`, payload);
    return data;
};

export const addCaseNote = async (caseId, payload) => {
    const { data } = await api.post(`/cases/${caseId}/notes`, payload);
    return data;
};

export const getCaseSla = async (caseId) => {
    const { data } = await api.get(`/cases/${caseId}/sla`);
    return data;
};
