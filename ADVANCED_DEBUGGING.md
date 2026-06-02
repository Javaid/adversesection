# 🔧 Advanced Debugging Guide - Multi-Tenant Issues

## Issue: Providers from Zigron showing in Naviquis

### Root Cause Analysis

This issue can have several causes:

1. **Frontend caching** - Old data not cleared
2. **JWT not including companyId** - Both users appear the same
3. **Database stores incorrect company_id** - Wrong data in database
4. **Filtering not applied** - WHERE clause not working
5. **Session mixing** - Different tabs/windows sharing data

---

## 🔍 Step 1: Verify JWT Payload

The most likely culprit is the JWT token not containing the correct companyId.

### Check 1a: Direct Login Test
```bash
# Terminal 1: Start server with verbose logging
cd backend
DEBUG=* npm start

# Terminal 2: Test login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user"}' -v

# In response, look for:
# - HTTP 200 OK (not 400)
# - Response body contains "token"
# - Response body contains user data
```

### Check 1b: Decode JWT
```bash
# Extract token from response
TOKEN="eyJhbGc..."

# Decode in Node.js
node -e "
const token = 'TOKEN_HERE';
const parts = token.split('.');
if (parts.length !== 3) { console.log('Invalid token'); process.exit(1); }
try {
  const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
  console.log('JWT Payload:', JSON.stringify(payload, null, 2));
} catch (e) {
  console.log('Error decoding:', e.message);
}
"

# Expected for "user" (Naviquis):
# {
#   "sub": "usr_2",
#   "username": "user",
#   "role": "admin",
#   "companyId": 2,
#   "iat": 1234567890,
#   "exp": 1234571490
# }
```

### Check 1c: Verify Different Tokens
```bash
# Login as "user" (Naviquis) - should get companyId: 2
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user"}' | jq '.data.token' -r > token_naviquis.txt

# Login as "zigron_admin" (Zigron) - should get companyId: 1
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"zigron_admin","password":"zigron_admin"}' | jq '.data.token' -r > token_zigron.txt

# Decode both and compare companyId values
cat token_naviquis.txt
cat token_zigron.txt

# They should be DIFFERENT
```

---

## 🔍 Step 2: Verify API Filtering

If JWT looks correct, the issue is in the API filtering.

### Check 2a: Fetch Providers with Different Tokens
```bash
# Get token (from Step 1)
NAVIQUIS_TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user"}' | jq -r '.data.token')

ZIGRON_TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"zigron_admin","password":"zigron_admin"}' | jq -r '.data.token')

# Get providers as Naviquis user
echo "=== NAVIQUIS USER PROVIDERS ==="
curl -s -X GET "http://localhost:5000/api/v1/providers/all?page=1&limit=5" \
  -H "Authorization: Bearer $NAVIQUIS_TOKEN" | jq '.data.data[] | {npi, providerName, companyId}'

# Get providers as Zigron user
echo "=== ZIGRON USER PROVIDERS ==="
curl -s -X GET "http://localhost:5000/api/v1/providers/all?page=1&limit=5" \
  -H "Authorization: Bearer $ZIGRON_TOKEN" | jq '.data.data[] | {npi, providerName, companyId}'

# All in Naviquis response should have companyId: 2
# All in Zigron response should have companyId: 1
```

### Check 2b: Check Backend Logs
```bash
# Look for WHERE clause in logs
grep "getAllProviders" backend/logs/app.log | tail -20

# Expected for Naviquis:
# [getAllProviders] Page 1, Limit 10, Where: {"companyId":2}

# Expected for Zigron:
# [getAllProviders] Page 1, Limit 10, Where: {"companyId":1}
```

### Check 2c: Check for "Company not identified" errors
```bash
# If you see this error, companyId is null/undefined
grep "company not identified" backend/logs/app.log

# If found, the issue is the JWT isn't setting companyId properly
```

---

## 🔍 Step 3: Verify Database Data

If API filtering looks correct, the issue is database data.

### Check 3a: Database Company Distribution
```sql
SELECT company_id, COUNT(*) as count, 
       STRING_AGG(DISTINCT organization_name, ', ') as orgs
FROM [provider_table].[providers]
GROUP BY company_id
ORDER BY company_id;

-- Expected output:
-- company_id | count | orgs
--     1      |   20  | Zigron
--     2      |   50  | Naviquis
```

### Check 3b: Check for Mixed Providers
```sql
-- Find providers that might be in wrong company
SELECT TOP 20 
    npi, 
    providerName, 
    organization_name,
    company_id
FROM [provider_table].[providers]
WHERE (organization_name LIKE '%Zigron%' AND company_id != 1)
   OR (organization_name LIKE '%Naviquis%' AND company_id != 2);

-- If results found, database data is corrupted
```

### Check 3c: Check Recent Additions
```sql
-- If you just added a provider, verify it has correct company_id
SELECT TOP 10
    npi,
    providerName,
    organization_name,
    company_id
FROM [provider_table].[providers]
ORDER BY id DESC;

-- Check that the most recent provider has the correct company_id
```

---

## 🔍 Step 4: Frontend Issues

If API and database look correct, the issue is frontend.

### Check 4a: Check Browser Console
```javascript
// In browser DevTools console (F12)

// Check stored token
console.log(localStorage.getItem('token'));
console.log(sessionStorage.getItem('token'));

// Check if it changes when you logout/login
// (Should be different token with different companyId)
```

### Check 4b: Check API Requests
```javascript
// In browser DevTools > Network tab

// 1. Login request
//    Look at Response body - should have "token" field
//    Decode token - should show correct companyId

// 2. Provider GET request
//    Look at Request headers - should have "Authorization: Bearer token"
//    Look at Response body - should have providers with matching companyId
```

### Check 4c: Test with Different Browsers
```bash
# If issue only happens in one browser, it's a cache issue

# Chrome: Ctrl+Shift+Delete → Clear all data
# Firefox: Ctrl+Shift+Delete
# Safari: Cmd+Shift+Delete

# Or use Incognito/Private window (no cache)
```

---

## 🐛 Issue: Login Returns 400 Error

### Root Causes
1. **Invalid JSON** - Body not proper JSON
2. **Validation fails** - Username/password don't meet requirements
3. **Request format wrong** - Missing Content-Type header

### Debug Steps

```bash
# Step 1: Test with curl (verbose)
curl -v -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user"}'

# Look for:
# < HTTP/1.1 200 OK (good)
# < HTTP/1.1 400 Bad Request (bad)

# If 400, check response body for error message
```

### Validation Requirements
```javascript
// Username:
// - Required: YES
// - Length: 2-64 characters
// - Type: String

// Password:
// - Required: YES
// - Length: 1-128 characters
// - Type: String
```

### Example: Valid Login Request
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "password": "user"
  }'
```

### Example: Invalid Login Request
```bash
# WRONG: Missing "username" field
curl -X POST http://localhost:5000/api/v1/auth/login \
  -d '{"password":"user"}'

# WRONG: Username too short (< 2 chars)
curl -X POST http://localhost:5000/api/v1/auth/login \
  -d '{"username":"u","password":"user"}'

# WRONG: Not JSON
curl -X POST http://localhost:5000/api/v1/auth/login \
  -d 'username=user&password=user'
```

---

## 🔧 Systematic Debugging Flow

```
Start: Providers showing in wrong company
    ↓
├─ Step 1: Check JWT
│  ├─ Does token have companyId? NO → Fix auth.service.js
│  ├─ Does different users get different companyId? NO → Check user definitions
│  └─ Is companyId correct value? (1,2,0)? NO → Fix user mapping
│
├─ Step 2: Check API Filtering  
│  ├─ Are providers filtered by companyId? NO → Check provider controller
│  ├─ Does WHERE clause show company filter? NO → Debug allocation
│  └─ Are SQL queries using WHERE correctly? NO → Fix Sequelize
│
├─ Step 3: Check Database
│  ├─ Do providers have correct company_id? NO → Run migration
│  ├─ Are there NULL company_ids? YES → Fix with UPDATE
│  └─ Is organization_name correct? NO → Check data quality
│
└─ Step 4: Check Frontend
   ├─ Is token being stored? NO → Frontend issue
   ├─ Is token being sent in headers? NO → Frontend issue
   └─ Is old cache being used? YES → Clear cache

Resolution found!
```

---

## 📊 Quick Diagnostic Script

Save as `diagnose.sh`:

```bash
#!/bin/bash

API="http://localhost:5000/api/v1"

echo "=== MULTI-TENANT DIAGNOSTIC ==="

echo "1. Testing logins..."
echo "  User: user (Naviquis)"
NAVIQUIS=$(curl -s -X POST $API/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user"}' | jq -r '.data.token // "FAILED"')

if [ "$NAVIQUIS" == "FAILED" ]; then
  echo "  ❌ Login failed"
else
  echo "  ✅ Login successful"
  COMP=$(node -e "console.log(JSON.parse(Buffer.from('$NAVIQUIS'.split('.')[1], 'base64')).companyId)")
  echo "  CompanyId: $COMP (expected 2)"
fi

echo "2. Testing provider fetch..."
PROV=$(curl -s -X GET "$API/providers/all?page=1&limit=1" \
  -H "Authorization: Bearer $NAVIQUIS" | jq '.data.data[0].companyId // "FAILED"')

if [ "$PROV" == "FAILED" ]; then
  echo "  ❌ Provider fetch failed"
else
  echo "  ✅ Provider fetch successful"
  echo "  First provider companyId: $PROV (expected 2)"
fi

echo "3. Testing dashboard..."
DASH=$(curl -s -X POST "$API/dashboard/summary" \
  -H "Authorization: Bearer $NAVIQUIS" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.data.stats.totalProviders // "FAILED"')

if [ "$DASH" == "FAILED" ]; then
  echo "  ❌ Dashboard failed"
else
  echo "  ✅ Dashboard successful"
  echo "  Total providers: $DASH"
fi

echo "=== DIAGNOSTIC COMPLETE ==="
```

Run with: `bash diagnose.sh`

---

## ✅ Once Issues Are Found

1. **JWT Issue** → Edit auth.service.js
2. **API Filtering Issue** → Edit provider controller
3. **Database Issue** → Run migration script
4. **Frontend Issue** → Clear cache, check code

Then re-run QUICK_TEST.js to verify the fix.

---

## 📞 Still Stuck?

Share the output of:
```bash
# 1. Login response
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user"}' | jq .

# 2. Provider response
curl -X GET "http://localhost:5000/api/v1/providers/all?page=1&limit=2" \
  -H "Authorization: Bearer [TOKEN]" | jq '.data.data[] | {npi, companyId}'

# 3. Backend logs (last 50 lines)
tail -50 backend/logs/app.log

# 4. Database check
sqlcmd -Q "SELECT company_id, COUNT(*) FROM providers GROUP BY company_id;"
```

This will help identify the exact issue!
