# 🚀 Azure DevOps Backup Setup Guide - Vistara-UI

**Last Updated:** 2025-08-03  
**Version:** 1.0  
**Prepared by:** Eagle 🦅 DevOps Backup Specialist

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Azure DevOps Account](#step-1-create-azure-devops-account)
4. [Step 2: Create Personal Access Token](#step-2-create-personal-access-token)
5. [Step 3: Configure Git for Azure](#step-3-configure-git-for-azure)
6. [Step 4: Add Azure Remote](#step-4-add-azure-remote)
7. [Step 5: Test Connection](#step-5-test-connection)
8. [Step 6: Setup Automated Backups](#step-6-setup-automated-backups)
9. [Verification](#verification)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This guide walks you through setting up Azure DevOps as the backup destination for the Vistara-UI project. Azure DevOps provides:
- ✅ Unlimited private Git repositories
- ✅ No size restrictions (unlike GitHub's 5GB limit)
- ✅ Free for up to 5 users
- ✅ Enterprise-grade reliability

**Current Status:** Azure remote configured, awaiting authentication setup

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] Access to Azure DevOps (https://dev.azure.com)
- [ ] Git installed on your system
- [ ] Access to the Vistara-UI project directory
- [ ] Admin access to create Personal Access Tokens

---

## 📝 Step 1: Create Azure DevOps Account

### If you don't have an account:
1. Go to https://azure.microsoft.com/en-us/services/devops/
2. Click "Start free"
3. Sign in with your Microsoft account or create one
4. Follow the setup wizard

### If you already have an account:
1. Go to https://dev.azure.com
2. Sign in with your credentials
3. You should see your organization (e.g., `shilozvi`)

---

## 🔐 Step 2: Create Personal Access Token

**CRITICAL:** This is required for Git authentication with Azure DevOps.

1. **Navigate to PAT Settings:**
   ```
   https://dev.azure.com/shilozvi/_usersSettings/tokens
   ```

2. **Click "New Token"**

3. **Configure the token:**
   - **Name:** `Vistara-UI-Backup-Token`
   - **Organization:** `shilozvi`
   - **Expiration:** Select "Custom defined" → 1 year from now
   - **Scopes:** Click "Custom defined" then select:
     - ✅ Code → Read & Write

4. **Click "Create"**

5. **⚠️ IMPORTANT:** Copy the token immediately!
   - You won't be able to see it again
   - Store it securely (e.g., in a password manager)

---

## 🔧 Step 3: Configure Git for Azure

### Option A: Store credentials permanently (recommended)
```bash
# Enable credential storage
git config --global credential.helper store

# Configure your identity
git config --global user.name "shilozvi"
git config --global user.email "shilozvi@gmail.com"
```

### Option B: Use macOS Keychain
```bash
# Use macOS keychain for secure storage
git config --global credential.helper osxkeychain
```

---

## 🔗 Step 4: Add Azure Remote

The Azure remote has already been added to your repository:

```bash
# Verify the remote
cd /Users/zvishilovitsky/vistara-ui
git remote -v

# You should see:
# azure    https://shilozvi@dev.azure.com/shilozvi/Vistara-UI/_git/Vistara-UI (fetch)
# azure    https://shilozvi@dev.azure.com/shilozvi/Vistara-UI/_git/Vistara-UI (push)
```

If missing, add it:
```bash
git remote add azure https://shilozvi@dev.azure.com/shilozvi/Vistara-UI/_git/Vistara-UI
```

---

## 🧪 Step 5: Test Connection

Test your Azure connection with your PAT:

```bash
cd /Users/zvishilovitsky/vistara-ui

# First push - will ask for credentials
git push azure main

# When prompted:
# Username: shilozvi
# Password: [paste your PAT token here]
```

If successful, credentials will be saved and future pushes will be automatic.

---

## 🤖 Step 6: Setup Automated Backups

### The automated system is already configured:

1. **Backup Script:** `/Users/zvishilovitsky/vistara-ui/backups/scripts/azure_backup_system.sh`
2. **LaunchAgents:** 24 hourly agents (00-23) in `~/Library/LaunchAgents/`
3. **Schedule:** Every hour at :30 (00:30, 01:30, 02:30... 23:30)

### Verify LaunchAgents are loaded:
```bash
# Check if agents are loaded
launchctl list | grep "com.vistaraui.backup.azure"

# If not loaded, load them:
for i in {00..23}; do
    launchctl load ~/Library/LaunchAgents/com.vistaraui.backup.azure.$i.plist
done
```

---

## ✅ Verification

### 1. Check backup status:
```bash
cat /Users/zvishilovitsky/vistara-ui/backups/LAST_AZURE_BACKUP_STATUS.md
```

### 2. View backup logs:
```bash
tail -f /Users/zvishilovitsky/vistara-ui/backups/logs/azure_backup.log
```

### 3. Check Azure DevOps:
Visit: https://dev.azure.com/shilozvi/Vistara-UI/_git/Vistara-UI

You should see:
- Recent commits with messages like "🔄 Backup: YYYY-MM-DD HH:MM"
- All project files synchronized

### 4. Manual backup test:
```bash
/Users/zvishilovitsky/vistara-ui/backups/scripts/azure_backup_system.sh
```

---

## 🔧 Troubleshooting

### Authentication Failed
```
fatal: Authentication failed for 'https://dev.azure.com/...'
```
**Solution:** Create a new PAT token and try again

### Push Rejected
```
! [rejected]        main -> main (non-fast-forward)
```
**Solution:** Pull first: `git pull azure main --allow-unrelated-histories`

### LaunchAgent Not Working
```bash
# Check agent status
launchctl list | grep vistaraui

# View agent errors
tail -f /tmp/com.vistaraui.backup.azure.*.log

# Reload agent
launchctl unload ~/Library/LaunchAgents/com.vistaraui.backup.azure.00.plist
launchctl load ~/Library/LaunchAgents/com.vistaraui.backup.azure.00.plist
```

### Large Repository Issues
If push takes too long:
```bash
# Enable Git LFS for large files
git lfs track "*.png" "*.jpg" "*.svg" "*.zip"
git add .gitattributes
git commit -m "Enable Git LFS"
```

---

## 📞 Support

**Issues with this guide?**
- Check: `/Users/zvishilovitsky/vistara-ui/backups/LAST_AZURE_BACKUP_STATUS.md`
- Logs: `/Users/zvishilovitsky/vistara-ui/backups/logs/azure_backup.log`
- Contact: Eagle 🦅 (DevOps Backup Specialist)

---

## 🎯 Next Steps

Once authentication is configured:
1. ✅ Automated backups will run every hour
2. ✅ Status updates in LAST_AZURE_BACKUP_STATUS.md
3. ✅ Daily reports will include Azure backup status
4. ✅ All data safely stored in Azure DevOps

---

*Guide prepared by Eagle 🦅 - Your DevOps Backup Specialist*