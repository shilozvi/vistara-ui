# ⚙️ Vistara UI - Component Configuration Guide

> מדריך מפורט להגדרת כל רכיב עם Props, Variants ודוגמאות

## 📑 תוכן עניינים
- [Props משותפים לכל הרכיבים](#props-משותפים)
- [Form Components](#form-components)
  - [TextInput](#textinput)
  - [PasswordInput](#passwordinput)
  - [EmailInput](#emailinput)
  - [SearchInput](#searchinput)
- [CompactTaskCard](#compacttaskcard)
- [TokenUsageMonitor](#tokenusagemonitor)
- [TasksTable](#taskstable)
- [SystemHealthDashboard](#systemhealthdashboard)
- [AgentCard](#agentcard)
- [BackupStatusCard](#backupstatuscard)
- [ChatInput](#chatinput)
- [NotificationBell](#notificationbell)

---

## 🔧 Props משותפים לכל הרכיבים

כל רכיב ב-Vistara UI תומך ב-props הבאים:

```typescript
interface BaseProps {
  size?: 'compact' | 'normal' | 'expanded';
  theme?: 'default' | 'minimal' | 'detailed';
  className?: string;
  style?: React.CSSProperties;
}
```

### דוגמה בסיסית:
```jsx
<AnyComponent
  size="normal"      // גודל התצוגה
  theme="default"    // ערכת נושא
  className="my-class" // מחלקה נוספת
  style={{ '--color-primary': '#7c3aed' }} // CSS Variables
/>
```

---

## 📝 Form Components

### TextInput

שדה קלט טקסט גמיש עם תמיכה בוואלידציה, אייקונים ונושאים מרובים.

#### Props מלאים:
```typescript
interface TextInputProps extends BaseProps {
  // Basic input props
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  
  // Input attributes
  placeholder?: string;
  type?: string;
  name?: string;
  id?: string;
  autoComplete?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  
  // Validation
  error?: string | boolean;
  helperText?: string;
  validateOnBlur?: boolean;
  validator?: (value: string) => string | boolean;
  
  // Visual variants
  variant?: 'outlined' | 'filled' | 'underlined';
  
  // Icons and prefixes
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  
  // Label
  label?: string;
}
```

#### דוגמאות שימוש:
```jsx
// Basic input
<TextInput 
  placeholder="הכנס טקסט..." 
  onChange={(e) => setValue(e.target.value)}
/>

// With validation
<TextInput 
  label="שם משתמש"
  value={username}
  validator={(value) => value.length >= 3 ? true : 'לפחות 3 תווים'}
  error={usernameError}
  helperText="שם המשתמש חייב להיות ייחודי"
/>

// With icons
<TextInput 
  variant="filled"
  leftIcon={<UserIcon />}
  rightIcon={<SearchIcon />}
  onRightIconClick={() => performSearch()}
/>

// With prefix/suffix
<TextInput 
  prefix="$"
  suffix="USD"
  type="number"
  placeholder="0.00"
/>
```

---

### PasswordInput

שדה סיסמה מאובטח עם אינדיקטור חוזק וכפתור הצגה/הסתרה.

#### Props מלאים:
```typescript
interface PasswordInputProps extends Omit<TextInputProps, 'type'> {
  // Password specific
  showStrengthIndicator?: boolean;
  showVisibilityToggle?: boolean;
  strengthRules?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  };
  onStrengthChange?: (strength: number) => void;
}
```

#### דוגמאות שימוש:
```jsx
// Basic password input
<PasswordInput 
  label="סיסמה"
  placeholder="הכנס סיסמה..."
  onChange={(e) => setPassword(e.target.value)}
/>

// With strength indicator
<PasswordInput 
  showStrengthIndicator={true}
  strengthRules={{
    minLength: 12,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }}
  onStrengthChange={(strength) => setPasswordStrength(strength)}
/>

// Minimal theme without extras
<PasswordInput 
  theme="minimal"
  showStrengthIndicator={false}
  showVisibilityToggle={false}
/>
```

---

### EmailInput

שדה אימייל עם וואלידציה אוטומטית והשלמה של דומיינים נפוצים.

#### Props מלאים:
```typescript
interface EmailInputProps extends Omit<TextInputProps, 'type'> {
  // Email specific
  suggestDomains?: boolean;
  commonDomains?: string[];
  validateOnType?: boolean;
  allowedDomains?: string[];
  blockedDomains?: string[];
  onValidEmail?: (email: string) => void;
}
```

#### דוגמאות שימוש:
```jsx
// Basic email input
<EmailInput 
  label="כתובת אימייל"
  placeholder="example@domain.com"
  onChange={(e) => setEmail(e.target.value)}
/>

// With domain suggestions
<EmailInput 
  suggestDomains={true}
  commonDomains={['gmail.com', 'outlook.com', 'company.com']}
  onValidEmail={(email) => console.log('Valid email:', email)}
/>

// Restricted domains
<EmailInput 
  allowedDomains={['company.com', 'contractor.com']}
  validateOnType={true}
  helperText="רק אימיילים של החברה מותרים"
/>

// Blocked domains
<EmailInput 
  blockedDomains={['tempmail.com', '10minutemail.com']}
  theme="detailed"
/>
```

---

### SearchInput

שדה חיפוש מתקדם עם הצעות, היסטוריה ופילטרים.

#### Props מלאים:
```typescript
interface SearchInputProps extends Omit<TextInputProps, 'onChange'> {
  // Search specific
  onSearch: (query: string, filters?: Record<string, string>) => void;
  searchOnType?: boolean;
  debounceDelay?: number;
  minChars?: number;
  
  // Suggestions
  suggestions?: string[];
  showSuggestions?: boolean;
  maxSuggestions?: number;
  getSuggestions?: (query: string) => Promise<string[]>;
  
  // Search history
  showHistory?: boolean;
  searchHistory?: string[];
  maxHistoryItems?: number;
  onClearHistory?: () => void;
  
  // Filters
  filters?: Array<{
    label: string;
    value: string;
    options: Array<{label: string; value: string} | string>;
  }>;
  activeFilters?: Record<string, string>;
  onFilterChange?: (filterKey: string, value: string) => void;
  
  // Loading state
  isLoading?: boolean;
}
```

#### דוגמאות שימוש:
```jsx
// Basic search
<SearchInput 
  placeholder="חפש..."
  onSearch={(query) => performSearch(query)}
  searchOnType={true}
  debounceDelay={500}
/>

// With suggestions and history
<SearchInput 
  suggestions={['React', 'Vue', 'Angular']}
  showHistory={true}
  searchHistory={['previous search', 'another search']}
  onClearHistory={() => clearSearchHistory()}
/>

// With filters
<SearchInput 
  filters={[
    {
      label: 'קטגוריה',
      value: 'category',
      options: [
        {label: 'הכל', value: 'all'},
        {label: 'רכיבים', value: 'components'},
        {label: 'דפים', value: 'pages'}
      ]
    },
    {
      label: 'סטטוס',
      value: 'status',
      options: ['active', 'inactive', 'pending']
    }
  ]}
  activeFilters={{category: 'components'}}
  onFilterChange={(key, value) => updateFilter(key, value)}
/>

// Async suggestions
<SearchInput 
  getSuggestions={async (query) => {
    const response = await api.searchSuggestions(query);
    return response.data;
  }}
  isLoading={searchLoading}
  minChars={3}
/>
```

#### CSS Variables זמינות:
```css
.vistara-search-input {
  --search-dropdown-max-height: 400px;
  --search-item-padding: var(--space-3);
  --search-header-color: var(--color-text-muted);
}
```

---

## 📦 CompactTaskCard

### Props מלאים:
```typescript
interface CompactTaskCardProps extends BaseProps {
  task: {
    Task_ID: string;
    Task_Name: string;
    Status: 'Pending' | 'In Progress' | 'Completed' | 'Review';
    Priority: 'Low' | 'Medium' | 'High' | 'Critical';
    Current_Owner: string;
    Project?: string;
    Last_Action?: string;
  };
  onComplete?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  showActions?: boolean;
  interactive?: boolean;
}
```

### דוגמאות שימוש:

#### 1. בסיסי:
```jsx
<CompactTaskCard 
  task={{
    Task_ID: 'TSK001',
    Task_Name: 'Update Documentation',
    Status: 'In Progress',
    Priority: 'High',
    Current_Owner: 'John Doe'
  }}
/>
```

#### 2. עם פעולות:
```jsx
<CompactTaskCard 
  task={task}
  onComplete={(id) => console.log('Completed:', id)}
  onDelete={(id) => confirm('Delete task?') && deleteTask(id)}
  showActions={true}
/>
```

#### 3. גרסה קומפקטית:
```jsx
<CompactTaskCard 
  task={task}
  size="compact"
  theme="minimal"
  showActions={false}
/>
```

#### 4. עם סטיילינג מותאם:
```jsx
<CompactTaskCard 
  task={task}
  style={{
    '--card-bg': 'linear-gradient(to right, #f3e7e9 0%, #e3eeff 100%)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
  }}
/>
```

---

## 📊 TokenUsageMonitor

### Props מלאים:
```typescript
interface TokenUsageMonitorProps extends BaseProps {
  refreshInterval?: number; // ms
  mockData?: boolean;
  showCosts?: boolean;
  showHistory?: boolean;
  models?: string[];
  onRefresh?: () => void;
  apiEndpoint?: string;
}
```

### דוגמאות שימוש:

#### 1. ניטור בזמן אמת:
```jsx
<TokenUsageMonitor 
  refreshInterval={5000} // רענון כל 5 שניות
  showCosts={true}
  showHistory={true}
/>
```

#### 2. עם נתוני דמו:
```jsx
<TokenUsageMonitor 
  mockData={true}
  size="expanded"
  theme="detailed"
/>
```

#### 3. מודלים ספציפיים:
```jsx
<TokenUsageMonitor 
  models={['gpt-4', 'claude-3', 'gemini-pro']}
  showCosts={true}
  onRefresh={() => console.log('Refreshing...')}
/>
```

#### 4. גרסה מינימלית:
```jsx
<TokenUsageMonitor 
  size="compact"
  theme="minimal"
  showHistory={false}
  showCosts={false}
/>
```

---

## 📋 TasksTable

### Props מלאים:
```typescript
interface TasksTableProps extends BaseProps {
  tasks?: Task[];
  mockData?: boolean;
  enableFilters?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  onTaskUpdate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskTransfer?: (taskId: string, newOwner: string) => void;
  columns?: string[]; // להסתרת עמודות
  readonly?: boolean;
}
```

### דוגמאות שימוש:

#### 1. טבלה מלאה:
```jsx
<TasksTable 
  tasks={tasks}
  enableFilters={true}
  enableSorting={true}
  enablePagination={true}
  pageSize={25}
  onTaskUpdate={updateTask}
  onTaskDelete={deleteTask}
/>
```

#### 2. תצוגה בלבד:
```jsx
<TasksTable 
  tasks={tasks}
  readonly={true}
  enableFilters={false}
  size="compact"
/>
```

#### 3. עמודות מותאמות:
```jsx
<TasksTable 
  tasks={tasks}
  columns={['Task_Name', 'Status', 'Priority', 'Current_Owner']}
  theme="minimal"
/>
```

#### 4. עם העברת משימות:
```jsx
<TasksTable 
  tasks={tasks}
  onTaskTransfer={(id, owner) => {
    transferTask(id, owner);
    showNotification(`Task transferred to ${owner}`);
  }}
/>
```

---

## 🏥 SystemHealthDashboard

### Props מלאים:
```typescript
interface SystemHealthDashboardProps extends BaseProps {
  systems?: string[];
  refreshInterval?: number;
  mockData?: boolean;
  showAlerts?: boolean;
  alertThreshold?: number; // אחוז
  onAlert?: (system: string, status: string) => void;
  historyDuration?: number; // דקות
}
```

### דוגמאות שימוש:

#### 1. ניטור מלא:
```jsx
<SystemHealthDashboard 
  systems={['api', 'database', 'cache', 'queue']}
  refreshInterval={3000}
  showAlerts={true}
  alertThreshold={80}
  onAlert={(system, status) => sendAlert(system, status)}
/>
```

#### 2. תצוגה מינימלית:
```jsx
<SystemHealthDashboard 
  size="compact"
  theme="minimal"
  showAlerts={false}
  historyDuration={5}
/>
```

#### 3. עם נתוני דמו:
```jsx
<SystemHealthDashboard 
  mockData={true}
  size="expanded"
  theme="detailed"
/>
```

---

## 🤖 AgentCard

### Props מלאים:
```typescript
interface AgentCardProps extends BaseProps {
  agent: {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'busy' | 'error';
    avatar?: string;
    role?: string;
    metrics?: AgentMetrics;
  };
  showStats?: boolean;
  showActions?: boolean;
  onChat?: (agentId: string) => void;
  onDetails?: (agentId: string) => void;
}
```

### דוגמאות שימוש:

#### 1. כרטיס מלא:
```jsx
<AgentCard 
  agent={{
    id: 'agent-001',
    name: 'Falcon AI',
    status: 'online',
    role: 'Frontend Specialist',
    metrics: {
      tasksCompleted: 156,
      responseTime: '1.2s',
      satisfaction: 98
    }
  }}
  showStats={true}
  showActions={true}
  onChat={(id) => openChat(id)}
/>
```

#### 2. גרסה פשוטה:
```jsx
<AgentCard 
  agent={agent}
  size="compact"
  theme="minimal"
  showStats={false}
  showActions={false}
/>
```

---

## 💾 BackupStatusCard

### Props מלאים:
```typescript
interface BackupStatusCardProps extends BaseProps {
  showDetails?: boolean;
  alertOnFailure?: boolean;
  systems?: ('git' | 'local' | 'cloud')[];
  refreshInterval?: number;
  onBackup?: (system: string) => void;
  mockData?: boolean;
}
```

### דוגמאות שימוש:

#### 1. ניטור מלא:
```jsx
<BackupStatusCard 
  systems={['git', 'local', 'cloud']}
  showDetails={true}
  alertOnFailure={true}
  refreshInterval={60000} // דקה
  onBackup={(system) => triggerBackup(system)}
/>
```

#### 2. תצוגת סטטוס בלבד:
```jsx
<BackupStatusCard 
  size="compact"
  theme="minimal"
  showDetails={false}
/>
```

---

## 💬 ChatInput

### Props מלאים:
```typescript
interface ChatInputProps extends BaseProps {
  onSend: (message: string) => void;
  placeholder?: string;
  maxLength?: number;
  allowVoice?: boolean;
  allowAttachments?: boolean;
  onVoiceStart?: () => void;
  onAttachment?: (file: File) => void;
  disabled?: boolean;
}
```

### דוגמאות שימוש:

#### 1. צ'אט מלא:
```jsx
<ChatInput 
  onSend={sendMessage}
  placeholder="Type a message..."
  allowVoice={true}
  allowAttachments={true}
  onVoiceStart={() => startRecording()}
  onAttachment={(file) => uploadFile(file)}
/>
```

#### 2. טקסט בלבד:
```jsx
<ChatInput 
  onSend={sendMessage}
  maxLength={500}
  allowVoice={false}
  allowAttachments={false}
/>
```

---

## 🔔 NotificationBell

### Props מלאים:
```typescript
interface NotificationBellProps extends BaseProps {
  count?: number;
  onClick?: () => void;
  animated?: boolean;
  color?: 'default' | 'warning' | 'danger';
  maxCount?: number;
}
```

### דוגמאות שימוש:

#### 1. עם מונה:
```jsx
<NotificationBell 
  count={12}
  onClick={showNotifications}
  animated={true}
  color="warning"
/>
```

#### 2. ללא התראות:
```jsx
<NotificationBell 
  count={0}
  onClick={showNotifications}
/>
```

#### 3. מגבלת תצוגה:
```jsx
<NotificationBell 
  count={150}
  maxCount={99} // יציג 99+
  color="danger"
/>
```

---

## 🎨 טיפים להתאמה אישית

### 1. CSS Variables מותאמים:
```jsx
<Component 
  style={{
    '--color-primary': '#8b5cf6',
    '--color-success': '#10b981',
    '--shadow-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '--radius-lg': '16px'
  }}
/>
```

### 2. שילוב עם Tailwind:
```jsx
<div className="p-4">
  <Component 
    className="hover:scale-105 transition-transform"
    size="normal"
  />
</div>
```

### 3. יצירת Wrapper מותאם:
```jsx
function MyTaskCard({ task, ...props }) {
  return (
    <CompactTaskCard 
      task={task}
      size="normal"
      theme="custom"
      style={{
        '--card-bg': 'var(--my-brand-color)',
        '--text-primary': 'var(--my-text-color)'
      }}
      {...props}
    />
  );
}
```

### 4. תמות גלובליות:
```css
/* my-theme.css */
:root[data-theme="my-brand"] {
  --color-primary: #e11d48;
  --color-secondary: #7c3aed;
  --color-surface: #fef2f2;
}
```

---

**💡 טיפ:** השתמש ב-React DevTools כדי לראות את כל ה-props הזמינים בזמן ריצה!