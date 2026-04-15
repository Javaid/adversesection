const express = require("express");
const router = express.Router();
const Providerss= require("../models/providerss.model"); 

router.get("/stats", async (req, res) => {
  try {
    const totalProviders = await Providerss.count();

    const clear = await Providerss.count({
      where: { risk_level: "Clear" }  
    });

    const underReview = await Providerss.count({
      where: { risk_level: "Under Review" }
    });

    const atRisk = await Providerss.count({
      where: { risk_level: "At Risk" }
    });

    res.json({ totalProviders, clear, underReview, atRisk });

  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ totalProviders: 0, clear: 0, underReview: 0, atRisk: 0 });
  }
});


module.exports = router;
