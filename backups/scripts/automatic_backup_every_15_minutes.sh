#!/bin/bash
# 🎯 Vistara-UI Automatic Backup Script - Every Hour (Optimized)
# Based on TitanMind's proven backup system  
# Created: 2025-01-27 | Optimized: 2025-08-23 by Eagle

set -e

# Configuration
PROJECT_NAME="vistara-ui"
PROJECT_DIR="/Users/zvishilovitsky/vistara-ui"
BACKUP_DIR="$PROJECT_DIR/backups/local"
EXTERNAL_BACKUP_DIR="/Users/zvishilovitsky/Backup_All_Projects/vistara-ui"
BACKUP_LOG="$PROJECT_DIR/backups/logs/backup_hourly.log"
ERROR_LOG="$PROJECT_DIR/backups/logs/backup_hourly_error.log"
ALERT_LOG="$PROJECT_DIR/backups/logs/alerts.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${TIMESTAMP}"
MAX_BACKUPS=48   # Keep 48 hours worth (48 * 1 hour) - Optimized from 192

# Create necessary directories
mkdir -p "$BACKUP_DIR"
mkdir -p "$EXTERNAL_BACKUP_DIR"
mkdir -p "$(dirname "$BACKUP_LOG")"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$BACKUP_LOG"
}

# Error logging function
log_error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" | tee -a "$ERROR_LOG" >&2
}

# Alert function
send_alert() {
    local severity="$1"
    local message="$2"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$severity] $message" >> "$ALERT_LOG"
    
    # macOS notification
    if command -v osascript >/dev/null 2>&1; then
        osascript -e "display notification \"$message\" with title \"Vistara-UI Backup $severity\"" 2>/dev/null || true
    fi
}

# Start backup
log "🚀 Starting hourly automatic backup: $BACKUP_NAME"

# Check if project exists
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Project directory not found: $PROJECT_DIR"
    send_alert "CRITICAL" "Project directory not found!"
    exit 1
fi

cd "$PROJECT_DIR"

# Get project size
PROJECT_SIZE=$(du -sh . 2>/dev/null | cut -f1 || echo "Unknown")
log "📊 Project size: $PROJECT_SIZE"

# Create code backup
log "📦 Creating code backup..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_code.tar.gz" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='.next' \
    --exclude='coverage' \
    --exclude='*.log' \
    --exclude='backups' \
    --exclude='.DS_Store' \
    --exclude='*.tmp' \
    --exclude='.env.local' \
    . 2>/dev/null || {
        log_error "Failed to create code backup"
        send_alert "ERROR" "Code backup failed"
        exit 1
    }

# Get backup size
CODE_SIZE=$(ls -lh "$BACKUP_DIR/${BACKUP_NAME}_code.tar.gz" 2>/dev/null | awk '{print $5}' || echo "Unknown")
log "✅ Code backup created: $CODE_SIZE"

# Create checksums
log "🔐 Creating checksums..."
cd "$BACKUP_DIR"
md5sum "${BACKUP_NAME}_code.tar.gz" > "${BACKUP_NAME}_code.checksum" 2>/dev/null || \
    md5 -q "${BACKUP_NAME}_code.tar.gz" > "${BACKUP_NAME}_code.checksum" 2>/dev/null || {
        log_error "Failed to create checksum"
    }

# Verify backup integrity
log "🔍 Verifying backup integrity..."
if tar -tzf "${BACKUP_NAME}_code.tar.gz" > /dev/null 2>&1; then
    log "✅ Backup integrity verified"
else
    log_error "Backup integrity check failed!"
    send_alert "CRITICAL" "Backup integrity check failed"
    exit 1
fi

# Copy to external backup location
log "📋 Copying to external backup location..."
cp "${BACKUP_NAME}_code.tar.gz" "$EXTERNAL_BACKUP_DIR/" 2>/dev/null || {
    log_error "Failed to copy to external location"
    send_alert "WARNING" "External backup copy failed"
}
cp "${BACKUP_NAME}_code.checksum" "$EXTERNAL_BACKUP_DIR/" 2>/dev/null || true

# Clean up old backups (keep last 48 for hourly backups)
log "🧹 Cleaning up old backups (hourly optimization)..."

# Clean main backup directory
cd "$BACKUP_DIR"
BACKUP_COUNT=$(ls -1 backup_*_code.tar.gz 2>/dev/null | wc -l || echo 0)
if [ $BACKUP_COUNT -gt $MAX_BACKUPS ]; then
    DELETE_COUNT=$((BACKUP_COUNT - MAX_BACKUPS))
    log "Removing $DELETE_COUNT old backups from main location (optimization)..."
    ls -1t backup_*_code.tar.gz | tail -n $DELETE_COUNT | while read file; do
        BASE_NAME="${file%_code.tar.gz}"
        rm -f "${BASE_NAME}_code.tar.gz" "${BASE_NAME}_code.checksum" 2>/dev/null || true
        log "  Removed: $BASE_NAME"
    done
fi

# Clean external backup directory
cd "$EXTERNAL_BACKUP_DIR"
BACKUP_COUNT=$(ls -1 backup_*_code.tar.gz 2>/dev/null | wc -l || echo 0)
if [ $BACKUP_COUNT -gt $MAX_BACKUPS ]; then
    DELETE_COUNT=$((BACKUP_COUNT - MAX_BACKUPS))
    log "Removing $DELETE_COUNT old backups from external location (optimization)..."
    ls -1t backup_*_code.tar.gz | tail -n $DELETE_COUNT | while read file; do
        BASE_NAME="${file%_code.tar.gz}"
        rm -f "${BASE_NAME}_code.tar.gz" "${BASE_NAME}_code.checksum" 2>/dev/null || true
    done
fi

# Create status file
cd "$PROJECT_DIR/backups"
cat > "LAST_BACKUP_STATUS.md" << EOF
# Last Backup Status - Vistara-UI

**Last Backup:** $(date '+%Y-%m-%d %H:%M:%S')
**Backup Name:** ${BACKUP_NAME}
**Status:** ✅ SUCCESS

## Details:
- **Code Size:** ${CODE_SIZE}
- **Project Size:** ${PROJECT_SIZE}
- **Main Location:** $BACKUP_DIR
- **External Location:** $EXTERNAL_BACKUP_DIR
- **Retention:** 48 hours (48 backups) - Hourly optimized

## Verify:
\`\`\`bash
# Check latest backups
ls -la $BACKUP_DIR/ | tail -5

# Verify integrity
cd $BACKUP_DIR
tar -tzf ${BACKUP_NAME}_code.tar.gz | head -5
\`\`\`

---
*Automatic backup system - runs every hour (optimized from 15 minutes)*
EOF

# Create info file for this backup
cat > "$BACKUP_DIR/${BACKUP_NAME}_info.txt" << EOF
Backup Date: $(date '+%Y-%m-%d %H:%M:%S')
Type: Hourly automatic (optimized)
Project: Vistara-UI
Project Path: $PROJECT_DIR
Code Size: $CODE_SIZE
Backup Location: $BACKUP_DIR
External Location: $EXTERNAL_BACKUP_DIR
Status: SUCCESS ✅
Integrity: VERIFIED ✅

=== INTEGRITY CHECKSUM ===
Code MD5: $(cat "$BACKUP_DIR/${BACKUP_NAME}_code.checksum" 2>/dev/null || echo "N/A")

Created by: Auto-backup system (launchd)
Host: $(hostname)
User: $(whoami)
EOF

# Summary
log ""
log "📊 BACKUP SUMMARY"
log "================"
log "Backup Name: $BACKUP_NAME"
log "Code Size: $CODE_SIZE"
log "Locations: 2 (main + external)"
log "Status: ✅ SUCCESS"
log ""

# Success alert for first backup of the day
HOUR=$(date +%H)
MINUTE=$(date +%M)
if [ "$HOUR" = "00" ] && [ "$MINUTE" -lt "15" ]; then
    send_alert "INFO" "Daily backups started successfully"
fi

log "🎉 Backup completed successfully!"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"