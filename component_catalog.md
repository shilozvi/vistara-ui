# 📚 Vistara UI - Component Catalog

> קטלוג מלא של כל 74 הרכיבים שהועברו מ-TitanMind

## 📑 תוכן עניינים
- [Common Components (58)](#common-components)
- [Data Components (2)](#data-components)
- [Display Components (2)](#display-components)
- [Monitoring Components (4)](#monitoring-components)

---

## 🎯 Common Components

### 1. **CompactTaskCard** 
**מה זה עושה:** מציג כרטיס משימה קומפקטי עם פרטי המשימה, סטטוס ופעולות
**מתי להשתמש:** כשצריך להציג רשימת משימות בצורה חסכונית במקום
```jsx
<CompactTaskCard task={task} size="normal" onComplete={handleComplete} />
```
**תצוגה:** כרטיס עם כותרת, סטטוס, בעלים ולחצני פעולה

---

### 2. **AgentAvatar**
**מה זה עושה:** מציג אווטאר של סוכן AI עם אינדיקטור סטטוס
**מתי להשתמש:** בכרטיסי סוכנים, צ'אטים, או רשימות משתמשים
```jsx
<AgentAvatar agent={agent} size="normal" showStatus={true} />
```
**תצוגה:** תמונה עגולה עם נקודת סטטוס צבעונית

---

### 3. **ChatInput**
**מה זה עושה:** שדה קלט לצ'אט עם תמיכה בהודעות ארוכות
**מתי להשתמש:** בממשקי צ'אט ושיחה עם AI
```jsx
<ChatInput onSend={handleSend} placeholder="Type a message..." />
```
**תצוגה:** שדה טקסט עם כפתור שליחה וגובה דינמי

---

### 4. **NotificationBell**
**מה זה עושה:** פעמון התראות עם מונה
**מתי להשתמש:** בהדר או בסרגל ניווט להתראות
```jsx
<NotificationBell count={5} onClick={showNotifications} />
```
**תצוגה:** אייקון פעמון עם בועת מספר אדומה

---

### 5. **TaskManager**
**מה זה עושה:** ממשק מלא לניהול משימות
**מתי להשתמש:** בדפי ניהול פרויקטים ומשימות
```jsx
<TaskManager tasks={tasks} onUpdate={updateTask} />
```
**תצוגה:** רשימת משימות עם סינון, מיון ועריכה

---

### 6. **Dashboard**
**מה זה עושה:** לוח בקרה ראשי עם ווידג'טים
**מתי להשתמש:** בדף הבית של האפליקציה
```jsx
<Dashboard widgets={['stats', 'tasks', 'activity']} />
```
**תצוגה:** רשת של כרטיסי מידע וסטטיסטיקות

---

### 7. **QuickActions**
**מה זה עושה:** תפריט פעולות מהירות
**מתי להשתמש:** לגישה מהירה לפעולות נפוצות
```jsx
<QuickActions actions={quickActionsList} />
```
**תצוגה:** רשת כפתורים עם אייקונים

---

### 8. **RecentActivity**
**מה זה עושה:** פיד של פעילות אחרונה
**מתי להשתמש:** בדשבורדים ודפי סקירה
```jsx
<RecentActivity activities={recentActivities} limit={10} />
```
**תצוגה:** רשימה כרונולוגית של אירועים

---

### 9. **SystemStats**
**מה זה עושה:** מציג סטטיסטיקות מערכת
**מתי להשתמש:** בדפי ניטור וביצועים
```jsx
<SystemStats refreshInterval={5000} />
```
**תצוגה:** מדדים בזמן אמת עם גרפים

---

### 10. **VoiceInput**
**מה זה עושה:** ממשק הקלטת קול
**מתי להשתמש:** לקלט קולי בצ'אטים או טפסים
```jsx
<VoiceInput onTranscript={handleTranscript} />
```
**תצוגה:** כפתור מיקרופון עם אנימציית גלי קול

---

### רכיבים נוספים ב-Common:
- **AgentStatus** - מציג סטטוס סוכן
- **AgentStatusMonitor** - ניטור סטטוס בזמן אמת
- **AgentTriggerPanel** - פאנל הפעלת סוכנים
- **AsyncChatButton** - כפתור צ'אט אסינכרוני
- **BulkTaskUpload** - העלאת משימות בכמות
- **ChatPanel** - פאנל צ'אט מלא
- **ChatTasksMonitor** - ניטור משימות בצ'אט
- **ChatWindow** - חלון צ'אט
- **CreateTaskPage** - דף יצירת משימה
- **DashboardMainView** - תצוגה ראשית של דשבורד
- **DashboardTaskSection** - קטע משימות בדשבורד
- **DataSettings** - הגדרות נתונים
- **GPTSettings** - הגדרות GPT
- **Header** - כותרת אפליקציה
- **Layout** - מבנה דף
- **LazyImage** - תמונה עם טעינה עצלה
- **MainView** - תצוגה ראשית
- **ManagementPanel** - פאנל ניהול
- **MessageBubble** - בועת הודעה
- **MessageTimer** - טיימר הודעות
- **MonitorPage** - דף ניטור
- **Navigation** - תפריט ניווט
- **NotificationToast** - הודעת טוסט
- **Phi3ManagerChat** - צ'אט עם Phi3
- **ProcessMonitor** - ניטור תהליכים
- **SimpleMainView** - תצוגה ראשית פשוטה
- **StreamingButton** - כפתור סטרימינג
- **StreamingMessage** - הודעת סטרימינג
- **SystemLogs** - לוגים של המערכת
- **TaskBotPanel** - פאנל בוט משימות
- **TaskCard** - כרטיס משימה
- **TaskDetailModal** - מודל פרטי משימה
- **TaskFilters** - פילטרים למשימות
- **TaskSummaryCompact** - סיכום משימות קומפקטי
- **TasksCSVTable** - טבלת משימות CSV
- **TasksTable** - טבלת משימות
- **TerminalPoolStatus** - סטטוס בריכת טרמינלים
- **ThemeButton** - כפתור החלפת ערכת נושא
- **ThemeDemo** - הדגמת ערכות נושא
- **ThemeToggle** - מתג ערכת נושא
- **TokenAnalytics** - אנליטיקס של טוקנים
- **TokenUsageMonitor** - ניטור שימוש בטוקנים
- **TokenUsageWidget** - ווידג'ט שימוש בטוקנים
- **TypingIndicator** - אינדיקטור הקלדה
- **VoiceSettings** - הגדרות קול
- **VoiceTestPage** - דף בדיקת קול
- **VoiceWave** - גלי קול ויזואליים

---

## 📊 Data Components

### 1. **TokenUsageMonitor**
**מה זה עושה:** מציג ניטור מפורט של שימוש בטוקנים של AI
**מתי להשתמש:** בדשבורדים של אפליקציות AI לניטור עלויות
```jsx
<TokenUsageMonitor refreshInterval={5000} showCosts={true} />
```
**תצוגה:** גרפים, מונים ופירוט עלויות בזמן אמת

---

### 2. **TasksTable**
**מה זה עושה:** טבלה מתקדמת לניהול משימות עם CRUD מלא
**מתי להשתמש:** בדפי ניהול משימות ופרויקטים
```jsx
<TasksTable tasks={tasks} onUpdate={handleUpdate} enableFilters={true} />
```
**תצוגה:** טבלה עם מיון, סינון, עריכה ומחיקה

---

## 🖼️ Display Components

### 1. **AgentCard**
**מה זה עושה:** כרטיס תצוגה מלא של סוכן AI
**מתי להשתמש:** בדפי סוכנים ודשבורדים
```jsx
<AgentCard agent={agentData} showStats={true} />
```
**תצוגה:** כרטיס עם תמונה, סטטוס, סטטיסטיקות וכפתורי פעולה

---

### 2. **SystemHealthDashboard**
**מה זה עושה:** דשבורד מקיף למצב בריאות המערכת
**מתי להשתמש:** בדפי ניטור וניהול מערכת
```jsx
<SystemHealthDashboard systems={['api', 'db', 'cache']} />
```
**תצוגה:** רשת של מדדי ביצועים, גרפים והתראות

---

## 🔍 Monitoring Components

### 1. **BackupStatusCard**
**מה זה עושה:** מציג סטטוס גיבויים ואחסון
**מתי להשתמש:** בדפי ניהול ותחזוקה
```jsx
<BackupStatusCard showDetails={true} alertOnFailure={true} />
```
**תצוגה:** כרטיס עם סטטוס גיבויים, מקום אחסון והיסטוריה

---

### 2. **BackupMonitor**
**מה זה עושה:** ניטור מתקדם של גיבויים
**מתי להשתמש:** בדפי ניטור ייעודיים
```jsx
<BackupMonitor systems={['git', 'local', 'cloud']} />
```
**תצוגה:** פאנל עם ציר זמן וסטטוסים מפורטים

---

### 3. **HealthStatusWidget**
**מה זה עושה:** ווידג'ט קומפקטי למצב בריאות
**מתי להשתמש:** בדשבורדים וסרגלי סטטוס
```jsx
<HealthStatusWidget compact={true} />
```
**תצוגה:** מחוון צבעוני עם אחוזי תקינות

---

### 4. **SystemResourcesMonitor**
**מה זה עושה:** ניטור משאבי מערכת (CPU, RAM, דיסק)
**מתי להשתמש:** בדפי ביצועים וניטור
```jsx
<SystemResourcesMonitor resources={['cpu', 'memory', 'disk']} />
```
**תצוגה:** גרפים בזמן אמת של ניצול משאבים

---

## 🎨 טיפים לשימוש

### בחירת גודל רכיב:
- **compact** - למקומות צפופים
- **normal** - ברירת מחדל
- **expanded** - לתצוגה מפורטת

### בחירת ערכת נושא:
- **default** - עיצוב רגיל
- **minimal** - עיצוב נקי
- **detailed** - מידע מורחב

### התאמה אישית:
```jsx
<Component 
  style={{'--color-primary': '#7c3aed'}}
  className="my-custom-class"
/>
```

---

**💡 טיפ:** השתמש ב-ComponentsExplorer באתר הדמו כדי לראות את כל הרכיבים בפעולה!