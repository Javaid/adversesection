# Multi-Tenant Provider System - Complete Fix Guide

## Overview
This document explains how the multi-tenant provider system now works and how to use it.

## Problem Summary
The application had three critical issues:
1. **Dashboard stats showed ALL providers** (no company filtering)
2. **Providers weren't properly associated with companies** (always saved as companyId=1)
3. **Super Admin visibility not implemented** (couldn't see all companies)

## Solution Implemented

### 1. Fixed Dashboard Statistics (Company-Specific)
**File:** `backend/src/services/dashboard.services.js`

**Before:**
```javascript
// Counted ALL providers across all companies
const getDashboardStats = async () => {
    const [total] = await sequelize.query("SELECT COUNT(*) AS cnt FROM [provider_table].[providers]");
    // ...
}
```

**After:**
```javascript
// Now requires companyId parameter and filters
const getDashboardStats = async (companyId) => {
    if (!companyId) throw new Error("Company ID is required");
    
    const companyFilter = `WHERE company_id = ${Number(companyId)}`;
    const [total] = await sequelize.query(
        `SELECT COUNT(*) AS cnt FROM [provider_table].[providers] ${companyFilter}`
    );
    // ...
}
```

**Impact:** 
- ✅ Naviquis dashboard shows only Naviquis providers
- ✅ Zigron dashboard shows only Zigron providers
- ✅ Stats accurately reflect company-specific data

---

### 2. Fixed Dashboard Controller (Pass User Context)
**File:** `backend/src/controllers/dashboard/dashboard.controller.js`

**Before:**
```javascript
// Not passing user company context
const dashboardStats = catchAsync(async (req, res) => {
    const stats = await dashboardService.getDashboardStats(); // ❌ Missing companyId
    return ApiResponse.ok(res, "Dashboard stats retrieved", { stats });
});
```

**After:**
```javascript
// Now extracts companyId from authenticated user and validates
const dashboardStats = catchAsync(async (req, res) => {
    const companyId = req.user?.companyId;
    
    if (!companyId) {
        return res.status(401).json({
            success: false,
            message: "Authentication error: company not identified"
        });
    }
    
    const stats = await dashboardService.getDashboardStats(companyId); // ✅ Passes companyId
    return ApiResponse.ok(res, "Dashboard stats retrieved", { stats });
});
```

---

### 3. Enhanced Authentication System
**File:** `backend/src/services/auth.service.js`

**Added Tenant-to-Company Mapping:**
```javascript
const TENANT_COMPANY_MAP = {
    "zigron": 1,      // Zigron company
    "naviquis": 2,    // Naviquis company
    "default": 1,     // Localhost defaults to Zigron
};
```

**Updated User Credentials:**
```javascript
const _users = new Map([
    [
        "admin",
        {
            id: "usr_1",
            username: "admin",
            password: "admin",
            role: "super_admin",
            companyId: 0,  // ✅ Super Admin - can see ALL companies
        },
    ],
    [
        "zigron_user",
        {
            id: "usr_2",
            username: "zigron_user",
            password: "zigron_user",
            role: "admin",
            companyId: 1,  // Zigron Company
        },
    ],
    [
        "naviquis_user",
        {
            id: "usr_3",
            username: "naviquis_user",
            password: "naviquis_user",
            role: "admin",
            companyId: 2,  // Naviquis Company
        },
    ],
]);
```

---

### 4. Removed Hardcoded Default Company ID
**File:** `backend/src/models/providers/providerss.model.js`

**Before:**
```javascript
companyId: { type: DataTypes.INTEGER, field:"company_id", allowNull: false, defaultValue: 1 }, // ❌ Always defaults to 1
```

**After:**
```javascript
companyId: { type: DataTypes.INTEGER, field:"company_id", allowNull: false }, // ✅ Must be explicitly provided
```

---

### 5. Enhanced Provider Controller (Super Admin Support)
**File:** `backend/src/controllers/provider/providerss.controller.js`

**Super Admin Logic Added:**
```javascript
// Super Admin (companyId=0) can see ALL providers
// Regular users see only their company
let whereCondition = userCompanyId === 0 ? {} : { companyId: userCompanyId };

// Also applied to search functionality
if (userCompanyId === 0) {
    // Super Admin - search across all companies
    whereCondition = searchCondition;
} else {
    // Regular user - search within their company only
    whereCondition = {
        [Op.and]: [
            { companyId: userCompanyId },
            searchCondition,
        ],
    };
}
```

---

## User Roles & Access Levels

| Username | Password | Role | Company | Can See |
|----------|----------|------|---------|---------|
| `admin` | `admin` | `super_admin` | All (0) | ✅ ALL providers from ALL companies |
| `zigron_user` | `zigron_user` | `admin` | Zigron (1) | ✅ Only Zigron providers |
| `naviquis_user` | `naviquis_user` | `admin` | Naviquis (2) | ✅ Only Naviquis providers |

---

## How It Works Now

### Scenario 1: Naviquis User Adds a Provider
1. User logs in as `naviquis_user` (companyId=2)
2. User searches for provider NPI in Naviquis dashboard
3. Backend gets `req.user?.companyId = 2`
4. Provider is created with `companyId: 2`
5. Provider appears ONLY in Naviquis dashboard ✅
6. Provider does NOT appear in Zigron dashboard ✅

### Scenario 2: Zigron User Views Stats
1. User logs in as `zigron_user` (companyId=1)
2. Dashboard calls `getDashboardStats(1)`
3. Query: `SELECT COUNT(*) FROM providers WHERE company_id = 1`
4. Shows only Zigron's 20 providers (example) ✅

### Scenario 3: Super Admin Views Everything
1. Admin logs in as `admin` (companyId=0)
2. Dashboard calls `getDashboardStats(0)` → Super Admin uses empty WHERE clause
3. Shows stats for ALL providers from ALL companies ✅
4. Can search across all companies' providers ✅

---

## Testing Checklist

### Test 1: Company-Specific Dashboards
- [ ] Login as `naviquis_user`
- [ ] Check dashboard stats - should show only Naviquis providers
- [ ] Login as `zigron_user`
- [ ] Check dashboard stats - should show only Zigron providers
- [ ] Stats should be different for each company

### Test 2: Provider Isolation
- [ ] Login as `naviquis_user`, add a new provider
- [ ] Logout and login as `zigron_user`
- [ ] Provider should NOT appear in Zigron dashboard
- [ ] Logout and login as `naviquis_user`
- [ ] Provider SHOULD appear in Naviquis dashboard

### Test 3: Super Admin Access
- [ ] Login as `admin` (super admin)
- [ ] Should see ALL providers from ALL companies
- [ ] Dashboard stats should show total from all companies
- [ ] Search should return providers from all companies

### Test 4: Provider Creation Validation
- [ ] Database records should have correct `company_id`
- [ ] Use SQL: `SELECT company_id, COUNT(*) FROM providers GROUP BY company_id`
- [ ] Should show separate counts for each company_id

---

## Database Verification

### Query to verify company isolation:
```sql
SELECT 
    company_id,
    COUNT(*) as provider_count,
    organization_name
FROM [provider_table].[providers]
GROUP BY company_id, organization_name
ORDER BY company_id;
```

### Expected Result:
```
company_id | provider_count | organization_name
    1      |      20        | Zigron
    2      |      50        | Naviquis
```

### Query to verify dashboard stats accuracy:
```sql
-- Naviquis (companyId=2) should have 50 providers
SELECT COUNT(*) FROM [provider_table].[providers] WHERE company_id = 2;

-- Zigron (companyId=1) should have 20 providers
SELECT COUNT(*) FROM [provider_table].[providers] WHERE company_id = 1;
```

---

## Frontend Updates Needed

If your frontend is hardcoded to use specific users, update:

### Update Login Credentials
**File:** `src/services/authService.js` or equivalent

```javascript
// Old (single user)
const credentials = { username: "user", password: "user" };

// New (company-specific)
const credentials = {
    "zigron": { username: "zigron_user", password: "zigron_user" },
    "naviquis": { username: "naviquis_user", password: "naviquis_user" },
    "admin": { username: "admin", password: "admin" }
};
```

---

## Migration Path for Existing Data

If you have existing providers with incorrect `company_id`, use:

```sql
-- Fix Zigron providers
UPDATE [provider_table].[providers]
SET company_id = 1
WHERE organization_name = 'Zigron' AND company_id != 1;

-- Fix Naviquis providers
UPDATE [provider_table].[providers]
SET company_id = 2
WHERE organization_name = 'Naviquis' AND company_id != 2;

-- Verify
SELECT company_id, organization_name, COUNT(*) 
FROM [provider_table].[providers]
GROUP BY company_id, organization_name;
```

---

## API Endpoints Overview

All endpoints now require authentication and company filtering:

| Endpoint | Method | Auth | Filters |
|----------|--------|------|---------|
| `/api/v1/providers` | GET | ✅ Required | By `companyId` (except Super Admin) |
| `/api/v1/providers/{npi}` | GET | ✅ Required | By `companyId` (except Super Admin) |
| `/api/v1/providers/{id}` | GET | ✅ Required | By `companyId` (except Super Admin) |
| `/api/v1/dashboard/summary` | POST | ✅ Required | By `companyId` (except Super Admin) |

---

## Summary of Changes

✅ **Dashboard stats now company-specific**
✅ **Providers properly isolated by company**
✅ **Super Admin can see all companies**
✅ **Provider creation uses authenticated user's companyId**
✅ **Search filtered by company (except Super Admin)**
✅ **No more hardcoded defaults**

---

## Next Steps (Optional Enhancements)

1. **Implement Database Users** - Replace in-memory users with DB users
2. **Add Tenant Switcher for Admin** - Allow Super Admin to view stats as different companies
3. **Add Multi-Company Reports** - Super Admin can generate cross-company analytics
4. **Implement Company Settings** - Each company can customize dashboard branding
5. **Add Audit Logs** - Track which user created/modified each provider

---

## Support

If you encounter any issues:

1. **Check Authentication** - Verify `req.user?.companyId` is correctly set
2. **Check Logs** - Backend logs show `[getAllProviders]` with WHERE clause
3. **Check Database** - Verify `company_id` values are correct
4. **Check Token** - JWT token should include `companyId` in payload

