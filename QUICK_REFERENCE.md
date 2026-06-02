# 📚 Quick Reference Guide - Multi-Tenant Provider System

## Quick Answer: What Changed?

**3 Problems Fixed:**
1. ✅ Dashboard stats filtered by company
2. ✅ Providers isolated by company
3. ✅ Super Admin can see all companies

**5 Files Modified:**
1. `dashboard.services.js` - Added company filtering
2. `dashboard.controller.js` - Pass user company context
3. `auth.service.js` - Added user roles
4. `providerss.model.js` - Removed hardcoded default
5. `providerss.controller.js` - Added Super Admin logic

---

## 🔐 Authentication & Access

### User Roles
```javascript
companyId: 0  → Super Admin → See ALL companies
companyId: 1  → Zigron Admin → See ONLY Zigron
companyId: 2  → Naviquis Admin → See ONLY Naviquis
```

### Login Credentials
| User | Pass | Type | Access |
|------|------|------|--------|
| admin | admin | Super Admin | ALL |
| zigron_user | zigron_user | Company Admin | Zigron (1) |
| naviquis_user | naviquis_user | Company Admin | Naviquis (2) |

### JWT Token Payload
```json
{
  "sub": "usr_1",
  "username": "admin",
  "role": "super_admin",
  "companyId": 0,
  "iat": 1234567890,
  "exp": 1234571490
}
```

---

## 🗂️ Database Schema

### Providers Table
```sql
CREATE TABLE [provider_table].[providers] (
    id INT PRIMARY KEY,
    npi VARCHAR(10) UNIQUE,
    providerName VARCHAR(255),
    organization_name VARCHAR(255),
    company_id INT NOT NULL,  -- KEY: Company assignment
    risk_level VARCHAR(50),
    ...
);

-- Indexes to add
CREATE INDEX idx_company_id ON [provider_table].[providers](company_id);
CREATE INDEX idx_npi_company ON [provider_table].[providers](npi, company_id);
```

### Query Examples
```sql
-- Get company-specific stats
SELECT COUNT(*) FROM providers WHERE company_id = 1;

-- Get provider for specific user
SELECT * FROM providers WHERE npi = '1234567890' AND company_id = 1;

-- Get all providers for company
SELECT * FROM providers WHERE company_id = 2;

-- Verify company distribution
SELECT company_id, COUNT(*) FROM providers GROUP BY company_id;
```

---

## 🔄 Request/Response Flow

### Provider Search (Zigron User)
```
1. Frontend: GET /api/v1/providers?search=doctor
   Headers: Authorization: Bearer <zigron_token>

2. Backend Auth Middleware:
   Extract token → Decode → req.user.companyId = 1

3. Provider Controller:
   whereCondition = { companyId: 1 }
   
4. Database Query:
   SELECT * FROM providers WHERE companyId = 1 AND providerName LIKE '%doctor%'

5. Response: Returns only Zigron providers
```

### Dashboard Stats (Super Admin)
```
1. Frontend: POST /api/v1/dashboard/summary
   Headers: Authorization: Bearer <admin_token>

2. Backend Auth Middleware:
   Extract token → Decode → req.user.companyId = 0

3. Dashboard Controller:
   companyFilter = req.user.companyId = 0

4. Dashboard Service:
   if (companyId === 0) → no WHERE clause (all companies)
   else → WHERE company_id = {companyId}

5. Database Queries:
   SELECT COUNT(*) FROM providers  (all companies)
   
6. Response: Returns combined stats from all companies
```

---

## 🔍 Code Snippets Reference

### Check User Company (In Any Controller)
```javascript
const userCompanyId = req.user?.companyId;

if (!userCompanyId && userCompanyId !== 0) {
    return res.status(401).json({ 
        success: false, 
        message: "Authentication error: company not identified" 
    });
}

// Super Admin check
if (userCompanyId === 0) {
    // Can see all companies
    whereClause = {}; // Empty = no filter
} else {
    // Regular user - only their company
    whereClause = { companyId: userCompanyId };
}
```

### Update Service to Support Multi-Tenant
```javascript
// BAD: Hardcoded company ID
async function getProviders() {
    return await Providerss.findAll({ where: { companyId: 1 } });
}

// GOOD: Pass company ID as parameter
async function getProviders(companyId) {
    if (!companyId && companyId !== 0) {
        throw new Error("Company ID required");
    }
    
    const whereClause = companyId === 0 ? {} : { companyId };
    return await Providerss.findAll({ where: whereClause });
}
```

### Create Provider with Correct Company
```javascript
// BAD: No company assignment
const provider = await Providerss.create({
    npi: data.number,
    providerName: data.name,
    // Missing: companyId
});

// GOOD: Use authenticated user's company
const companyId = req.user?.companyId;
if (!companyId) throw new Error("Company not identified");

const provider = await Providerss.create({
    npi: data.number,
    providerName: data.name,
    companyId: companyId  // ✅ Assigned from user
});
```

---

## 🧪 Testing Queries

### Verify Company Isolation
```bash
# Quick test from command line
curl -X GET "http://localhost:5000/api/v1/providers/all?page=1&limit=5" \
  -H "Authorization: Bearer <zigron_token>"

# Should return providers with companyId = 1 ONLY
```

### Check Dashboard Filtering
```bash
curl -X POST "http://localhost:5000/api/v1/dashboard/summary" \
  -H "Authorization: Bearer <naviquis_token>" \
  -H "Content-Type: application/json" \
  -d '{}'

# Should return stats for company_id = 2 ONLY
```

### SQL Verification
```sql
-- Verify count matches dashboard
SELECT COUNT(*) FROM providers WHERE company_id = 1;  -- Should match Zigron dashboard

SELECT COUNT(*) FROM providers WHERE company_id = 2;  -- Should match Naviquis dashboard

SELECT COUNT(*) FROM providers;  -- Should match Admin dashboard
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T: Forget to pass companyId to service
```javascript
// WRONG - Dashboard service called without company filter
const stats = await dashboardService.getDashboardStats();

// RIGHT - Pass company ID
const stats = await dashboardService.getDashboardStats(req.user?.companyId);
```

### ❌ DON'T: Hardcode company IDs
```javascript
// WRONG - Always limits to company 1
const providers = await Providerss.findAll({ where: { companyId: 1 } });

// RIGHT - Use authenticated user's company
const companyId = req.user?.companyId;
const providers = await Providerss.findAll({ where: { companyId } });
```

### ❌ DON'T: Forget Super Admin check
```javascript
// WRONG - Super Admin can't see other companies
let whereClause = { companyId: userCompanyId };

// RIGHT - Super Admin (0) sees all
let whereClause = userCompanyId === 0 ? {} : { companyId: userCompanyId };
```

### ❌ DON'T: Skip validation
```javascript
// WRONG - No validation
const companyId = req.user.companyId;  // Crashes if companyId is 0

// RIGHT - Check for null/undefined, allow 0
const companyId = req.user?.companyId;
if (companyId === null || companyId === undefined) {
    return res.status(401).json({ message: "Company not identified" });
}
```

---

## 📊 API Endpoints - Company Filtering

| Endpoint | Query | Filter Applied |
|----------|-------|-----------------|
| `GET /api/v1/providers/all` | `?page=1&limit=10` | `WHERE company_id = :companyId` (unless Super Admin) |
| `GET /api/v1/providers/:npi` | - | `WHERE npi = :npi AND company_id = :companyId` |
| `GET /api/v1/providers/:id` | - | `WHERE id = :id AND company_id = :companyId` |
| `POST /api/v1/dashboard/summary` | - | Stats WHERE company_id = :companyId |

All endpoints require valid JWT token with `companyId`.

---

## 🐛 Debugging Checklist

### If providers aren't showing up:
- [ ] Check `company_id` in database matches user's `companyId`
- [ ] Verify JWT token includes `companyId` field
- [ ] Check WHERE clause in SQL logs
- [ ] Verify user has correct role assigned

### If dashboard stats are wrong:
- [ ] Verify service is called with `companyId` parameter
- [ ] Check dashboard.services.js includes `companyFilter`
- [ ] Run SQL: `SELECT COUNT(*) FROM providers WHERE company_id = X`
- [ ] Compare SQL result with dashboard display

### If Super Admin can't see all companies:
- [ ] Check admin user has `companyId: 0`
- [ ] Verify provider controller includes: `if (userCompanyId === 0) { whereClause = {} }`
- [ ] Check all providers have valid `company_id` (not NULL)

---

## 📝 SQL Cheat Sheet

```sql
-- Distribution check
SELECT company_id, organization_name, COUNT(*) 
FROM providers 
GROUP BY company_id, organization_name;

-- Dashboard stats (Zigron)
SELECT 'Total' as metric, COUNT(*) FROM providers WHERE company_id = 1
UNION ALL SELECT 'Clear', COUNT(*) FROM providers WHERE company_id = 1 AND risk_level = 'Clear'
UNION ALL SELECT 'High Risk', COUNT(*) FROM providers WHERE company_id = 1 AND risk_level = 'HIGH';

-- Dashboard stats (Naviquis)  
SELECT 'Total' as metric, COUNT(*) FROM providers WHERE company_id = 2
UNION ALL SELECT 'Clear', COUNT(*) FROM providers WHERE company_id = 2 AND risk_level = 'Clear'
UNION ALL SELECT 'High Risk', COUNT(*) FROM providers WHERE company_id = 2 AND risk_level = 'HIGH';

-- Find mismatched providers (organization_name ≠ company_id)
SELECT npi, organization_name, company_id FROM providers
WHERE (organization_name LIKE '%Zigron%' AND company_id != 1)
   OR (organization_name LIKE '%Naviquis%' AND company_id != 2);

-- Fix mismatched (run with caution!)
UPDATE providers SET company_id = 1 WHERE organization_name LIKE '%Zigron%';
UPDATE providers SET company_id = 2 WHERE organization_name LIKE '%Naviquis%';
```

---

## 🚀 Performance Notes

### Recommended Indexes
```sql
-- Add these indexes for better performance
CREATE INDEX idx_company_id 
  ON [provider_table].[providers](company_id);

CREATE INDEX idx_npi_company 
  ON [provider_table].[providers](npi, company_id);

CREATE INDEX idx_name_company 
  ON [provider_table].[providers](providerName, company_id);

CREATE INDEX idx_company_risk 
  ON [provider_table].[providers](company_id, risk_level);
```

### Query Performance
- Dashboard stats: `< 100ms` (single aggregation query)
- Provider list: `< 200ms` (paginated, filtered)
- Provider search: `< 300ms` (pattern matching on large tables)

Monitor with: `SET STATISTICS IO ON` in SQL Server

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| [MULTI_TENANT_FIX_GUIDE.md](MULTI_TENANT_FIX_GUIDE.md) | Detailed explanation of all changes |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Overview and summary |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Step-by-step deployment |
| [SQL_VERIFY_AND_FIX_COMPANY_ISOLATION.sql](SQL_VERIFY_AND_FIX_COMPANY_ISOLATION.sql) | Database migration script |
| [TEST_MULTI_TENANT.js](TEST_MULTI_TENANT.js) | Automated test suite |

---

## 💡 Tips for Developers

1. **Always check companyId** - Treat it like authentication
2. **Super Admin = companyId 0** - Remember this special case
3. **Never hardcode company_id** - Always use user context
4. **Validate before filtering** - Check companyId isn't null/undefined
5. **Test with both roles** - Regular user AND Super Admin

---

## Quick Commands

```bash
# Test specific user
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"zigron_user","password":"zigron_user"}'

# Decode JWT token (Node.js)
node -e "console.log(JSON.parse(Buffer.from('<token_part2>', 'base64')))"

# Run full test suite
node TEST_MULTI_TENANT.js

# Check provider count by company
sqlcmd -Q "SELECT company_id, COUNT(*) FROM providers GROUP BY company_id;"

# Monitor API logs
tail -f backend/logs/app.log | grep company_id
```

---

## ✅ Checklist for New Features

When adding new features to multi-tenant system:

- [ ] Accept `companyId` parameter (or get from `req.user`)
- [ ] Validate `companyId` isn't null/undefined
- [ ] Handle Super Admin case (`companyId === 0`)
- [ ] Filter queries with company WHERE clause
- [ ] Test with both regular user and Super Admin
- [ ] Add SQL indexes if needed
- [ ] Update documentation
- [ ] Add test cases to `TEST_MULTI_TENANT.js`

