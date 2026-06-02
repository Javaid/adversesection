# Multi-Tenant Security - Quick Start Testing

## Pre-Test Checklist

- [ ] Backend is running on http://localhost:5000
- [ ] Frontend is running on http://localhost:5173
- [ ] All files have been saved
- [ ] Dependencies installed (`npm install` in both frontend and backend)

## Quick Test Sequence (5 minutes)

### 1. Test Zigron User Access (Success Case)
```bash
# Step 1: Navigate to Zigron login
URL: http://localhost:5173/zigron/login

# Step 2: Login with Zigron credentials
Username: zigron
Password: zigron

# Step 3: Verify
✓ Should see "Welcome back" message for Zigron
✓ Should redirect to http://localhost:5173/zigron/dashboard
✓ Should see Zigron dashboard data
```

### 2. Test URL Manipulation Attack (Failure Case - MAIN SECURITY TEST)
```bash
# Step 1: You are already logged into Zigron dashboard
# Step 2: Manually change URL in browser address bar
URL: http://localhost:5173/naviquis/dashboard

# Step 3: Verify SECURITY WORKS
✓ Should see "403 Forbidden" error
✓ Message should contain: "Access denied: You are assigned to tenant 'zigron' but requested 'naviquis'"
✓ Should NOT redirect or show Naviquis data
```

### 3. Test Naviquis User (Opposite Case)
```bash
# Step 1: Open new incognito window to avoid token conflicts
# Step 2: Navigate to Naviquis login
URL: http://localhost:5173/naviquis/login

# Step 3: Login with Naviquis credentials
Username: naviquis
Password: naviquis

# Step 4: Verify
✓ Should redirect to http://localhost:5173/naviquis/dashboard
✓ Should see Naviquis-specific data

# Step 5: Try to access Zigron
URL: http://localhost:5173/zigron/dashboard

# Step 6: Verify SECURITY WORKS
✓ Should get 403 Forbidden error
✓ Should NOT have access to Zigron data
```

### 4. Test Super Admin Bypass
```bash
# Step 1: Open new incognito window
# Step 2: Navigate to Zigron login
URL: http://localhost:5173/zigron/login

# Step 3: Login with admin (super admin) credentials
Username: admin
Password: admin

# Step 4: Verify access to both tenants
✓ Should see Zigron dashboard
✓ Navigate to http://localhost:5173/naviquis/dashboard
✓ Should see Naviquis dashboard (super admin can access all)
```

### 5. Test Login with Tenant Mismatch (Backend API)
```bash
# Using curl or Postman:
POST http://localhost:5173/api/v1/auth/login

Request Body:
{
  "username": "zigron",
  "password": "zigron",
  "tenant": "naviquis"
}

Expected Response: 403 Forbidden
{
  "success": false,
  "message": "Access denied: Your account is assigned to zigron but you're trying to access naviquis"
}
```

## Verification Checklist

After running the tests above, verify:

- [ ] Zigron user CANNOT access Naviquis dashboard
- [ ] Naviquis user CANNOT access Zigron dashboard
- [ ] Super admin (admin/admin) CAN access both dashboards
- [ ] URL manipulation results in 403 error
- [ ] Login API validates tenant parameter
- [ ] JWT token contains tenant field
- [ ] X-Tenant header is sent with API requests

## Browser DevTools Verification

### Check JWT Token Contents
1. Login to any tenant
2. Open DevTools (F12)
3. Go to Application → Local Storage
4. Look for `token:localhost`
5. Copy the token and decode it at https://jwt.io
6. Verify the payload contains:
   ```json
   {
     "sub": "usr_id",
     "username": "username",
     "role": "role_type",
     "companyId": number,
     "tenant": "tenant_name"
   }
   ```

### Check API Headers
1. Open DevTools → Network tab
2. Make any API request (e.g., dashboard load)
3. Select the request
4. Go to Request Headers
5. Look for `x-tenant: zigron` (or appropriate tenant)

## Troubleshooting

### Issue: Still accessing wrong tenant
- [ ] Clear browser localStorage completely
- [ ] Close all browser tabs for that site
- [ ] Try in incognito/private window
- [ ] Check browser console for JavaScript errors

### Issue: Getting 401 instead of 403
- [ ] Token might be expired
- [ ] Try logging out and back in
- [ ] Check that Bearer token is properly set

### Issue: Super admin can't access other tenants
- [ ] Check user has companyId = 0
- [ ] Verify role is "super_admin"
- [ ] Restart backend server

## Success Criteria

✅ Security is working correctly if:
1. Users cannot access dashboard URLs of other tenants
2. 403 error is returned when attempting unauthorized tenant access
3. Super admin can access all tenant dashboards
4. Login endpoint validates tenant matches user assignment
5. JWT token contains tenant field
6. API requests include X-Tenant header

## Files Modified

### Critical Files for Security
1. **Auth Middleware**: `backend/src/middleware/tenantValidation.js` (NEW)
2. **Auth Service**: `backend/src/services/auth.service.js` (MODIFIED)
3. **Auth Controller**: `backend/src/controllers/auth/auth.controller.js` (MODIFIED)
4. **Frontend Routes**: `src/routes/index.jsx` (MODIFIED)
5. **API Interceptor**: `src/services/api.js` (MODIFIED)
6. **Route Protection**: All `/v1/*` routes updated with tenantValidation middleware

### If Something Breaks

The implementation should NOT break existing functionality because:
- Tenant validation only rejects mismatched tenants
- Super admin can still access everything
- Login flow is backward compatible
- API structure unchanged
- Database queries unchanged

If you encounter errors:
1. Check that all files were saved
2. Restart both frontend and backend servers
3. Clear browser cache and localStorage
4. Check browser console for specific error messages

---

**Implementation Date**: May 21, 2026
**Status**: ✅ Complete and Ready for Testing
