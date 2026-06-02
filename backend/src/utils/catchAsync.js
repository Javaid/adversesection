"use strict";

/**
 * Wraps an async route handler so any rejected promise is forwarded to
 * Express's next(err) without needing try/catch in every controller.
 *
 * Usage:
 *   router.post("/login", catchAsync(authController.login));
 *
 * @param {Function} fn - async (req, res, next) => {}
 * @returns {Function}
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
