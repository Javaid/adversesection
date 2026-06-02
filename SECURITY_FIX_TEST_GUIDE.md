# Multi-Tenant Security Fix - Testing Guide

## Summary of What Was Fixed

**The Security Flaw:** Users could manually change the URL from one tenant's subdomain to another and still access that tenant's data using their original login token.

**The Fix:** Added subdomain-to-JWT tenant validation. Now when a user changes the URL subdomain, the system checks if their JWT token matches the new subdomain's tenant. If they don't match, access is blocked.

---

## Before & After Comparison

### ❌ BEFORE THE FIX (Vulnerable)
```
User logs into: zigron.localhost.me
JWT Token contains: tenant: "zigron", companyId: 1

User manually changes URL to: naviquis.localhost.me
Result: ✗ STILL HAS ACCESS (SECURITY FLAW!)
User can see Naviquis data even though they're a Zigron user
```

### ✅ AFTER THE FIX (Secure)
```
User logs into: zigron.localhost.me
JWT Token contains: tenant: "zigron", companyId: 1

User manually changes URL to: naviquis.localhost.me
Result: ✗ ACCESS DENIED (403 Forbidden)
Error message: "Access denied: You are assigned to tenant 'zigron' 
but the subdomain 'naviquis' belongs to a different tenant"
```

---

## Test Cases

### ✅ Test 1: Legitimate Zigron User - Zigron Dashboard (SHOULD WORK)

**Setup:**
- Login to: `http://zigron.localhost.me:5173/login`
- Username/Email: [zigron user]
- Password: [password]

**Action:**
1. Navigate to Dashboard: `http://zigron.localhost.me:5173/dashboard`
2. Check that you see Zigron's data

**Expected Result:**
- ✅ Dashboard loads normally
- ✅ You can see Zigron's providers, cases, users, etc.

---

### ❌ Test 2: Zigron User Tries to Access Naviquis URL (SHOULD FAIL)

**Setup:**
- You are logged in as Zigron user
- Current URL: `http://zigron.localhost.me:5173/dashboard`

**Action:**
1. Manually change the URL to: `http://naviquis.localhost.me:5173/dashboard`
2. Press Enter to navigate

**Expected Result:**
- ❌ **Access Denied / 403 Forbidden Error**
- Error message should say something like:
  - "Access denied: You are assigned to tenant 'zigron' but the subdomain 'naviquis' belongs to a different tenant"
- You should be redirected or see an error page
- ✅ **You CANNOT access Naviquis data**

---

### ✅ Test 3: Legitimate Naviquis User - Naviquis Dashboard (SHOULD WORK)

**Setup:**
1. Logout from Zigron
2. Navigate to: `http://naviquis.localhost.me:5173/login`
3. Login with Naviquis user credentials

**Action:**
1. Navigate to Dashboard: `http://naviquis.localhost.me:5173/dashboard`
2. Check that you see Naviquis's data

**Expected Result:**
- ✅ Dashboard loads normally
- ✅ You can see Naviquis's providers, cases, users, etc.
- ✅ Data is different from Zigron's

---

### ❌ Test 4: Naviquis User Tries to Access Zigron URL (SHOULD FAIL)

**Setup:**
- You are logged in as Naviquis user
- Current URL: `http://naviquis.localhost.me:5173/dashboard`

**Action:**
1. Manually change the URL to: `http://zigron.localhost.me:5173/dashboard`
2. Press Enter to navigate

**Expected Result:**
- ❌ **Access Denied / 403 Forbidden Error**
- Error message should indicate tenant mismatch
- ✅ **You CANNOT access Zigron data**

---

### ✅ Test 5: Admin User Can Access All Tenants (IF CONFIGURED AS SUPER_ADMIN)

**Setup (if applicable):**
- You have a super_admin account with `companyId: 0`
- Logged in with super_admin credentials

**Action:**
1. Navigate to: `http://zigron.localhost.me:5173/dashboard`
2. Check access
3. Navigate to: `http://naviquis.localhost.me:5173/dashboard`
4. Check access

**Expected Result:**
- ✅ Super admin can access both tenants' dashboards
- ✅ No "Access Denied" errors
- (Regular admins for specific tenants should NOT pass this test)

---

## What to Look For - Browser Console / Network Tab

### Test Failed Scenarios

If you change the URL and get access (which would indicate the fix didn't work):

**Check the Network tab for the API calls:**
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to **Network** tab
3. Make a request to another tenant
4. Look at the API response:
   - ❌ **FAIL:** `200 OK` response with data
   - ✅ **PASS:** `403 Forbidden` response with error message

**Check the Console for errors:**
1. Open browser DevTools
2. Go to **Console** tab
3. Look for error messages about tenant access

---

## API Testing (cURL / Postman)

### Test Using cURL

**Step 1: Get a Zigron JWT Token**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "zigron-user@example.com",
    "password": "password123"
  }'
```

Copy the `token` from the response.

**Step 2: Test Legitimate Request (Should Work)**
```bash
curl -X POST http://zigron.localhost.me:5000/api/v1/dashboard/summary \
  -H "Authorization: Bearer <zigron-token>" \
  -H "Content-Type: application/json"
```

Expected: `200 OK` with data

**Step 3: Test Cross-Tenant Request (Should Fail)**
```bash
curl -X POST http://naviquis.localhost.me:5000/api/v1/dashboard/summary \
  -H "Authorization: Bearer <zigron-token>" \
  -H "Content-Type: application/json"
```

Expected: `403 Forbidden` with error message:
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Access denied: You are assigned to tenant 'zigron' but the subdomain 'naviquis' belongs to a different tenant"
}
```

---

## What Changed in the Code

### File Modified: `backend/src/middleware/tenantValidation.js`

**The new security check (added at the top of the middleware):**
```javascript
// 🔐 CRITICAL: Check subdomain tenant first (if available)
// This prevents users from accessing other tenants by changing subdomain
if (req.tenant && req.tenant.slug) {
    const subdomainTenant = req.tenant.slug.toLowerCase();
    if (userTenant !== subdomainTenant) {
        throw ApiError.forbidden(
            `Access denied: You are assigned to tenant '${userTenant}' but the subdomain '${subdomainTenant}' belongs to a different tenant`
        );
    }
}
```

This check happens BEFORE any other validation, ensuring:
1. The URL subdomain tenant is extracted
2. The user's JWT tenant is compared against it
3. If they don't match → 403 Forbidden

---

## Rollback (if needed)

If you need to revert this fix:
1. Restore `backend/src/middleware/tenantValidation.js` from git
2. Restart the backend server
3. The old (vulnerable) behavior will return

---

## Documentation & URLs

**Your URL structure (unchanged):**
- Zigron: `http://zigron.localhost.me:5173/dashboard`
- Naviquis: `http://naviquis.localhost.me:5173/dashboard`
- Admin: `http://admin.localhost.me:5173/dashboard`

No URLs were modified. Only security validation was enhanced!

---

## Questions or Issues?

If tests fail or show unexpected behavior:
1. Check the backend logs for error messages
2. Verify JWT tokens are being sent in the `Authorization` header
3. Ensure the subdomain matches the tenant in your database
4. Check that `tenantValidation()` is applied to all protected routes
