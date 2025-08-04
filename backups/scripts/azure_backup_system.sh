#!/bin/bash
# ☁️ Azure DevOps Backup System for Vistara-UI
# Replaces iCloud backup with Azure DevOps push
# Created by Eagle 🦅 - 2025-08-03

set -e

PROJECT_DIR="/Users/zvishilovitsky/vistara-ui"
LOG_FILE="$PROJECT_DIR/backups/logs/azure_backup.log"
ERROR_LOG="$PROJECT_DIR/backups/logs/azure_backup_error.log"
ALERT_LOG="$PROJECT_DIR/backups/logs/alerts.log"

# Create directories
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error logging function
error_log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" | tee -a "$ERROR_LOG"
}

# Alert function
send_alert() {
    local severity="$1"
    local message="$2"
    local timestamp="[$(date '+%Y-%m-%d %H:%M:%S')]"
    
    echo "$timestamp [$severity] $message" >> "$ALERT_LOG"
    
    # Log to main log as well
    case $severity in
        "CRITICAL"|"ERROR")
            error_log "$message"
            ;;
        *)
            log "$message"
            ;;
    esac
}

# Function to backup to Azure DevOps
backup_to_azure() {
    cd "$PROJECT_DIR"
    
    log "🚀 Starting Azure DevOps backup for Vistara-UI"
    
    # Check if we have azure remote
    if ! git remote | grep -q "^azure$"; then
        error_log "Azure remote not configured"
        send_alert "ERROR" "Azure remote not configured for Vistara-UI"
        return 1
    fi
    
    # Get current branch name
    local current_branch=$(git branch --show-current)
    log "📋 Current branch: $current_branch"
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log "📝 Found uncommitted changes, committing..."
        
        # Add all changes
        git add -A
        
        # Create commit message
        local commit_msg="🔄 Azure Backup: $(date '+%Y-%m-%d %H:%M')"
        if git commit -m "$commit_msg"; then
            log "✅ Changes committed: $commit_msg"
        else
            log "⚠️ Nothing new to commit"
        fi
    else
        log "📋 No uncommitted changes found"
    fi
    
    # Push to Azure
    log "📤 Pushing to Azure DevOps..."
    push_output=$(git push azure "$current_branch" 2>&1)
    push_result=$?
    
    if [ $push_result -eq 0 ]; then
        log "✅ Successfully backed up to Azure DevOps"
        send_alert "INFO" "Azure DevOps backup completed successfully for Vistara-UI"
    elif echo "$push_output" | grep -q "Everything up-to-date"; then
        log "✅ Azure DevOps is up-to-date (no new changes to push)"
        send_alert "INFO" "Azure DevOps backup completed - repository is up-to-date"
    else
        error_log "Failed to push to Azure DevOps"
        send_alert "ERROR" "Azure DevOps push failed for Vistara-UI - authentication may be needed"
        
        # Create failed status file
        cat > "$PROJECT_DIR/backups/LAST_AZURE_BACKUP_STATUS.md" << EOF
# Last Azure DevOps Backup Status - Vistara-UI

**Last Backup:** $(date '+%Y-%m-%d %H:%M:%S')
**Status:** ⚠️ AUTHENTICATION NEEDED

## Issue:
Azure DevOps requires Personal Access Token authentication.

## Setup Required:
1. Go to: https://dev.azure.com/shilozvi/_usersSettings/tokens
2. Create new token with Code (Read & Write) permissions
3. Configure git credentials:
   \`\`\`bash
   git config --global credential.helper store
   git push azure $current_branch
   # Enter username: shilozvi
   # Enter password: [YOUR-PAT-TOKEN]
   \`\`\`

---
*Azure DevOps backup - requires authentication setup*
EOF
        return 1
    fi
        
    # Update status file (for both success cases)
    cat > "$PROJECT_DIR/backups/LAST_AZURE_BACKUP_STATUS.md" << EOF
# Last Azure DevOps Backup Status - Vistara-UI

**Last Backup:** $(date '+%Y-%m-%d %H:%M:%S')
**Status:** ✅ SUCCESS

## Details:
- **Branch:** $current_branch
- **Remote:** https://dev.azure.com/shilozvi/Vistara-UI/_git/Vistara-UI
- **Commit:** $(git rev-parse --short HEAD)
- **Message:** $(git log -1 --format="%s")

## Verify:
\`\`\`bash
# Check status
cd $PROJECT_DIR
git status

# View in Azure DevOps
open "https://dev.azure.com/shilozvi/Vistara-UI/_git/Vistara-UI"
\`\`\`

---
*Azure DevOps backup - runs every hour at :00 minutes*
EOF
    return 0
}

# Function to check connectivity
check_connectivity() {
    if ping -c 1 dev.azure.com &>/dev/null; then
        log "🌐 Internet connectivity: OK"
        return 0
    else
        error_log "No internet connectivity"
        send_alert "ERROR" "Cannot reach dev.azure.com - check internet connection"
        return 1
    fi
}

# Main execution
main() {
    log "========================================"
    log "🔄 Azure DevOps Backup Started for Vistara-UI"
    log "========================================"
    
    # Check connectivity first
    if ! check_connectivity; then
        error_log "Aborting backup due to connectivity issues"
        exit 1
    fi
    
    # Perform backup
    if backup_to_azure; then
        log "✅ Azure DevOps backup completed successfully"
    else
        error_log "❌ Azure DevOps backup failed"
        exit 1
    fi
    
    log "========================================"
}

# Run main function
main