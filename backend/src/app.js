"use strict";

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const config = require("./config");
const routes = require("./routes");
const requestLogger = require("./middleware/requestLogger");
const { globalLimiter } = require("./middleware/rateLimiter");
const tenantService = require("./services/tenant.service");
const { authenticate } = require("./middleware/auth");
const { resolveTenant } = require("./middleware/tenant");

const errorHandler = require("./middleware/errorHandler");
const ApiError = require("./utils/ApiError");


const app = express();

app.set("trust proxy", 1);

// ── Security headers ─────────────────────────────────────────────────────────
app.use(
    helmet({
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    })
);

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow server-to-server requests (no origin) in development
            if (tenantService.isAllowedOrigin(origin)) return callback(null, true);
            callback(new Error(`CORS: origin '${origin}' not allowed`));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── Request logging ───────────────────────────────────────────────────────────
app.use(requestLogger);

// ── Global rate limiting ─────────────────────────────────────────────────────
app.use(globalLimiter);

// ── Health check (excluded from auth & rate limiting) ────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Dev-only debug endpoint for tenant host resolution ───────────────────────
if (config.env !== "production") {
    app.get("/debug/tenant-resolution", (req, res) => {
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
        const evaluatedHosts = uniqueCandidates.map((host) => {
            const tenant = tenantService.findTenantByHostname(host);
            return {
                host,
                matchedTenant: tenant ? tenant.slug : null,
            };
        });

        const resolved = evaluatedHosts.find((item) => item.matchedTenant);

        res.json({
            success: true,
            statusCode: 200,
            message: "Tenant resolution debug payload",
            data: {
                env: config.env,
                trustProxy: config.tenant.trustProxy,
                request: {
                    hostHeader: req.headers.host || null,
                    forwardedHostHeader: req.headers["x-forwarded-host"] || null,
                    hostname: req.hostname || null,
                    originalUrl: req.originalUrl,
                },
                evaluatedHosts,
                resolvedTenant: resolved ? resolved.matchedTenant : null,
            },
        });
    });
}


// ── Tenant resolution ─────────────────────────────────────────────────────────
app.use(resolveTenant);


 
// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api", routes);



// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, _res, next) => {
    next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`));
});

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
