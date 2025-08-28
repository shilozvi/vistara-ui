#!/bin/bash
# 🐙 Vistara-UI GitHub Backup Script - Enhanced with TSK086 Logging
# Automated push to GitHub repository with comprehensive logging
# Based on TitanMind's proven system + New centralized logging

set -e

# Import centralized logging system
BACKUP_LOGGER="/Users/zvishilovitsky/Backup_All_Projects/Archives/backup_logging_system/backup_logger.sh"
if [ -f "$BACKUP_LOGGER" ]; then
    source "$BACKUP_LOGGER"
    BACKUP_LOG_VERBOSE="true"  # Enable verbose logging
else
    echo "⚠️  Warning: Centralized logging system not found at $BACKUP_LOGGER"
    backup_log_execution() { echo "[$2] $3"; }  # Fallback logging
fi

# Configuration
PROJECT_NAME="vistara-ui"
PROJECT_DIR="/Users/zvishilovitsky/vistara-ui"
BACKUP_LOG="$PROJECT_DIR/backups/logs/github_backup.log"
ERROR_LOG="$PROJECT_DIR/backups/logs/github_backup_error.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_ONLY=$(date +%Y-%m-%d)
TIME_ONLY=$(date +%H:%M)
START_TIME=$(date +%s)

# Create directories if needed
mkdir -p "$(dirname "$BACKUP_LOG")"

# Enhanced logging with centralized system
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$BACKUP_LOG"
    backup_log_execution "vistara-github" "INFO" "$1"
}

log_success() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1" | tee -a "$BACKUP_LOG"
    backup_log_execution "vistara-github" "SUCCESS" "$1"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERROR: $1" | tee -a "$ERROR_LOG" >&2
    backup_log_execution "vistara-github" "FAILED" "$1"
}

log_warning() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️  WARNING: $1" | tee -a "$BACKUP_LOG"
    backup_log_execution "vistara-github" "WARNING" "$1"
}

# Alert function with enhanced logging
send_alert() {
    local severity="$1"
    local message="$2"
    
    backup_smart_alert "service_unavailable" "$severity" "Vistara GitHub Backup: $message" "N/A"
    
    if command -v osascript >/dev/null 2>&1; then
        osascript -e "display notification \"$message\" with title \"Vistara-UI GitHub Backup $severity\"" 2>/dev/null || true
    fi
}

log "🐙 Starting GitHub backup for Vistara-UI"
backup_log_execution "vistara-github" "INFO" "Backup process initiated" "Start time: $(date)"

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

# Performance monitoring - disk usage before backup
DISK_USAGE_BEFORE=$(du -sh . --exclude='.git' --exclude='node_modules' --exclude='backups/local' 2>/dev/null | cut -f1 || echo "Unknown")
backup_log_performance "disk" "INFO" "Pre-backup Vistara disk usage measured" "Size: $DISK_USAGE_BEFORE"

# Check for uncommitted changes
log "📋 Checking git status..."
CHANGED_FILES=$(git status --porcelain | wc -l)
if [ $CHANGED_FILES -eq 0 ]; then
    log "No changes to backup"
    backup_log_execution "vistara-github" "INFO" "No changes detected - backup skipped"
    exit 0
fi

# Get repository info
CURRENT_BRANCH=$(git branch --show-current)
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "no-remote")
log "Branch: $CURRENT_BRANCH"
log "Remote: $REMOTE_URL"

# Check if remote exists
if [ "$REMOTE_URL" = "no-remote" ]; then
    log_error "No GitHub remote configured!"
    send_alert "ERROR" "No GitHub remote configured"
    backup_log_alert "service_unavailable" "ERROR" "GitHub remote not configured" "Required for backup"
    exit 1
fi

# Verification - check GitHub connectivity
log "🌐 Testing GitHub connectivity..."
if ! git ls-remote origin HEAD >/dev/null 2>&1; then
    log_warning "GitHub remote connectivity issues detected"
    backup_log_alert "service_unavailable" "WARNING" "GitHub connectivity issues" "Remote check failed"
else
    log "✅ GitHub remote accessible"
    backup_log_verification "destination" "SUCCESS" "GitHub remote verified" "Remote: $REMOTE_URL"
fi

# Stash any existing changes (safety)
if [ -n "$(git status --porcelain)" ]; then
    log "📦 Stashing uncommitted changes..."
    git stash push -m "Auto-stash before GitHub backup at $TIMESTAMP"
fi

# Add all changes
log "➕ Adding all changes..."
git add -A

# Get detailed statistics
ADDED=$(git diff --cached --numstat | wc -l)
MODIFIED=$(git diff --cached --name-status | grep '^M' | wc -l 2>/dev/null || echo "0")
DELETED=$(git diff --cached --name-status | grep '^D' | wc -l 2>/dev/null || echo "0")
CODE_SIZE=$(du -sh . --exclude='.git' --exclude='node_modules' --exclude='backups/local' 2>/dev/null | cut -f1 || echo "Unknown")

log "📊 Changes: $ADDED added, $MODIFIED modified, $DELETED deleted, Size: $CODE_SIZE"
backup_log_execution "vistara-github" "INFO" "Files processed for backup" "Added: $ADDED, Modified: $MODIFIED, Deleted: $DELETED, Total size: $CODE_SIZE"

# Create commit
COMMIT_MESSAGE="[$DATE_ONLY $TIME_ONLY] Auto backup - Code: $CODE_SIZE, Changes: $CHANGED_FILES files"
log "💾 Creating commit: $COMMIT_MESSAGE"

if git commit -m "$COMMIT_MESSAGE" -m "Automated backup by Vistara-UI backup system"; then
    log_success "Commit created successfully"
    COMMIT_HASH=$(git rev-parse HEAD)
    backup_log_execution "vistara-github" "SUCCESS" "Git commit created" "Hash: ${COMMIT_HASH:0:8}, Message: $COMMIT_MESSAGE"
else
    log_error "Failed to create commit"
    git stash pop 2>/dev/null || true
    exit 1
fi

# Push to GitHub
log "📤 Pushing to GitHub..."
PUSH_START=$(date +%s)

if git push origin "$CURRENT_BRANCH" 2>&1 | tee -a "$BACKUP_LOG"; then
    PUSH_END=$(date +%s)
    PUSH_DURATION=$((PUSH_END - PUSH_START))
    
    log_success "Successfully pushed to GitHub"
    backup_log_execution "vistara-github" "SUCCESS" "Push to GitHub completed" "Duration: ${PUSH_DURATION}s, Branch: $CURRENT_BRANCH"
    backup_log_performance "transfer_speed" "SUCCESS" "GitHub push completed" "Duration: ${PUSH_DURATION}s, Size: $CODE_SIZE"
    
    # Post-push verification
    log "🔍 Verifying push success..."
    REMOTE_HASH=$(git ls-remote origin "$CURRENT_BRANCH" | cut -f1)
    LOCAL_HASH=$(git rev-parse HEAD)
    
    if [ "$REMOTE_HASH" = "$LOCAL_HASH" ]; then
        log_success "Push verification successful - hashes match"
        backup_log_verification "destination" "SUCCESS" "GitHub push verified" "Local: ${LOCAL_HASH:0:8}, Remote: ${REMOTE_HASH:0:8}"
    else
        log_warning "Push verification failed - hash mismatch"
        backup_log_verification "destination" "WARNING" "GitHub push verification failed" "Local: ${LOCAL_HASH:0:8}, Remote: ${REMOTE_HASH:0:8}"
    fi
    
else
    PUSH_END=$(date +%s)
    PUSH_DURATION=$((PUSH_END - PUSH_START))
    
    log_error "Failed to push to GitHub"
    backup_log_execution "vistara-github" "FAILED" "Push to GitHub failed" "Duration: ${PUSH_DURATION}s, Branch: $CURRENT_BRANCH"
    send_alert "ERROR" "GitHub push failed - check authentication"
    
    # Troubleshooting info
    log ""
    log "❓ Troubleshooting:"
    log "1. Check internet connection"
    log "2. Verify GitHub credentials"
    log "3. Check SSH key: ssh -T git@github.com"
    log "4. Or use personal access token for HTTPS"
    git stash pop 2>/dev/null || true
    exit 1
fi

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

# Calculate total performance metrics
END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))

# Performance summary
backup_measure_performance "$START_TIME" "$END_TIME" "Vistara GitHub Backup" "$(echo $CODE_SIZE | sed 's/[^0-9]*//g')000000"

# Final success logging
log_success "GitHub backup completed successfully"
backup_log_execution "vistara-github" "SUCCESS" "Complete backup process finished" "Total duration: ${TOTAL_DURATION}s, Files: $ADDED, Size: $CODE_SIZE"

# Generate performance report entry
backup_log_report "daily" "INFO" "Vistara GitHub backup completed" "Duration: ${TOTAL_DURATION}s, Changes: $ADDED files, Size: $CODE_SIZE, Status: SUCCESS"

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

exit 0