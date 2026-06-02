import axios from "axios";
import { getApiBaseUrl, getTenantStorageKey, getTenantFromSubdomain } from "./runtimeConfig";

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach token and tenant to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(getTenantStorageKey("token"));
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Add tenant header from subdomain
        const tenant = getTenantFromSubdomain();
        if (tenant) {
            config.headers["X-Tenant"] = tenant;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Global response error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(getTenantStorageKey("token"));
            window.location.href = "/login";
        }
        if (error.response?.status === 403) {
            // Tenant access denied
            console.error("Access denied: Tenant mismatch or insufficient permissions");
        }
        return Promise.reject(error);
    }
);

export default api;
