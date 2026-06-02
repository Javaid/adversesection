"use strict";

const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

/**
 * Run after express-validator chain.
 * If there are validation errors, collects them and throws a 400 ApiError.
 *
 * Usage:
 *   router.post("/login", [...validatorRules], validate, controller.login);
 */
const validate = (req, _res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formatted = errors.array().map(({ path, msg }) => ({ field: path, message: msg }));
        throw ApiError.badRequest("Validation failed", formatted);
    }
    next();
};

module.exports = validate;
