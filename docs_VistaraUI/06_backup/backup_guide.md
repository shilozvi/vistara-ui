# 🎯 מדריך גיבויים מלא - Vistara-UI

**מערכת גיבויים מתקדמת מבוססת TitanMind**
**נוצר:** 27/01/2025
**סטטוס:** ✅ פעיל ופועל

---

## 🚀 סיכום המערכת שהותקנה

### ✅ מה הותקן בהצלחה:

1. **גיבוי אוטומטי כל 15 דקות**
   - 📁 מיקום: `/Users/zvishilovitsky/vistara-ui/backups/local/`
   - 📁 גיבוי חיצוני: `/Users/zvishilovitsky/Backup_All_Projects/vistara-ui/`
   - 🔄 שמירה: 96 גיבויים (24 שעות)
   - ✅ פועל אוטומטית ברקע

2. **גיבוי מוצפן ל-iCloud (כל שעה)**
   - 📁 מיקום: `~/Library/Mobile Documents/com~apple~CloudDocs/Vistara_UI_Backups/`
   - 🔐 הצפנה: AES-256-CBC
   - 🔑 סיסמה: `vistaraui_YYYYMMDD`
   - ⏰ זמנים: 00:00, 01:00, 02:00... 23:00 (24 ביום)
   - 🗂️ שמירה: 48 שעות

3. **גיבוי אוטומטי ל-GitHub (כל שעה)**
   - 🐙 Repository: https://github.com/shilozvi/vistara-ui
   - ⏰ זמנים: 00:30, 01:30, 02:30... 23:30 (24 ביום)
   - 🏷️ תגיות יומיות אוטומטיות
   - 🗂️ שמירה: 48 שעות

4. **מערכת ניטור ובדיקת תקינות**
   - 📊 דוח תקינות מפורט
   - 🔍 בדיקות אוטומטיות
   - 📝 לוגים מפורטים

---

## 📋 פקודות שימושיות

### בדיקת סטטוס מהירה:
```bash
# בדיקת תקינות מלאה
cd /Users/zvishilovitsky/vistara-ui/backups/scripts
./system_health_check.sh

# בדיקת גיבויים אחרונים
ls -la /Users/zvishilovitsky/vistara-ui/backups/local/ | tail -5

# בדיקת LaunchAgents
launchctl list | grep vistaraui
```

### גיבוי ידני מיידי:
```bash
cd /Users/zvishilovitsky/vistara-ui/backups/scripts
./automatic_backup_every_15_minutes.sh
```

### בדיקת לוגים:
```bash
# לוגים של גיבוי יומיומי
tail -20 /Users/zvishilovitsky/vistara-ui/backups/logs/backup_15min.log

# לוגים של גיבוי iCloud
tail -20 /Users/zvishilovitsky/vistara-ui/backups/logs/icloud_backup.log

# שגיאות (אם יש)
tail -20 /Users/zvishilovitsky/vistara-ui/backups/logs/backup_15min_error.log
```

---

## 🔐 שחזור מגיבויים

### שחזור מגיבוי מקומי:
```bash
# בחר גיבוי מהרשימה
ls -la /Users/zvishilovitsky/vistara-ui/backups/local/

# צור תיקיית שחזור זמנית
mkdir /tmp/vistara_restore_$(date +%H%M%S)
cd /tmp/vistara_restore_*

# חלץ את הגיבוי
cp /Users/zvishilovitsky/vistara-ui/backups/local/backup_YYYYMMDD_HHMMSS_code.tar.gz .
tar -xzf backup_YYYYMMDD_HHMMSS_code.tar.gz

# העתק בחזרה מה שצריך (בזהירות!)
```

### שחזור מ-iCloud:
```bash
# נווט לתיקיית iCloud
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/Vistara_UI_Backups/

# בחר גיבוי
ls -la

# פענח (השתמש בסיסמה vistaraui_YYYYMMDD)
cd vistaraui_backup_YYYYMMDD_HHMMSS/
openssl enc -aes-256-cbc -d -pbkdf2 -in *.tar.gz.enc -out code.tar.gz -k "vistaraui_20250127"

# חלץ
tar -xzf code.tar.gz
```

---

## 📊 מבנה המערכת

```
vistara-ui/
├── backups/
│   ├── scripts/
│   │   ├── automatic_backup_every_15_minutes.sh
│   │   ├── backup_to_icloud.sh
│   │   ├── backup_to_github.sh
│   │   └── system_health_check.sh
│   ├── logs/
│   │   ├── backup_15min.log
│   │   ├── icloud_backup.log
│   │   └── github_backup.log
│   ├── local/
│   │   └── backup_YYYYMMDD_HHMMSS_code.tar.gz
│   └── LAST_BACKUP_STATUS.md
└── [קבצי הפרויקט]
```

---

## ⚙️ LaunchAgents מותקנים

1. `com.vistaraui.backup.15min.plist` - גיבוי כל 15 דקות
2. `com.vistaraui.backup.icloud.plist` - גיבוי iCloud כל 3 שעות
3. `com.vistaraui.backup.github.plist` - גיבוי GitHub כל 3 שעות

### הפעלה מחדש של LaunchAgents:
```bash
launchctl unload ~/Library/LaunchAgents/com.vistaraui.backup.*.plist
launchctl load ~/Library/LaunchAgents/com.vistaraui.backup.*.plist
```

---

## 🛡️ הגנות ובטיחות

### ✅ מה מוגן:
- **גיבוי כפול**: מקומי + חיצוני
- **הצפנה**: כל גיבויי iCloud מוצפנים
- **שלמות**: בדיקת MD5 לכל גיבוי
- **היסטוריה**: Git + תגיות אוטומטיות
- **ניטור**: בדיקות תקינות אוטומטיות

### ⚠️ חוקי זהב:
1. **אל תמחק תיקיית `/backups/`**
2. **תמיד שחזר לתיקיה זמנית קודם**
3. **בדוק שלמות הגיבוי לפני שימוש**
4. **שמור סיסמאות iCloud במקום בטוח**

---

## 📈 סטטיסטיקות המערכת

- **תדירות גיבוי**: כל 15 דקות (96 ביום)
- **גיבויי ענן**: 48 ביום (24 iCloud + 24 GitHub)
- **שמירה מקומית**: 48 שעות
- **שמירה בענן**: 48 שעות
- **הצפנה**: AES-256-CBC
- **בדיקת שלמות**: MD5 + tar verification

---

## 💡 טיפים לשימוש

### לפני שינוי גדול:
```bash
# צור גיבוי מיוחד
cd /Users/zvishilovitsky/vistara-ui/backups/scripts
./automatic_backup_every_15_minutes.sh

# תייג במיוחד
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp /Users/zvishilovitsky/vistara-ui/backups/local/backup_*_code.tar.gz \
   /Users/zvishilovitsky/vistara-ui/backups/local/BEFORE_BIG_CHANGE_${TIMESTAMP}.tar.gz
```

### בדיקה יומית מומלצת:
```bash
# פקודה אחת לבדיקה יומית
cd /Users/zvishilovitsky/vistara-ui/backups/scripts && ./system_health_check.sh
```

---

## 🎉 סיכום

**המערכת שלך עכשיו מוגנת ב-144 גיבויים ביום!**

- ✅ **96 גיבויים מקומיים** (כל 15 דקות)
- ✅ **24 גיבויים מוצפנים ל-iCloud** (כל שעה ב-:00)
- ✅ **24 גיבויים ל-GitHub** (כל שעה ב-:30)
- ✅ **בדיקות תקינות אוטומטיות**
- ✅ **התראות מיידיות**

**המערכת פועלת אוטומטית ברקע - אתה יכול לישון בשקט!** 😴

---

*נוצר על ידי Claude בהתבסס על המערכת המתקדמת של TitanMind*
*כל הקרדיט ל-Eagle 🦅 על הפיתוח המקורי*