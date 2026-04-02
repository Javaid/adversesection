// backend/Routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const { createDoctor, reindexAllDoctors,searchDoctors } = require("../controllers/doctorController");
const client = require("../config/elasticSearch");
router.post("/create", createDoctor);

// Reindex all doctors manually
router.post("/reindex", reindexAllDoctors);
router.get("/search", searchDoctors);
module.exports = router;

