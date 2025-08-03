# ⚡ Azure Backup Quick Reference - Vistara-UI

**For when you need answers FAST!**

---

## 🚨 Status Check Commands

```bash
# Current backup status
cat /Users/zvishilovitsky/vistara-ui/backups/LAST_AZURE_BACKUP_STATUS.md

# Check if backups are running
ps aux | grep azure_backup | grep -v grep

# View recent backup logs
tail -20 /Users/zvishilovitsky/vistara-ui/backups/logs/azure_backup.log

# Check LaunchAgent status
launchctl list | grep "com.vistaraui.backup.azure"
```

---

## 🔧 Common Fixes

### Authentication Error
```bash
# Re-authenticate with Azure
cd /Users/zvishilovitsky/vistara-ui
git push azure main
# Enter username: shilozvi
# Enter password: [Your PAT Token]
```

### Backup Not Running
```bash
# Reload LaunchAgents
for i in {00..23}; do
    launchctl unload ~/Library/LaunchAgents/com.vistaraui.backup.azure.$i.plist 2>/dev/null
    launchctl load ~/Library/LaunchAgents/com.vistaraui.backup.azure.$i.plist
done
```

### Manual Backup
```bash
# Run backup manually
/Users/zvishilovitsky/vistara-ui/backups/scripts/azure_backup_system.sh
```

---

## 📍 Important Locations

| What | Where |
|------|-------|
| Backup Script | `/Users/zvishilovitsky/vistara-ui/backups/scripts/azure_backup_system.sh` |
| Status File | `/Users/zvishilovitsky/vistara-ui/backups/LAST_AZURE_BACKUP_STATUS.md` |
| Logs | `/Users/zvishilovitsky/vistara-ui/backups/logs/azure_backup.log` |
| LaunchAgents | `~/Library/LaunchAgents/com.vistaraui.backup.azure.*.plist` |
| Azure URL | https://dev.azure.com/shilozvi/Vistara-UI |

---

## 🕐 Backup Schedule

**Azure Backups:** Every hour at :30
- 00:30, 01:30, 02:30... 23:30
- Total: 24 backups per day
- Retention: 48 hours

---

## 🔐 PAT Token Setup

1. Go to: https://dev.azure.com/shilozvi/_usersSettings/tokens
2. Create token with Code (Read & Write) permissions
3. Save securely - you won't see it again!

---

*Quick reference by Eagle 🦅*