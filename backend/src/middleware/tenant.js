"use strict";

const config = require("../config");
const tenantService = require("../services/tenant.service");

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

    // Fall back to current behavior to preserve error handling contract.
    return tenantService.assertTenant(getRequestHost(req));
}

function resolveTenant(req, _res, next) {
    if (req.path === "/health") {
        return next();
    }

    req.tenant = resolveTenantHost(req);
    return next();
}

module.exports = { resolveTenant };