const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authmiddleware");
const { search, stats, providersList } = require("../controllers/authController");

router.get("/search", authMiddleware, search);
router.get("/stats", authMiddleware, stats);
router.get("/providersList", authMiddleware, providersList);

module.exports = router;
