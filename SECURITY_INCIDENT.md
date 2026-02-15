# 🚨 SECURITY INCIDENT RESPONSE GUIDE

## Incident: Exposed Database Credentials

**Date Detected:** 2026-02-15  
**Severity:** CRITICAL  
**Status:** REMEDIATION IN PROGRESS

---

## What Happened?

PostgreSQL database credentials for Supabase were accidentally committed to the Git repository and detected by GitGuardian.

**Exposed Information:**
- Database Host: `aws-0-ap-south-1.pooler.supabase.com`
- Database Username: `postgres.ocsmppwxorxvyiafdwyf`
- Database Password: `Rahul@31082006` (URL-encoded as `Rahul%4031082006`)
- Database Name: `postgres`

---

## ✅ IMMEDIATE ACTIONS REQUIRED

### 1. **ROTATE DATABASE CREDENTIALS** (DO THIS FIRST!)

**Steps to reset your Supabase password:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Database**
4. Click **Reset Database Password**
5. Generate a new strong password (use a password manager!)
6. Save the new password securely
7. Update your local `.env` file with the new credentials

### 2. **Update Local Environment File**

After resetting your password, update `backend/.env`:

```bash
# Replace YOUR_NEW_PASSWORD with your actual new password
SUPABASE_DB_URL_DIRECT=postgresql://postgres:YOUR_NEW_PASSWORD@db.ocsmppwxorxvyiafdwyf.supabase.co:5432/postgres?sslmode=require
SUPABASE_DB_URL_POOLER=postgresql://postgres.ocsmppwxorxvyiafdwyf:YOUR_NEW_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**Note:** If your password contains special characters, URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `&` → `%26`
- etc.

### 3. **Remove Credentials from Git History**

The credentials are still in your Git history. You need to remove them:

#### Option A: Using BFG Repo-Cleaner (Recommended)

```powershell
# Install BFG (if not already installed)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy of your repo
git clone --mirror https://github.com/Rylin31/Pre-Delinquency-Intervention-Engine-.git

# Remove the sensitive file from history
java -jar bfg.jar --delete-files check_db.py Pre-Delinquency-Intervention-Engine-.git

# Clean up
cd Pre-Delinquency-Intervention-Engine-.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: This rewrites history!)
git push --force
```

#### Option B: Using git filter-repo (Alternative)

```powershell
# Install git-filter-repo
pip install git-filter-repo

# Navigate to your repo
cd e:\Projects\Tent

# Remove the file from history
git filter-repo --path backend/check_db.py --invert-paths

# Force push
git push --force
```

#### Option C: Manual Git History Cleanup

```powershell
cd e:\Projects\Tent

# Create a backup first!
git branch backup-before-cleanup

# Remove the file from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/check_db.py" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: This rewrites history!)
git push origin --force --all
```

⚠️ **WARNING:** Force pushing rewrites Git history. Coordinate with any collaborators!

### 4. **Verify the Fix**

After cleaning Git history:

```powershell
# Search for any remaining credentials
git log -S "Rahul%4031082006" --all
git log -S "ocsmppwxorxvyiafdwyf" --all

# Should return no results
```

### 5. **Monitor for Unauthorized Access**

1. Check Supabase logs for any suspicious activity
2. Review database access logs
3. Check for any unauthorized data modifications
4. Monitor for unusual queries or connections

---

## 🛡️ PREVENTIVE MEASURES IMPLEMENTED

### Code Changes Made:

1. ✅ **Removed hardcoded credentials** from `backend/check_db.py`
2. ✅ **Added environment variable loading** using `python-dotenv`
3. ✅ **Created `.env` template** with placeholders
4. ✅ **Updated `.env.example`** with proper documentation
5. ✅ **Verified `.env` is in `.gitignore`**

### Additional Security Recommendations:

1. **Use Secret Management Tools:**
   - Consider using tools like HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault for production
   - For local development, `python-dotenv` is sufficient

2. **Enable Pre-commit Hooks:**
   - Install `detect-secrets` or `git-secrets` to prevent future leaks
   
   ```powershell
   pip install pre-commit detect-secrets
   ```

3. **Regular Security Audits:**
   - Run `git log -p | grep -i "password\|secret\|key"` periodically
   - Use tools like TruffleHog or GitGuardian CLI

4. **Rotate Secrets Regularly:**
   - Set a reminder to rotate database passwords every 90 days
   - Use strong, unique passwords (20+ characters)

5. **Principle of Least Privilege:**
   - Create separate database users for different environments
   - Grant only necessary permissions

---

## 📋 CHECKLIST

- [ ] Reset Supabase database password
- [ ] Update local `.env` file with new credentials
- [ ] Test database connection with new credentials
- [ ] Remove credentials from Git history (using BFG or git filter-repo)
- [ ] Force push cleaned history to remote
- [ ] Verify credentials are removed from Git history
- [ ] Check Supabase logs for unauthorized access
- [ ] Install pre-commit hooks to prevent future leaks
- [ ] Document incident in team security log
- [ ] Review and update security policies

---

## 🔗 Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod#security)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [GitGuardian Documentation](https://docs.gitguardian.com/)

---

## Contact

If you need assistance with this security incident, contact:
- Supabase Support: https://supabase.com/support
- GitGuardian Support: https://www.gitguardian.com/contact

---

**Last Updated:** 2026-02-15  
**Next Review:** After completing all checklist items
