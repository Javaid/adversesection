# 🔐 MULTI-TENANT SECURITY FIX - RESTART & TEST GUIDE

## ⚠️ IMPORTANT: You Must Restart Both Servers!

The fix requires BOTH the backend and frontend to be restarted to work.

---

## STEP 1: Stop the Servers

### Stop Backend (Node.js on port 3000)
```bash
# In the terminal where backend is running:
# Press Ctrl + C
```

### Stop Frontend (Vite on port 5173)
```bash
# In the terminal where frontend is running:
# Press Ctrl + C
```

---

## STEP 2: Restart Backend

```bash
cd backend
npm start
# OR if you use: npm run dev
```

You should see:
```
✓ Server running on http://localhost:3000
✓ [TENANT_VALIDATION] logs will appear when requests are made
```

---

## STEP 3: Restart Frontend (New Terminal)

```bash
# In a NEW terminal, from the root directory
npm run dev
# OR if you use a different command: npm start
```

You should see:
```
✓ Vite dev server running at
  ➜  http://localhost:5173/
  ➜  http://zigron.localhost.me:5173/
  ➜  http://naviquis.localhost.me:5173/
```

---

## STEP 4: Clear Browser Cache & Cookies

1. **Open DevTools** (F12 or Right-click → Inspect)
2. Go to **Application** tab
3. Click **Clear Site Data** (or manually delete cookies/localStorage)
4. Close browser completely
5. Open a NEW browser window

---

## STEP 5: Test the Fix

### ✅ Test 1: Legitimate Access (Should Work)

1. Navigate to: `http://zigron.localhost.me:5173/login`
2. Login with Zigron credentials:
   - Username: `zigron`
   - Password: `zigron`
3. You should see the Zigron dashboard

**Check Backend Logs:**
You should see logs like:
```
[TENANT_VALIDATION] User: zigron | JWT Tenant: zigron | Role: admin
[TENANT_VALIDATION] Subdomain Tenant: zigron | X-Forwarded-Host: zigron.localhost.me | Host: zigron.localhost.me:5173
[TENANT_VALIDATION] ✅ Subdomain tenant matches user tenant
[TENANT_VALIDATION] ✅ ALLOWED - All checks passed for tenant: zigron
```

---

### ❌ Test 2: Cross-Tenant Attack (Should FAIL)

1. **WHILE LOGGED IN AS ZIGRON USER**
2. Manually change the URL from:
   ```
   http://zigron.localhost.me:5173/dashboard
   ```
   to:
   ```
   http://naviquis.localhost.me:5173/dashboard
   ```
3. Press Enter

**Expected Results:**
- ❌ **Access Denied** error appears
- ✅ You CANNOT see Naviquis data
- ✅ You are NOT logged in as Zigron anymore

**Check Backend Logs:**
You should see logs like:
```
[TENANT_VALIDATION] User: zigron | JWT Tenant: zigron | Role: admin
[TENANT_VALIDATION] Subdomain Tenant: naviquis | X-Forwarded-Host: naviquis.localhost.me | Host: naviquis.localhost.me:5173
[TENANT_VALIDATION] ❌ BLOCKED - Tenant mismatch! User tenant (zigron) != Subdomain tenant (naviquis)
```

---

### ✅ Test 3: Different Tenant Login (Should Work)

1. **Logout** from Zigron
2. Navigate to: `http://naviquis.localhost.me:5173/login`
3. Login with Naviquis credentials:
   - Username: `naviquis`
   - Password: `naviquis`
4. You should see the Naviquis dashboard

**Check Backend Logs:**
```
[TENANT_VALIDATION] User: naviquis | JWT Tenant: naviquis | Role: admin
[TENANT_VALIDATION] Subdomain Tenant: naviquis | X-Forwarded-Host: naviquis.localhost.me | Host: naviquis.localhost.me:5173
[TENANT_VALIDATION] ✅ Subdomain tenant matches user tenant
[TENANT_VALIDATION] ✅ ALLOWED - All checks passed for tenant: naviquis
```

---

### ❌ Test 4: Naviquis User Tries Zigron (Should FAIL)

1. **WHILE LOGGED IN AS NAVIQUIS USER**
2. Manually change URL to:
   ```
   http://zigron.localhost.me:5173/dashboard
   ```
3. Press Enter

**Expected Results:**
- ❌ **Access Denied** error
- ✅ You CANNOT see Zigron data

**Check Backend Logs:**
```
[TENANT_VALIDATION] ❌ BLOCKED - Tenant mismatch! User tenant (naviquis) != Subdomain tenant (zigron)
```

---

## 🐛 Troubleshooting - If Tests Still Fail

### Problem: Still getting access to other tenant

**Check the Backend Logs:**
- Look for the `[TENANT_VALIDATION]` lines
- If you DON'T see them, the middleware might not be running
- If you see `✅ ALLOWED` with the wrong tenant, there's a tenant mismatch issue

### Problem: "X-Forwarded-Host" is missing in logs

This means the Vite proxy is not forwarding the header properly.

**Check:**
1. Is the backend running with TRUST_PROXY=1? (Check `.env`)
2. Did you restart the backend after making changes?
3. Did you restart the frontend with the NEW vite.config.js?

**Fix:**
```bash
# Make sure .env has:
TRUST_PROXY=1
BASE_DOMAIN=localhost.me

# Restart both servers completely
```

### Problem: Frontend still showing old data

**Solution:**
1. **Clear browser cache:**
   - Press Ctrl + Shift + Delete (Windows/Linux) or Cmd + Shift + Delete (Mac)
   - Check "Cookies" and "Cached images and files"
   - Click "Clear data"

2. **Clear localStorage (DevTools):**
   - Open DevTools (F12)
   - Go to Application → Storage → Local Storage
   - Click `http://zigron.localhost.me:5173`
   - Delete all entries
   - Do same for `http://naviquis.localhost.me:5173`

3. **Close browser completely** and reopen

---

## 📋 Quick Checklist

- [ ] Backend server stopped
- [ ] Frontend server stopped
- [ ] Backend restarted (port 3000)
- [ ] Frontend restarted (port 5173)
- [ ] Browser cache cleared
- [ ] Logged out completely
- [ ] Test 1 passed (✅ legitimate access works)
- [ ] Test 2 passed (❌ can't change to other tenant)
- [ ] Test 3 passed (✅ different tenant login works)
- [ ] Test 4 passed (❌ other tenant can't access your tenant)

---

## 📊 What Changed

### File: `vite.config.js`
- Changed proxy to properly forward `X-Forwarded-Host` header
- This lets the backend know which subdomain the request came from

### File: `backend/src/middleware/tenantValidation.js`
- Added subdomain tenant check
- Added debug logging to help diagnose issues
- Now checks if user's JWT tenant matches the URL subdomain

### File: `backend/.env`
- Already has `TRUST_PROXY=1` enabled ✓
- Already has `BASE_DOMAIN=localhost.me` configured ✓

---

## ✅ Success Indicators

When the fix is working correctly:

1. **Legitimate access works:**
   - Login as Zigron user → See Zigron dashboard ✓
   - Login as Naviquis user → See Naviquis dashboard ✓

2. **Cross-tenant access is blocked:**
   - Zigron user tries naviquis.localhost.me → 403 Forbidden ✓
   - Naviquis user tries zigron.localhost.me → 403 Forbidden ✓

3. **Backend logs show tenant validation:**
   - Should see `[TENANT_VALIDATION]` messages
   - Should see either ✅ ALLOWED or ❌ BLOCKED
   - Subdomain should be correctly detected

---

## Need Help?

If tests still fail after restarting:
1. Check backend logs for `[TENANT_VALIDATION]` messages
2. Verify `TRUST_PROXY=1` in `backend/.env`
3. Verify `BASE_DOMAIN=localhost.me` in `backend/.env`
4. Make sure vite.config.js has the `configure: (proxy)` section
5. Try clearing all browser cache and cookies
6. Stop both servers completely (wait 5 seconds) and restart
