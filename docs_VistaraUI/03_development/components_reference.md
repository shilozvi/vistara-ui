# 📚 מדריך רכיבי Vistara UI - Components Reference

> **סטטוס:** ✅ Complete  
> **עודכן לאחרונה:** 2025-07-27  
> **רמת קושי:** Beginner-Intermediate  
> **זמן קריאה:** כ־15 דקות  
> **שייך לקטגוריה:** 03_development  
> **מלא על ידי:** Moss 🌱

---

## 🎯 סקירה כללית

מדריך זה מכיל את **כל המידע** על הרכיבים ב-Vistara UI במקום אחד:
- רשימת כל הרכיבים הזמינים
- הגדרות ו-Props של כל רכיב
- דוגמאות שימוש מלאות
- מתי ואיך להשתמש בכל רכיב

**הכלל:** כל המידע על רכיבים נמצא **רק כאן**. למידע על CSS Variables ראה [css_variables_guide.md](./css_variables_guide.md).

---

## 📦 רכיבים זמינים - 6 רכיבים מוכנים

### סקירה מהירה:
| קטגוריה | רכיבים | תיאור |
|----------|---------|--------|
| **Common** | CompactTaskCard | כרטיסי משימות |
| **Data** | TokenUsageMonitor, TasksTable | תצוגת נתונים |
| **Display** | SystemHealthDashboard, AgentCard | תצוגות מערכת |
| **Monitoring** | BackupStatusCard | ניטור ומעקב |

---

## 🧩 מדריך מפורט לכל רכיב

### 1. CompactTaskCard

**מטרה:** הצגת כרטיס משימה קומפקטי עם פרטים ופעולות

#### 📋 Props:
```typescript
interface CompactTaskCardProps {
  task: {
    Task_ID: string;
    Task_Name: string;
    Status: string;
    Current_Owner: string;
    Priority?: string;
    Project?: string;
    Last_Action?: string;
  };
  onComplete?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  showActions?: boolean;  // default: true
  size?: 'small' | 'normal' | 'large';  // default: 'normal'
  theme?: 'default' | 'minimal';  // default: 'default'
  mockData?: boolean;  // לבדיקות
}
```

#### 💡 דוגמאות שימוש:

```jsx
// שימוש בסיסי
<CompactTaskCard 
  task={myTask}
  onComplete={handleComplete}
  onDelete={handleDelete}
/>

// עם כל האפשרויות
<CompactTaskCard 
  task={myTask}
  onComplete={handleComplete}
  onDelete={handleDelete}
  showActions={true}
  size="large"
  theme="minimal"
/>

// לבדיקה מהירה
<CompactTaskCard mockData />
```

#### 🎨 סטטוסים נתמכים:
- `completed` - ירוק
- `in progress` - כחול
- `active` - צהוב
- `review` - סגול
- אחר - אפור

---

### 2. TokenUsageMonitor

**מטרה:** ניטור שימוש בטוקנים בזמן אמת

#### 📋 Props:
```typescript
interface TokenUsageMonitorProps {
  data?: {
    used: number;
    limit: number;
    percentage: number;
    trend?: 'up' | 'down' | 'stable';
  };
  size?: 'compact' | 'normal' | 'expanded';  // default: 'normal'
  theme?: 'default' | 'minimal' | 'detailed';  // default: 'default'
  showDetails?: boolean;  // default: true
  refreshInterval?: number;  // milliseconds
  mockData?: boolean;
}
```

#### 💡 דוגמאות שימוש:

```jsx
// ניטור בסיסי
<TokenUsageMonitor 
  data={tokenData}
  refreshInterval={5000}
/>

// תצוגה קומפקטית
<TokenUsageMonitor 
  size="compact"
  theme="minimal"
  showDetails={false}
/>

// עם נתוני דמו
<TokenUsageMonitor mockData />
```

---

### 3. TasksTable

**מטרה:** טבלת משימות מלאה עם מיון, סינון ופעולות

#### 📋 Props:
```typescript
interface TasksTableProps {
  tasks?: Task[];
  columns?: string[];  // בחירת עמודות
  sortable?: boolean;  // default: true
  filterable?: boolean;  // default: true
  selectable?: boolean;  // default: false
  actions?: {
    onEdit?: (task: Task) => void;
    onDelete?: (task: Task) => void;
    onComplete?: (task: Task) => void;
  };
  size?: 'compact' | 'normal' | 'spacious';
  theme?: 'default' | 'striped' | 'bordered';
  mockData?: boolean;
}
```

#### 💡 דוגמאות שימוש:

```jsx
// טבלה מלאה
<TasksTable 
  tasks={tasks}
  sortable={true}
  filterable={true}
  actions={{
    onEdit: handleEdit,
    onDelete: handleDelete,
    onComplete: handleComplete
  }}
/>

// טבלה פשוטה
<TasksTable 
  tasks={tasks}
  columns={['Task_Name', 'Status', 'Owner']}
  size="compact"
  theme="striped"
/>
```

---

### 4. SystemHealthDashboard

**מטרה:** לוח בקרה מקיף למצב המערכת

#### 📋 Props:
```typescript
interface SystemHealthDashboardProps {
  metrics?: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    services: { name: string; status: 'up' | 'down' }[];
  };
  refreshRate?: number;  // seconds
  showAlerts?: boolean;
  size?: 'compact' | 'normal' | 'expanded';
  theme?: 'default' | 'dark' | 'minimal';
  layout?: 'grid' | 'list' | 'cards';
  mockData?: boolean;
}
```

#### 💡 דוגמאות שימוש:

```jsx
// לוח בקרה מלא
<SystemHealthDashboard 
  metrics={systemMetrics}
  refreshRate={30}
  showAlerts={true}
  layout="grid"
/>

// תצוגה מינימלית
<SystemHealthDashboard 
  size="compact"
  theme="minimal"
  layout="list"
  showAlerts={false}
/>
```

---

### 5. AgentCard

**מטרה:** הצגת מידע על סוכן/משתמש במערכת

#### 📋 Props:
```typescript
interface AgentCardProps {
  agent: {
    name: string;
    avatar?: string;
    role?: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
    lastActive?: Date;
    tasks?: number;
    performance?: number;  // 0-100
  };
  showDetails?: boolean;
  showActions?: boolean;
  size?: 'small' | 'normal' | 'large';
  theme?: 'default' | 'minimal' | 'detailed';
  onClick?: () => void;
  mockData?: boolean;
}
```

#### 💡 דוגמאות שימוש:

```jsx
// כרטיס סוכן מלא
<AgentCard 
  agent={agentData}
  showDetails={true}
  showActions={true}
  onClick={handleAgentClick}
/>

// תצוגה קומפקטית
<AgentCard 
  agent={agentData}
  size="small"
  theme="minimal"
  showDetails={false}
/>
```

---

### 6. BackupStatusCard

**מטרה:** הצגת סטטוס גיבויים ופעולות

#### 📋 Props:
```typescript
interface BackupStatusCardProps {
  backup?: {
    lastBackup: Date;
    nextBackup: Date;
    status: 'success' | 'failed' | 'running' | 'scheduled';
    size: string;  // "1.2GB"
    type: 'full' | 'incremental' | 'differential';
    location?: string;
  };
  onBackupNow?: () => void;
  onRestore?: () => void;
  showHistory?: boolean;
  size?: 'compact' | 'normal' | 'detailed';
  theme?: 'default' | 'minimal';
  mockData?: boolean;
}
```

#### 💡 דוגמאות שימוש:

```jsx
// כרטיס גיבוי מלא
<BackupStatusCard 
  backup={backupData}
  onBackupNow={handleBackup}
  onRestore={handleRestore}
  showHistory={true}
  size="detailed"
/>

// תצוגה בסיסית
<BackupStatusCard 
  backup={backupData}
  size="compact"
  theme="minimal"
/>
```

---

## 🎯 איך לבחור את הרכיב הנכון?

### מחפש להציג משימות?
- **משימה בודדת** → `CompactTaskCard`
- **רשימת משימות** → `TasksTable`

### מחפש להציג נתונים?
- **שימוש בטוקנים** → `TokenUsageMonitor`
- **מצב מערכת** → `SystemHealthDashboard`

### מחפש להציג משתמשים?
- **פרטי סוכן** → `AgentCard`

### מחפש להציג סטטוס?
- **סטטוס גיבויים** → `BackupStatusCard`

---

## 🔧 טיפים לשימוש

### 1. התחל עם mockData
```jsx
// בדוק איך הרכיב נראה לפני חיבור לנתונים אמיתיים
<CompactTaskCard mockData />
<TokenUsageMonitor mockData />
<SystemHealthDashboard mockData />
```

### 2. התאם את הגודל למקום
```jsx
// במקום צר
<CompactTaskCard size="small" />

// במסך מלא
<SystemHealthDashboard size="expanded" />
```

### 3. בחר theme מתאים
```jsx
// לדשבורד ראשי
<SystemHealthDashboard theme="default" />

// לתצוגה משנית
<AgentCard theme="minimal" />
```

---

## 🌐 Import ושימוש

### Import בסיסי:
```jsx
// בפרויקט עם npm link או התקנה
import CompactTaskCard from 'vistara-ui/components/common/CompactTaskCard';
import TokenUsageMonitor from 'vistara-ui/components/data/TokenUsageMonitor';

// אל תשכח את ה-CSS Variables!
import 'vistara-ui/styles/tokens.css';
import 'vistara-ui/styles/base.css';
```

### Import מקומי (אחרי build & copy):
```jsx
import CompactTaskCard from './vistara-ui/components/common/CompactTaskCard';
```

---

## 📚 משאבים נוספים

- **CSS Variables** → [css_variables_guide.md](./css_variables_guide.md)
- **פיתוח רכיבים חדשים** → [component_development.md](./component_development.md)
- **העברת רכיבים מפרויקט אחר** → [migration_guide.md](./migration_guide.md)
- **שימוש בפרויקטים אחרים** → [using_components_in_other_projects.md](./using_components_in_other_projects.md)

---

**🌱 Moss:** "כל המידע על הרכיבים במקום אחד - ללא כפילויות!" 🎯