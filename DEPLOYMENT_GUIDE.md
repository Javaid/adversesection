# 🚀 Deployment Guide - Multi-Tenant Provider System

## Pre-Deployment Checklist

- [ ] All code changes reviewed
- [ ] Database backup created
- [ ] Test environment ready
- [ ] API server can be restarted
- [ ] SQL Server access available

---

## Step-by-Step Deployment

### STEP 1: Verify Code Changes (No Deployment Yet)

Ensure all 5 files have been updated:

```bash
# Check 1: Dashboard Service - has getDashboardStats(companyId) function
cd backend/src/services
grep -n "const getDashboardStats = async (companyId)" dashboard.services.js
# Expected: Should find the line with companyId parameter

# Check 2: Dashboard Controller - passes req.user?.companyId
cd ../controllers/dashboard
grep -n "const companyId = req.user" dashboard.controller.js
# Expected: Should find this line

# Check 3: Auth Service - has user roles
cd ../services
grep -n "super_admin\|zigron_user\|naviquis_user" auth.service.js
# Expected: Should find all three user types

# Check 4: Provider Model - no defaultValue for companyId
cd ../../models/providers
grep "companyId.*defaultValue" providerss.model.js
# Expected: NO RESULTS (defaultValue should be removed)

# Check 5: Provider Controller - has Super Admin logic
cd ../../controllers/provider
grep -n "userCompanyId === 0" providerss.controller.js
# Expected: Should find multiple matches
```

### STEP 2: Create Database Backup

**IMPORTANT:** Always backup before making database changes!

#### Option A: SQL Server Backup (Recommended)
```sql
-- Create full backup
BACKUP DATABASE [YourDatabaseName] 
TO DISK = 'C:\Backup\YourDatabase_PreMultiTenant.bak' 
WITH INIT;

-- Verify backup
RESTORE FILELISTONLY FROM DISK = 'C:\Backup\YourDatabase_PreMultiTenant.bak';
```

#### Option B: SQL Script Backup
```sql
-- Create table backup (run in SQL Management Studio)
SELECT * INTO [provider_table].[providers_backup_$(date /t)] 
FROM [provider_table].[providers];

-- Verify backup created
SELECT COUNT(*) FROM [provider_table].[providers_backup_$(date /t)];
```

### STEP 3: Stop API Server

```bash
# If using npm
npm stop
# or
Ctrl+C

# If using PM2
pm2 stop app

# If using Docker
docker-compose down
```

Wait 10 seconds for graceful shutdown.

### STEP 4: Deploy Code Changes

**Option A: If using Git**
```bash
cd /path/to/project/backend
git pull origin main
# or
git pull origin <your-branch>
```

**Option B: Manual File Update**
- Copy updated files to server:
  - `src/services/dashboard.services.js`
  - `src/controllers/dashboard/dashboard.controller.js`
  - `src/services/auth.service.js`
  - `src/models/providers/providerss.model.js`
  - `src/controllers/provider/providerss.controller.js`

### STEP 5: Verify Dependencies

```bash
# No new dependencies needed - all changes use existing packages
# Just run npm install to be safe
npm install

# Verify no errors
npm list --depth=0
```

### STEP 6: Fix Database Data (Migration)

**CRITICAL:** Run these SQL queries to fix existing provider company assignments

```bash
# Connect to SQL Server
sqlcmd -S your-server -U your-user -P your-password

# Run the migration script
:r SQL_VERIFY_AND_FIX_COMPANY_ISOLATION.sql

# Verify results
SELECT company_id, COUNT(*) FROM [provider_table].[providers] GROUP BY company_id;
```

**Expected output:**
```
company_id  count
1           <number of Zigron providers>
2           <number of Naviquis providers>
```

### STEP 7: Start API Server

```bash
# If using npm
npm start

# If using PM2
pm2 start app

# If using Docker
docker-compose up

# Monitor for startup errors
tail -f logs/app.log
```

Wait for the server to be fully initialized (typically 5-10 seconds).

### STEP 8: Verify Server Health

```bash
# Check if server is responding
curl http://localhost:5000/health

# Expected: 200 OK

# Check API is ready
curl http://localhost:5000/api/v1/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Expected: Returns token
```

### STEP 9: Run Test Suite

```bash
# Run the comprehensive test script
node TEST_MULTI_TENANT.js

# Expected output: All ✅ marks
```

**Sample Expected Output:**
```
✅ Zigron: JWT contains correct companyId (1)
✅ Naviquis: JWT contains correct companyId (2)
✅ Admin: JWT contains correct companyId (0)
✅ Zigron Stats Retrieved: Total: 20...
✅ Naviquis Stats Retrieved: Total: 50...
✅ Admin Stats Retrieved: Total: 70...
✅ Dashboard stats are company-specific
✅ Super Admin sees all providers
```

### STEP 10: Manual Testing in UI

#### Test 1: Company-Specific Dashboard

1. Open Zigron dashboard
2. Login: `zigron_user` / `zigron_user`
3. Check dashboard stats - should show Zigron stats only
4. Note the number of providers shown

**Then:**

5. Logout and open Naviquis dashboard
6. Login: `naviquis_user` / `naviquis_user`
7. Check dashboard stats - should show DIFFERENT stats
8. Stats should NOT match Zigron's stats (unless by coincidence)

#### Test 2: Provider Isolation

1. Login as `naviquis_user`
2. Search for and add a provider (using the NPI search feature)
3. Verify provider appears in Naviquis dashboard
4. Logout

**Then:**

5. Login as `zigron_user`
6. Verify the provider you just added does NOT appear
7. Zigron should show the same providers as before

#### Test 3: Super Admin Access

1. Login as `admin` / `admin`
2. Dashboard stats should show combined totals from all companies
3. Provider search should return providers from all companies
4. When filtering by provider, should see all companies' providers

### STEP 11: Monitor Logs

Watch backend logs for any issues:

```bash
# Real-time log monitoring
tail -f backend/logs/app.log

# Look for error patterns
grep -i "error\|fail\|unauthorized" backend/logs/app.log

# Should see no errors like:
# ❌ "Authentication error: company not identified"
# ❌ "Provider not found" (when it should exist)
```

---

## Rollback Procedure (If Needed)

If something goes wrong:

### OPTION A: Restore from Backup (Recommended)

```sql
-- Restore database from backup
RESTORE DATABASE [YourDatabaseName] 
FROM DISK = 'C:\Backup\YourDatabase_PreMultiTenant.bak' 
WITH REPLACE;
```

### OPTION B: Revert Code Changes

```bash
# If using Git
git revert <commit-hash>
git push

# If manual
Restore original files from your backup/version control
```

### OPTION C: Undo Data Changes

```sql
-- If you have a backup table
DELETE FROM [provider_table].[providers];
INSERT INTO [provider_table].[providers]
SELECT * FROM [provider_table].[providers_backup];

-- Or if using Git with uncommitted changes
git checkout -- backend/
```

---

## Post-Deployment Tasks

### Documentation
- [ ] Update API documentation with new company filtering
- [ ] Update user guides for new user credentials
- [ ] Document tenant-to-company mapping

### Monitoring
- [ ] Setup alerts for authentication failures
- [ ] Monitor dashboard response times
- [ ] Track provider query performance

### Communication
- [ ] Notify team about new credentials
- [ ] Update wiki/confluence with new system behavior
- [ ] Document for future maintainers

### Cleanup
- [ ] Remove old test users if any
- [ ] Archive old backup files (keep recent ones)
- [ ] Update deployment checklist for next time

---

## Deployment Timeline

| Task | Duration | Status |
|------|----------|--------|
| Pre-deployment verification | 5 min | ⏳ |
| Database backup | 5-10 min | ⏳ |
| Stop server | 1 min | ⏳ |
| Deploy code | 2 min | ⏳ |
| Database migration | 5-10 min | ⏳ |
| Start server | 2 min | ⏳ |
| Run tests | 5 min | ⏳ |
| Manual testing | 10-15 min | ⏳ |
| **TOTAL** | **~45-60 min** | ⏳ |

---

## Deployment Checklist

### Before Deployment
- [ ] All code files updated (5 files)
- [ ] Database backup created and verified
- [ ] Test environment matches production
- [ ] API server can be restarted
- [ ] SQL Server access available
- [ ] Team notified of maintenance window

### During Deployment
- [ ] Stop API server
- [ ] Deploy code changes
- [ ] Run database migration
- [ ] Start API server
- [ ] Verify server health
- [ ] Run test suite
- [ ] Manual testing completed

### After Deployment
- [ ] Monitor logs for errors (24 hours)
- [ ] Verify provider isolation working
- [ ] Verify dashboard stats accurate
- [ ] Confirm user access levels correct
- [ ] Test with all user types
- [ ] Document any issues

---

## Troubleshooting During Deployment

### Server won't start
```bash
# Check logs
tail -f logs/app.log

# Common issues:
# 1. Port already in use
# 2. Database connection failed
# 3. Syntax error in updated files

# Solution: Revert code and investigate
```

### Database migration fails
```bash
# Check if backup table was created
SELECT * FROM [provider_table].[providers_backup];

# Restore from backup
RESTORE DATABASE [YourDatabaseName] 
FROM DISK = 'C:\Backup\YourDatabase_PreMultiTenant.bak' 
WITH REPLACE;

# Re-run migration with detailed output
```

### Tests fail
```bash
# Check specific failure
node TEST_MULTI_TENANT.js 2>&1 | tee test-results.log

# Common issues:
# 1. Users not created properly
# 2. Database migration incomplete
# 3. Server port different

# Fix and re-test
```

---

## Quick Rollback Commands

```bash
# Revert everything in 2 commands:

# 1. Restore database
sqlcmd -S server -U user -P pass -Q "RESTORE DATABASE [DB] FROM DISK = 'backup.bak' WITH REPLACE;"

# 2. Redeploy old code
git revert HEAD && git push

# 3. Restart server
npm start
```

---

## Success Criteria

After deployment, verify:

✅ Zigron dashboard shows ONLY Zigron providers  
✅ Naviquis dashboard shows ONLY Naviquis providers  
✅ Super Admin sees all providers  
✅ Stats are company-specific  
✅ New providers created with correct company_id  
✅ No authentication errors in logs  
✅ All tests pass  

If all checks pass: **Deployment successful!** 🎉

---

## Support Contact

If issues arise during deployment:
1. Check troubleshooting section above
2. Review logs in `backend/logs/app.log`
3. Run test suite to identify specific failures
4. Consult `MULTI_TENANT_FIX_GUIDE.md` for detailed explanations

