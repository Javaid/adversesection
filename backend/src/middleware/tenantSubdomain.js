"use strict";

const config = require("../config");
const tenantService = require("../services/tenant.service");

/**
 * Extract tenant from subdomain
 * Examples:
 *   zigron.localhost.me → "zigron"
 *   naviquis.localhost.me → "naviquis"
 *   localhost:5000 → "default"
 */
function getTenantFromSubdomain(hostname) {
    if (!hostname) return "default";
    
    hostname = hostname.toLowerCase();
    
    // Handle localhost
    if (hostname === "localhost" || hostname.startsWith("localhost:")) {
        return "default";
    }
    
    // Extract subdomain (everything before the first dot)
    const subdomain = hostname.split(".")[0];
    
    // Validate it's a known tenant
    const knownTenants = ["zigron", "naviquis", "admin", "default"];
    if (knownTenants.includes(subdomain)) {
        return subdomain;
    }
    
    return "default";
}

function getRequestHost(req) {
    if (config.tenant.trustProxy) {
        const forwardedHost = req.headers["x-forwarded-host"];
        if (forwardedHost) {
            return Array.isArray(forwardedHost)
                ? forwardedHost[0]
                : String(forwardedHost).split(",")[0].trim();
        }
    }

    return req.headers.host || req.hostname;
}

function resolveTenantHost(req) {
    const candidates = [];

    if (config.tenant.trustProxy) {
        const forwardedHost = req.headers["x-forwarded-host"];
        if (forwardedHost) {
            const firstForwarded = Array.isArray(forwardedHost)
                ? forwardedHost[0]
                : String(forwardedHost).split(",")[0].trim();

            if (firstForwarded) {
                candidates.push(firstForwarded);
            }
        }
    }

    if (req.headers.host) {
        candidates.push(req.headers.host);
    }

    if (req.hostname) {
        candidates.push(req.hostname);
    }

    const uniqueCandidates = [...new Set(candidates.filter(Boolean))];
    for (const host of uniqueCandidates) {
        const tenant = tenantService.findTenantByHostname(host);
        if (tenant) {
            return tenant;
        }
    }

    // Fallback to subdomain extraction
    const host = getRequestHost(req);
    const subdomainTenant = getTenantFromSubdomain(host);
    
    if (subdomainTenant && subdomainTenant !== "default") {
        return { slug: subdomainTenant };
    }

    // Fall back to current behavior
    return tenantService.assertTenant(host);
}

function resolveTenant(req, _res, next) {
    if (req.path === "/health") {
        return next();
    }

    req.tenant = resolveTenantHost(req);
    return next();
}

module.exports = { resolveTenant, getTenantFromSubdomain };
