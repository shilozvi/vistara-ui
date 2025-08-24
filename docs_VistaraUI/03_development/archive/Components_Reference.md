# 📚 Vistara UI - Components Reference
> **"Command your Design."** - מדריך מלא לכל הרכיבים בספרייה

---

## 🎯 סקירה כללית

**Vistara UI** היא ספריית רכיבים מתקדמת המבוססת על **CSS Variables בלבד** (ללא Tailwind), עם תמיכה מלאה ב-RTL ומערכת עיצוב מובנית.

- **📦 סה"כ רכיבים:** 6 רכיבים פעילים
- **🔄 מקור:** הועברו מ-TitanMind עם אדריכלות CSS Variables מחדש
- **🎨 עיצוב:** 3-layer CSS Variables system
- **🌐 תמיכה:** RTL (עברית), LTR (אנגלית)
- **📱 תגובה:** Size variants: compact, normal, expanded

---

## 🗂️ טבלת רכיבים

| 🧩 **Component**         | 📁 **Category** | 🎛️ **Key Props**                           | 🎨 **Themes**               | 📐 **Sizes**              | 🏷️ **Tags**                          | 📝 **Description**                                                    |
|--------------------------|-----------------|---------------------------------------------|----------------------------|---------------------------|--------------------------------------|-----------------------------------------------------------------------|
| `CompactTaskCard`        | `common`        | `task`, `onComplete`, `onDelete`, `size`    | `default`, `minimal`, `detailed` | `small`, `normal`, `large` | task, card, ui, management           | Displays a compact view of a task with status indicators             |
| `TokenUsageMonitor`      | `data`          | `size`, `theme`, `refreshInterval`          | `default`, `minimal`, `detailed` | `compact`, `normal`, `expanded` | token, usage, monitoring, ai         | Real-time token usage monitoring with cost tracking                  |
| `SystemHealthDashboard`  | `display`       | `size`, `theme`, `mockData`                 | `default`, `minimal`, `detailed` | `compact`, `normal`, `expanded` | system, health, monitoring, metrics  | Comprehensive system health dashboard with performance metrics       |
| `AgentCard`              | `display`       | `size`, `theme`, `refreshInterval`          | `default`, `minimal`, `detailed` | `compact`, `normal`, `expanded` | agent, status, monitoring, ai        | Agent status monitoring with real-time health tracking              |
| `BackupStatusCard`       | `monitoring`    | `size`, `theme`, `mockData`                 | `default`, `minimal`, `detailed` | `compact`, `normal`, `expanded` | backup, monitoring, storage, git     | Comprehensive backup monitoring with storage and activity tracking   |
| `TasksTable`             | `data`          | `size`, `theme`, `onTaskUpdate`, `mockData` | `default`, `minimal`, `detailed` | `compact`, `normal`, `expanded` | table, tasks, management, crud       | Full-featured task management table with CRUD operations            |

---

## 🏗️ קטגוריות רכיבים

### 🔧 **Common** - רכיבי UI בסיסיים
- **CompactTaskCard** - כרטיסי משימות קומפקטיים

### 📊 **Data** - רכיבי נתונים וניהול
- **TokenUsageMonitor** - ניטור שימוש ב-tokens
- **TasksTable** - טבלת ניהול משימות מתקדמת

### 🖼️ **Display** - רכיבי תצוגה ויזואליזציה
- **SystemHealthDashboard** - דשבורד בריאות מערכת
- **AgentCard** - כרטיס סטטוס סוכנים

### 📡 **Monitoring** - רכיבי ניטור ומעקב
- **BackupStatusCard** - ניטור מצב גיבויים

---

## 🔍 חיפוש לפי תגיות

### 📋 **Task Management**
- `CompactTaskCard` - תצוגת משימות קומפקטית
- `TasksTable` - ניהול משימות מלא

### 📊 **Monitoring & Analytics** 
- `TokenUsageMonitor` - ניטור שימוש ב-AI tokens
- `SystemHealthDashboard` - ניטור בריאות מערכת
- `AgentCard` - ניטור סטטוס סוכנים
- `BackupStatusCard` - ניטור מערכת גיבויים

### 🤖 **AI Related**
- `TokenUsageMonitor` - מעקב עלויות AI
- `AgentCard` - ניהול סוכני AI

### 💾 **Data & Storage**
- `BackupStatusCard` - ניטור גיבויים
- `TasksTable` - ניהול נתוני משימות

---

## 🎨 מערכת הגדרות

### **Size Variants**
- `compact` - תצוגה דחוסה למקומות צרים
- `normal` - גודל סטנדרטי (ברירת מחדל)
- `expanded` - תצוגה מורחבת עם פרטים נוספים

### **Theme Variants**
- `default` - עיצוב מלא עם כל התכונות
- `minimal` - עיצוב מינימלי וקליל
- `detailed` - עיצוב מפורט עם מידע נוסף

### **CSS Variables Architecture**
```css
/* Layer 1: Raw Colors */
--color-blue-500: #3b82f6;

/* Layer 2: Semantic Meanings */
--color-primary: var(--color-blue-500);

/* Layer 3: Usage Context */
--color-button-background: var(--color-primary);
```

---

## 📖 דוגמאות שימוש

### Basic Usage - שימוש בסיסי
```jsx
import { CompactTaskCard } from 'vistara-ui';

<CompactTaskCard 
  task={taskData}
  size="normal"
  theme="default"
  onComplete={handleComplete}
  onDelete={handleDelete}
/>
```

### Advanced Configuration - הגדרות מתקדמות
```jsx
import { SystemHealthDashboard } from 'vistara-ui';

<SystemHealthDashboard
  size="expanded"
  theme="detailed" 
  refreshInterval={30000}
  mockData={false}
/>
```

### Mock Data for Development - נתונים מדמיינים לפיתוח
```jsx
import { TokenUsageMonitor } from 'vistara-ui';

<TokenUsageMonitor
  mockData={true}  // Uses built-in demo data
  theme="minimal"
  size="compact"
/>
```

---

## 🛠️ דרישות טכניות

### **Dependencies**
- React 18+
- lucide-react (icons)
- CSS Variables support

### **Files Structure**
```
src/
├── components/
│   ├── common/CompactTaskCard.jsx
│   ├── data/TokenUsageMonitor.jsx
│   ├── data/TasksTable.jsx  
│   ├── display/SystemHealthDashboard.jsx
│   ├── display/AgentCard.jsx
│   └── monitoring/BackupStatusCard.jsx
├── utils/normalizeStyle.js
└── styles/variables.css
```

---

## 🚀 מה חדש?

### **v0.1.0** (2025-07-27)
✅ **הושלמה ההעברה של 6 רכיבים מ-TitanMind:**
- CompactTaskCard - כרטיסי משימות
- TokenUsageMonitor - ניטור tokens
- SystemHealthDashboard - דשבורד מערכת
- AgentCard - כרטיסי סוכנים
- BackupStatusCard - ניטור גיבויים
- TasksTable - טבלת משימות

**✨ תכונות מרכזיות:**
- 🎨 100% CSS Variables (ללא Tailwind)
- 📱 Size variants: compact/normal/expanded
- 🎭 Theme variants: default/minimal/detailed
- 🌐 תמיכה מלאה ב-RTL
- 🔧 Mock data למצב פיתוח
- 📊 מערכת תיעוד מובנית

---

## 📞 תמיכה ופיתוח

### **Quick Search - חיפוש מהיר**
- **Ctrl+F** במסמך זה + מילת מפתח
- חפש לפי **tag**, **category**, או **component name**
- השתמש ב-`components.index.json` לחיפוש פרוגרמטי

### **Adding New Components - הוספת רכיבים חדשים**
1. ✍️ כתוב את הרכיב ב-`src/components/`
2. 📝 עדכן את `components.index.json`
3. 📚 עדכן טבלה זו ב-`Components_Reference.md`
4. 🧪 הוסף לדמו ב-`Showcase.jsx`

### **Migration Status**
- ✅ **Completed:** 6/6 רכיבים הועברו בהצלחה
- 🔄 **In Progress:** מערכת תיעוד מתקדמת
- 📋 **Next:** רכיבים נוספים מ-TitanMind

---

*📅 עודכן לאחרונה: 27 ביולי 2025*  
*🔧 נבנה עם Vistara UI v0.1.0*