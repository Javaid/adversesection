export function getApiBaseUrl() {
    const explicitBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
    console.log("API Base URL:", explicitBaseUrl || "Using default /api");
    if (explicitBaseUrl) {
        return explicitBaseUrl.replace(/\/$/, "");
    }

    return "/api";
}

const RESOLVED_TENANT_KEY = "resolvedTenant";

export function getTenantStorageKey(name) {
    if (typeof window === "undefined") {
        return name;
    }

    return `${name}:${window.location.hostname.toLowerCase()}`;
}

export function getResolvedTenantStorageKey() {
    return getTenantStorageKey(RESOLVED_TENANT_KEY);
}

export function getResolvedTenantFromStorage() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(getResolvedTenantStorageKey());
}

export function setResolvedTenantInStorage(tenant) {
    if (typeof window === "undefined") return;
    if (!tenant) {
        localStorage.removeItem(getResolvedTenantStorageKey());
        return;
    }

    localStorage.setItem(getResolvedTenantStorageKey(), tenant);
}

/**
 * Extract tenant from subdomain
 * Examples:
 *   zigron.localhost.me → "zigron"
 *   naviquis.localhost.me → "naviquis"
 *   localhost:5173 → "default"
 *   admin.localhost.me → "admin"
 */
export function getTenantFromSubdomain() {
    if (typeof window === "undefined") return "default";

    const hostname = window.location.hostname.toLowerCase();

    if (
        hostname === "localhost" ||
        hostname.startsWith("localhost:") ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("127.0.0.1:")
    ) {
        return getResolvedTenantFromStorage() || "default";
    }

    if (hostname === "localhost.me") {
        return getResolvedTenantFromStorage() || "default";
    }

    const subdomain = hostname.split(".")[0];
    return subdomain || "default";
}
