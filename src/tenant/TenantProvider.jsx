import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getApiBaseUrl, setResolvedTenantInStorage } from "../services/runtimeConfig";

const DEFAULT_TENANT = {
    slug: "default",
    displayName: "Adverse Section",
    shortName: "AS",
    tagline: "Reporting suite",
    plan: "enterprise",
    loginHero: {
        headline: "Monitor adverse events. Manage cases. Stay compliant.",
        description:
            "Centralised case tracking, reporting, and compliance management for the Adverse Section team.",
    },
    theme: {
        background: "#f8fafc",
        surface: "#ffffff",
        surfaceMuted: "#f1f5f9",
        text: "#0f172a",
        mutedText: "#64748b",
        primary: "#0369a1",
        primaryHover: "#075985",
        primarySoft: "rgba(3, 105, 161, 0.14)",
        border: "#e2e8f0",
        inverseText: "#ffffff",
        heroGradient: "linear-gradient(135deg, #075985 0%, #0f172a 100%)",
    },
};

const TenantContext = createContext({
    tenant: DEFAULT_TENANT,
    loading: true,
    error: "",
    refreshTenant: async () => { },
});

function applyTheme(theme) {
    const root = document.documentElement;

    // App-specific CSS variables
    root.style.setProperty("--tenant-color-bg", theme.background);
    root.style.setProperty("--tenant-color-surface", theme.surface);
    root.style.setProperty("--tenant-color-surface-muted", theme.surfaceMuted);
    root.style.setProperty("--tenant-color-text", theme.text);
    root.style.setProperty("--tenant-color-muted", theme.mutedText);
    root.style.setProperty("--tenant-color-primary", theme.primary);
    root.style.setProperty("--tenant-color-primary-hover", theme.primaryHover);
    root.style.setProperty("--tenant-color-primary-soft", theme.primarySoft);
    root.style.setProperty("--tenant-color-border", theme.border);
    root.style.setProperty("--tenant-color-inverse", theme.inverseText);
    root.style.setProperty("--tenant-hero-gradient", theme.heroGradient);

    // Bootstrap 5 CSS variables (runtime override)
    // See: https://getbootstrap.com/docs/5.3/customize/css-variables/
    root.style.setProperty('--bs-primary', theme.primary);
    root.style.setProperty('--bs-primary-rgb', hexToRgb(theme.primary));
    root.style.setProperty('--bs-body-bg', theme.background);
    root.style.setProperty('--bs-body-color', theme.text);
    root.style.setProperty('--bs-border-color', theme.border);
    root.style.setProperty('--bs-secondary', theme.surfaceMuted || theme.surface);
    root.style.setProperty('--bs-secondary-rgb', hexToRgb(theme.surfaceMuted || theme.surface));
    // Add more Bootstrap variables as needed
}

// Helper to convert hex color to rgb string for Bootstrap variables
function hexToRgb(hex) {
    if (!hex) return '';
    let c = hex.replace('#', '');
    if (c.length === 3) {
        c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `${r}, ${g}, ${b}`;
}

async function fetchTenantBootstrap(signal) {
    const response = await fetch(`${getApiBaseUrl()}/v1/tenant/bootstrap`, {
        credentials: "include",
        headers: {
            Accept: "application/json",
        },
        signal,
    });

    if (!response.ok) {
        throw new Error(`Tenant bootstrap failed with ${response.status}`);
    }

    const payload = await response.json();
    return payload.data?.tenant || DEFAULT_TENANT;
}

function TenantLoadingScreen() {
    return (
        <div className="min-h-screen tenant-shell flex items-center justify-center px-6">
            <div className="tenant-card border tenant-border rounded-2xl px-6 py-5 text-center shadow-sm max-w-sm w-full">
                <div className="w-10 h-10 rounded-full tenant-avatar mx-auto mb-4 animate-pulse"></div>
                <h1 className="text-lg font-semibold tenant-text">Loading workspace</h1>
                <p className="mt-2 text-sm tenant-text-muted">Resolving tenant branding and runtime configuration.</p>
            </div>
        </div>
    );
}

function TenantErrorScreen({ message, onRetry }) {
    return (
        <div className="min-h-screen tenant-shell flex items-center justify-center px-6">
            <div className="tenant-card border tenant-border rounded-2xl px-6 py-5 shadow-sm max-w-md w-full">
                <h1 className="text-lg font-semibold tenant-text">Workspace unavailable</h1>
                <p className="mt-2 text-sm tenant-text-muted">{message}</p>
                <button type="button" onClick={onRetry} className="tenant-primary-button mt-5 w-full py-2.5 px-4 rounded-lg text-sm font-semibold">
                    Retry bootstrap
                </button>
            </div>
        </div>
    );
}

export function TenantProvider({ children }) {
    const [tenant, setTenant] = useState(DEFAULT_TENANT);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadToken, setReloadToken] = useState(0);

    useEffect(() => {
        applyTheme(tenant.theme);
    }, [tenant]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadTenant() {
            setLoading(true);
            setError("");

            try {
                const nextTenant = await fetchTenantBootstrap(controller.signal);
                setTenant(nextTenant);
                setResolvedTenantInStorage(nextTenant.slug);
            } catch (loadError) {
                if (loadError.name !== "AbortError") {
                    // On rate-limit or network error, silently use default tenant
                    if (loadError.message?.includes("429") || loadError.message?.includes("Failed to fetch")) {
                        setTenant(DEFAULT_TENANT);
                    } else {
                        setError(loadError.message || "Unable to load tenant bootstrap");
                    }
                }
            } finally {
                setLoading(false);
            }
        }

        loadTenant();

        return () => controller.abort();
    }, [reloadToken]);

    const value = useMemo(
        () => ({
            tenant,
            loading,
            error,
            refreshTenant: async () => setReloadToken((value) => value + 1),
        }),
        [tenant, loading, error]
    );

    if (loading) {
        return <TenantLoadingScreen />;
    }

    if (error) {
        return <TenantErrorScreen message={error} onRetry={() => setReloadToken((value) => value + 1)} />;
    }

    return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
    return useContext(TenantContext);
}