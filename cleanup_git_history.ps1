# Git History Cleanup Script
# This script removes the exposed credentials from Git history

Write-Host "🚨 Git History Cleanup for Exposed Credentials" -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Red
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository!" -ForegroundColor Red
    exit 1
}

Write-Host "⚠️  WARNING: This will rewrite Git history!" -ForegroundColor Yellow
Write-Host "Make sure you've:" -ForegroundColor Yellow
Write-Host "  1. ✅ Reset your Supabase database password" -ForegroundColor Yellow
Write-Host "  2. ✅ Updated backend/.env with new credentials" -ForegroundColor Yellow
Write-Host "  3. ✅ Informed any collaborators (if any)" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Continue? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "Aborted." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📦 Creating backup branch..." -ForegroundColor Cyan
git branch backup-before-cleanup-$(Get-Date -Format "yyyyMMdd-HHmmss")

Write-Host "🔍 Searching for exposed credentials in history..." -ForegroundColor Cyan
$foundDirect = git log --all --grep="Rahul%4031082006" --oneline
$foundPooler = git log --all --grep="ocsmppwxorxvyiafdwyf" --oneline

if ($foundDirect -or $foundPooler) {
    Write-Host "Found commits with exposed credentials" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🧹 Removing sensitive data from Git history..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Gray

# Use git filter-branch to remove the file from history
git filter-branch --force --index-filter `
  "git rm --cached --ignore-unmatch backend/check_db.py" `
  --prune-empty --tag-name-filter cat -- --all

Write-Host ""
Write-Host "🗑️  Cleaning up Git references..." -ForegroundColor Cyan
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host ""
Write-Host "✅ Git history cleaned!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify the cleanup:" -ForegroundColor White
Write-Host "     git log --all -S 'Rahul%4031082006'" -ForegroundColor Gray
Write-Host "     (should return no results)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Force push to remote:" -ForegroundColor White
Write-Host "     git push origin --force --all" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Re-add the fixed check_db.py:" -ForegroundColor White
Write-Host "     git add backend/check_db.py" -ForegroundColor Gray
Write-Host "     git commit -m 'fix: use environment variables for database credentials'" -ForegroundColor Gray
Write-Host "     git push" -ForegroundColor Gray
Write-Host ""
