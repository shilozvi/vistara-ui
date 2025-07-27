#!/bin/bash
# 🌤️ Vistara-UI iCloud Backup Script
# Encrypted backup to iCloud every 3 hours
# Based on TitanMind's proven system

set -e

# Configuration
PROJECT_NAME="vistara-ui"
PROJECT_DIR="/Users/zvishilovitsky/vistara-ui"
ICLOUD_DIR="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Vistara_UI_Backups"
BACKUP_LOG="$PROJECT_DIR/backups/logs/icloud_backup.log"
ERROR_LOG="$PROJECT_DIR/backups/logs/icloud_backup_error.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DATE_ONLY=$(date +%Y%m%d)
BACKUP_NAME="vistaraui_backup_${TIMESTAMP}"
PASSWORD="vistaraui_${DATE_ONLY}"
MAX_BACKUPS=48  # Keep 48 hours worth (24 per day * 2 days)

# Create directories
mkdir -p "$ICLOUD_DIR"
mkdir -p "$(dirname "$BACKUP_LOG")"

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
        osascript -e "display notification \"$message\" with title \"Vistara-UI iCloud Backup $severity\"" 2>/dev/null || true
    fi
}

log "☁️ Starting iCloud backup: $BACKUP_NAME"
log "🔐 Encryption password: $PASSWORD"

# Check if project exists
if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Project directory not found: $PROJECT_DIR"
    send_alert "CRITICAL" "Project directory not found!"
    exit 1
fi

# Create temporary directory
TEMP_DIR="/tmp/vistaraui_icloud_backup_${TIMESTAMP}"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

log "📦 Creating backup archive..."

# Copy latest local backup if available
LATEST_LOCAL=$(ls -1t "$PROJECT_DIR/backups/local/backup_"*"_code.tar.gz" 2>/dev/null | head -1)
if [ -f "$LATEST_LOCAL" ]; then
    log "Using latest local backup: $(basename "$LATEST_LOCAL")"
    cp "$LATEST_LOCAL" "$TEMP_DIR/code.tar.gz"
else
    log "Creating new backup from source..."
    cd "$PROJECT_DIR"
    tar -czf "$TEMP_DIR/code.tar.gz" \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='build' \
        --exclude='.next' \
        --exclude='coverage' \
        --exclude='*.log' \
        --exclude='backups' \
        --exclude='.DS_Store' \
        . 2>/dev/null || {
            log_error "Failed to create backup archive"
            exit 1
        }
fi

cd "$TEMP_DIR"

# Get sizes
ARCHIVE_SIZE=$(ls -lh code.tar.gz | awk '{print $5}')
log "📊 Archive size: $ARCHIVE_SIZE"

# Create manifest
cat > manifest.json << EOF
{
  "project": "vistara-ui",
  "backup_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "backup_name": "$BACKUP_NAME",
  "encryption": "AES-256-CBC",
  "archive_size": "$ARCHIVE_SIZE",
  "git_commit": "$(cd "$PROJECT_DIR" && git rev-parse HEAD 2>/dev/null || echo "no-git")",
  "git_branch": "$(cd "$PROJECT_DIR" && git branch --show-current 2>/dev/null || echo "no-git")",
  "host": "$(hostname)",
  "user": "$(whoami)"
}
EOF

# Encrypt the backup
log "🔐 Encrypting backup..."
openssl enc -aes-256-cbc -pbkdf2 -in code.tar.gz -out "${BACKUP_NAME}.tar.gz.enc" -k "$PASSWORD" 2>/dev/null || {
    log_error "Encryption failed"
    exit 1
}

# Create checksum
CHECKSUM=$(md5sum "${BACKUP_NAME}.tar.gz.enc" 2>/dev/null | cut -d' ' -f1 || md5 -q "${BACKUP_NAME}.tar.gz.enc")
echo "$CHECKSUM" > "${BACKUP_NAME}.checksum"

# Create bundle
log "📦 Creating iCloud bundle..."
mkdir -p "$ICLOUD_DIR/$BACKUP_NAME"
cp "${BACKUP_NAME}.tar.gz.enc" "$ICLOUD_DIR/$BACKUP_NAME/"
cp "${BACKUP_NAME}.checksum" "$ICLOUD_DIR/$BACKUP_NAME/"
cp manifest.json "$ICLOUD_DIR/$BACKUP_NAME/"

# Create decryption instructions
cat > "$ICLOUD_DIR/$BACKUP_NAME/DECRYPT_INSTRUCTIONS.txt" << EOF
Vistara-UI Backup Decryption Instructions
========================================

Backup Date: $(date '+%Y-%m-%d %H:%M:%S')
Encrypted File: ${BACKUP_NAME}.tar.gz.enc
Password: $PASSWORD

To decrypt and extract:

1. Open Terminal
2. Navigate to this directory
3. Run the following commands:

# Decrypt
openssl enc -aes-256-cbc -d -pbkdf2 -in ${BACKUP_NAME}.tar.gz.enc -out code.tar.gz -k "$PASSWORD"

# Extract
mkdir extracted
cd extracted
tar -xzf ../code.tar.gz

# Verify checksum
md5sum ${BACKUP_NAME}.tar.gz.enc
# Should match: $CHECKSUM

For automated restore, use the restore script in the project's backup directory.
EOF

# Update latest symlink
cd "$ICLOUD_DIR"
rm -f LATEST
ln -s "$BACKUP_NAME" LATEST

# Clean up old backups
log "🧹 Cleaning up old iCloud backups..."
BACKUP_COUNT=$(ls -1d vistaraui_backup_* 2>/dev/null | wc -l || echo 0)
if [ $BACKUP_COUNT -gt $MAX_BACKUPS ]; then
    DELETE_COUNT=$((BACKUP_COUNT - MAX_BACKUPS))
    log "Removing $DELETE_COUNT old backups..."
    ls -1dt vistaraui_backup_* | tail -n $DELETE_COUNT | while read dir; do
        rm -rf "$dir"
        log "  Removed: $dir"
    done
fi

# Clean up temp files
rm -rf "$TEMP_DIR"

# Create status file
cd "$PROJECT_DIR/backups"
cat > "LAST_ICLOUD_BACKUP_STATUS.md" << EOF
# Last iCloud Backup Status - Vistara-UI

**Last Backup:** $(date '+%Y-%m-%d %H:%M:%S')
**Backup Name:** ${BACKUP_NAME}
**Status:** ✅ SUCCESS

## Details:
- **Encrypted Size:** $(ls -lh "$ICLOUD_DIR/$BACKUP_NAME/${BACKUP_NAME}.tar.gz.enc" | awk '{print $5}')
- **Location:** $ICLOUD_DIR/$BACKUP_NAME/
- **Encryption:** AES-256-CBC
- **Password:** vistaraui_${DATE_ONLY}
- **Checksum:** $CHECKSUM
- **Retention:** 7 days (56 backups)

## Decrypt Command:
\`\`\`bash
cd "$ICLOUD_DIR/$BACKUP_NAME"
openssl enc -aes-256-cbc -d -pbkdf2 -in ${BACKUP_NAME}.tar.gz.enc -out code.tar.gz -k "$PASSWORD"
\`\`\`

---
*iCloud backup runs at: 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00*
EOF

log ""
log "☁️ ICLOUD BACKUP SUMMARY"
log "======================="
log "Backup Name: $BACKUP_NAME"
log "Location: $ICLOUD_DIR/$BACKUP_NAME/"
log "Encrypted Size: $(ls -lh "$ICLOUD_DIR/$BACKUP_NAME/${BACKUP_NAME}.tar.gz.enc" | awk '{print $5}')"
log "Password: $PASSWORD"
log "Status: ✅ SUCCESS"
log ""

send_alert "SUCCESS" "iCloud backup completed - $BACKUP_NAME"
log "🎉 iCloud backup completed successfully!"