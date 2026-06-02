"use strict";

const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/ApiError");

/**
 * Auth service — encapsulates all authentication business logic.
 *
 * NOTE: Users are held in-memory to get you started quickly.
 * Replace the `_users` store with your database layer (Prisma, Mongoose, etc.)
 * when you wire up persistence.
 */

// ── Tenant to Company ID Mapping ──────────────────────────────────────────────
// This maps tenant subdomains/organizations to company IDs
const TENANT_COMPANY_MAP = {
    "zigron": 1,      // Zigron company
    "naviquis": 2,    // Naviquis company
    "default": 1,     // Default to Zigron for localhost
};

// ── In-memory user store (replace with DB) ───────────────────────────────────
const _users = new Map([
    [
        "admin",
        {
            id: "usr_1",
            username: "admin",
            password: "admin",
            role: "super_admin",
            companyId: 0,
            tenant: "default", // Super admin can access all tenants
        },
    ],
    [
        "zigron",
        {
            id: "usr_2",
            username: "zigron",
            password: "zigron",
            role: "admin",
            companyId: 1,
            tenant: "zigron",
        },
    ],
    [
        "naviquis",
        {
            id: "usr_3",
            username: "naviquis",
            password: "naviquis",
            role: "admin",
            companyId: 2,
            tenant: "naviquis",
        },
    ],
]);

// ── Helpers ───────────────────────────────────────────────────────────────────

function signToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
}

function safeUser(user) {
    const { password: _pw, ...rest } = user;
    return rest;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Validate credentials and return a signed JWT + the sanitised user object.
 * Ensures tenant-based security:
 * - User's assigned tenant must match the requested tenant (unless super admin)
 * - Super admin (companyId=0) can access all tenants
 *
 * @param {string} username
 * @param {string} password
 * @param {string} requestedTenant - The tenant the user is trying to access
 * @returns {{ token: string, user: object }}
 */
async function loginUser(username, password, requestedTenant = "default") {
    const user = _users.get(username);

    // Validate credentials
    if (!user || user.password !== password) {
        throw ApiError.unauthorized("Invalid username or password");
    }

    // Tenant validation: Check if user is allowed to access the requested tenant
    const isSuperAdmin = user.companyId === 0; // Super admin with companyId 0
    const userTenant = user.tenant || requestedTenant;
    const tenantCompanyId = TENANT_COMPANY_MAP[requestedTenant] || TENANT_COMPANY_MAP["default"];

    // Validate tenant access
    if (!isSuperAdmin && userTenant !== requestedTenant) {
        // User trying to access a tenant they're not assigned to
        throw ApiError.forbidden(
            `Access denied: Your account is assigned to ${userTenant} but you're trying to access ${requestedTenant}`
        );
    }

    // Verify user's companyId matches the tenant's companyId (unless super admin)
    if (!isSuperAdmin && user.companyId !== tenantCompanyId) {
        throw ApiError.forbidden(
            "Access denied: Your company assignment does not match the requested tenant"
        );
    }

    // Create JWT with all required fields including tenant
    const token = signToken({
        sub: user.id,
        username: user.username,
        role: user.role,
        companyId: user.companyId,
        tenant: isSuperAdmin ? requestedTenant : userTenant, // Super admin uses requested tenant
    });

    return { token, user: safeUser(user) };
}

/**
 * Resolve a user from a decoded JWT payload (attached by auth middleware).
 *
 * @param {{ sub: string }} jwtPayload
 * @returns {object}
 */
async function getUserById(jwtPayload) {
    for (const user of _users.values()) {
        if (user.id === jwtPayload.sub) return safeUser(user);
    }
    throw ApiError.unauthorized("User no longer exists");
}

module.exports = { loginUser, getUserById };
