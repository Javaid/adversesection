"use strict";

const ApiError = require("../utils/ApiError");

const NPI_REGISTRY_BASE_URL = "https://npiregistry.cms.hhs.gov/api/";

function parseSearchQuery(query) {
    const trimmed = String(query || "").trim();
    const normalized = trimmed.replace(/\s+/g, " ");

    // NPI numbers are 10 digits.
    if (/^\d{10}$/.test(normalized)) {
        return { number: normalized };
    }

    const parts = normalized.split(" ");
    if (parts.length >= 2) {
        return {
            first_name: parts.slice(0, -1).join(" "),
            last_name: parts[parts.length - 1],
        };
    }

    // Single-token input can match either person or organization.
    return {
        first_name: normalized,
        organization_name: normalized,
    };
}

function mapProviderResult(item) {
    const basic = item?.basic || {};
    const firstName = basic.first_name || "";
    const lastName = basic.last_name || "";
    const orgName = basic.organization_name || "";

    const fullName = `${firstName} ${lastName}`.trim() || orgName || "Unknown provider";

    const primaryTaxonomy = item?.taxonomies?.find((taxonomy) => taxonomy?.primary) || item?.taxonomies?.[0] || null;
    const practiceAddress = item?.addresses?.find((addr) => addr?.address_purpose === "LOCATION") || item?.addresses?.[0] || null;

    return {
        npi: item?.number ? String(item.number) : "",
        name: fullName,
        providerType: item?.enumeration_type || "",
        credential: basic.credential || "",
        organizationName: orgName,
        taxonomy: primaryTaxonomy?.desc || "",
        state: practiceAddress?.state || "",
        city: practiceAddress?.city || "",
        status: basic.status || "",
    };
}

async function searchProviders({ query, limit = 10 }) {
    const searchParams = new URLSearchParams({
        version: "2.1",
        limit: String(limit),
    });

    const queryParts = parseSearchQuery(query);
    Object.entries(queryParts).forEach(([key, value]) => {
        if (value) searchParams.set(key, value);
    });

    const response = await fetch(`${NPI_REGISTRY_BASE_URL}?${searchParams.toString()}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        throw ApiError.internal("Provider search failed. Please try again.");
    }

    const payload = await response.json();
    const results = Array.isArray(payload?.results) ? payload.results : [];

    return {
        total: Number(payload?.result_count || results.length || 0),
        providers: results.map(mapProviderResult),
    };
}

module.exports = {
    searchProviders,
};
