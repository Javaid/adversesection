# Tenant-Based Security Implementation Guide

## Overview
This document outlines the comprehensive tenant-based security system implemented to prevent unauthorized access between tenants in the multi-tenant application.

## Security Architecture

### 1. Multi-Tenant User Assignment
Users are now permanently assigned to specific tenants with the following mapping:

```javascript
// User to Tenant Assignment
- admin/admin       → Super Admin (companyId: 0, can access all tenants)
- zigron/zigron     → Zigron Tenant (companyId: 1)
- naviquis/naviquis → Naviquis Tenant (companyId: 2)
```

### 2. Frontend Routes (URL-Based Tenant Routing)

Routes now follow the pattern: `/:tenant/login`, `/:tenant/dashboard`, etc.

**Examples:**
- `http://localhost:5173/zigron/login` → Zigron login page
- `http://localhost:5173/zigron/dashboard` → Zigron dashboard
- `http://localhost:5173/naviquis/login` → Naviquis login page
- `http://localhost:5173/naviquis/dashboard` → Naviquis dashboard

### 3. Login Flow with Tenant Validation

#### Request Format
```json
POST /v1/auth/login
{
  "username": "zigron",
  "password": "zigron",
  "tenant": "zigron"  // Required field
}
```

#### Validation Logic
1. Verify username/password credentials
2. Check if user is assigned to the requested tenant
3. Super admin (companyId=0) can access all tenants
4. Return 403 Forbidden if tenant mismatch occurs
5. Generate JWT with tenant field

#### JWT Token Format
```json
{
  "sub": "usr_id",
  "username": "username",
  "role": "admin",
  "companyId": 1,
  "tenant": "zigron",  // New field
  "iat": 1234567890,
  "exp": 1234571490
}
```

### 4. Tenant Validation Middleware

The `tenantValidation()` middleware is applied to all protected routes and enforces:

1. **Tenant Extraction** (in priority order):
   - `X-Tenant` header (explicit specification)
   - Request body `tenant` field
   - URL parameter `tenant`
   - User's assigned tenant (fallback)

2. **Access Control**:
   - Super admin (companyId=0) bypasses all checks
   - Regular users can only access their assigned tenant
   - Returns 403 Forbidden on mismatch

3. **Protected Routes**:
   - Dashboard: `/v1/dashboard/summary`
   - Providers: `/v1/providers/search`, `/v1/providerss/*`
   - Cases: `/v1/cases/*`
   - Doctors: `/v1/doctors/*`
   - Users: `/v1/users/*`
   - Stats: `/v1/stats`

### 5. Frontend API Integration

The API service automatically:
1. Extracts tenant from current URL path
2. Adds `X-Tenant` header to all requests
3. Extracts companyId from JWT and stores in localStorage
4. Stores tenant in localStorage for session persistence

## Testing the Security Implementation

### Test Case 1: Valid Tenant Access
**Objective**: Verify users can access their assigned tenant

```bash
# Test Zigron Login
1. Navigate to: http://localhost:5173/zigron/login
2. Login with: username=zigron, password=zigron
3. Expected: Redirect to /zigron/dashboard with access granted
4. Verify JWT contains: tenant="zigron", companyId=1
```

### Test Case 2: Unauthorized Tenant Access (Main Security Test)
**Objective**: Verify URL manipulation blocks unauthorized access

```bash
# Attempt to access wrong tenant
1. Login as Zigron user: http://localhost:5173/zigron/login
2. Successfully access: http://localhost:5173/zigron/dashboard
3. Try to access Naviquis: http://localhost:5173/naviquis/dashboard
4. EXPECTED: 403 Forbidden - "Access denied: You are assigned to tenant 'zigron' but requested 'naviquis'"
```

### Test Case 3: Tenant Mismatch on Login
**Objective**: Verify login endpoint rejects mismatched tenants

```bash
# Attempt to login to wrong tenant
POST http://localhost:5173/api/v1/auth/login
{
  "username": "zigron",
  "password": "zigron",
  "tenant": "naviquis"  # Wrong tenant
}

EXPECTED: 403 Forbidden
{
  "success": false,
  "message": "Access denied: Your account is assigned to zigron but you're trying to access naviquis"
}
```

### Test Case 4: Super Admin Access (Bypass)
**Objective**: Verify super admin can access all tenants

```bash
# Login as super admin
1. Navigate to: http://localhost:5173/zigron/login
2. Login with: username=admin, password=admin
3. Should redirect to: /zigron/dashboard
4. Super admin can access any dashboard

# Or login via Naviquis
1. Navigate to: http://localhost:5173/naviquis/login
2. Login with: username=admin, password=admin
3. Should redirect to: /naviquis/dashboard
```

### Test Case 5: API Request with Tenant Header
**Objective**: Verify backend enforces tenant validation on API requests

```bash
# Valid request (authenticated and matching tenant)
curl -H "Authorization: Bearer <jwt_token>" \
     -H "X-Tenant: zigron" \
     http://localhost:5173/api/v1/dashboard/summary

# EXPECTED: 200 OK with Zigron data

# Invalid request (tenant mismatch)
curl -H "Authorization: Bearer <jwt_token>" \
     -H "X-Tenant: naviquis" \
     http://localhost:5173/api/v1/dashboard/summary

# EXPECTED: 403 Forbidden
```

### Test Case 6: Session Persistence
**Objective**: Verify tenant is maintained across page refreshes

```bash
1. Login to Zigron
2. Open browser DevTools → Application → Local Storage
3. Verify: tenant:localhost = "zigron"
4. Refresh page → Should remain on /zigron/dashboard
5. Verify access is still restricted to Zigron
```

### Test Case 7: Logout and Redirect
**Objective**: Verify logout maintains tenant context

```bash
1. Login to Zigron: /zigron/login → /zigron/dashboard
2. Click logout
3. EXPECTED: Redirect to /zigron/login (maintains tenant context)
4. Token is cleared from localStorage
```

## Implementation Files Modified

### Frontend
- `src/routes/index.jsx` - Added tenant path routing
- `src/pages/login.jsx` - Extracts tenant from URL
- `src/hooks/useAuth.js` - Sends tenant in login request
- `src/services/authService.js` - Updated for tenant parameter
- `src/services/api.js` - Adds X-Tenant header to requests
- `src/components/ProtectedRoute.jsx` - Tenant-aware redirects

### Backend
- `backend/src/middleware/tenantValidation.js` - New tenant validation middleware
- `backend/src/services/auth.service.js` - Tenant-based login validation
- `backend/src/controllers/auth/auth.controller.js` - Accepts tenant parameter
- `backend/src/routes/v1/dashboard.routes.js` - Added tenantValidation
- `backend/src/routes/v1/provider.routes.js` - Added tenantValidation
- `backend/src/routes/v1/case.route.js` - Added tenantValidation
- `backend/src/routes/v1/doctor.route.js` - Added tenantValidation
- `backend/src/routes/v1/user.route.js` - Added tenantValidation
- `backend/src/routes/v1/stats.route.js` - Added tenantValidation
- `backend/src/routes/v1/providerss.route.js` - Added tenantValidation

## Security Best Practices Implemented

1. **Defense in Depth**: Validation at both frontend and backend
2. **Zero Trust**: Every request is validated against user's assigned tenant
3. **Super Admin Bypass**: Controlled exception for administrative access
4. **Multiple Validation Points**: URL, headers, body, JWT payload
5. **Clear Error Messages**: Users understand why access is denied
6. **Session Isolation**: Each tenant has separate localStorage keys
7. **Token Claims**: JWT includes all necessary tenant information

## Future Enhancements

1. **Database Integration**: Replace in-memory user store with persistent database
2. **Dynamic Tenant Mapping**: Load tenant configurations from database
3. **Audit Logging**: Log all access attempts and authorization failures
4. **Rate Limiting**: Per-tenant rate limiting to prevent abuse
5. **SSO Integration**: Support single sign-on with tenant context
6. **Tenant Customization**: Allow tenants to customize branding and rules

## Troubleshooting

### Issue: "403 Forbidden - Tenant mismatch"
**Solution**: Ensure:
1. You're logged in to the correct tenant
2. URL matches your assigned tenant
3. JWT token contains correct tenant claim
4. X-Tenant header matches (if manually testing API)

### Issue: Redirect loops
**Solution**:
1. Check localStorage is cleared between tenants
2. Verify JWT is properly decoded and contains tenant field
3. Ensure useAuth hook is properly handling tenant parameter

### Issue: Super admin can't access other tenants
**Solution**:
1. Verify admin user has companyId=0
2. Check role is set to "super_admin"
3. Ensure tenantValidation middleware allows super admin bypass

## Questions or Issues?

Refer to test cases above to verify implementation is working correctly. Each test case can be executed independently to validate specific security features.
