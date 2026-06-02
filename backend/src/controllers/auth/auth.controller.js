"use strict";

const { StatusCodes } = require("http-status-codes");
const authService = require("../../services/auth.service");
const ApiResponse = require("../../utils/ApiResponse");
const catchAsync = require("../../utils/catchAsync");

/**
 * POST /api/v1/auth/login
 *
 * Body: { username: string, password: string, tenant: string (optional) }
 * Returns: { token: string, user: object }
 * 
 * Enforces tenant-based security:
 * - Validates user's tenant assignment matches requested tenant
 * - Super admin can access all tenants
 * - Includes tenant in JWT token
 */
const login = catchAsync(async (req, res) => {
    const { username, password, tenant = "default" } = req.body;
    const result = await authService.loginUser(username, password, tenant);
    return ApiResponse.ok(res, "Login successful", result);
});

/**
 * GET /api/v1/auth/me  (protected)
 *
 * Returns the authenticated user's profile derived from the JWT payload.
 */
const getMe = catchAsync(async (req, res) => {
    const user = await authService.getUserById(req.user);
    return ApiResponse.ok(res, "User profile retrieved", { user });
});

/**
 * POST /api/v1/auth/logout  (protected)
 *
 * Stateless JWT logout — the client discards its token.
 * Extend with a token-blocklist (Redis) if you need server-side invalidation.
 */
const logout = catchAsync(async (_req, res) => {
    return ApiResponse.ok(res, "Logged out successfully");
});

module.exports = { login, getMe, logout };
