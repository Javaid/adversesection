import api from "./api";
import { getTenantStorageKey } from "./runtimeConfig";

/**
 * Auth service — swap the simulated functions below with real API calls
 * by replacing the axios calls' endpoints.
 */

// Simulated user database (remove when connecting to a real backend)
const FAKE_USERS = [
    { username: "admin", password: "admin", token: "fake-jwt-token-admin" },
    { username: "user", password: "user", token: "fake-jwt-token-user" },
];

/**
 * Log in with username & password & tenant.
 * Returns { token: string, user: object }
 */
export async function login(username, password, tenant = "default") {
    const { data } = await api.post("/v1/auth/login", { 
        username, 
        password,
        tenant // Include tenant in request body
    });
    return data;
}

/**
 * Decode JWT token to extract a field (default: companyId)
 */
export function getCompanyIdFromToken(token, field = 'companyId') {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        
        const decoded = JSON.parse(atob(parts[1]));
        return decoded[field] !== undefined ? decoded[field] : null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}

/**
 * Log out — clears local token and companyId.
 * Extend to call a backend logout endpoint if needed.
 */
export async function logout() {
    localStorage.removeItem(getTenantStorageKey("token"));
    localStorage.removeItem(getTenantStorageKey("companyId"));

    // Real API call (uncomment when backend is ready):
    // await api.post("/v1/auth/logout");
}

/**
 * Fetch the currently authenticated user's profile.
 */
export async function getMe() {
    const { data } = await api.get("/v1/auth/me");
    return data;
}
