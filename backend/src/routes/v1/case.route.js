"use strict";

const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/auth");
const { tenantValidation } = require("../../middleware/tenantValidation");
const {
    createCase,
    getCaseById,
    listCases,
    updateCaseStatus,
    assignCase,
    addCaseNote,
    getCaseSla,
    getCaseHistory,
} = require("../../controllers/case/case.controller");

router.use(authenticate);
router.use(tenantValidation());

router.post("/", createCase);
router.get("/", listCases);
router.get("/:caseId", getCaseById);
router.patch("/:caseId/status", updateCaseStatus);
router.patch("/:caseId/assignee", assignCase);
router.post("/:caseId/notes", addCaseNote);
router.get("/:caseId/sla", getCaseSla);
router.get("/:caseId/history", getCaseHistory);

module.exports = router;
