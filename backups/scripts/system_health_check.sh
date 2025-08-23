#!/bin/bash
# 🔍 Vistara-UI System Health Check
# Comprehensive backup system monitoring
# Based on TitanMind's proven monitoring system

set -e

# Configuration
PROJECT_NAME="vistara-ui"
PROJECT_DIR="/Users/zvishilovitsky/vistara-ui"
BACKUP_DIR="$PROJECT_DIR/backups"
REPORT_FILE="$BACKUP_DIR/SYSTEM_HEALTH_REPORT.md"
LOG_FILE="$BACKUP_DIR/logs/health_check.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Check function
check() {
    local description="$1"
    local command="$2"
    local expected="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    printf "%-50s " "$description"
    
    if eval "$command" >/dev/null 2>&1; then
        if [ "$expected" = "success" ] || [ -z "$expected" ]; then
            echo -e "${GREEN}✅ PASS${NC}"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            return 0
        else
            echo -e "${RED}❌ FAIL${NC}"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            return 1
        fi
    else
        if [ "$expected" = "fail" ]; then
            echo -e "${GREEN}✅ PASS${NC}"
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            return 0
        else
            echo -e "${RED}❌ FAIL${NC}"
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            return 1
        fi
    fi
}

# Warning check function
check_warn() {
    local description="$1"
    local command="$2"
    local threshold="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    printf "%-50s " "$description"
    
    if eval "$command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${YELLOW}⚠️  WARN${NC}"
        WARNING_CHECKS=$((WARNING_CHECKS + 1))
        return 1
    fi
}

# Start health check
clear
echo -e "${BLUE}🔍 Vistara-UI Backup System Health Check${NC}"
echo -e "${BLUE}=======================================${NC}"
echo "Started: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

log "Starting system health check"

# 1. Project Structure Checks
echo -e "${BLUE}📁 Project Structure${NC}"
echo "-------------------"
check "Project directory exists" "test -d '$PROJECT_DIR'"
check "Backup directory exists" "test -d '$BACKUP_DIR'"
check "Scripts directory exists" "test -d '$BACKUP_DIR/scripts'"
check "Logs directory exists" "test -d '$BACKUP_DIR/logs'"
check "Local backups directory exists" "test -d '$BACKUP_DIR/local'"
check "External backup directory exists" "test -d '/Users/zvishilovitsky/Backup_All_Projects/vistara-ui'"
echo ""

# 2. Script Checks
echo -e "${BLUE}📜 Backup Scripts${NC}"
echo "----------------"
check "Main backup script exists" "test -f '$BACKUP_DIR/scripts/automatic_backup_every_15_minutes.sh'"
check "Main backup script executable" "test -x '$BACKUP_DIR/scripts/automatic_backup_every_15_minutes.sh'"
# iCloud backup scripts removed - no longer needed
check "GitHub backup script exists" "test -f '$BACKUP_DIR/scripts/backup_to_github.sh'"
check "GitHub backup script executable" "test -x '$BACKUP_DIR/scripts/backup_to_github.sh'"
echo ""

# 3. LaunchAgent Checks
echo -e "${BLUE}⚙️  LaunchAgent Configuration${NC}"
echo "----------------------------"
check "LaunchAgent file exists" "test -f '$HOME/Library/LaunchAgents/com.vistaraui.backup.15min.plist'"
check_warn "LaunchAgent is loaded" "launchctl list | grep -q 'com.vistaraui.backup.15min'"
echo ""

# 4. Backup History Checks
echo -e "${BLUE}📦 Backup History${NC}"
echo "-----------------"

# Count backups
LOCAL_BACKUP_COUNT=$(ls "$BACKUP_DIR/local/backup_"*"_code.tar.gz" 2>/dev/null | wc -l || echo 0)
EXTERNAL_BACKUP_COUNT=$(ls "/Users/zvishilovitsky/Backup_All_Projects/vistara-ui/backup_"*"_code.tar.gz" 2>/dev/null | wc -l || echo 0)

check "Local backups exist" "test $LOCAL_BACKUP_COUNT -gt 0"
check "External backups exist" "test $EXTERNAL_BACKUP_COUNT -gt 0"

if [ $LOCAL_BACKUP_COUNT -gt 0 ]; then
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR/local/backup_"*"_code.tar.gz" 2>/dev/null | head -1)
    BACKUP_AGE_MINUTES=$((($(date +%s) - $(stat -f %m "$LATEST_BACKUP" 2>/dev/null || stat -c %Y "$LATEST_BACKUP" 2>/dev/null || echo 0)) / 60))
    
    if [ $BACKUP_AGE_MINUTES -le 20 ]; then
        check "Latest backup is recent (<20 min)" "true"
    else
        check "Latest backup is recent (<20 min)" "false"
    fi
fi

echo ""

# 5. Git Repository Checks
echo -e "${BLUE}🐙 Git Repository${NC}"
echo "----------------"
if [ -d "$PROJECT_DIR/.git" ]; then
    check "Git repository exists" "true"
    check_warn "Git has remote origin" "cd '$PROJECT_DIR' && git remote get-url origin >/dev/null 2>&1"
    check_warn "Git working tree is clean" "cd '$PROJECT_DIR' && test -z \"\$(git status --porcelain)\""
else
    check "Git repository exists" "false"
fi
echo ""

# 6. Disk Space Checks
echo -e "${BLUE}💾 Disk Space${NC}"
echo "-------------"

# Get disk usage
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "Unknown")
AVAILABLE_SPACE=$(df -h "$PROJECT_DIR" | tail -1 | awk '{print $4}' || echo "Unknown")

echo "Backup directory size: $BACKUP_SIZE"
echo "Available disk space: $AVAILABLE_SPACE"

# Check if we have enough space (at least 1GB)
AVAILABLE_KB=$(df "$PROJECT_DIR" | tail -1 | awk '{print $4}' || echo 0)
check "Sufficient disk space (>1GB)" "test $AVAILABLE_KB -gt 1048576"
echo ""

# 7. Log File Checks
echo -e "${BLUE}📋 Log Files${NC}"
echo "-----------"
check "Main log file exists" "test -f '$BACKUP_DIR/logs/backup_15min.log'"

if [ -f "$BACKUP_DIR/logs/backup_15min_error.log" ]; then
    ERROR_COUNT=$(wc -l < "$BACKUP_DIR/logs/backup_15min_error.log" 2>/dev/null || echo 0)
    check_warn "No recent errors in log" "test $ERROR_COUNT -eq 0"
fi

echo ""

# 8. Cloud Backup Checks
echo -e "${BLUE}☁️  Cloud Backups${NC}"
echo "----------------"
# iCloud backup checks removed - no longer needed

echo ""

# Calculate score
SCORE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

# Display summary
echo -e "${BLUE}📊 HEALTH CHECK SUMMARY${NC}"
echo "======================="
echo "Total Checks: $TOTAL_CHECKS"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"
echo -e "Warnings: ${YELLOW}$WARNING_CHECKS${NC}"
echo ""

if [ $SCORE -ge 90 ]; then
    echo -e "Overall Score: ${GREEN}$SCORE% - EXCELLENT${NC}"
    STATUS_COLOR="$GREEN"
    STATUS="EXCELLENT"
elif [ $SCORE -ge 80 ]; then
    echo -e "Overall Score: ${GREEN}$SCORE% - GOOD${NC}"
    STATUS_COLOR="$GREEN"
    STATUS="GOOD"
elif [ $SCORE -ge 70 ]; then
    echo -e "Overall Score: ${YELLOW}$SCORE% - OK${NC}"
    STATUS_COLOR="$YELLOW"
    STATUS="OK"
else
    echo -e "Overall Score: ${RED}$SCORE% - NEEDS ATTENTION${NC}"
    STATUS_COLOR="$RED"
    STATUS="NEEDS ATTENTION"
fi

echo ""

# Create detailed report
cat > "$REPORT_FILE" << EOF
# Vistara-UI Backup System Health Report

**Generated:** $(date '+%Y-%m-%d %H:%M:%S')
**Overall Score:** $SCORE% - $STATUS

## Summary
- **Total Checks:** $TOTAL_CHECKS
- **Passed:** $PASSED_CHECKS ✅
- **Failed:** $FAILED_CHECKS ❌
- **Warnings:** $WARNING_CHECKS ⚠️

## Backup Statistics
- **Local Backups:** $LOCAL_BACKUP_COUNT files
- **External Backups:** $EXTERNAL_BACKUP_COUNT files
- **Backup Directory Size:** $BACKUP_SIZE
- **Available Disk Space:** $AVAILABLE_SPACE

## Quick Commands
\`\`\`bash
# Run health check
cd $PROJECT_DIR/backups/scripts
./system_health_check.sh

# Check latest backups
ls -la $BACKUP_DIR/local/ | tail -5

# Manual backup
./automatic_backup_every_15_minutes.sh

# Check LaunchAgent status
launchctl list | grep vistaraui
\`\`\`

EOF

# Add recommendations if score is low
if [ $SCORE -lt 80 ]; then
    cat >> "$REPORT_FILE" << EOF

## ⚠️ Recommendations
EOF
    
    if [ $FAILED_CHECKS -gt 0 ]; then
        cat >> "$REPORT_FILE" << EOF
- Fix failed checks by running the health check script again
- Ensure all backup scripts are executable
- Verify LaunchAgent is properly loaded
EOF
    fi
    
    if [ $LOCAL_BACKUP_COUNT -eq 0 ]; then
        cat >> "$REPORT_FILE" << EOF
- No local backups found - run manual backup immediately
EOF
    fi
fi

cat >> "$REPORT_FILE" << EOF

---
*Generated by Vistara-UI Health Check System*
EOF

echo "📄 Detailed report saved to: $REPORT_FILE"
echo ""

# Final recommendation
if [ $SCORE -ge 90 ]; then
    echo -e "${GREEN}🎉 Your backup system is working excellently!${NC}"
elif [ $SCORE -ge 80 ]; then
    echo -e "${GREEN}✅ Your backup system is working well!${NC}"
else
    echo -e "${YELLOW}⚠️  Your backup system needs attention. Check the failed items above.${NC}"
fi

log "Health check completed - Score: $SCORE%"