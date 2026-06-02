#!/usr/bin/env node

/**
 * QUICK TEST - Direct API Testing
 * 
 * Simple verification of multi-tenant functionality
 * Run: node QUICK_TEST.js
 */

const BASE_URL = process.env.API_URL || "http://localhost:5000";
const API = `${BASE_URL}/api/v1`;

// Colors for output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

function log(type, msg) {
    const prefix = {
        success: `${colors.green}✅${colors.reset}`,
        error: `${colors.red}❌${colors.reset}`,
        info: `${colors.blue}ℹ️ ${colors.reset}`,
        section: `${colors.cyan}`,
    };
    
    if (type === "section") {
        console.log(`\n${prefix[type]}${"=".repeat(60)}\n${msg}\n${"=".repeat(60)}${colors.reset}\n`);
    } else {
        console.log(`${prefix[type]} ${msg}`);
    }
}

/**
 * Make API calls
 */
async function apiCall(method, endpoint, body, token) {
    const url = `${API}${endpoint}`;
    const headers = { "Content-Type": "application/json" };
    
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        
        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
    } catch (err) {
        return { ok: false, status: 0, error: err.message };
    }
}

/**
 * Decode JWT to see payload
 */
function decodeJWT(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
        return payload;
    } catch {
        return null;
    }
}

/**
 * TEST 1: Login with different users
 */
async function testLogin() {
    log("section", "TEST 1: Login & JWT Verification");
    
    const users = [
        { username: "admin", password: "admin", label: "Super Admin" },
        { username: "user", password: "user", label: "Naviquis (original user)" },
        { username: "zigron_admin", password: "zigron_admin", label: "Zigron Admin" },
        { username: "naviquis_admin", password: "naviquis_admin", label: "Naviquis Admin" },
    ];
    
    const tokens = {};
    
    for (const user of users) {
        log("info", `Logging in as ${user.label} (${user.username})...`);
        
        const res = await apiCall("POST", "/auth/login", {
            username: user.username,
            password: user.password,
        });
        
        if (!res.ok) {
            log("error", `Login failed: ${res.status} - ${res.data?.message || res.data?.errors?.[0]?.msg}`);
            continue;
        }
        
        const { token, user: userData } = res.data.data;
        tokens[user.username] = token;
        
        // Decode JWT
        const payload = decodeJWT(token);
        
        if (payload) {
            log("success", `${user.label}:`);
            console.log(`   Username: ${payload.username}`);
            console.log(`   Role: ${payload.role}`);
            console.log(`   CompanyId: ${payload.companyId}`);
            console.log(`   Token: ${token.substring(0, 20)}...`);
        }
    }
    
    return tokens;
}

/**
 * TEST 2: Fetch providers with different users
 */
async function testProviders(tokens) {
    log("section", "TEST 2: Provider Visibility (Company-Specific)");
    
    const userTests = [
        { username: "admin", label: "Super Admin (should see all)" },
        { username: "user", label: "Naviquis user (should see only companyId=2)" },
        { username: "zigron_admin", label: "Zigron admin (should see only companyId=1)" },
    ];
    
    for (const test of userTests) {
        const token = tokens[test.username];
        if (!token) {
            log("error", `${test.label}: No token available`);
            continue;
        }
        
        log("info", `Fetching providers as ${test.label}...`);
        
        const res = await apiCall("GET", "/providers/all?page=1&limit=5", null, token);
        
        if (!res.ok) {
            log("error", `Failed to fetch providers: ${res.status}`);
            continue;
        }
        
        const { data: providers, total } = res.data.data;
        
        if (!providers || providers.length === 0) {
            log("info", `${test.label}: No providers returned (total: ${total})`);
            continue;
        }
        
        log("success", `${test.label}: Found ${total} providers`);
        
        // Check company IDs
        const companyIds = new Set(providers.map(p => p.companyId));
        console.log(`   Company IDs: ${[...companyIds].join(", ")}`);
        console.log(`   Sample providers:`);
        
        providers.slice(0, 3).forEach(p => {
            console.log(`     - NPI: ${p.npi}, Name: ${p.providerName}, CompanyId: ${p.companyId}`);
        });
    }
}

/**
 * TEST 3: Dashboard stats
 */
async function testDashboard(tokens) {
    log("section", "TEST 3: Dashboard Stats (Company-Specific)");
    
    const userTests = [
        { username: "admin", label: "Super Admin (should show all)" },
        { username: "user", label: "Naviquis user (should show only naviquis stats)" },
        { username: "zigron_admin", label: "Zigron admin (should show only zigron stats)" },
    ];
    
    const stats = {};
    
    for (const test of userTests) {
        const token = tokens[test.username];
        if (!token) {
            log("error", `${test.label}: No token available`);
            continue;
        }
        
        log("info", `Fetching stats for ${test.label}...`);
        
        const res = await apiCall("POST", "/dashboard/summary", {}, token);
        
        if (!res.ok) {
            log("error", `Failed to fetch stats: ${res.status}`);
            continue;
        }
        
        const dashStats = res.data.data.stats;
        stats[test.username] = dashStats;
        
        log("success", `${test.label}: Total=${dashStats.totalProviders}, Clear=${dashStats.clearProviders}, HighRisk=${dashStats.atRiskProviders}`);
    }
    
    // Check if stats are different for different users
    const userStats = stats["user"]?.totalProviders || 0;
    const zigronStats = stats["zigron_admin"]?.totalProviders || 0;
    
    if (userStats !== zigronStats && userStats > 0 && zigronStats > 0) {
        log("success", `✅ Stats are properly isolated (Naviquis: ${userStats}, Zigron: ${zigronStats})`);
    } else if (userStats === 0 || zigronStats === 0) {
        log("info", `Could not verify stats isolation - one company has no providers`);
    }
}

/**
 * Main
 */
async function main() {
    log("section", `QUICK MULTI-TENANT TEST\nAPI: ${API}`);
    
    console.log("Testing multi-tenant functionality...\n");
    
    try {
        // Test 1: Login
        const tokens = await testLogin();
        
        if (Object.keys(tokens).length === 0) {
            log("error", "No successful logins - cannot continue tests");
            process.exit(1);
        }
        
        // Test 2: Providers
        await testProviders(tokens);
        
        // Test 3: Dashboard
        await testDashboard(tokens);
        
        log("section", "TESTS COMPLETED");
        console.log(`
Interpretation:
✅ = Feature working as expected
ℹ️  = Information or warning
❌ = Error or issue found

If you see different company IDs for different users and different stats,
the multi-tenant system is working correctly!
        `);
    } catch (error) {
        log("error", `Test failed: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
}

main().catch(console.error);
