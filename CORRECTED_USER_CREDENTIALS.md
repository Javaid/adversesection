# 🔐 Corrected User Credentials & Testing Guide

## ✅ Fixed User Credentials

Your multi-tenant system now has these users:

### Super Admin (Can see ALL companies)
```
Username: admin
Password: admin
Role: super_admin
CompanyId: 0 (All companies)
Access: ✅ All providers from all companies
```

### Naviquis Users
```
Username: user                    (ORIGINAL - for backward compatibility)
Password: user
CompanyId: 2 (Naviquis)
Access: ✅ Only Naviquis providers

OR

Username: naviquis_admin
Password: naviquis_admin
CompanyId: 2 (Naviquis)
Access: ✅ Only Naviquis providers
```

### Zigron User
```
Username: zigron_admin
Password: zigron_admin
Role: admin
CompanyId: 1 (Zigron)
Access: ✅ Only Zigron providers
```

---

## 🧪 Quick Test Instructions

### Step 1: Start the server
```bash
cd backend
npm start
```

### Step 2: Run Quick Test
```bash
cd project-root
node QUICK_TEST.js
```

### Step 3: Interpret Results

**Good results should show:**
- ✅ Naviquis user gets companyId: 2 in JWT
- ✅ Zigron user gets companyId: 1 in JWT
- ✅ Admin gets companyId: 0 in JWT
- ✅ Dashboard stats differ for different users
- ✅ Provider lists show different companies

---

## 🔍 Manual Testing Steps

### Test 1: Login with Different Users

```bash
# Test Naviquis (original "user")
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user"}'

# Expected Response:
# {
#   "data": {
#     "token": "eyJ...",
#     "user": {
#       "id": "usr_2",
#       "username": "user",
#       "role": "admin",
#       "companyId": 2
#     }
#   }
# }

# Test Zigron
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"zigron_admin","password":"zigron_admin"}'

# Expected Response: companyId should be 1

# Test Super Admin
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Expected Response: companyId should be 0
```

### Test 2: Verify JWT Contains CompanyId

```bash
# 1. Get token (replace with actual token)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Decode and verify (use online JWT decoder or Node.js)
node -e "console.log(JSON.parse(Buffer.from('TOKEN_PART_2', 'base64')))"

# Should show:
# {
#   "sub": "usr_X",
#   "username": "username",
#   "role": "admin/super_admin",
#   "companyId": 1 or 2 or 0
# }
```

### Test 3: Check Provider Filtering

```bash
# Login as Naviquis user and get token
NAVIQUIS_TOKEN="..."

# Get providers
curl -X GET "http://localhost:5000/api/v1/providers/all?page=1&limit=10" \
  -H "Authorization: Bearer $NAVIQUIS_TOKEN"

# All returned providers should have companyId: 2

# Try with Zigron token
ZIGRON_TOKEN="..."

curl -X GET "http://localhost:5000/api/v1/providers/all?page=1&limit=10" \
  -H "Authorization: Bearer $ZIGRON_TOKEN"

# All returned providers should have companyId: 1
```

### Test 4: Check Dashboard Stats

```bash
# As Naviquis user
curl -X POST http://localhost:5000/api/v1/dashboard/summary \
  -H "Authorization: Bearer $NAVIQUIS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# As Zigron user
curl -X POST http://localhost:5000/api/v1/dashboard/summary \
  -H "Authorization: Bearer $ZIGRON_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# Stats should be DIFFERENT
# (Unless both companies happen to have the exact same number of providers)
```

---

## 🐛 Debugging JWT Issues

### Check 1: Verify token is being sent
```bash
# In browser DevTools Console (F12)
const token = localStorage.getItem('token'); // or sessionStorage
console.log(token); // Should show a long JWT string
```

### Check 2: Decode token
```bash
# Node.js
const token = "eyJ...";
const parts = token.split(".");
const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
console.log(payload);

# Expected output:
# {
#   sub: 'usr_X',
#   username: 'username',
#   role: 'admin',
#   companyId: 1 or 2 or 0,
#   iat: 1234567890,
#   exp: 1234571490
# }
```

### Check 3: Verify companyId is in JWT
```javascript
// If companyId is missing, the issue is in the JWT creation
// If companyId is wrong, the issue is in user definition
// If companyId is correct but filtering doesn't work, the issue is in the controller
```

---

## 🔧 Common Issues & Fixes

### Issue: All users see the same data
**Solution:** 
1. Check that each user has different companyId in auth.service.js
2. Verify JWT includes companyId
3. Clear browser cache and re-login

### Issue: Login returns 400 error
**Solution:**
1. Ensure username and password are in JSON body
2. Username must be 2-64 characters
3. Password must be 1-128 characters
4. Check spelling of username

### Issue: Super Admin doesn't see all companies
**Solution:**
1. Verify admin user has companyId: 0
2. Check provider controller has: `if (userCompanyId === 0) { whereClause = {} }`
3. Ensure all providers have valid company_id (not NULL)

### Issue: Providers from one company showing in another
**Solution:**
1. Run SQL: `SELECT npi, company_id FROM providers`
2. Check if all providers have correct company_id
3. If not, run SQL migration script to fix

---

## 📊 SQL Verification

### Check Company Distribution
```sql
SELECT company_id, COUNT(*) as count
FROM [provider_table].[providers]
GROUP BY company_id;

-- Expected output:
-- company_id | count
--    1       | 20 (or your Zigron count)
--    2       | 50 (or your Naviquis count)
```

### Check for NULL company_id
```sql
SELECT COUNT(*) as null_count
FROM [provider_table].[providers]
WHERE company_id IS NULL;

-- Should return: 0
-- If not, these providers need to be assigned a company
```

### Check Dashboard Stats Query
```sql
-- Naviquis (company_id=2) stats
SELECT 'Total' as metric, COUNT(*) FROM providers WHERE company_id=2
UNION ALL SELECT 'Clear', COUNT(*) FROM providers WHERE company_id=2 AND risk_level='Clear'
UNION ALL SELECT 'High Risk', COUNT(*) FROM providers WHERE company_id=2 AND risk_level='HIGH'
UNION ALL SELECT 'Med/Low Risk', COUNT(*) FROM providers WHERE company_id=2 AND risk_level IN ('MEDIUM','LOW');

-- Zigron (company_id=1) stats  
SELECT 'Total' as metric, COUNT(*) FROM providers WHERE company_id=1
UNION ALL SELECT 'Clear', COUNT(*) FROM providers WHERE company_id=1 AND risk_level='Clear'
UNION ALL SELECT 'High Risk', COUNT(*) FROM providers WHERE company_id=1 AND risk_level='HIGH'
UNION ALL SELECT 'Med/Low Risk', COUNT(*) FROM providers WHERE company_id=1 AND risk_level IN ('MEDIUM','LOW');
```

---

## ✅ Verification Checklist

After testing, verify:

- [ ] Admin login returns companyId: 0
- [ ] Naviquis login returns companyId: 2
- [ ] Zigron login returns companyId: 1
- [ ] JWT token includes all fields
- [ ] Provider list shows different data for different users
- [ ] Dashboard stats differ per user
- [ ] Super Admin sees all providers combined
- [ ] Database has correct company_id values
- [ ] No 401 "company not identified" errors
- [ ] Backend logs show WHERE clause filtering

---

## 🚀 Running QUICK_TEST.js

```bash
# From project root
node QUICK_TEST.js

# Output will show:
# ✅ Successful tests
# ❌ Failed tests
# ℹ️  Information
```

### Expected Output
```
✅ Admin: JWT contains correct companyId (0)
✅ User: JWT contains correct companyId (2)
✅ Zigron Admin: JWT contains correct companyId (1)
✅ Naviquis Admin: JWT contains correct companyId (2)
✅ Admin Stats Retrieved: Total: 70
✅ Naviquis user Stats Retrieved: Total: 50
✅ Zigron admin Stats Retrieved: Total: 20
✅ Dashboard stats are company-specific
✅ Super Admin sees all providers
✅ Provider lists are properly isolated by company
```

---

## 📝 Next Steps

1. **Verify the user credentials** are correct in your system
2. **Run QUICK_TEST.js** to validate everything works
3. **Check backend logs** for any errors
4. **Test with frontend** - make sure it's using correct users
5. **Verify database** - ensure providers have correct company_id

---

## 🆘 Still Having Issues?

1. Check that you're using the correct usernames:
   - Super Admin: `admin` (not `super_admin`)
   - Naviquis: `user` or `naviquis_admin`
   - Zigron: `zigron_admin`

2. Make sure companyId is being extracted from JWT in every request

3. Run SQL queries to verify database data

4. Check backend logs for filtering WHERE clauses

5. Ensure no caching issues (clear browser cache)

**The corrected user credentials are now in place! Test with QUICK_TEST.js**
