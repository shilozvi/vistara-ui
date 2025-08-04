#!/bin/bash
# 🎯 Hierarchical Backup System with Azure DevOps (GFS - Grandfather-Father-Son)
# By Eagle - DevOps Backup Specialist
# Updated to use Azure DevOps instead of iCloud
# Manages hourly (6h), daily (7d), and weekly (52w) backups

set -euo pipefail

# Configuration - All Projects
PROJECTS=(
    "/Users/zvishilovitsky/TitanMind"
    "/Users/zvishilovitsky/Akasha"
    "/Users/zvishilovitsky/vistara-ui"
)
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
DAY_OF_WEEK=$(date +%u)  # 1=Monday, 7=Sunday
HOUR=$(date +%H)
MINUTE=$(date +%M)
LOG_FILE="/Users/zvishilovitsky/TitanMind/backups/logs/unified_hierarchical_backup.log"

# Retention policies
HOURLY_RETENTION_HOURS=48    # Keep 48 hours (as per principle 15)
DAILY_RETENTION_DAYS=30      # Keep 30 days (as per principle 16)
WEEKLY_RETENTION_DAYS=52     # Keep 1 year (as per principle 17)

# Function to log messages
log_message() {
    local timestamp="[$(date '+%Y-%m-%d %H:%M:%S')]"
    echo "$timestamp $1" >> "$LOG_FILE"
}

# Function to ensure directories exist
setup_directories() {
    for project_root in "${PROJECTS[@]}"; do
        local backup_root="$project_root/backups"
        mkdir -p "$backup_root/local/hourly"
        mkdir -p "$backup_root/local/daily"
        mkdir -p "$backup_root/local/weekly"
        mkdir -p "$backup_root/logs"
    done
    
    # Ensure log directory exists
    mkdir -p "$(dirname "$LOG_FILE")"
}

# Function to check if project has changes since last backup
check_for_changes() {
    local project_root=$1
    local target_dir=$2
    local project_name=$(basename "$project_root")
    
    # Get the latest backup
    local latest_backup=$(ls -t "$target_dir" 2>/dev/null | grep "^backup_" | head -1)
    
    if [ -z "$latest_backup" ]; then
        log_message "📝 No previous backup found for $project_name - will create new backup"
        return 0  # No previous backup, so we should create one
    fi
    
    # Get modification time of latest backup
    local latest_backup_time=$(stat -f %m "$target_dir/$latest_backup" 2>/dev/null || echo "0")
    local current_time=$(date +%s)
    
    # Find files changed since last backup
    local changed_files=$(find "$project_root" \
        -type f \
        -newer "$target_dir/$latest_backup" \
        ! -path "*/backups/*" \
        ! -path "*/.git/*" \
        ! -path "*/node_modules/*" \
        ! -path "*/logs/*" \
        ! -path "*/.venv/*" \
        ! -path "*/venv/*" \
        ! -path "*/__pycache__/*" \
        ! -path "*/htmlcov/*" \
        ! -name "*.tar.gz" \
        ! -name "*.zip" \
        ! -name "*.enc" \
        2>/dev/null | head -10)
    
    if [ -z "$changed_files" ]; then
        # No changes detected
        local time_diff=$((current_time - latest_backup_time))
        local hours_diff=$((time_diff / 3600))
        log_message "⏭️  No changes detected in $project_name since last backup (${hours_diff}h ago) - skipping"
        return 1  # No changes, skip backup
    else
        local num_changes=$(echo "$changed_files" | wc -l | tr -d ' ')
        log_message "📝 Found $num_changes+ changed files in $project_name - proceeding with backup"
        return 0  # Changes detected, proceed with backup
    fi
}

# Function to create backup for specific project
create_backup_for_project() {
    local project_root=$1
    local backup_type=$2
    local target_dir=$3
    local project_name=$(basename "$project_root")
    local backup_type_lower=$(echo "$backup_type" | tr '[:upper:]' '[:lower:]')
    local backup_name="backup_${TIMESTAMP}_${backup_type_lower}"
    local backup_path="$target_dir/$backup_name"
    
    log_message "📦 Creating $backup_type backup for $project_name: $backup_name"
    
    # Create backup directory
    mkdir -p "$backup_path"
    
    # Copy files with exclusions (more efficient than tar for local)
    rsync -av --quiet \
        --exclude='backups' \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='logs' \
        --exclude='.venv' \
        --exclude='venv' \
        --exclude='__pycache__' \
        --exclude='htmlcov' \
        --exclude='*.tar.gz' \
        --exclude='*.zip' \
        --exclude='*.enc' \
        "$project_root/" "$backup_path/" 2>/dev/null
    
    if [ $? -ne 0 ]; then
        log_message "❌ ERROR: Rsync failed for $project_name"
        rm -rf "$backup_path"
        return 1
    fi
    
    # Verify backup was created successfully and isn't too large
    local backup_size=$(du -sm "$backup_path" 2>/dev/null | cut -f1 || echo "0")
    if [ "$backup_size" -gt 1024 ]; then  # If backup > 1GB
        log_message "⚠️ ERROR: Backup grew to ${backup_size}MB - removing and aborting!"
        rm -rf "$backup_path"
        return 1
    fi
    
    # Create backup info
    cat > "$backup_path/info.txt" << EOF
Backup Type: $backup_type
Timestamp: $TIMESTAMP
Date: $(date)
Project: $project_name
Size: $(du -sh "$backup_path" | cut -f1)
Excludes: backups, .git, node_modules, logs, venv
EOF
    
    log_message "✅ $backup_type backup completed: $backup_name"
    return 0
}

# Function to backup to Azure DevOps
backup_to_azure() {
    local project_root=$1
    local project_name=$(basename "$project_root")
    
    log_message "☁️ Starting Azure DevOps backup for $project_name"
    
    cd "$project_root"
    
    # Check if we have azure remote
    if ! git remote | grep -q "^azure$"; then
        log_message "❌ Azure remote not configured for $project_name"
        return 1
    fi
    
    # Get Azure project name (special case for vistara-ui)
    local azure_project_name="$project_name"
    if [ "$project_name" = "vistara-ui" ]; then
        azure_project_name="Vistara-UI"
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log_message "📝 Committing changes before Azure backup"
        
        # Add all changes
        git add -A
        
        # Create commit message
        local commit_msg="🔄 Backup: $(date '+%Y-%m-%d %H:%M')"
        git commit -m "$commit_msg" || {
            log_message "⚠️ Nothing to commit for $project_name"
        }
    fi
    
    # Get current branch name
    local current_branch=$(git branch --show-current)
    
    # Push to Azure
    log_message "📤 Pushing to Azure DevOps ($current_branch)..."
    if git push azure "$current_branch" 2>/dev/null; then
        log_message "✅ Successfully backed up to Azure DevOps"
        
        # Update status file
        cat > "/tmp/backup_status/LAST_AZURE_BACKUP_STATUS_VistaraUI.md" << EOF
# Last Azure DevOps Backup Status - $project_name

**Last Backup:** $(date '+%Y-%m-%d %H:%M:%S')
**Status:** ✅ SUCCESS

## Details:
- **Branch:** main
- **Remote:** https://dev.azure.com/shilozvi/$azure_project_name/_git/$azure_project_name
- **Commit:** $(git rev-parse --short HEAD)
- **Message:** $(git log -1 --format="%s")

## Verify:
\`\`\`bash
# Check status
cd $project_root
git status

# View in Azure DevOps
open "https://dev.azure.com/shilozvi/$azure_project_name/_git/$azure_project_name"
\`\`\`

---
*Azure DevOps backup - part of unified backup system*
EOF
        return 0
    else
        log_message "⚠️ Azure DevOps push failed - authentication needed"
        
        # Create failed status file
        cat > "/tmp/backup_status/LAST_AZURE_BACKUP_STATUS_VistaraUI.md" << EOF
# Last Azure DevOps Backup Status - $project_name

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
        return 0  # Don't fail the whole backup process
    fi
}

# Function to promote backup (copy from hourly to daily/weekly)
promote_backup() {
    local source_type=$1
    local target_type=$2
    local source_dir=$3
    local target_dir=$4
    
    # Get the latest backup from source
    local latest_backup=$(ls -t "$source_dir" | grep "^backup_" | head -1)
    
    if [ -z "$latest_backup" ]; then
        log_message "⚠️ No $source_type backup found to promote to $target_type"
        return 1
    fi
    
    local new_name="backup_${TIMESTAMP}_promoted_from_${source_type}"
    
    log_message "📤 Promoting $source_type backup to $target_type: $latest_backup → $new_name"
    
    # Copy the backup
    cp -r "$source_dir/$latest_backup" "$target_dir/$new_name"
    
    # Update the info file
    echo "Promoted from: $source_type at $(date)" >> "$target_dir/$new_name/info.txt"
    
    log_message "✅ Successfully promoted to $target_type"
    return 0
}

# Function to clean old backups for specific project
cleanup_old_backups_for_project() {
    local backup_root=$1
    local hourly_dir="$backup_root/local/hourly"
    local daily_dir="$backup_root/local/daily"
    local weekly_dir="$backup_root/local/weekly"
    
    # Clean hourly backups older than 6 hours
    if [ -d "$hourly_dir" ]; then
        find "$hourly_dir" -name "backup_*" -type d -mmin +$((HOURLY_RETENTION_HOURS * 60)) -exec rm -rf {} \; 2>/dev/null || true
    fi
    
    # Clean daily backups older than 7 days
    if [ -d "$daily_dir" ]; then
        find "$daily_dir" -name "backup_*" -type d -mtime +$DAILY_RETENTION_DAYS -exec rm -rf {} \; 2>/dev/null || true
    fi
    
    # Clean weekly backups older than 1 year
    if [ -d "$weekly_dir" ]; then
        find "$weekly_dir" -name "backup_*" -type d -mtime +$WEEKLY_RETENTION_DAYS -exec rm -rf {} \; 2>/dev/null || true
    fi
}

# Function to get backup statistics for specific project
show_statistics_for_project() {
    local project_name=$1
    local backup_root=$2
    local hourly_dir="$backup_root/local/hourly"
    local daily_dir="$backup_root/local/daily"
    local weekly_dir="$backup_root/local/weekly"
    
    local hourly_count=$(ls -1 "$hourly_dir" 2>/dev/null | grep -c "^backup_" || echo 0)
    local daily_count=$(ls -1 "$daily_dir" 2>/dev/null | grep -c "^backup_" || echo 0)
    local weekly_count=$(ls -1 "$weekly_dir" 2>/dev/null | grep -c "^backup_" || echo 0)
    
    local hourly_size=$(du -sh "$hourly_dir" 2>/dev/null | cut -f1 || echo "0")
    local daily_size=$(du -sh "$daily_dir" 2>/dev/null | cut -f1 || echo "0")
    local weekly_size=$(du -sh "$weekly_dir" 2>/dev/null | cut -f1 || echo "0")
    
    log_message "📊 $project_name Statistics:"
    log_message "   Hourly: $hourly_count backups ($hourly_size)"
    log_message "   Daily: $daily_count backups ($daily_size)"
    log_message "   Weekly: $weekly_count backups ($weekly_size)"
}

# Main execution
main() {
    log_message "=========================================="
    log_message "🎯 Unified Hierarchical Backup System Started (with Azure DevOps)"
    log_message "Processing ${#PROJECTS[@]} projects..."
    log_message "=========================================="
    
    # Setup directories
    setup_directories
    
    # Process each project
    for project_root in "${PROJECTS[@]}"; do
        local project_name=$(basename "$project_root")
        local backup_root="$project_root/backups"
        local hourly_dir="$backup_root/local/hourly"
        local daily_dir="$backup_root/local/daily"
        local weekly_dir="$backup_root/local/weekly"
        
        log_message "📁 Processing project: $project_name"
        
        # Check if project has changes before creating hourly backup
        if check_for_changes "$project_root" "$hourly_dir"; then
            create_backup_for_project "$project_root" "HOURLY" "$hourly_dir"
            
            # Also backup to Azure DevOps
            backup_to_azure "$project_root"
        fi
        
        # Check if it's midnight (00:00-00:14) for daily backup
        if [ "$HOUR" = "00" ] && [ "$MINUTE" -lt "15" ]; then
            # Only promote to daily if we have a recent hourly backup
            local latest_hourly=$(ls -t "$hourly_dir" 2>/dev/null | grep "^backup_" | head -1)
            if [ -n "$latest_hourly" ]; then
                log_message "🌙 Midnight - Creating daily backup for $project_name"
                promote_backup "hourly" "daily" "$hourly_dir" "$daily_dir"
                
                # Check if it's Sunday midnight for weekly backup
                if [ "$DAY_OF_WEEK" = "7" ]; then
                    log_message "📅 Sunday midnight - Creating weekly backup for $project_name"
                    promote_backup "daily" "weekly" "$daily_dir" "$weekly_dir"
                fi
            else
                log_message "⏭️  No recent hourly backup to promote to daily for $project_name"
            fi
        fi
        
        # Cleanup old backups for this project
        cleanup_old_backups_for_project "$backup_root"
        
        # Show statistics for this project
        show_statistics_for_project "$project_name" "$backup_root"
    done
    
    log_message "✅ Unified hierarchical backup process completed"
    log_message "=========================================="
}

# Run main function
main