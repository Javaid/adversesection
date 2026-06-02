"use strict";

const { body } = require("express-validator");

const providerSearchValidation = [
    body("query")
        .trim()
        .notEmpty().withMessage("Search query is required")
        .isLength({ min: 2, max: 120 }).withMessage("Search query must be 2-120 characters"),

    body("limit")
        .optional()
        .isInt({ min: 1, max: 20 }).withMessage("Limit must be between 1 and 20")
        .toInt(),
];

module.exports = {
    providerSearchValidation,
};
