import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout, getCompanyIdFromToken } from "../services/authService";
import { getTenantStorageKey, getTenantFromSubdomain } from "../services/runtimeConfig";

export function useAuth() {
    const navigate = useNavigate();
    const currentTenant = getTenantFromSubdomain();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const tokenStorageKey = getTenantStorageKey("token");
    const companyIdStorageKey = getTenantStorageKey("companyId");
    const tenantStorageKey = getTenantStorageKey("tenant");
    const isAuthenticated = Boolean(localStorage.getItem(tokenStorageKey));

    async function handleLogin(username, password, tenant) {
        setError("");
        setLoading(true);
        try {
            const { data: response } = await login(username, password, tenant);
            const token = response.token;
            const companyId = getCompanyIdFromToken(token);
            const tenantFromToken = getCompanyIdFromToken(token, 'tenant');
            
            localStorage.setItem(tokenStorageKey, token);
            if (companyId !== null && companyId !== undefined) {
                localStorage.setItem(companyIdStorageKey, companyId);
            }
            if (tenantFromToken) {
                localStorage.setItem(tenantStorageKey, tenantFromToken);
            }
            
            // Navigate to dashboard (tenant detected from subdomain)
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message ?? err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        await logout();
        navigate("/login", { replace: true });
    }

    return { isAuthenticated, loading, error, handleLogin, handleLogout };
}
