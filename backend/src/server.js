"use strict";

const app = require("./app");
const config = require("./config");
const { connectDatabase, closeDatabase } = require("./config/database");
let server;
let isShuttingDown = false;

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n[SERVER] ${signal} received — shutting down gracefully`);
    if (server) {
        server.close(async () => {
            console.log("[SERVER] HTTP server closed");
            await closeDatabase();
            process.exit(0);
        });
    } else {
        await closeDatabase();
        process.exit(0);
    }

    // Force exit if connections linger beyond 10 s
    setTimeout(() => {
        console.error("[SERVER] Forcing shutdown after timeout");
        process.exit(1);
    }, 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
    console.error("[SERVER] Unhandled rejection:", reason);
    shutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (err) => {
    console.error("[SERVER] Uncaught exception:", err);
    shutdown("UNCAUGHT_EXCEPTION");
});

async function bootstrap() {
    try {
        await connectDatabase();

       const db = require("./models");
    db.applyAssociations();

        server = app.listen(config.port, () => {
            console.log(
                `[SERVER] Running in ${config.env} mode on http://localhost:${config.port}`
            );
            console.log(`[SERVER] Health check → http://localhost:${config.port}/health`);
            console.log(
                `[SERVER] API base    → http://localhost:${config.port}/api/v1`
            );
        });
    } catch (error) {
        console.error("[SERVER] Failed to bootstrap:", error);
        process.exit(1);
    }
}

bootstrap();

module.exports = { bootstrap };
