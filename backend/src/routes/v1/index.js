"use strict";

const { Router } = require("express");
const authRoutes = require("./auth.routes");
const dashboardRoutes = require("./dashboard.routes");
const providerRoutes = require("./provider.routes");
const tenantRoutes = require("./tenant.routes");
const caseRoutes = require("./case.route");
const doctorRoutes = require("./doctor.route");
const userRoutes = require("./user.route");
const providerssRoutes = require("./providerss.route");
const statsRoutes = require("./stats.route");

const router = Router();

router.use("/tenant", tenantRoutes);
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/providers/search", providerRoutes);
router.use("/providerss", providerssRoutes);
router.use("/stats", statsRoutes);
router.use("/cases", caseRoutes);
router.use("/doctors", doctorRoutes);
router.use("/users", userRoutes);

module.exports = router;
