"use strict";

const { Router } = require("express");
const authController = require("../../controllers/auth/auth.controller");
const { authenticate } = require("../../middleware/auth");
const { authLimiter } = require("../../middleware/rateLimiter");
const validate = require("../../middleware/validate");
const { loginValidation } = require("../../validators/auth.validator");

const router = Router();

/**
 * @route  POST /api/v1/auth/login
 * @desc   Authenticate user and receive a JWT
 * @access Public
 */
router.post(
    "/login",
    authLimiter,
    loginValidation,
    validate,
    authController.login
);

/**
 * @route  GET /api/v1/auth/me
 * @desc   Get the currently authenticated user's profile
 * @access Protected
 */
router.get("/me", authenticate, authController.getMe);

/**
 * @route  POST /api/v1/auth/logout
 * @desc   Invalidate session (client discards token)
 * @access Protected
 */
router.post("/logout", authenticate, authController.logout);

module.exports = router;
