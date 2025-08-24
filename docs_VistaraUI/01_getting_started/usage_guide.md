# 📦 Vistara UI - מדריך שימוש בפרויקטים חיצוניים

## 🚀 התקנה מהירה

### אפשרות 1: העתקת קבצים (מומלץ לפרויקטים קיימים)

```bash
# 1. העתק את תיקיית הרכיבים
cp -r /path/to/vistara-ui/src/components ./src/

# 2. העתק את קבצי הסטיילים
cp -r /path/to/vistara-ui/src/styles ./src/

# 3. העתק את כלי העזר
cp -r /path/to/vistara-ui/src/utils ./src/
```

### אפשרות 2: Git Submodule

```bash
# הוסף את Vistara UI כ-submodule
git submodule add https://github.com/yourusername/vistara-ui.git vendors/vistara-ui
```

### אפשרות 3: npm Package (בפיתוח)

```bash
# בעתיד...
npm install @vistara/ui
```

## 🔧 הגדרה בפרויקט שלך

### 1. ייבוא קבצי CSS הבסיסיים

בקובץ הראשי שלך (App.js/index.js):

```javascript
// ייבוא קבצי הסטיילים של Vistara UI
import './styles/tokens.css';    // CSS Variables
import './styles/base.css';      // סטיילים בסיסיים
```

### 2. התאמה למבנה הפרויקט שלך

אם אתה משתמש ב-TypeScript, צור קובץ הגדרות:

```typescript
// vistara-ui.d.ts
declare module '@/components/common/*';
declare module '@/components/data/*';
declare module '@/components/display/*';
declare module '@/components/monitoring/*';
```

## 📝 דוגמאות שימוש

### רכיב בסיסי - CompactTaskCard

```jsx
import CompactTaskCard from './components/common/CompactTaskCard';

function MyTaskList() {
  const task = {
    Task_ID: 'TSK001',
    Task_Name: 'משימה לדוגמה',
    Status: 'In Progress',
    Priority: 'High',
    Current_Owner: 'John Doe',
    Project: 'My Project'
  };

  return (
    <CompactTaskCard 
      task={task}
      size="normal"  // 'compact' | 'normal' | 'expanded'
      theme="default" // 'default' | 'minimal' | 'detailed'
      onComplete={(taskId) => console.log('Task completed:', taskId)}
      onDelete={(taskId) => console.log('Task deleted:', taskId)}
    />
  );
}
```

### רכיב מורכב - TokenUsageMonitor

```jsx
import TokenUsageMonitor from './components/data/TokenUsageMonitor';

function MyDashboard() {
  return (
    <TokenUsageMonitor 
      size="normal"
      refreshInterval={5000} // רענון כל 5 שניות
      mockData={true} // להדגמה
    />
  );
}
```

### שימוש עם נושאים (Themes)

```jsx
import SystemHealthDashboard from './components/display/SystemHealthDashboard';

function MyMonitoringPage() {
  return (
    <div className="monitoring-container">
      {/* גודל קומפקטי עם נושא מינימלי */}
      <SystemHealthDashboard 
        size="compact"
        theme="minimal"
      />
      
      {/* גודל מורחב עם נושא מפורט */}
      <SystemHealthDashboard 
        size="expanded"
        theme="detailed"
      />
    </div>
  );
}
```

## 🎨 התאמה אישית

### 1. שינוי צבעים גלובלי

צור קובץ `custom-tokens.css`:

```css
:root {
  /* החלף צבעים בסיסיים */
  --color-blue-500: #2563eb;
  --color-green-500: #16a34a;
  
  /* או החלף צבעים סמנטיים */
  --color-primary: #8b5cf6;  /* סגול במקום כחול */
  --color-success: #059669;  /* ירוק כהה יותר */
}
```

### 2. התאמת רכיב ספציפי

```jsx
import AgentCard from './components/display/AgentCard';

// עטוף רכיב עם סטיילים מותאמים
function CustomAgentCard(props) {
  return (
    <div className="custom-agent-wrapper">
      <AgentCard 
        {...props}
        style={{
          '--color-primary': '#7c3aed',
          '--shadow-lg': '0 20px 25px -5px rgba(124, 58, 237, 0.1)'
        }}
      />
    </div>
  );
}
```

### 3. יצירת וריאנט חדש

```jsx
// הוסף וריאנט חדש לרכיב קיים
function MyTaskCard({ task }) {
  return (
    <CompactTaskCard 
      task={task}
      size="normal"
      theme="custom"
      className="my-custom-task"
      style={{
        '--card-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '--text-color': '#ffffff'
      }}
    />
  );
}
```

## 🔌 אינטגרציה עם מערכות קיימות

### React + Redux

```jsx
import { useSelector, useDispatch } from 'react-redux';
import TasksTable from './components/data/TasksTable';

function TasksContainer() {
  const tasks = useSelector(state => state.tasks.list);
  const dispatch = useDispatch();
  
  return (
    <TasksTable 
      mockData={false}
      tasks={tasks}
      onTaskUpdate={(task) => dispatch(updateTask(task))}
      onTaskDelete={(taskId) => dispatch(deleteTask(taskId))}
    />
  );
}
```

### Next.js

```jsx
// pages/dashboard.js
import dynamic from 'next/dynamic';

// טעינה דינמית לרכיבים כבדים
const SystemHealthDashboard = dynamic(
  () => import('@/components/display/SystemHealthDashboard'),
  { ssr: false }
);

export default function Dashboard() {
  return <SystemHealthDashboard size="normal" />;
}
```

### Vue.js (עם Vue 3)

```vue
<template>
  <div ref="taskCardRef"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ReactDOM from 'react-dom/client';
import CompactTaskCard from './vistara-ui/components/common/CompactTaskCard';

const taskCardRef = ref(null);

onMounted(() => {
  const root = ReactDOM.createRoot(taskCardRef.value);
  root.render(
    <CompactTaskCard 
      task={task}
      size="normal"
    />
  );
});
</script>
```

## 📋 רשימת רכיבים זמינים

### Common (58 רכיבים)
- `AgentAvatar` - תמונת פרופיל לסוכני AI
- `ChatInput` - קלט צ'אט
- `CompactTaskCard` - כרטיס משימה קומפקטי
- `Dashboard` - לוח בקרה ראשי
- `NotificationBell` - פעמון התראות
- `TaskManager` - מנהל משימות
- ... ועוד

### Data (2 רכיבים)
- `TokenUsageMonitor` - מעקב שימוש בטוקנים
- `TasksTable` - טבלת משימות

### Display (2 רכיבים)
- `AgentCard` - כרטיס סוכן
- `SystemHealthDashboard` - לוח בקרה למצב המערכת

### Monitoring (4 רכיבים)
- `BackupStatusCard` - כרטיס מצב גיבויים
- `HealthStatusWidget` - ווידג'ט מצב בריאות
- `SystemResourcesMonitor` - מעקב משאבי מערכת

## 🛠️ כלי עזר

### normalizeStyle
```jsx
import { normalizeStyle } from './utils/normalizeStyle';

const customStyles = normalizeStyle({
  backgroundColor: 'var(--color-primary)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)'
});
```

### withNormalizedStyles HOC
```jsx
import { withNormalizedStyles } from './utils/normalizeStyle';

const MyComponent = ({ style, ...props }) => {
  return <div style={style}>...</div>;
};

export default withNormalizedStyles(MyComponent);
```

## 🚨 בעיות נפוצות ופתרונות

### 1. רכיבים לא נטענים
```bash
# וודא שהעתקת את כל התלויות
cp -r /path/to/vistara-ui/src/utils ./src/
```

### 2. סטיילים לא עובדים
```javascript
// וודא שייבאת את קבצי ה-CSS בסדר הנכון
import './styles/tokens.css';   // חייב להיות ראשון!
import './styles/base.css';     // אחרי tokens
```

### 3. קונפליקט עם Tailwind
```css
/* הוסף ל-index.css שלך */
.vistara-component * {
  all: revert;
}
```

## 📚 משאבים נוספים

- [Component Explorer](http://localhost:3001) - חקור את כל הרכיבים
- [API Documentation](./API_REFERENCE.md) - תיעוד API מלא
- [Migration Guide](./MIGRATION_GUIDE.md) - מדריך מעבר מ-Tailwind

## 💡 טיפים

1. **התחל קטן** - התחל עם רכיב אחד ובדוק שהכל עובד
2. **השתמש ב-mockData** - לבדיקות ראשוניות
3. **בדוק את ה-Console** - הרכיבים מדפיסים אזהרות שימושיות
4. **עקוב אחר העדכונים** - Vistara UI מתעדכן באופן קבוע

## 🤝 תמיכה

- פתח Issue ב-GitHub
- שלח שאלות ב-Discord
- תרום חזרה לפרויקט!

---

**🎯 Command your Design with Vistara UI!**