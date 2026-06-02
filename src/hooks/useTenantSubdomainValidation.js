import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTenantFromSubdomain, getTenantStorageKey } from "../services/runtimeConfig";
import { getCompanyIdFromToken } from "../services/authService";

/**
 * Hook to enforce strict subdomain tenant validation
 * Redirects users to their proper subdomain if they try to access via localhost or wrong subdomain
 * 
 * Usage: Call this in Dashboard or other protected pages
 */
export function useTenantSubdomainValidation() {
    const navigate = useNavigate();
    const location = useLocation();
    const lastCheckedHostname = useRef(window.location.hostname);

    const validateTenant = () => {
        const currentHostname = window.location.hostname;
        
        // Only check if hostname changed (manual URL change)
        if (currentHostname !== lastCheckedHostname.current) {
            console.log(`[TENANT_SUBDOMAIN_CHECK] Manual URL change detected: ${lastCheckedHostname.current} → ${currentHostname}`);
            lastCheckedHostname.current = currentHostname;
        }

        const tokenStorageKey = getTenantStorageKey("token");
        const token = localStorage.getItem(tokenStorageKey);

        if (!token) {
            return; // Not authenticated, let router handle it
        }

        try {
            // Get user's assigned tenant from JWT token
            const userTenant = getCompanyIdFromToken(token, 'tenant');
            
            // Get current subdomain from URL
            const currentSubdomain = getTenantFromSubdomain();

            console.log(`[TENANT_SUBDOMAIN_CHECK] User Tenant: ${userTenant} | Current Subdomain: ${currentSubdomain}`);

            // Check if accessing via localhost or "default" subdomain
            if (currentSubdomain === "default" && userTenant && userTenant !== "default") {
                console.log(`[TENANT_SUBDOMAIN_CHECK] ⚠️  User accessed via localhost without proper subdomain!`);
                console.log(`[TENANT_SUBDOMAIN_CHECK] Redirecting to: http://${userTenant}.localhost.me:5173${window.location.pathname}`);
                
                // Redirect to proper subdomain
                window.location.href = `http://${userTenant}.localhost.me:5173${window.location.pathname}${window.location.search}`;
                return;
            }

            // Check if user is accessing via a different tenant's subdomain
            if (currentSubdomain !== "default" && userTenant && currentSubdomain !== userTenant) {
                console.log(`[TENANT_SUBDOMAIN_CHECK] ❌ SECURITY VIOLATION: User tenant (${userTenant}) does not match subdomain (${currentSubdomain})`);
                console.log(`[TENANT_SUBDOMAIN_CHECK] Clearing session and redirecting to login`);
                
                // Clear all tenant-related localStorage
                localStorage.removeItem(tokenStorageKey);
                localStorage.removeItem(getTenantStorageKey("companyId"));
                localStorage.removeItem(getTenantStorageKey("tenant"));
                
                // Redirect to login
                window.location.href = `http://${userTenant}.localhost.me:5173/login`;
                return;
            }

            console.log(`[TENANT_SUBDOMAIN_CHECK] ✅ Tenant validation passed`);
        } catch (error) {
            console.error("[TENANT_SUBDOMAIN_CHECK] Error during validation:", error);
        }
    };

    useEffect(() => {
        // Check on route/location change
        validateTenant();
    }, [location]);

    useEffect(() => {
        // Listen for manual URL changes (popstate = back/forward buttons or direct URL changes)
        window.addEventListener('popstate', validateTenant);
        
        // Also check periodically in case user manually types URL (can't be caught by standard events)
        const interval = setInterval(() => {
            if (window.location.hostname !== lastCheckedHostname.current) {
                validateTenant();
            }
        }, 1000); // Check every second

        return () => {
            window.removeEventListener('popstate', validateTenant);
            clearInterval(interval);
        };
    }, []);
}
