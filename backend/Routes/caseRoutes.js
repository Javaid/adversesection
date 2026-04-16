const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authmiddleware");
const {
    createCase,
    getCaseById,
    listCases,
    updateCaseStatus,
    assignCase,
    addCaseNote,
    getCaseSla,
    getCaseHistory,
} = require("../controllers/caseController");

router.use(authMiddleware);

router.post("/", createCase);
router.get("/", listCases);
router.get("/:caseId", getCaseById);
router.patch("/:caseId/status", updateCaseStatus);
router.patch("/:caseId/assignee", assignCase);
router.post("/:caseId/notes", addCaseNote);
router.get("/:caseId/sla", getCaseSla);
router.get("/:caseId/history", getCaseHistory);

module.exports = router;
