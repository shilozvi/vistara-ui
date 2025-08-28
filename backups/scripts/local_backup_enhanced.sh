#!/bin/bash
# 💾 Local Backup Script for Vistara-UI Project - Enhanced with Centralized Logging
# Creates local backups with comprehensive logging

set -euo pipefail

# Import centralized logging system
BACKUP_LOGGER="/Users/zvishilovitsky/Backup_All_Projects/Archives/backup_logging_system/backup_logger.sh"
if [ -f "$BACKUP_LOGGER" ]; then
    source "$BACKUP_LOGGER"
    BACKUP_LOG_VERBOSE="true"  # Enable verbose logging
else
    echo "⚠️  Warning: Centralized logging system not found at $BACKUP_LOGGER"
    backup_log_execution() { echo "[$2] $3"; }  # Fallback logging
fi

PROJECT_DIR="/Users/zvishilovitsky/vistara-ui"
BACKUP_DIR="/Users/zvishilovitsky/vistara-ui/backups/local"
LOG_FILE="/Users/zvishilovitsky/vistara-ui/backups/logs/local_backup.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_ONLY=$(date +%Y-%m-%d)
TIME_ONLY=$(date +%H:%M)
START_TIME=$(date +%s)

# Create directories if needed
mkdir -p "$BACKUP_DIR" "$(dirname "$LOG_FILE")"

# Enhanced logging with centralized system
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
    backup_log_execution "vistara-local" "INFO" "$1"
}

log_success() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ $1" | tee -a "$LOG_FILE"
    backup_log_execution "vistara-local" "SUCCESS" "$1"
}

log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ ERROR: $1" | tee -a "$LOG_FILE" >&2
    backup_log_execution "vistara-local" "FAILED" "$1"
}

log "💾 Starting Vistara-UI local backup"
backup_log_execution "vistara-local" "INFO" "Local backup process initiated" "Start time: $(date)"

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Project directory not found: $PROJECT_DIR"
    backup_log_execution "vistara-local" "FAILED" "Project directory not found" "Path: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Performance monitoring - disk usage before backup
DISK_USAGE_BEFORE=$(du -sh . --exclude='node_modules' --exclude='backups/local' 2>/dev/null | cut -f1 || echo "Unknown")
backup_log_performance "disk" "INFO" "Pre-backup Vistara disk usage measured" "Size: $DISK_USAGE_BEFORE"

# Create backup archive (excluding node_modules and existing backups)
BACKUP_FILE="$BACKUP_DIR/vistara_backup_$TIMESTAMP.tar.gz"
EXCLUDE_FILE="/tmp/vistara_exclude_$TIMESTAMP.txt"

# Create exclusion list
cat > "$EXCLUDE_FILE" << EOF
node_modules/
backups/local/
.git/objects/
*.log
.DS_Store
.env
dist/
build/
coverage/
EOF

log "📦 Creating backup archive..."
if tar --exclude-from="$EXCLUDE_FILE" -czf "$BACKUP_FILE" -C "$(dirname "$PROJECT_DIR")" "$(basename "$PROJECT_DIR")" 2>/dev/null; then
    log_success "Backup archive created successfully"
    
    # Get backup size and file count
    BACKUP_SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
    FILE_COUNT=$(tar -tzf "$BACKUP_FILE" | wc -l)
    
    log "📊 Backup details:"
    log "   File: $(basename "$BACKUP_FILE")"
    log "   Size: $BACKUP_SIZE"
    log "   Files: $FILE_COUNT"
    
    backup_log_execution "vistara-local" "SUCCESS" "Local backup created" "Size: $BACKUP_SIZE, Files: $FILE_COUNT"
else
    log_error "Failed to create backup archive"
    backup_log_execution "vistara-local" "FAILED" "Backup archive creation failed"
    rm -f "$EXCLUDE_FILE"
    exit 1
fi

# Clean up temporary files
rm -f "$EXCLUDE_FILE"

# Create info file
INFO_FILE="$BACKUP_DIR/backup_${TIMESTAMP}_info.txt"
cat > "$INFO_FILE" << EOF
# Vistara-UI Local Backup Information
Backup Date: $(date)
Project Directory: $PROJECT_DIR
Backup File: $BACKUP_FILE
Backup Size: $BACKUP_SIZE
File Count: $FILE_COUNT
Disk Usage Before: $DISK_USAGE_BEFORE

# Git Information (if available)
EOF

# Add git info if available
if [ -d ".git" ]; then
    echo "Git Branch: $(git branch --show-current 2>/dev/null || echo 'Unknown')" >> "$INFO_FILE"
    echo "Git Commit: $(git rev-parse HEAD 2>/dev/null | cut -c1-8 || echo 'Unknown')" >> "$INFO_FILE"
    echo "Git Status: $(git status --porcelain | wc -l) uncommitted changes" >> "$INFO_FILE"
fi

# Clean up old backups (keep last 10)
log "🧹 Cleaning up old backups..."
OLD_BACKUPS=$(find "$BACKUP_DIR" -name "vistara_backup_*.tar.gz" -type f | sort -r | tail -n +11)
if [ -n "$OLD_BACKUPS" ]; then
    echo "$OLD_BACKUPS" | xargs rm -f
    OLD_COUNT=$(echo "$OLD_BACKUPS" | wc -l)
    log "📝 Removed $OLD_COUNT old backup(s)"
    backup_log_execution "vistara-local" "INFO" "Old backups cleaned" "Removed: $OLD_COUNT files"
fi

# Calculate total performance metrics
END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))

# Convert size to bytes for performance measurement (rough estimation)
SIZE_BYTES=$(echo $BACKUP_SIZE | sed 's/[^0-9]*//g')000000
backup_measure_performance "$START_TIME" "$END_TIME" "Vistara Local Backup" "$SIZE_BYTES"

# Verification - check backup integrity
log "🔍 Verifying backup integrity..."
if tar -tzf "$BACKUP_FILE" > /dev/null 2>&1; then
    log_success "Backup integrity verified"
    backup_log_verification "archive" "SUCCESS" "Backup archive verified" "File: $(basename "$BACKUP_FILE")"
else
    log_error "Backup integrity check failed"
    backup_log_verification "archive" "FAILED" "Backup archive corrupted" "File: $(basename "$BACKUP_FILE")"
fi

# Final success logging
log_success "Local backup completed successfully"
backup_log_execution "vistara-local" "SUCCESS" "Local backup process completed" "Duration: ${TOTAL_DURATION}s, Size: $BACKUP_SIZE"

# Generate performance report entry
backup_log_report "daily" "INFO" "Vistara local backup completed" "Duration: ${TOTAL_DURATION}s, Files: $FILE_COUNT, Size: $BACKUP_SIZE, Status: SUCCESS"

log ""
log "💾 LOCAL BACKUP SUMMARY"
log "======================="
log "Backup: $(basename "$BACKUP_FILE")"
log "Size: $BACKUP_SIZE"
log "Duration: ${TOTAL_DURATION}s"
log "Status: ✅ SUCCESS"
log ""