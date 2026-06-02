const express = require("express");
const router = express.Router();
const Providerss = require("../../models/providers/providerss.model");
const { authenticate } = require("../../middleware/auth");
const { tenantValidation } = require("../../middleware/tenantValidation");

router.get("/", authenticate, tenantValidation(), async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    // Validate companyId exists (must check null/undefined, not just falsy!)
    if (companyId === null || companyId === undefined) {
      return res.status(401).json({
        success: false,
        message: "Authentication error: company not identified",
      });
    }

    // Build WHERE clause for company filtering
    // Super Admin (companyId=0) sees all, others see only their company
    const whereClause = companyId === 0 ? {} : { company_id: companyId };

    const totalProviders = await Providerss.count({ where: whereClause });
    const clear = await Providerss.count({ where: { ...whereClause, risk_level: "Clear" } });
    const underReview = await Providerss.count({ where: { ...whereClause, risk_level: ["MEDIUM", "LOW"] } });
    const atRisk = await Providerss.count({ where: { ...whereClause, risk_level: "HIGH" } });
    res.json({ totalProviders, clear, underReview, atRisk });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ totalProviders: 0, clear: 0, underReview: 0, atRisk: 0 });
  }
});


module.exports = router;
