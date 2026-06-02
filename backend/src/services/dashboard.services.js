"use strict";

const { Providerss } = require("../models");

const getDashboardStats = async (companyId) => {
    // CRITICAL: Validate companyId exists (must check null/undefined, not just falsy!)
    if (companyId === null || companyId === undefined) {
        throw new Error("Company ID is required. Authentication error: company not identified");
    }

    const whereClause = companyId === 0 ? {} : { companyId: Number(companyId) };

    const [total, clear, highRisk, medRisk] = await Promise.all([
        Providerss.count({ where: whereClause }),
        Providerss.count({ where: { ...whereClause, risk_level: "Clear" } }),
        Providerss.count({ where: { ...whereClause, risk_level: "HIGH" } }),
        Providerss.count({ where: { ...whereClause, risk_level: ["MEDIUM", "LOW"] } }),
    ]);

    return {
        totalProviders: Number(total ?? 0),
        clearProviders: Number(clear ?? 0),
        underReviewProviders: Number(medRisk ?? 0),
        atRiskProviders: Number(highRisk ?? 0),
    };
};

module.exports = { getDashboardStats };