"use strict";

const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

/**
 * Tenant-based authorization middleware.
 *
 * Validates that:
 * 1. The user's tenant (from JWT) matches the request subdomain tenant
 * 2. Super admins (companyId === 0) can access all tenants
 * 3. Regular users MUST access via their assigned subdomain (strict enforcement)
 * 4. Accessing via default/localhost without proper subdomain is BLOCKED
 *
 * Usage:
 *   router.get("/path", authenticate, tenantValidation(), handler);
 */
function tenantValidation() {
    return catchAsync(async (req, _res, next) => {
        // Get user from JWT (should be set by authenticate middleware)
        if (!req.user) {
            throw ApiError.unauthorized("User not authenticated");
        }

        const userRole = req.user.role;
        const userCompanyId = req.user.companyId;
        const userTenant = req.user.tenant;

        // Debug logging with timestamp
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [TENANT_VALIDATION] User: ${req.user.username} | JWT Tenant: ${userTenant} | JWT CompanyId: ${userCompanyId} | Role: ${userRole}`);

        // Super admin (companyId === 0) bypasses tenant restrictions
        if (userCompanyId === 0 && userRole === "super_admin") {
            console.log(`[${timestamp}] [TENANT_VALIDATION] Super admin detected - allowing access to all tenants`);
            return next();
        }

        // 🔐 CRITICAL: ENFORCE STRICT SUBDOMAIN MATCHING
        // Regular (non-super-admin) users MUST access via their assigned subdomain
        // This prevents users from accessing the system via localhost or wrong subdomain
        if (req.tenant && req.tenant.slug) {
            const subdomainTenant = req.tenant.slug.toLowerCase();
            console.log(`[${timestamp}] [TENANT_VALIDATION] Subdomain Tenant: ${subdomainTenant} | X-Forwarded-Host: ${req.headers['x-forwarded-host']} | Host: ${req.headers.host}`);
            
            // Strict check: user's tenant MUST match the subdomain tenant
            if (userTenant !== subdomainTenant) {
                console.log(`[${timestamp}] [TENANT_VALIDATION] ❌ BLOCKED - STRICT SUBDOMAIN CHECK FAILED! User tenant (${userTenant}) != Subdomain tenant (${subdomainTenant})`);
                // Log detailed info for security audit
                console.log(`[${timestamp}] [SECURITY_AUDIT] Unauthorized tenant access attempt:`);
                console.log(`[${timestamp}] [SECURITY_AUDIT]   Username: ${req.user.username}`);
                console.log(`[${timestamp}] [SECURITY_AUDIT]   Assigned Tenant: ${userTenant}`);
                console.log(`[${timestamp}] [SECURITY_AUDIT]   Attempted Tenant: ${subdomainTenant}`);
                console.log(`[${timestamp}] [SECURITY_AUDIT]   IP: ${req.ip}`);
                console.log(`[${timestamp}] [SECURITY_AUDIT]   URL: ${req.originalUrl}`);
                console.log(`[${timestamp}] [SECURITY_AUDIT]   Method: ${req.method}`);
                
                throw ApiError.forbidden(
                    `Access denied: You must access via your assigned tenant subdomain. You are assigned to '${userTenant}' but tried to access '${subdomainTenant}'. ` +
                    `Please use http://${userTenant}.localhost.me:5173 instead of localhost:5173`
                );
            }
            console.log(`[${timestamp}] [TENANT_VALIDATION] ✅ Subdomain matches user's assigned tenant`);
        } else {
            // No subdomain tenant resolved - this should not happen in normal operation
            console.log(`[${timestamp}] [TENANT_VALIDATION] ⚠️  WARNING: req.tenant not set or missing slug`);
            throw ApiError.forbidden(
                `Access denied: Could not determine tenant from request. Please access via your subdomain (e.g., zigron.localhost.me:5173)`
            );
        }

        // Extract requested tenant from multiple sources (in priority order)
        let requestedTenant = null;

        // 1. From X-Tenant header (explicit tenant specification)
        if (req.headers["x-tenant"]) {
            requestedTenant = req.headers["x-tenant"].toLowerCase();
        }

        // 2. From request body (for POST/PUT requests)
        if (!requestedTenant && req.body && req.body.tenant) {
            requestedTenant = req.body.tenant.toLowerCase();
        }

        // 3. From URL path if available (e.g., /v1/tenants/:tenant/...)
        if (!requestedTenant && req.params.tenant) {
            requestedTenant = req.params.tenant.toLowerCase();
        }

        // 4. Default to user's assigned tenant
        if (!requestedTenant) {
            requestedTenant = userTenant;
        }

        console.log(`[${timestamp}] [TENANT_VALIDATION] Final Requested Tenant: ${requestedTenant}`);

        // Validate tenant match
        if (userTenant !== requestedTenant) {
            console.log(`[${timestamp}] [TENANT_VALIDATION] ❌ BLOCKED - User tenant (${userTenant}) != Requested tenant (${requestedTenant})`);
            throw ApiError.forbidden(
                `Access denied: You are assigned to tenant '${userTenant}' but requested '${requestedTenant}'`
            );
        }

        // Store resolved tenant AND companyId in request for downstream use
        // This ensures all data queries filter by company
        req.resolvedTenant = requestedTenant;
        req.isTenantAccess = true;
        req.companyId = userCompanyId;  // Attach companyId so data queries can filter

        console.log(`[${timestamp}] [TENANT_VALIDATION] ✅ ALLOWED - All checks passed for tenant: ${requestedTenant} | companyId: ${userCompanyId}`);
        next();
    });
}

/**
 * Tenant resolution middleware (without strict validation).
 * Used on public/semi-public routes to identify tenant context without denying access.
 */
function resolveTenantOptional() {
    return (req, _res, next) => {
        // Extract tenant from multiple sources
        let tenant = null;

        if (req.headers["x-tenant"]) {
            tenant = req.headers["x-tenant"].toLowerCase();
        }

        if (!tenant && req.body && req.body.tenant) {
            tenant = req.body.tenant.toLowerCase();
        }

        if (!tenant && req.params.tenant) {
            tenant = req.params.tenant.toLowerCase();
        }

        if (!tenant && req.user) {
            tenant = req.user.tenant;
        }

        req.resolvedTenant = tenant || "default";
        next();
    };
}

module.exports = { tenantValidation, resolveTenantOptional };
