# 🚨 Quick Security Fix Guide

**Status:** Repo is now PRIVATE ✅  
**Urgency:** MEDIUM (still need to rotate credentials)

---

## What I've Already Fixed:

✅ **Code Updated:** `backend/check_db.py` now uses environment variables  
✅ **Template Created:** `backend/.env` ready for your new credentials  
✅ **Gitignore:** `.env` is already ignored  

---

## What YOU Need to Do (15 minutes):

### Step 1: Reset Your Supabase Password (5 min)

1. Go to https://supabase.com/dashboard
2. Select your project
3. **Settings** → **Database** → **Reset Database Password**
4. Copy the new password

### Step 2: Update Your Local .env File (2 min)

Open `backend/.env` and replace `YOUR_NEW_PASSWORD` with your actual new password:

```bash
SUPABASE_DB_URL_DIRECT=postgresql://postgres:YOUR_NEW_PASSWORD@db.ocsmppwxorxvyiafdwyf.supabase.co:5432/postgres?sslmode=require
SUPABASE_DB_URL_POOLER=postgresql://postgres.ocsmppwxorxvyiafdwyf:YOUR_NEW_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**Special characters?** URL-encode them:
- `@` → `%40`
- `#` → `%23`  
- `!` → `%21`

### Step 3: Test the Connection (1 min)

```powershell
cd backend
python check_db.py
```

You should see: ✅ Connection successful!

### Step 4: Clean Git History (5 min)

```powershell
cd e:\Projects\Tent
.\cleanup_git_history.ps1
```

Follow the prompts. This will:
- Create a backup branch
- Remove credentials from all commits
- Clean up Git references

### Step 5: Commit the Fixed Code (2 min)

```powershell
git add backend/check_db.py .env.example
git commit -m "fix: use environment variables for database credentials"
git push origin --force --all
```

---

## Why Still Rotate Even Though Repo is Private?

1. **GitGuardian already scanned it** when it was public
2. **Git history** still contains the old password
3. **Defense in depth** - eliminate all risk
4. **Takes only 5 minutes** - worth the peace of mind

---

## Need Help?

- **Can't reset password?** Check Supabase docs: https://supabase.com/docs/guides/database/managing-passwords
- **Git errors?** See full guide in `SECURITY_INCIDENT.md`
- **Connection fails?** Make sure you URL-encoded special characters

---

## After You're Done:

- [ ] Old password is reset ✅
- [ ] New password in `.env` ✅
- [ ] Connection test passes ✅
- [ ] Git history cleaned ✅
- [ ] Changes pushed ✅
- [ ] Delete `SECURITY_INCIDENT.md` and `QUICK_FIX_GUIDE.md` (optional)

**You're all set! 🎉**
