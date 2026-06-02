-- SQL Script to verify and fix company isolation for providers
-- Run this in your SQL Server Management Studio

-- ============================================================================
-- STEP 1: Verify Current State
-- ============================================================================
PRINT '=== CURRENT STATE ANALYSIS ===';

-- Check how many providers are in each company
SELECT 'Total Providers' AS metric, COUNT(*) as count FROM [provider_table].[providers]
UNION ALL
SELECT 'Providers in Company 1 (Zigron)', COUNT(*) FROM [provider_table].[providers] WHERE company_id = 1
UNION ALL
SELECT 'Providers in Company 2 (Naviquis)', COUNT(*) FROM [provider_table].[providers] WHERE company_id = 2
UNION ALL
SELECT 'Providers with NULL company_id', COUNT(*) FROM [provider_table].[providers] WHERE company_id IS NULL;

-- Check organization names and their distribution
PRINT '';
PRINT '=== DISTRIBUTION BY ORGANIZATION AND COMPANY ===';
SELECT 
    ISNULL(organization_name, 'NULL') as organization_name,
    company_id,
    COUNT(*) as provider_count
FROM [provider_table].[providers]
GROUP BY organization_name, company_id
ORDER BY organization_name, company_id;

-- ============================================================================
-- STEP 2: BACKUP (OPTIONAL - Uncomment to create backup table)
-- ============================================================================
-- PRINT '';
-- PRINT '=== CREATING BACKUP ===';
-- SELECT * INTO [provider_table].[providers_backup] FROM [provider_table].[providers];
-- PRINT 'Backup created: [provider_table].[providers_backup]';

-- ============================================================================
-- STEP 3: Fix Company Association Based on Organization Name
-- ============================================================================
PRINT '';
PRINT '=== FIXING COMPANY ASSOCIATION ===';

-- Set all Zigron providers to company_id = 1
UPDATE [provider_table].[providers]
SET company_id = 1
WHERE organization_name LIKE '%Zigron%' AND company_id != 1;

PRINT 'Updated Zigron providers to company_id = 1';

-- Set all Naviquis providers to company_id = 2
UPDATE [provider_table].[providers]
SET company_id = 2
WHERE organization_name LIKE '%Naviquis%' AND company_id != 2;

PRINT 'Updated Naviquis providers to company_id = 2';

-- ============================================================================
-- STEP 4: Handle providers with NULL organization names
-- ============================================================================
-- If you have providers without organization_name, assign them based on their NPI
-- This is a manual process - update as needed
PRINT '';
PRINT '=== PROVIDERS WITHOUT ORGANIZATION NAME ===';
SELECT TOP 10
    id,
    npi,
    providerName,
    organization_name,
    company_id
FROM [provider_table].[providers]
WHERE organization_name IS NULL OR organization_name = '';

-- You can manually update these, or use this logic:
-- UPDATE [provider_table].[providers]
-- SET company_id = 1
-- WHERE (organization_name IS NULL OR organization_name = '') AND company_id IS NULL;

-- ============================================================================
-- STEP 5: Verify After Fix
-- ============================================================================
PRINT '';
PRINT '=== FINAL STATE VERIFICATION ===';

SELECT 
    ISNULL(organization_name, 'NO ORGANIZATION') as organization_name,
    company_id,
    COUNT(*) as provider_count
FROM [provider_table].[providers]
GROUP BY organization_name, company_id
ORDER BY organization_name, company_id;

-- Total by company
PRINT '';
SELECT 
    'Company 1 (Zigron)' as company,
    COUNT(*) as total_providers
FROM [provider_table].[providers]
WHERE company_id = 1
UNION ALL
SELECT 
    'Company 2 (Naviquis)' as company,
    COUNT(*) as total_providers
FROM [provider_table].[providers]
WHERE company_id = 2;

-- ============================================================================
-- STEP 6: Check for issues
-- ============================================================================
PRINT '';
PRINT '=== CHECKING FOR ISSUES ===';

IF EXISTS (SELECT 1 FROM [provider_table].[providers] WHERE company_id IS NULL)
BEGIN
    PRINT '⚠️  WARNING: Found providers with NULL company_id';
    SELECT id, npi, providerName, organization_name FROM [provider_table].[providers] WHERE company_id IS NULL;
END
ELSE
BEGIN
    PRINT '✅ All providers have valid company_id';
END

-- ============================================================================
-- STEP 7: Dashboard Stats Verification (Test the new filtering)
-- ============================================================================
PRINT '';
PRINT '=== DASHBOARD STATS BY COMPANY ===';

-- Company 1 (Zigron) Stats
PRINT '';
PRINT 'COMPANY 1 (Zigron) STATS:';
SELECT 
    'Total Providers' AS stat_name,
    COUNT(*) as count
FROM [provider_table].[providers]
WHERE company_id = 1
UNION ALL
SELECT 'Clear', COUNT(*) FROM [provider_table].[providers] WHERE company_id = 1 AND risk_level = 'Clear'
UNION ALL
SELECT 'High Risk', COUNT(*) FROM [provider_table].[providers] WHERE company_id = 1 AND risk_level = 'HIGH'
UNION ALL
SELECT 'Medium/Low Risk', COUNT(*) FROM [provider_table].[providers] WHERE company_id = 1 AND risk_level IN ('MEDIUM', 'LOW');

-- Company 2 (Naviquis) Stats
PRINT '';
PRINT 'COMPANY 2 (Naviquis) STATS:';
SELECT 
    'Total Providers' AS stat_name,
    COUNT(*) as count
FROM [provider_table].[providers]
WHERE company_id = 2
UNION ALL
SELECT 'Clear', COUNT(*) FROM [provider_table].[providers] WHERE company_id = 2 AND risk_level = 'Clear'
UNION ALL
SELECT 'High Risk', COUNT(*) FROM [provider_table].[providers] WHERE company_id = 2 AND risk_level = 'HIGH'
UNION ALL
SELECT 'Medium/Low Risk', COUNT(*) FROM [provider_table].[providers] WHERE company_id = 2 AND risk_level IN ('MEDIUM', 'LOW');

-- ============================================================================
-- STEP 8: Sample Queries to Verify API Behavior
-- ============================================================================
PRINT '';
PRINT '=== SAMPLE API QUERIES (for verification) ===';

-- Query 1: Get all Zigron providers (simulating zigron_user login)
PRINT '';
PRINT 'Query 1: Zigron User - Get All Providers';
SELECT TOP 5 
    id, npi, providerName, speciality, risk_level, company_id
FROM [provider_table].[providers]
WHERE company_id = 1
ORDER BY providerName;

-- Query 2: Get all Naviquis providers (simulating naviquis_user login)
PRINT '';
PRINT 'Query 2: Naviquis User - Get All Providers';
SELECT TOP 5
    id, npi, providerName, speciality, risk_level, company_id
FROM [provider_table].[providers]
WHERE company_id = 2
ORDER BY providerName;

-- Query 3: Get specific provider for Zigron user
PRINT '';
PRINT 'Query 3: Get specific provider (Zigron user searches)';
SELECT TOP 3
    id, npi, providerName, organization_name, company_id
FROM [provider_table].[providers]
WHERE company_id = 1 AND providerName LIKE '%doctor%'
ORDER BY providerName;

PRINT '';
PRINT '✅ Verification complete!';
