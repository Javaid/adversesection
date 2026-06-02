"use strict";

const config = require("../config");
const ApiError = require("../utils/ApiError");

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);

const DEFAULT_THEME = {
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
};

const FALLBACK_TENANTS = [
    {
        id: "tenant_default",
        slug: "default",
        subdomain: "app",
        displayName: "Adverse Section",
        shortName: "AS",
        tagline: "Reporting suite",
        status: "active",
        isDefault: true,
        plan: "enterprise",
        hosts: ["localhost", "127.0.0.1"],
        allowedOrigins: ["http://localhost:5173"],
        loginHero: {
            headline: "Monitor adverse events. Manage cases. Stay compliant.",
            description:
                "Centralised case tracking, reporting, and compliance management for the Adverse Section team.",
        },
        theme: DEFAULT_THEME,
    },
    {
        id: "tenant_sentinel",
        slug: "sentinel",
        subdomain: "sentinel",
        displayName: "Sentinel QA",
        shortName: "SQ",
        tagline: "Quality oversight workspace",
        status: "active",
        plan: "professional",
        hosts: [],
        allowedOrigins: [],
        loginHero: {
            headline: "Track signals faster. Review risk earlier.",
            description:
                "A focused workspace for quality and safety teams running early signal detection across programs.",
        },
        theme: {
            background: "#fffaf0",
            surface: "#ffffff",
            surfaceMuted: "#fef3c7",
            text: "#172554",
            mutedText: "#7c2d12",
            primary: "#c2410c",
            primaryHover: "#9a3412",
            primarySoft: "rgba(194, 65, 12, 0.14)",
            border: "#fed7aa",
            inverseText: "#ffffff",
            heroGradient: "linear-gradient(135deg, #ea580c 0%, #7c2d12 100%)",
        },
    },
];

function normalizeHostname(value) {
    if (!value) {
        return "";
    }

    const rawValue = Array.isArray(value) ? value[0] : String(value);
    const withoutProtocol = rawValue.includes("://")
        ? new URL(rawValue).hostname
        : rawValue.split(",")[0].trim().split("/")[0];

    return withoutProtocol.split(":")[0].trim().toLowerCase();
}

function normaliseTheme(theme = {}) {
    return {
        ...DEFAULT_THEME,
        ...theme,
    };
}

function normaliseTenant(tenant, index) {
    const slug = tenant.slug || `tenant-${index + 1}`;

    return {
        id: tenant.id || `tenant_${index + 1}`,
        slug,
        subdomain: (tenant.subdomain || slug).toLowerCase(),
        displayName: tenant.displayName || slug,
        shortName: tenant.shortName || (tenant.displayName || slug).slice(0, 2).toUpperCase(),
        tagline: tenant.tagline || "Workspace",
        status: tenant.status || "active",
        isDefault: Boolean(tenant.isDefault),
        plan: tenant.plan || "standard",
        hosts: [...new Set((tenant.hosts || []).map(normalizeHostname).filter(Boolean))],
        allowedOrigins: [...new Set((tenant.allowedOrigins || []).map((origin) => origin.trim()).filter(Boolean))],
        loginHero: {
            headline:
                tenant.loginHero?.headline ||
                `${tenant.displayName || slug} keeps reporting and review in one place.`,
            description:
                tenant.loginHero?.description ||
                "Use your tenant workspace to load branding, navigation, and runtime defaults.",
        },
        theme: normaliseTheme(tenant.theme),
    };
}

function getTenants() {
    const source = Array.isArray(config.tenant.catalog) && config.tenant.catalog.length > 0
        ? config.tenant.catalog
        : FALLBACK_TENANTS;

    return source.map(normaliseTenant);
}

function getDefaultTenant() {
    const tenants = getTenants();
    console.log("Available tenants:", tenants.map((t) => t.slug).join(", "));
    return tenants.find((tenant) => tenant.isDefault) || tenants[0] || null;
}

function findTenantByHostname(hostname) {
    const normalizedHostname = normalizeHostname(hostname);
    const tenants = getTenants();

    if (!normalizedHostname) {
        return getDefaultTenant();
    }

    const exactMatch = tenants.find((tenant) => tenant.hosts.includes(normalizedHostname));
    if (exactMatch) {
        return exactMatch;
    }

    if (LOCAL_HOSTNAMES.has(normalizedHostname)) {
        return getDefaultTenant();
    }

    if (!config.tenant.baseDomain) {
        return null;
    }

    if (normalizedHostname === config.tenant.baseDomain) {
        return getDefaultTenant();
    }

    const suffix = `.${config.tenant.baseDomain}`;
    if (!normalizedHostname.endsWith(suffix)) {
        return null;
    }

    const subdomain = normalizedHostname.slice(0, -suffix.length);
    if (!subdomain) {
        return getDefaultTenant();
    }

    return tenants.find((tenant) => tenant.subdomain === subdomain) || null;
}

function assertTenant(hostname) {
    const tenant = findTenantByHostname(hostname);

    if (!tenant) {
        throw ApiError.notFound("Unknown tenant host");
    }

    if (tenant.status !== "active") {
        throw ApiError.forbidden("Tenant is not active");
    }

    return tenant;
}

function isAllowedOrigin(origin) {
    if (!origin) {
        return config.env !== "production";
    }

    if (config.cors.allowedOrigins.includes(origin)) {
        return true;
    }

    const tenant = findTenantByHostname(origin);
    if (!tenant) {
        return false;
    }

    return tenant.allowedOrigins.length === 0 || tenant.allowedOrigins.includes(origin);
}

function getBootstrapPayload(tenant) {
    return {
        id: tenant.id,
        slug: tenant.slug,
        subdomain: tenant.subdomain,
        displayName: tenant.displayName,
        shortName: tenant.shortName,
        tagline: tenant.tagline,
        plan: tenant.plan,
        loginHero: tenant.loginHero,
        theme: tenant.theme,
    };
}

module.exports = {
    assertTenant,
    findTenantByHostname,
    getBootstrapPayload,
    getDefaultTenant,
    getTenants,
    isAllowedOrigin,
    normalizeHostname,
};