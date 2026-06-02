"use strict";

const { body } = require("express-validator");

/**
 * Validation rules for POST /auth/login
 */
const loginValidation = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 2, max: 64 }).withMessage("Username must be 2–64 characters"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 1, max: 128 }).withMessage("Password must be 1–128 characters"),
];

module.exports = { loginValidation };
