#!/bin/bash
# 🐙 Vistara-UI GitHub Backup Script
# Automated push to GitHub repository
# Based on TitanMind's proven system

set -e

# Configuration
PROJECT_NAME="vistara-ui"
PROJECT_DIR="/Users/zvishilovitsky/vistara-ui"
BACKUP_LOG="$PROJECT_DIR/backups/logs/github_backup.log"
ERROR_LOG="$PROJECT_DIR/backups/logs/github_backup_error.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_ONLY=$(date +%Y-%m-%d)
TIME_ONLY=$(date +%H:%M)

# Logging functions
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$BACKUP_LOG"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" | tee -a "$ERROR_LOG" >&2
}

# Alert function
send_alert() {
    local severity="$1"
    local message="$2"
    
    if command -v osascript >/dev/null 2>&1; then
        osascript -e "display notification \"$message\" with title \"Vistara-UI GitHub Backup $severity\"" 2>/dev/null || true
    fi
}

log "🚀 Starting GitHub backup"

# Check if project exists
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Project directory not found: $PROJECT_DIR"
    send_alert "CRITICAL" "Project directory not found!"
    exit 1
fi

cd "$PROJECT_DIR"

# Check if git repo exists
if [ ! -d ".git" ]; then
    log_error "Not a git repository!"
    send_alert "ERROR" "Project is not a git repository"
    exit 1
fi

# Check for uncommitted changes
log "📋 Checking git status..."
CHANGED_FILES=$(git status --porcelain | wc -l)
if [ $CHANGED_FILES -eq 0 ]; then
    log "No changes to backup"
    exit 0
fi

# Get repository info
CURRENT_BRANCH=$(git branch --show-current)
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "no-remote")
log "Branch: $CURRENT_BRANCH"
log "Remote: $REMOTE_URL"

# Stash any existing changes (safety)
if [ -n "$(git status --porcelain)" ]; then
    log "📦 Stashing uncommitted changes..."
    git stash push -m "Auto-stash before backup at $TIMESTAMP"
fi

# Add all changes
log "➕ Adding all changes..."
git add -A

# Get statistics
ADDED=$(git diff --cached --numstat | wc -l)
MODIFIED=$(git diff --cached --name-status | grep '^M' | wc -l)
DELETED=$(git diff --cached --name-status | grep '^D' | wc -l)
CODE_SIZE=$(du -sh . --exclude='.git' --exclude='node_modules' 2>/dev/null | cut -f1 || echo "Unknown")

log "📊 Changes: $ADDED added, $MODIFIED modified, $DELETED deleted"

# Create commit
COMMIT_MESSAGE="[$DATE_ONLY $TIME_ONLY] Auto backup - Code: $CODE_SIZE, Changes: $CHANGED_FILES files"
log "💾 Creating commit: $COMMIT_MESSAGE"

git commit -m "$COMMIT_MESSAGE" -m "Automated backup by Vistara-UI backup system" || {
    log_error "Commit failed"
    send_alert "ERROR" "GitHub commit failed"
    git stash pop 2>/dev/null || true
    exit 1
}

# Push to GitHub
log "📤 Pushing to GitHub..."
git push origin "$CURRENT_BRANCH" 2>&1 | tee -a "$BACKUP_LOG" || {
    log_error "Push failed - check your GitHub authentication"
    send_alert "ERROR" "GitHub push failed - check authentication"
    
    # Try to provide helpful error info
    log ""
    log "❓ Troubleshooting:"
    log "1. Check if you have internet connection"
    log "2. Verify GitHub credentials:"
    log "   git config user.name"
    log "   git config user.email"
    log "3. Check SSH key:"
    log "   ssh -T git@github.com"
    log "4. Or use personal access token for HTTPS"
    exit 1
}

# Create tag for daily backup
if [ "$(date +%H)" = "00" ]; then
    TAG_NAME="backup-$DATE_ONLY"
    log "🏷️ Creating daily tag: $TAG_NAME"
    git tag -a "$TAG_NAME" -m "Daily backup tag" 2>/dev/null || true
    git push origin "$TAG_NAME" 2>/dev/null || true
fi

# Get commit info
LAST_COMMIT=$(git rev-parse HEAD)
COMMIT_URL="${REMOTE_URL%.git}/commit/$LAST_COMMIT"

# Create status file
cd "$PROJECT_DIR/backups"
cat > "LAST_GITHUB_BACKUP_STATUS.md" << EOF
# Last GitHub Backup Status - Vistara-UI

**Last Backup:** $(date '+%Y-%m-%d %H:%M:%S')
**Status:** ✅ SUCCESS

## Details:
- **Branch:** $CURRENT_BRANCH
- **Commit:** $LAST_COMMIT
- **Message:** $COMMIT_MESSAGE
- **Files Changed:** $CHANGED_FILES
- **Code Size:** $CODE_SIZE
- **Remote:** $REMOTE_URL

## Statistics:
- **Added:** $ADDED files
- **Modified:** $MODIFIED files
- **Deleted:** $DELETED files

## View Online:
$COMMIT_URL

## Local Verification:
\`\`\`bash
# Check latest commit
git log -1 --oneline

# Check push status
git status

# Verify remote
git ls-remote origin HEAD
\`\`\`

---
*GitHub backup runs at: 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00*
EOF

log ""
log "🐙 GITHUB BACKUP SUMMARY"
log "======================="
log "Commit: $LAST_COMMIT"
log "Files: $CHANGED_FILES changed"
log "Status: ✅ SUCCESS"
log ""

send_alert "SUCCESS" "GitHub backup completed - $CHANGED_FILES files"
log "🎉 GitHub backup completed successfully!"

# Restore stashed changes if any
STASH_COUNT=$(git stash list | grep "Auto-stash before backup" | wc -l)
if [ $STASH_COUNT -gt 0 ]; then
    log "📦 Restoring stashed changes..."
    git stash pop 2>/dev/null || true
fi