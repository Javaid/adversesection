/**
 * MULTI-TENANT TESTING SCRIPT
 * 
 * This script helps you test all the multi-tenant fixes
 * Run after deploying the fixes to verify everything works
 * 
 * Prerequisites:
 * - Backend server running on http://localhost:5000
 * - Update the BASE_URL and API_URL if your server is running elsewhere
 */

const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/v1`;

// Color codes for console output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    section: (msg) => console.log(`\n${colors.cyan}${"=".repeat(60)}\n${msg}\n${"=".repeat(60)}${colors.reset}\n`),
};

// Test user credentials
const users = {
    zigron: {
        username: "zigron_user",
        password: "zigron_user",
        expectedCompanyId: 1,
        expectedCompanyName: "Zigron",
    },
    naviquis: {
        username: "naviquis_user",
        password: "naviquis_user",
        expectedCompanyId: 2,
        expectedCompanyName: "Naviquis",
    },
    admin: {
        username: "admin",
        password: "admin",
        expectedCompanyId: 0,
        expectedCompanyName: "Super Admin (All Companies)",
    },
};

/**
 * Helper function to make API requests
 */
async function apiCall(method, endpoint, body = null, token = null) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    } catch (error) {
        return {
            ok: false,
            status: 0,
            error: error.message,
        };
    }
}

/**
 * TEST 1: Verify login creates correct company context
 */
async function testLogin() {
    log.section("TEST 1: Verify Login & Company Context");

    for (const [company, user] of Object.entries(users)) {
        log.info(`Testing login for ${company} (${user.username})`);

        const response = await apiCall("POST", "/auth/login", {
            username: user.username,
            password: user.password,
        });

        if (!response.ok) {
            log.error(`Login failed for ${company}: ${response.data?.message}`);
            continue;
        }

        const { token, user: userData } = response.data.data;

        if (!token) {
            log.error(`No token received for ${company}`);
            continue;
        }

        // Decode JWT to check companyId
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
            log.error(`Invalid token format for ${company}`);
            continue;
        }

        try {
            const decodedPayload = JSON.parse(
                Buffer.from(tokenParts[1], "base64").toString()
            );

            if (decodedPayload.companyId === user.expectedCompanyId) {
                log.success(
                    `${company}: JWT contains correct companyId (${user.expectedCompanyId})`
                );
            } else {
                log.error(
                    `${company}: JWT has wrong companyId (${decodedPayload.companyId} vs expected ${user.expectedCompanyId})`
                );
            }
        } catch (e) {
            log.warn(`Could not decode JWT for ${company}: ${e.message}`);
        }

        // Store token for next tests
        users[company].token = token;
    }
}

/**
 * TEST 2: Verify dashboard stats are company-specific
 */
async function testDashboardStats() {
    log.section("TEST 2: Verify Dashboard Stats (Company-Specific)");

    const statsPerCompany = {};

    for (const [company, user] of Object.entries(users)) {
        if (!user.token) {
            log.warn(`Skipping ${company} - no token available`);
            continue;
        }

        log.info(`Fetching dashboard stats for ${company}...`);

        const response = await apiCall(
            "POST",
            "/dashboard/summary",
            {},
            user.token
        );

        if (!response.ok) {
            log.error(
                `Failed to fetch stats for ${company}: ${response.data?.message}`
            );
            continue;
        }

        const stats = response.data.data.stats;
        statsPerCompany[company] = stats;

        log.success(`${company} Stats Retrieved:`);
        console.log(`   Total Providers: ${stats.totalProviders}`);
        console.log(`   Clear: ${stats.clearProviders}`);
        console.log(`   Under Review: ${stats.underReviewProviders}`);
        console.log(`   At Risk: ${stats.atRiskProviders}`);
    }

    // Verify that company stats are different
    const zigronTotal = statsPerCompany.zigron?.totalProviders || 0;
    const naviquistotal = statsPerCompany.naviquis?.totalProviders || 0;
    const adminTotal = statsPerCompany.admin?.totalProviders || 0;

    if (zigronTotal !== naviquistotal) {
        log.success(
            `✅ Dashboard stats are company-specific (Zigron: ${zigronTotal}, Naviquis: ${naviquistotal})`
        );
    } else if (zigronTotal === 0 || naviquistotal === 0) {
        log.warn(
            `Could not verify separation - one or both companies have 0 providers`
        );
    } else {
        log.error(
            `Dashboard stats are NOT separated (both show ${zigronTotal})`
        );
    }

    if (adminTotal >= Math.max(zigronTotal, naviquistotal)) {
        log.success(
            `✅ Super Admin sees all providers (Total: ${adminTotal})`
        );
    } else {
        log.warn(
            `Admin total (${adminTotal}) is less than expected (should be >= ${Math.max(
                zigronTotal,
                naviquistotal
            )})`
        );
    }
}

/**
 * TEST 3: Verify provider list is company-specific
 */
async function testProviderList() {
    log.section("TEST 3: Verify Provider List (Company-Specific)");

    const providersPerCompany = {};

    for (const [company, user] of Object.entries(users)) {
        if (!user.token) {
            log.warn(`Skipping ${company} - no token available`);
            continue;
        }

        log.info(`Fetching providers for ${company}...`);

        const response = await apiCall(
            "GET",
            "/providers/all?page=1&limit=5",
            null,
            user.token
        );

        if (!response.ok) {
            log.error(
                `Failed to fetch providers for ${company}: ${response.status}`
            );
            continue;
        }

        const { data: providers, total } = response.data.data;

        providersPerCompany[company] = {
            count: providers.length,
            total,
            providers: providers.map((p) => ({
                npi: p.npi,
                name: p.providerName,
                company: p.companyId,
            })),
        };

        log.success(`${company}: Found ${total} providers (showing ${providers.length})`);

        // Check all providers have correct companyId
        const allCorrect = providers.every(
            (p) => p.companyId === user.expectedCompanyId
        );

        if (allCorrect || user.expectedCompanyId === 0) {
            log.success(`   All providers have correct companyId`);
        } else {
            log.error(
                `   ERROR: Found providers with wrong companyId: ${providers
                    .filter((p) => p.companyId !== user.expectedCompanyId)
                    .map((p) => `${p.npi} (company ${p.companyId})`)
                    .join(", ")}`
            );
        }
    }

    // Verify company isolation
    const zigronCompanies = providersPerCompany.zigron?.providers.map(
        (p) => p.company
    ) || [];
    const naviquiesCompanies = providersPerCompany.naviquis?.providers.map(
        (p) => p.company
    ) || [];

    if (
        zigronCompanies.every((c) => c === 1) &&
        naviquiesCompanies.every((c) => c === 2)
    ) {
        log.success(`✅ Provider lists are properly isolated by company`);
    } else {
        log.error(`❌ Provider lists are NOT properly isolated`);
    }
}

/**
 * TEST 4: Verify Super Admin sees all companies
 */
async function testSuperAdminAccess() {
    log.section("TEST 4: Verify Super Admin Access");

    const adminUser = users.admin;
    if (!adminUser.token) {
        log.warn(`Skipping - admin token not available`);
        return;
    }

    log.info(`Fetching all providers as Super Admin...`);

    const response = await apiCall(
        "GET",
        "/providers/all?page=1&limit=100",
        null,
        adminUser.token
    );

    if (!response.ok) {
        log.error(`Failed to fetch providers as admin: ${response.status}`);
        return;
    }

    const { data: providers, total } = response.data.data;

    // Check if admin sees multiple company IDs
    const uniqueCompanies = new Set(providers.map((p) => p.companyId));

    if (uniqueCompanies.size > 1) {
        log.success(
            `✅ Super Admin sees providers from multiple companies: ${Array.from(
                uniqueCompanies
            ).join(", ")}`
        );
    } else if (uniqueCompanies.size === 1 && total > 0) {
        log.warn(
            `⚠️  Super Admin fetched ${total} providers but only from company ${[
                ...uniqueCompanies,
            ][0]}`
        );
    }
}

/**
 * TEST 5: Verify provider creation assigns correct company
 */
async function testProviderCreation() {
    log.section("TEST 5: Test Provider Creation (Optional)");

    log.warn(`
This test requires searching for a provider NPI and adding it.
To manually test:

1. Login as zigron_user
2. Search for provider NPI (e.g., 1234567890)
3. Check database: SELECT npi, company_id FROM providers WHERE npi = 1234567890
4. Should show company_id = 1

5. Logout and login as naviquis_user
6. Search for different provider NPI
7. Check database: should show company_id = 2

You can also check backend logs for messages like:
[getAllProviders] Page 1, Limit 10, Where: {"companyId":1}
    `);
}

/**
 * MAIN TEST RUNNER
 */
async function runAllTests() {
    log.section("MULTI-TENANT SYSTEM TEST SUITE");

    console.log(`Testing API at: ${API_URL}\n`);

    try {
        // Run tests in sequence
        await testLogin();
        await testDashboardStats();
        await testProviderList();
        await testSuperAdminAccess();
        await testProviderCreation();

        log.section("TESTS COMPLETED");
        console.log(`
Summary:
✅ = Passed
❌ = Failed
⚠️  = Warning (needs review)

If all tests show ✅, the multi-tenant system is working correctly!
        `);
    } catch (error) {
        log.error(`Test suite failed: ${error.message}`);
        console.error(error);
    }
}

// Run tests
runAllTests();
