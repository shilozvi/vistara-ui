# 🎯 מערכת גיבויים Vistara-UI - מדריך יישום מפורט

> **Based on EAGLE_BACKUP_MASTER_SPEC.md v1.0**  
> **עודכן לאחרונה:** 2025-08-04  
> **יוצר:** Claude (מבוסס על מערכת TitanMind של Eagle)  
> **גרסה:** 1.1  
> **סטטוס:** ✅ Active

---

## 📋 תוכן עניינים

1. [סקירה כללית](#סקירה-כללית)
2. [מה בדיוק הותקן](#מה-בדיוק-הותקן)
3. [מבנה הקבצים שנוצרו](#מבנה-הקבצים-שנוצרו)
4. [LaunchAgents שהותקנו](#launchagents-שהותקנו)
5. [סקריפטים שנוצרו](#סקריפטים-שנוצרו)
6. [מערכת הניטור](#מערכת-הניטור)
7. [פקודות בדיקה](#פקודות-בדיקה)
8. [פתרון בעיות](#פתרון-בעיות)

---

## 📖 סקירה כללית

מערכת הגיבויים של Vistara-UI מבוססת על EAGLE_BACKUP_MASTER_SPEC.md ומספקת הגנה מרובת שכבות עם 144 גיבויים ביום על פני 3 מערכות עצמאיות.

### 🎯 עקרונות המערכת (לפי Master Spec):
- **3-tier backup system**: Local, iCloud, GitHub
- **אוטומציה מלאה**: פועל ברקע ללא התערבות
- **הצפנה**: AES-256-CBC לגיבויי ענן
- **144 גיבויים ביום**: 96 מקומי + 24 iCloud + 24 GitHub
- **48 שעות retention** לכל סוגי הגיבויים

---

## 🛠️ מה בדיוק הותקן

### 1. מבנה תיקיות:
```bash
mkdir -p /Users/zvishilovitsky/vistara-ui/backups/{scripts,logs,local}
mkdir -p /Users/zvishilovitsky/Backup_All_Projects/vistara-ui
mkdir -p /Users/zvishilovitsky/vistara-ui/docs_VistaraUI/06_backup
```

### 2. סקריפטי גיבוי:
- `automatic_backup_every_15_minutes.sh` - גיבוי מקומי כל 15 דקות
- `backup_to_icloud.sh` - גיבוי מוצפן ל-iCloud כל שעה ב-:00
- `backup_to_github.sh` - גיבוי ל-GitHub כל שעה ב-:30
- `system_health_check.sh` - בדיקת תקינות מערכת

### 3. LaunchAgents:
- `com.vistaraui.backup.15min.plist` - משימה כל 15 דקות
- `com.vistaraui.backup.icloud.plist` - משימות כל שעה ב-:00 (24 ביום)
- `com.vistaraui.backup.github.plist` - משימות כל שעה ב-:30 (24 ביום)

### 4. הרצה ראשונה:
- הפעלת כל ה-LaunchAgents
- ביצוע גיבוי ראשון בהצלחה
- בדיקת תקינות מערכת

---

## 📁 מבנה הקבצים שנוצרו

```
/Users/zvishilovitsky/vistara-ui/
├── backups/
│   ├── scripts/
│   │   ├── automatic_backup_every_15_minutes.sh     # 📜 גיבוי מקומי
│   │   ├── backup_to_icloud.sh                      # ☁️ גיבוי iCloud
│   │   ├── backup_to_github.sh                      # 🐙 גיבוי GitHub
│   │   └── system_health_check.sh                   # 🔍 בדיקת תקינות
│   ├── logs/
│   │   ├── backup_15min.log                         # 📋 לוגי גיבוי מקומי
│   │   ├── backup_15min_error.log                   # ❌ שגיאות גיבוי מקומי
│   │   ├── icloud_backup.log                        # ☁️ לוגי iCloud
│   │   ├── icloud_backup_error.log                  # ❌ שגיאות iCloud
│   │   ├── github_backup.log                        # 🐙 לוגי GitHub
│   │   ├── github_backup_error.log                  # ❌ שגיאות GitHub
│   │   ├── health_check.log                         # 🔍 לוגי בדיקת תקינות
│   │   └── alerts.log                               # 🚨 התראות
│   ├── local/
│   │   ├── backup_YYYYMMDD_HHMMSS_code.tar.gz      # 📦 גיבויים מקומיים
│   │   ├── backup_YYYYMMDD_HHMMSS_code.checksum    # 🔐 בדיקת שלמות
│   │   └── backup_YYYYMMDD_HHMMSS_info.txt         # ℹ️ מידע על הגיבוי
│   ├── LAST_BACKUP_STATUS.md                        # 📊 סטטוס אחרון
│   ├── LAST_ICLOUD_BACKUP_STATUS.md                 # ☁️ סטטוס iCloud
│   ├── LAST_GITHUB_BACKUP_STATUS.md                 # 🐙 סטטוס GitHub
│   ├── SYSTEM_HEALTH_REPORT.md                      # 🏥 דוח תקינות
│   └── VISTARA_UI_BACKUP_GUIDE.md                   # 📖 מדריך שימוש
├── docs_VistaraUI/
│   └── 06_backup/
│       ├── backup_guide.md                          # 📚 מדריך משתמש
│       └── backup_system_implementation.md          # 📚 המדריך הזה
└── [קבצי הפרויקט...]

/Users/zvishilovitsky/Backup_All_Projects/vistara-ui/
└── [גיבויים חיצוניים - מראה של המקומיים]

/Users/zvishilovitsky/Library/LaunchAgents/
├── com.vistaraui.backup.15min.plist                 # ⚙️ משימה 15 דקות
├── com.vistaraui.backup.icloud.plist                # ⚙️ משימות iCloud
└── com.vistaraui.backup.github.plist                # ⚙️ משימות GitHub

~/Library/Mobile Documents/com~apple~CloudDocs/Vistara_UI_Backups/
└── [גיבויים מוצפנים - 48 גיבויים, 48 שעות]
```

---

## ⚙️ LaunchAgents שהותקנו

### 1. גיבוי מקומי כל 15 דקות
**קובץ:** `com.vistaraui.backup.15min.plist`
```xml
<key>StartInterval</key>
<integer>900</integer>  <!-- 15 דקות -->
```
- רץ כל 15 דקות, 24/7
- יוצר גיבוי מקומי + חיצוני
- שומר 192 גיבויים (48 שעות)

### 2. גיבוי iCloud כל שעה
**קובץ:** `com.vistaraui.backup.icloud.plist`
```xml
<key>StartCalendarInterval</key>
<!-- זמנים: 00:00, 01:00, 02:00... 23:00 -->
```
- 24 גיבויים ביום
- הצפנה AES-256-CBC
- סיסמה: `vistaraui_YYYYMMDD`
- שמירה: 48 שעות (48 גיבויים)

### 3. גיבוי GitHub כל שעה
**קובץ:** `com.vistaraui.backup.github.plist`
```xml
<key>StartCalendarInterval</key>
<!-- זמנים: 00:30, 01:30, 02:30... 23:30 -->
```
- 24 גיבויים ביום
- תגיות יומיות אוטומטיות
- היסטוריית commits מלאה
- שמירה: 48 שעות (48 תגיות)

---

## 📜 סקריפטים שנוצרו

### 1. automatic_backup_every_15_minutes.sh
**תכונות עיקריות:**
- דחיסת TAR+GZIP עם החרגות חכמות
- יצירת checksums אוטומטית
- בדיקת שלמות הגיבוי
- העתקה לגיבוי חיצוני
- ניקוי גיבויים ישנים מ-48 שעות
- לוגים מפורטים

**החרגות:**
```bash
--exclude='.git'
--exclude='node_modules'
--exclude='dist'
--exclude='build'
--exclude='.next'
--exclude='coverage'
--exclude='*.log'
--exclude='backups'
--exclude='.DS_Store'
```

### 2. backup_to_icloud.sh
**תכונות עיקריות:**
- שימוש בגיבוי מקומי קיים אם זמין
- הצפנה עם OpenSSL (AES-256-CBC)
- יצירת manifest.json
- הוראות פענוח אוטומטיות
- ניקוי גיבויים ישנים מ-48 שעות (48 גיבויים)

**פורמט הצפנה:**
```bash
openssl enc -aes-256-cbc -pbkdf2 -in code.tar.gz -out backup.tar.gz.enc -k "vistaraui_20250804"
```

### 3. backup_to_github.sh
**תכונות עיקריות:**
- בדיקת שינויים אוטומטית
- stash זמני לבטיחות
- commit עם מסר מפורט
- push אוטומטי
- תגיות יומיות
- ניקוי תגיות ישנות מ-48 שעות

**פורמט commit:**
```
[2025-08-04 HH:MM] Auto backup - Code: XXX MB, Changes: N files
```

### 4. system_health_check.sh
**בדיקות שמבוצעות:**
- מבנה תיקיות (6 בדיקות)
- קיום וביצוע סקריפטים (6 בדיקות)
- הגדרת LaunchAgents (3 בדיקות)
- היסטוריית גיבויים (3 בדיקות)
- מאגר Git (3 בדיקות)
- מקום בדיסק (1 בדיקה)
- קבצי לוג (2 בדיקות)
- גיבויי ענן (2 בדיקות)
- תאימות ל-Master Spec (1 בדיקה)

**ציון בריאות:**
- 90%+ = EXCELLENT
- 80-89% = GOOD
- 70-79% = OK
- <70% = NEEDS ATTENTION

---

## 🔍 מערכת הניטור

### קבצי סטטוס אוטומטיים:
1. **LAST_BACKUP_STATUS.md** - מתעדכן אחרי כל גיבוי מקומי
2. **LAST_ICLOUD_BACKUP_STATUS.md** - מתעדכן אחרי גיבוי iCloud
3. **LAST_GITHUB_BACKUP_STATUS.md** - מתעדכן אחרי גיבוי GitHub
4. **SYSTEM_HEALTH_REPORT.md** - מתעדכן אחרי בדיקת תקינות

### התראות:
- התראות macOS עבור הצלחות/כשלים
- רישום בקובץ alerts.log
- מידע מפורט בלוגים

---

## 🔧 פקודות בדיקה

### בדיקה יומית מומלצת:
```bash
cd /Users/zvishilovitsky/vistara-ui/backups/scripts
./system_health_check.sh
```

### בדיקת גיבויים אחרונים:
```bash
# 5 גיבויים אחרונים
ls -la /Users/zvishilovitsky/vistara-ui/backups/local/ | tail -5

# גיבויים מהיום
ls -la /Users/zvishilovitsky/vistara-ui/backups/local/ | grep "$(date +'%b %e')"
```

### בדיקת LaunchAgents:
```bash
# סטטוס כל המשימות
launchctl list | grep vistaraui

# פרטים על משימה ספציפית
launchctl list com.vistaraui.backup.15min
```

### בדיקת לוגים:
```bash
# לוג גיבוי מקומי
tail -20 /Users/zvishilovitsky/vistara-ui/backups/logs/backup_15min.log

# שגיאות אם יש
tail -20 /Users/zvishilovitsky/vistara-ui/backups/logs/backup_15min_error.log

# התראות מערכת
tail -20 /Users/zvishilovitsky/vistara-ui/backups/logs/alerts.log
```

---

## 🚨 פתרון בעיות

### LaunchAgent לא פועל:
```bash
# בטל טעינה וטען מחדש
launchctl unload ~/Library/LaunchAgents/com.vistaraui.backup.15min.plist
launchctl load ~/Library/LaunchAgents/com.vistaraui.backup.15min.plist

# בדוק סטטוס
launchctl list com.vistaraui.backup.15min
```

### גיבוי iCloud נכשל:
```bash
# בדוק אם iCloud זמין
ls ~/Library/Mobile\ Documents/com~apple~CloudDocs/

# הרץ ידנית לבדיקה
cd /Users/zvishilovitsky/vistara-ui/backups/scripts
./backup_to_icloud.sh
```

### גיבוי GitHub נכשל:
```bash
# בדוק אותנטיקציה
ssh -T git@github.com

# בדוק הגדרות Git
git config user.name
git config user.email

# הרץ ידנית
./backup_to_github.sh
```

### מקום בדיסק נגמר:
```bash
# בדוק גודל גיבויים
du -sh /Users/zvishilovitsky/vistara-ui/backups/local/
du -sh /Users/zvishilovitsky/Backup_All_Projects/vistara-ui/

# מחק גיבויים ישנים מ-48 שעות באופן ידני אם נדרש
find /Users/zvishilovitsky/vistara-ui/backups/local/ -name "*.tar.gz" -mmin +2880 -delete
```

---

## 📊 מדדי ביצוע

### יעדי המערכת (לפי Master Spec):
- **תדירות גיבויים**: 144 ביום (96 מקומי + 24 iCloud + 24 GitHub)
- **זמן שמירה**: 48 שעות לכל סוג גיבוי
- **הצפנה**: AES-256-CBC לגיבויי ענן
- **ניטור**: 24/7 עם בדיקות תקינות

### תדירות הגיבויים:
- **מקומי**: כל 15 דקות = 96 ביום
- **iCloud**: כל שעה ב-:00 = 24 ביום  
- **GitHub**: כל שעה ב-:30 = 24 ביום
- **סה"כ**: 144 גיבויים ביום

---

## ✅ סיכום

מערכת הגיבויים של Vistara-UI מבוססת על EAGLE_BACKUP_MASTER_SPEC.md v1.0 ומספקת:

1. ✅ **3-tier backup system** - Local, iCloud, GitHub
2. ✅ **144 גיבויים ביום** - על פי המפרט המדויק
3. ✅ **48 שעות retention** - לכל סוגי הגיבויים
4. ✅ **הצפנה AES-256-CBC** - לגיבויי ענן
5. ✅ **אוטומציה מלאה** - ללא צורך בהתערבות
6. ✅ **ניטור והתראות** - דוחות אוטומטיים

**המערכת פועלת אוטומטית ברקע ומספקת הגנה מקסימלית לפרויקט!** 🛡️

---

*מדריך זה מתעד את מערכת הגיבויים של Vistara-UI*  
*עדכון אחרון: 2025-08-04*  
*מבוסס על: EAGLE_BACKUP_MASTER_SPEC.md v1.0*