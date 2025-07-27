# 🔧 מדריך התקנה מפורט - Vistara UI

> **סטטוס:** Active  
> **עודכן לאחרונה:** 2025-07-27  
> **רמת קושי:** Beginner  
> **זמן קריאה:** כ־10 דקות  
> **שייך לקטגוריה:** 01_getting_started  

---

## 📚 תוכן עניינים
- [🎯 סקירה כללית](#סקירה-כללית)
- [📋 דרישות מוקדמות](#דרישות-מוקדמות)
- [🚀 שלבי התקנה](#שלבי-התקנה)
- [⚙️ הגדרות נוספות](#הגדרות-נוספות)
- [🧯 פתרון בעיות נפוצות](#פתרון-בעיות-נפוצות)
- [🔗 משאבים נוספים](#משאבים-נוספים)

---

## 🎯 סקירה כללית

מדריך זה יעזור לך להתקין ולהגדיר את Vistara UI על המערכת שלך, כולל כל התלויות והכלים הנדרשים לפיתוח יעיל.

---

## 📋 דרישות מוקדמות

### מערכת הפעלה
- [ ] macOS 10.15+ / Windows 10+ / Linux Ubuntu 18.04+
- [ ] זיכרון RAM: 4GB מינימום, 8GB מומלץ
- [ ] אחסון: 2GB פנויים

### תוכנות נדרשות
- [ ] **Node.js** 16.14.0 או גבוה יותר
- [ ] **npm** 8.0+ או **yarn** 1.22+
- [ ] **Git** 2.30+
- [ ] **עורך קוד** (VS Code מומלץ)

### הרשאות
- [ ] גישה לאינטרנט
- [ ] הרשאות כתיבה בתיקיית הפרויקט
- [ ] אפשרות הפעלת שרתי פיתוח מקומיים

---

## 🚀 שלבי התקנה

### שלב 1: וידוא Node.js
בדוק שNode.js מותקן בגרסה הנכונה:

```bash
node --version
# צריך להציג v16.14.0 או גבוה יותר

npm --version  
# צריך להציג 8.0+ או גבוה יותר
```

**אם לא מותקן:**
1. גש ל-[nodejs.org](https://nodejs.org)
2. הורד גרסת LTS
3. התקן לפי ההוראות למערכת שלך

### שלב 2: כניסה לתיקיית הפרויקט
```bash
cd /Users/zvishilovitsky/vistara-ui
```

### שלב 3: התקנת תלויות
```bash
# התקנה סטנדרטית
npm install

# או עם yarn
yarn install

# או התקנה נקייה (מומלץ)
npm ci
```

### שלב 4: וידוא התקנה תקינה
```bash
# בדיקת פקודות פרויקט
npm run --help

# צריך להציג:
# start, build, test, eject, dev, scan-hardcoded, convert-hardcoded, etc.
```

### שלב 5: הפעלת שרת פיתוח
```bash
npm start
# או
npm run dev
```

**תוצאה צפויה:**
```
Local:            http://localhost:3000
On Your Network:  http://192.168.1.x:3000

webpack compiled with 0 errors
```

### שלב 6: פתח בדפדפן
1. פתח דפדפן
2. גש ל-`http://localhost:3000`
3. אמור לראות את Vistara UI Showcase

---

## ⚙️ הגדרות נוספות

### VS Code Extensions מומלצות
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode", 
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### הגדרת Prettier (אופציונלי)
צור קובץ `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5", 
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### הגדרת Git Hooks (מומלץ)
```bash
# התקנת husky לפני commit
npm install --save-dev husky

# הגדרת pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm run validate-design-system"
```

---

## 🧯 פתרון בעיות נפוצות

| בעיה | תופעה | פתרון |
|------|-------|--------|
| **Port 3000 תפוס** | `Error: listen EADDRINUSE: address already in use :::3000` | `lsof -ti:3000 \| xargs kill -9` או שנה פורט ב-package.json |
| **Node version לא נתמך** | `Unsupported Node.js version` | עדכן ל-Node.js 16+ |
| **npm install נכשל** | `ERESOLVE unable to resolve dependency tree` | `npm install --legacy-peer-deps` |
| **Tailwind לא עובד** | סגנונות לא מופיעים | בדוק ש-tailwind.config.js קיים ומוגדר |
| **CSS Variables לא עובדות** | צבעים לא מופיעים | בדוק ש-tokens.css נטען ב-index.js |

### בעיות נוספות

#### שגיאת הרשאות במacOS:
```bash
sudo chown -R $(whoami) /Users/zvishilovitsky/vistara-ui
```

#### ניקוי Cache:
```bash
npm start -- --reset-cache
# או
rm -rf node_modules package-lock.json
npm install
```

#### בדיקת תקינות מלאה:
```bash
npm run validate-design-system
```

---

## 🔗 משאבים נוספים

- [quick_start.md](./quick_start.md) - התחלה מהירה
- [architecture_overview.md](./architecture_overview.md) - ארכיטקטורת הפרויקט
- [UI Design Guide](../03_development/ui_design_guide.md) - מדריך עיצוב
- [troubleshooting](../08_troubleshooting/) - פתרון בעיות מתקדם

---

## 👥 יוצרים ובודקים

- ✍️ נכתב על ידי: Moss 🌱
- ✅ נבדק על ידי: Falcon 🦅  
- 📅 גרסה: v1.0
- 🧠 הערות: מדריך התקנה מפורט ומעודכן