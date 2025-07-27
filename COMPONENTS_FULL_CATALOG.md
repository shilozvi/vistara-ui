# 📚 Vistara UI - Full Components Catalog
> **"Command your Design."** - קטלוג מלא של 183+ רכיבים

---

## 🎯 סקירה כללית

**Vistara UI** היא ספריית רכיבים מתקדמת המבוססת על **CSS Variables** בלבד, עם תמיכה מלאה ב-RTL ומערכת עיצוב מובנית.

- **📦 סה"כ רכיבים:** 183+ רכיבים מקצועיים
- **🎨 עיצוב:** 3-layer CSS Variables system
- **🌐 תמיכה:** RTL (עברית), LTR (אנגלית)
- **📱 תגובה:** Size variants: compact, normal, expanded
- **🎨 ערכות נושא:** default, minimal, modern, colorful

---

## 📢 רכיבים לפי קטגוריות

### 📝 קומפוננטי טפסים (16)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `TextInput` | שדה טקסט מתקדם | `label`, `placeholder`, `error` | `<TextInput label="Name" />` |
| `PasswordInput` | שדה סיסמה עם הצגה/הסתרה | `showToggle`, `strength` | `<PasswordInput showStrength />` |
| `EmailInput` | שדה אימייל עם ואלידציה | `validation`, `suggestions` | `<EmailInput suggestions />` |
| `SearchInput` | שדה חיפוש עם הצעות | `onSearch`, `suggestions` | `<SearchInput onSearch={handleSearch} />` |
| `Checkbox` | תיבת סימון | `label`, `checked`, `indeterminate` | `<Checkbox label="Agree" />` |
| `RadioButton` | כפתור רדיו | `options`, `value`, `orientation` | `<RadioButton options={opts} />` |
| `SelectDropdown` | תפריט בחירה | `options`, `searchable`, `multiple` | `<SelectDropdown searchable />` |
| `Textarea` | שדה טקסט רב-שורות | `autoResize`, `maxLength` | `<Textarea autoResize />` |
| `ToggleSwitch` | מתג הפעלה/כיבוי | `label`, `size`, `disabled` | `<ToggleSwitch label="Enable" />` |
| `NumberInput` | שדה מספרים | `min`, `max`, `step`, `precision` | `<NumberInput min={0} max={100} />` |
| `PhoneInput` | שדה טלפון בינלאומי | `country`, `format`, `validation` | `<PhoneInput country="IL" />` |
| `AddressInput` | שדה כתובת עם השלמה | `autocomplete`, `geolocation` | `<AddressInput autocomplete />` |
| `CreditCardInput` | שדה כרטיס אשראי | `showIcon`, `validation` | `<CreditCardInput showIcon />` |
| `MultiSelect` | בחירה מרובה | `options`, `searchable`, `maxItems` | `<MultiSelect searchable />` |
| `Slider` | סרגל גלילה | `min`, `max`, `step`, `range` | `<Slider range min={0} max={100} />` |
| `FormBuilder` | בונה טפסים דינמי | `fields`, `validation`, `layout` | `<FormBuilder fields={schema} />` |

### 🔘 קומפוננטי כפתורים (5)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `PrimaryButton` | כפתור ראשי | `variant`, `size`, `loading` | `<PrimaryButton>Click Me</PrimaryButton>` |
| `SecondaryButton` | כפתור משני | `outline`, `ghost` | `<SecondaryButton outline />` |
| `IconButton` | כפתור עם אייקון | `icon`, `tooltip` | `<IconButton icon={<Save />} />` |
| `LoadingButton` | כפתור עם טעינה | `loading`, `loadingText` | `<LoadingButton loading />` |
| `FloatingActionButton` | כפתור פעולה צף | `position`, `extended` | `<FloatingActionButton position="bottom-right" />` |

### 💬 קומפוננטי Feedback & Status (5)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `ToastNotification` | הודעת טוסט | `type`, `duration`, `position` | `<ToastNotification type="success" />` |
| `LoadingSpinner` | ספינר טעינה | `size`, `color`, `text` | `<LoadingSpinner size="large" />` |
| `ProgressBar` | סרגל התקדמות | `value`, `showLabel`, `animated` | `<ProgressBar value={75} />` |
| `ErrorAlert` | התראת שגיאה | `title`, `message`, `dismissible` | `<ErrorAlert title="Error" />` |
| `InfoTooltip` | טולטיפ מידע | `content`, `position`, `trigger` | `<InfoTooltip content="Help text" />` |

### 🦭 קומפוננטי ניווט (9)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `Breadcrumb` | פירורי לחם | `items`, `separator` | `<Breadcrumb items={paths} />` |
| `Pagination` | עמודים | `total`, `current`, `pageSize` | `<Pagination total={100} />` |
| `TabsNavigation` | טאבים | `tabs`, `activeTab`, `orientation` | `<TabsNavigation tabs={tabs} />` |
| `SidebarMenu` | תפריט צד | `items`, `collapsible`, `activeItem` | `<SidebarMenu collapsible />` |
| `TopNavbar` | סרגל ניווט עליון | `brand`, `links`, `sticky` | `<TopNavbar sticky />` |
| `NavigationDrawer` | מגירת ניווט | `position`, `overlay`, `swipeable` | `<NavigationDrawer swipeable />` |
| `CommandPalette` | פקודות מהירות | `commands`, `searchable`, `hotkeys` | `<CommandPalette hotkeys />` |
| `MegaMenu` | מנו על | `items`, `columns`, `showImages` | `<MegaMenu columns={4} />` |
| `StepperNavigation` | ניווט צעדים | `steps`, `currentStep`, `orientation` | `<StepperNavigation steps={steps} />` |

### 🏗️ קומפוננטי פריסה ומבנה (6)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `Card` | כרטיס | `title`, `shadow`, `hoverable` | `<Card hoverable>Content</Card>` |
| `ModalDialog` | חלון מודאלי | `open`, `size`, `closeOnOverlay` | `<ModalDialog open={isOpen} />` |
| `GridContainer` | מכולת גריד | `columns`, `gap`, `responsive` | `<GridContainer columns={3} />` |
| `Accordion` | אקורדיון | `items`, `allowMultiple`, `animated` | `<Accordion allowMultiple />` |
| `FlexRow` | שורה גמישה | `align`, `justify`, `gap` | `<FlexRow justify="between" />` |
| `FlexColumn` | עמודה גמישה | `align`, `justify`, `gap` | `<FlexColumn align="center" />` |

### 🌐 קומפוננטי Overlays (3)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `Tooltip` | טולטיפ | `content`, `position`, `delay` | `<Tooltip content="Info">Hover me</Tooltip>` |
| `Popover` | פופאובר | `content`, `trigger`, `placement` | `<Popover trigger="click" />` |
| `Drawer` | מגירה | `position`, `size`, `overlay` | `<Drawer position="right" />` |

### 🛠️ קומפוננטי Utilities (3)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `DatePicker` | בוחר תאריך | `format`, `minDate`, `maxDate` | `<DatePicker format="DD/MM/YYYY" />` |
| `FileUploader` | העלאת קבצים | `accept`, `multiple`, `dragDrop` | `<FileUploader dragDrop />` |
| `ColorPicker` | בוחר צבע | `format`, `presets`, `alpha` | `<ColorPicker format="hex" />` |

### 🎬 קומפוננטי Media (3)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `ImageGallery` | גלריית תמונות | `images`, `columns`, `lightbox` | `<ImageGallery lightbox />` |
| `VideoPlayer` | נגן וידאו | `src`, `controls`, `autoplay` | `<VideoPlayer controls />` |
| `AudioPlayer` | נגן אודיו | `src`, `waveform`, `playlist` | `<AudioPlayer waveform />` |

### 📈 קומפוננטי Charts (5)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `LineChart` | גרף קו | `data`, `animated`, `tooltip` | `<LineChart data={data} animated />` |
| `BarChart` | גרף עמודות | `data`, `stacked`, `horizontal` | `<BarChart stacked />` |
| `PieChart` | גרף עוגה | `data`, `donut`, `labels` | `<PieChart donut />` |
| `AreaChart` | גרף שטח | `data`, `gradient`, `stacked` | `<AreaChart gradient />` |
| `ProgressChart` | גרף התקדמות | `progress`, `showMilestones` | `<ProgressChart progress={75} />` |

### 📊 קומפוננטי Analytics (4)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `MetricsCard` | כרטיס מטריקות | `metric`, `trend`, `comparison` | `<MetricsCard metric={data} />` |
| `KPIDashboard` | דשבורד KPI | `kpis`, `period`, `refreshRate` | `<KPIDashboard kpis={kpis} />` |
| `TrendAnalyzer` | ניתוח מגמות | `data`, `predictions`, `timeframe` | `<TrendAnalyzer predictions />` |
| `HeatmapChart` | מפת חום | `data`, `colorScale`, `interactive` | `<HeatmapChart interactive />` |

### 🚀 קומפוננטי Specialized (6)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `CodeEditor` | עורך קוד | `language`, `theme`, `lineNumbers` | `<CodeEditor language="javascript" />` |
| `Timeline` | ציר זמן | `events`, `orientation`, `animated` | `<Timeline events={events} />` |
| `RichTextEditor` | עורך טקסט עשיר | `toolbar`, `formats`, `onChange` | `<RichTextEditor toolbar />` |
| `DragDropList` | רשימה גרירה | `items`, `onReorder`, `groups` | `<DragDropList groups />` |
| `Calendar` | לוח שנה | `events`, `view`, `selectionMode` | `<Calendar view="month" />` |
| `Kanban` | לוח קאנבן | `columns`, `cards`, `onDragEnd` | `<Kanban columns={columns} />` |

### 📊 קומפוננטי Data Visualization (3)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `TreeMap` | מפת עץ | `data`, `colorScheme`, `interactive` | `<TreeMap data={hierarchy} />` |
| `RadarChart` | גרף רדאר | `data`, `axes`, `fillOpacity` | `<RadarChart axes={axes} />` |
| `GaugeChart` | מד מחוג | `value`, `min`, `max`, `segments` | `<GaugeChart value={75} />` |

### 📊 קומפוננטי נתונים (4)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `TasksTable` | טבלת משימות | `tasks`, `onUpdate`, `sortable` | `<TasksTable sortable />` |
| `TokenUsageMonitor` | ניטור שימוש ב-AI | `refreshRate`, `showCosts` | `<TokenUsageMonitor showCosts />` |
| `DataTable` | טבלה גנרית | `data`, `columns`, `pagination` | `<DataTable pagination />` |
| `StatsCard` | כרטיס סטטיסטיקה | `stat`, `icon`, `trend` | `<StatsCard stat={stat} />` |

### 🖼️ קומפוננטי תצוגה (4)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `SystemHealthDashboard` | דשבורד בריאות | `systems`, `refreshRate` | `<SystemHealthDashboard systems={systems} />` |
| `AgentCard` | כרטיס סוכן | `agent`, `showStats`, `actions` | `<AgentCard showStats />` |
| `Badge` | תג | `text`, `color`, `size` | `<Badge color="success">New</Badge>` |
| `Avatar` | אווטאר | `src`, `name`, `size`, `status` | `<Avatar name="John" status="online" />` |

### 🔍 קומפוננטי ניטור (5)

| Component | Description | Key Props | Example |
|-----------|-------------|-----------|----------|
| `BackupMonitorNew` | ניטור גיבויים מתקדם | `systems`, `schedule` | `<BackupMonitorNew systems={backupSystems} />` |
| `BackupStatusCard` | כרטיס סטטוס גיבוי | `status`, `lastBackup` | `<BackupStatusCard status={status} />` |
| `HealthStatusWidget` | ווידג'ט בריאות | `compact`, `systems` | `<HealthStatusWidget compact />` |
| `SystemResourcesMonitor` | ניטור משאבים | `resources`, `threshold` | `<SystemResourcesMonitor resources={['cpu', 'ram']} />` |

### 🎯 קומפוננטים נפוצים (70+)

כולל רכיבים כמו:
- AgentAvatar, AgentStatus, AgentStatusMonitor
- ChatInput, ChatPanel, ChatWindow
- Dashboard, DashboardMainView
- TaskCard, TaskManager, TaskFilters
- NotificationBell, NotificationToast
- VoiceInput, VoiceWave, VoiceSettings
- ועוד רבים...

---

## 🎨 מערכת הגדרות

### **Size Variants**
```jsx
<Component size="compact" />   // דחוס
<Component size="normal" />    // רגיל (ברירת מחדל)
<Component size="expanded" />  // מורחב
```

### **Theme Variants**
```jsx
<Component theme="default" />  // עיצוב מלא
<Component theme="minimal" />  // מינימלי
<Component theme="modern" />   // מודרני
<Component theme="colorful" /> // צבעוני
```

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

## 📦 שימוש בספרייה

### Installation
```bash
npm install vistara-ui
```

### Basic Usage
```jsx
import { PrimaryButton, Card, LineChart } from 'vistara-ui';
import 'vistara-ui/dist/styles.css';

function App() {
  return (
    <Card>
      <LineChart data={data} animated />
      <PrimaryButton onClick={handleClick}>
        Click Me
      </PrimaryButton>
    </Card>
  );
}
```

### Custom Theme
```jsx
// Override CSS variables
<div style={{
  '--color-primary': '#7c3aed',
  '--border-radius-lg': '16px'
}}>
  <YourApp />
</div>
```

---

## 🛠️ כלים ושירותים

### normalizeStyle Utility
```jsx
import { normalizeStyle } from 'vistara-ui';

const styles = normalizeStyle({
  padding: 'var(--space-4)',
  ':hover': {
    backgroundColor: 'var(--color-primary-light)'
  }
});
```

### Component Explorer
```jsx
import { ComponentsExplorer } from 'vistara-ui';

// מציג את כל הרכיבים בדמו אינטראקטיבי
<ComponentsExplorer />
```

---

## 🚀 תכונות מרכזיות

✅ **100% CSS Variables** - ללא Tailwind, גמישות מלאה  
✅ **RTL Support** - תמיכה מובנית בעברית  
✅ **TypeScript Ready** - הגדרות טיפוסים מלאות  
✅ **Accessible** - ARIA labels ו-keyboard navigation  
✅ **Animated** - אנימציות חלקות מובנות  
✅ **Tree-shakeable** - ייבוא רק מה שצריך  
✅ **Dark Mode** - תמיכה במצב כהה  

---

*📅 עודכן לאחרונה: 27 ביולי 2025*  
*🔧 נבנה עם Vistara UI v1.0.0*