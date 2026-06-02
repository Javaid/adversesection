# Subdomain-Based Tenant Security - Testing Guide

## Your Infrastructure Setup

Your hosts file has:
```
127.0.0.1 naviquis.localhost.me
127.0.0.1 zigron.localhost.me
127.0.0.1 admin.localhost.me
127.0.0.1 api.localhost.me
```

This means:
- **Frontend**: Accessible via subdomain (e.g., http://zigron.localhost.me:5173)
- **Backend API**: Accessible via http://api.localhost.me:5000

## How Tenant Security Works with Subdomains

### Tenant Detection from Subdomain
```
URL: http://zigron.localhost.me:5173/login
     ↓
Extract subdomain: "zigron"
     ↓
Tenant = "zigron"
     ↓
Send to backend with header: X-Tenant: zigron
```

### Login Flow
```
1. User visits: http://zigron.localhost.me:5173/login
2. System detects tenant: "zigron" from subdomain
3. User enters: username=zigron, password=zigron
4. Frontend sends to backend:
   POST /api/v1/auth/login
   {
     "username": "zigron",
     "password": "zigron",
     "tenant": "zigron"
   }
5. Backend validates:
   - User "zigron" exists ✓
   - Password correct ✓
   - User assigned to "zigron" ✓
   - Requested tenant is "zigron" ✓
6. Returns JWT with tenant: "zigron"
7. User redirected to: http://zigron.localhost.me:5173/dashboard
```

### Security: URL Manipulation Prevention
```
Attacker tries:
1. Login to Zigron: http://zigron.localhost.me:5173/login
2. Successfully logged in as Zigron user
3. Tries to change subdomain: http://naviquis.localhost.me:5173/dashboard
4. System checks:
   - User's JWT has tenant: "zigron"
   - Current subdomain is: "naviquis"
   - X-Tenant header sent: "naviquis"
   - Mismatch detected! ❌
5. Backend returns: 403 Forbidden
6. User cannot access Naviquis data
```

## Quick Testing (Subdomain-Based)

### Test 1: Login to Zigron
```
1. Open browser: http://zigron.localhost.me:5173/login
2. Login with:
   Username: zigron
   Password: zigron
3. Expected: 
   ✅ Login succeeds
   ✅ Redirected to: http://zigron.localhost.me:5173/dashboard
   ✅ See Zigron dashboard data
   ✅ Browser console: "API Base URL: Using default /api"
   ✅ Network tab: X-Tenant: zigron header sent
```

### Test 2: URL Manipulation Attack (MAIN SECURITY TEST)
```
1. You're logged into Zigron: http://zigron.localhost.me:5173/dashboard
2. Manually change URL to Naviquis:
   http://naviquis.localhost.me:5173/dashboard
3. Expected SECURITY BEHAVIOR:
   ✅ Browser shows 403 Forbidden error
   ✅ Error message: "Access denied: Tenant mismatch"
   ✅ Cannot access Naviquis dashboard
   ✅ Stays restricted to Zigron
```

### Test 3: Login to Naviquis
```
1. Open new tab: http://naviquis.localhost.me:5173/login
2. Login with:
   Username: naviquis
   Password: naviquis
3. Expected:
   ✅ Login succeeds
   ✅ Redirected to: http://naviquis.localhost.me:5173/dashboard
   ✅ See Naviquis dashboard data
   ✅ Try to access Zigron: http://zigron.localhost.me:5173/dashboard
   ✅ Get 403 error
```

### Test 4: Super Admin (admin user)
```
1. Open tab: http://zigron.localhost.me:5173/login
2. Login with:
   Username: admin
   Password: admin
3. Logged into Zigron ✅
4. Change URL: http://naviquis.localhost.me:5173/dashboard
5. Expected:
   ✅ Super admin CAN access both tenants
   ✅ Naviquis dashboard loads
   ✅ Change back to Zigron
   ✅ Zigron dashboard loads
   ✅ Super admin has companyId = 0 (no restrictions)
```

### Test 5: Verify JWT Token
```
1. Login to any tenant
2. Open DevTools (F12) → Application → Local Storage
3. Find: token:zigron.localhost.me (or appropriate domain)
4. Copy the token value
5. Go to https://jwt.io
6. Paste the token and verify payload contains:
   {
     "sub": "usr_id",
     "username": "zigron",
     "role": "admin",
     "companyId": 1,
     "tenant": "zigron",
     ...
   }
   ✅ Tenant field must be present
```

### Test 6: Check API Headers
```
1. Login to Zigron tenant
2. Open DevTools → Network tab
3. Trigger any API request (refresh dashboard)
4. Click on the API request in Network tab
5. Go to "Request Headers"
6. Look for:
   Authorization: Bearer <token>
   X-Tenant: zigron
   ✅ Both headers must be present
```

## Troubleshooting

### Problem: Browser shows empty login page

**Cause**: The subdomain detection isn't working

**Solution**:
1. Check you're using correct subdomain:
   - ✅ Correct: http://zigron.localhost.me:5173
   - ❌ Wrong: http://localhost:5173/zigron
2. Verify hosts file:
   ```
   127.0.0.1 zigron.localhost.me
   127.0.0.1 naviquis.localhost.me
   ```
3. Clear browser cache:
   - DevTools → Application → Local Storage → Clear All
4. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

### Problem: Login fails with "Invalid username or password"

**Cause**: Wrong credentials or tenant mismatch

**Solution**:
1. Verify you're on correct tenant subdomain
2. Use correct credentials:
   - Zigron: username=zigron, password=zigron
   - Naviquis: username=naviquis, password=naviquis
   - Admin: username=admin, password=admin
3. Check backend logs for errors

### Problem: 403 error when accessing API

**Cause**: Tenant mismatch or user not authenticated

**Solution**:
1. Verify JWT is in localStorage:
   ```
   localStorage.getItem("token:zigron.localhost.me")
   ```
2. Verify X-Tenant header matches:
   - Network tab → Check X-Tenant header
3. Check JWT expiration:
   - Decode token on jwt.io
   - Verify "exp" date is in future

### Problem: Dashboard shows but data is empty

**Cause**: Provider data is being filtered by companyId

**This is expected** - Each tenant only sees their own providers. The frontend is working correctly.

**To verify**:
1. Check in Network tab:
   - POST request to /api/v1/dashboard/summary
   - Header includes: X-Tenant: zigron
   - Response has correct companyId filter
2. Check browser console for errors
3. Verify backend database has data for that company

## Environment Setup Checklist

- [ ] Hosts file configured with all subdomains
- [ ] Frontend running at port 5173
- [ ] Backend running at port 5000
- [ ] API Base URL correctly set (should be `/api`)
- [ ] Database connection working
- [ ] Browser cache cleared
- [ ] All localStorage cleared

## Architecture Diagram

```
Frontend (Subdomain-Based)
├── http://zigron.localhost.me:5173
│   ├── Detects subdomain: "zigron"
│   ├── Tenant context active
│   ├── All API calls include X-Tenant: zigron
│   └── Can only access Zigron resources
│
├── http://naviquis.localhost.me:5173
│   ├── Detects subdomain: "naviquis"
│   ├── Tenant context active
│   ├── All API calls include X-Tenant: naviquis
│   └── Can only access Naviquis resources
│
└── http://admin.localhost.me:5173
    ├── Detects subdomain: "admin"
    ├── Login as admin user (super admin)
    ├── Can access ALL subdomains
    └── companyId = 0 (no restrictions)

Backend API (http://api.localhost.me:5000)
├── Receives X-Tenant header from frontend
├── Validates against user's JWT tenant
├── Enforces tenant isolation
├── Returns 403 if mismatch
└── Filters data by companyId
```

## Expected Behavior Summary

| Scenario | Expected Result |
|----------|-----------------|
| Login to correct tenant | ✅ Success, dashboard loads |
| Change to wrong tenant subdomain | ❌ 403 Forbidden |
| Super admin login | ✅ Success, can access all |
| API request with mismatch X-Tenant | ❌ 403 Forbidden |
| Refresh page on tenant | ✅ Session persists |
| Logout | ✅ Redirect to /login |

## Files Modified for Subdomain Support

### Frontend
- `src/services/runtimeConfig.js` - Added `getTenantFromSubdomain()`
- `src/routes/index.jsx` - Changed to standard routes (no `:tenant` param)
- `src/pages/login.jsx` - Extract tenant from subdomain
- `src/hooks/useAuth.js` - Use subdomain-based tenant
- `src/services/api.js` - Send X-Tenant header from subdomain
- `src/components/ProtectedRoute.jsx` - Simplified redirects

### Backend
- `backend/src/middleware/tenantSubdomain.js` - New subdomain extraction
- `backend/src/middleware/tenantValidation.js` - Tenant validation
- `backend/src/services/auth.service.js` - Tenant-aware login
- All route files - Added tenantValidation middleware

---

**Status**: ✅ Subdomain-Based Security Implemented  
**Testing**: Ready for subdomain testing  
**Access Pattern**: http://[tenant].localhost.me:5173
