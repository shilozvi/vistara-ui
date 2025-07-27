# 🛠️ Vistara UI - Development Workflow Guide

> מדריך מלא לפיתוח רכיבים חדשים מהתחלה ועד הסוף

## 📋 Checklist - רשימת משימות לרכיב חדש

- [ ] 1. תכנון הרכיב וה-API שלו
- [ ] 2. יצירת קובץ הרכיב במיקום הנכון
- [ ] 3. כתיבת הרכיב עם CSS Variables
- [ ] 4. הוספת Props וגדלים
- [ ] 5. יצירת Story לדמו
- [ ] 6. בדיקות ותיקונים
- [ ] 7. עדכון components.index.json
- [ ] 8. עדכון component_catalog.md
- [ ] 9. עדכון component_configuration_guide.md
- [ ] 10. הוספה ל-Showcase

---

## 🚀 שלב 1: תכנון הרכיב

### 1.1 הגדר את המטרה
```markdown
שם הרכיב: NotificationPanel
מטרה: להציג רשימת התראות עם אפשרויות סינון ומחיקה
קטגוריה: common
מורכבות: medium
```

### 1.2 תכנן את ה-API
```typescript
interface NotificationPanelProps {
  // Props בסיסיים
  notifications: Notification[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  
  // Props של Vistara
  size?: 'compact' | 'normal' | 'expanded';
  theme?: 'default' | 'minimal' | 'detailed';
  
  // Props מיוחדים
  showFilters?: boolean;
  maxItems?: number;
  groupByDate?: boolean;
}
```

---

## 📁 שלב 2: יצירת קובץ הרכיב

### 2.1 בחר מיקום נכון
```bash
# לפי הקטגוריה:
src/components/common/        # רכיבי UI כלליים
src/components/data/          # רכיבי נתונים
src/components/display/       # רכיבי תצוגה
src/components/monitoring/    # רכיבי ניטור
```

### 2.2 צור את הקובץ
```bash
touch src/components/common/NotificationPanel.jsx
```

---

## 💻 שלב 3: כתיבת הרכיב

### 3.1 Template בסיסי
```jsx
/**
 * 🎯 Vistara UI - NotificationPanel Component
 * "Command your Design."
 * 
 * A panel for displaying and managing notifications
 * with filtering and dismissal capabilities
 */

import React, { useState, useMemo } from 'react';
import { normalizeStyle, withNormalizedStyles } from '../../utils/normalizeStyle';

const NotificationPanel = ({ 
  notifications = [],
  onDismiss,
  onMarkAsRead,
  size = 'normal',
  theme = 'default',
  showFilters = true,
  maxItems = 50,
  groupByDate = false,
  className,
  style,
  ...props
}) => {
  const [filter, setFilter] = useState('all');
  
  // Size configurations
  const sizeConfigs = {
    compact: {
      padding: 'var(--space-3)',
      gap: 'var(--space-2)',
      fontSize: 'var(--font-size-sm)',
      itemHeight: '60px'
    },
    normal: {
      padding: 'var(--space-4)',
      gap: 'var(--space-3)',
      fontSize: 'var(--font-size-base)',
      itemHeight: '80px'
    },
    expanded: {
      padding: 'var(--space-6)',
      gap: 'var(--space-4)',
      fontSize: 'var(--font-size-lg)',
      itemHeight: '100px'
    }
  };

  const config = sizeConfigs[size];
  
  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    
    if (filter === 'unread') {
      filtered = notifications.filter(n => !n.read);
    } else if (filter === 'important') {
      filtered = notifications.filter(n => n.important);
    }
    
    return filtered.slice(0, maxItems);
  }, [notifications, filter, maxItems]);
  
  // Container styles
  const containerStyles = normalizeStyle({
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: config.padding,
    display: 'flex',
    flexDirection: 'column',
    gap: config.gap,
    ...style
  });
  
  return (
    <div 
      className={`vistara-notification-panel ${className || ''}`} 
      style={containerStyles} 
      {...props}
    >
      {/* Header */}
      <div style={normalizeStyle({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      })}>
        <h3 style={normalizeStyle({
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)'
        })}>
          Notifications ({filteredNotifications.length})
        </h3>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div style={normalizeStyle({
          display: 'flex',
          gap: 'var(--space-2)'
        })}>
          {['all', 'unread', 'important'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={normalizeStyle({
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: filter === type 
                  ? 'var(--color-primary)' 
                  : 'var(--color-background)',
                color: filter === type 
                  ? 'var(--color-white)' 
                  : 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: config.fontSize
              })}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      {/* Notifications List */}
      <div style={normalizeStyle({
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        maxHeight: '400px',
        overflowY: 'auto'
      })}>
        {filteredNotifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            config={config}
            onDismiss={onDismiss}
            onMarkAsRead={onMarkAsRead}
            theme={theme}
          />
        ))}
      </div>
      
      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div style={normalizeStyle({
          textAlign: 'center',
          padding: 'var(--space-8)',
          color: 'var(--color-text-muted)'
        })}>
          No notifications to display
        </div>
      )}
    </div>
  );
};

// Notification Item Component
const NotificationItem = ({ notification, config, onDismiss, onMarkAsRead, theme }) => {
  const itemStyles = normalizeStyle({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3)',
    borderRadius: 'var(--border-radius-md)',
    backgroundColor: notification.read 
      ? 'var(--color-background)' 
      : 'var(--color-primary-light)',
    border: '1px solid var(--color-border)',
    minHeight: config.itemHeight,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });
  
  return (
    <div style={itemStyles}>
      {/* Icon */}
      <div style={normalizeStyle({
        width: '40px',
        height: '40px',
        borderRadius: 'var(--border-radius-full)',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-white)'
      })}>
        {notification.icon || '🔔'}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1 }}>
        <h4 style={normalizeStyle({
          fontSize: config.fontSize,
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-1)'
        })}>
          {notification.title}
        </h4>
        {theme !== 'minimal' && (
          <p style={normalizeStyle({
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)'
          })}>
            {notification.message}
          </p>
        )}
      </div>
      
      {/* Actions */}
      {theme !== 'minimal' && (
        <div style={normalizeStyle({
          display: 'flex',
          gap: 'var(--space-2)'
        })}>
          {!notification.read && onMarkAsRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              style={normalizeStyle({
                padding: 'var(--space-2)',
                borderRadius: 'var(--border-radius-sm)',
                border: 'none',
                backgroundColor: 'var(--color-success-light)',
                color: 'var(--color-success)',
                cursor: 'pointer'
              })}
              title="Mark as read"
            >
              ✓
            </button>
          )}
          {onDismiss && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(notification.id);
              }}
              style={normalizeStyle({
                padding: 'var(--space-2)',
                borderRadius: 'var(--border-radius-sm)',
                border: 'none',
                backgroundColor: 'var(--color-danger-light)',
                color: 'var(--color-danger)',
                cursor: 'pointer'
              })}
              title="Dismiss"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Export with style normalization HOC
export default withNormalizedStyles(NotificationPanel);
```

---

## 🎨 שלב 4: הוספת Props וגדלים

### 4.1 ודא תמיכה בכל הגדלים
```jsx
// בדוק שיש הגדרות ל:
- compact: למקומות צפופים
- normal: ברירת מחדל
- expanded: תצוגה מפורטת
```

### 4.2 ודא תמיכה בכל הערכות נושא
```jsx
// בדוק שיש התנהגות ל:
- default: תצוגה רגילה
- minimal: מידע בסיסי בלבד
- detailed: כל המידע
```

---

## 📸 שלב 5: יצירת Story לדמו

### 5.1 צור קובץ דוגמאות
```jsx
// src/stories/NotificationPanel.stories.js
export const mockNotifications = [
  {
    id: '1',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Update Documentation"',
    icon: '📋',
    read: false,
    important: true,
    timestamp: new Date()
  },
  {
    id: '2',
    title: 'System Update',
    message: 'System will undergo maintenance at 2 AM',
    icon: '🔧',
    read: true,
    important: false,
    timestamp: new Date()
  }
];
```

---

## 🧪 שלב 6: בדיקות ותיקונים

### 6.1 בדיקות ידניות
```bash
# 1. הוסף את הרכיב ל-Showcase
# 2. בדוק בכל הגדלים
# 3. בדוק בכל הערכות נושא
# 4. בדוק עם/בלי נתונים
# 5. בדוק RTL
```

### 6.2 בדיקת CSS Variables
```bash
# ודא שאין:
- צבעים קשיחים (#ffffff)
- מידות קשיחות (16px)
- רווחים קשיחים (margin: 10px)
```

---

## 📝 שלב 7: עדכון components.index.json

### 7.1 הוסף את הרכיב לאינדקס
```bash
node scripts/update-component-index.js NotificationPanel common medium
```

### או עדכן ידנית:
```json
{
  "NotificationPanel": {
    "path": "src/components/common/NotificationPanel.jsx",
    "category": "common",
    "props": [
      "notifications",
      "onDismiss",
      "onMarkAsRead",
      "size",
      "theme",
      "showFilters",
      "maxItems",
      "groupByDate"
    ],
    "requiredProps": ["notifications"],
    "variants": {
      "size": ["compact", "normal", "expanded"],
      "theme": ["default", "minimal", "detailed"]
    },
    "status": "new",
    "createdDate": "2025-07-27",
    "tags": ["notification", "panel", "ui", "alerts"],
    "description": "Panel for displaying and managing notifications",
    "features": [
      "Filtering options",
      "Dismiss functionality",
      "Mark as read",
      "Group by date",
      "CSS Variables only"
    ],
    "dependencies": ["normalizeStyle", "withNormalizedStyles"],
    "hasDemo": true,
    "complexity": "medium"
  }
}
```

---

## 📚 שלב 8: עדכון component_catalog.md

### 8.1 הוסף לקטלוג
```markdown
### X. **NotificationPanel**
**מה זה עושה:** מציג פאנל התראות עם אפשרויות סינון ומחיקה
**מתי להשתמש:** בהדר או בסרגל צד להצגת התראות מערכת
```jsx
<NotificationPanel 
  notifications={notifications} 
  onDismiss={handleDismiss}
  showFilters={true}
/>
```
**תצוגה:** פאנל עם רשימת התראות, פילטרים וכפתורי פעולה
```

---

## 🔧 שלב 9: עדכון component_configuration_guide.md

### 9.1 הוסף תיעוד Props מלא
```markdown
## 🔔 NotificationPanel

### Props מלאים:
```typescript
interface NotificationPanelProps extends BaseProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  showFilters?: boolean;
  maxItems?: number;
  groupByDate?: boolean;
}
```

### דוגמאות שימוש:

#### 1. בסיסי:
```jsx
<NotificationPanel 
  notifications={notifications}
/>
```

#### 2. עם פעולות:
```jsx
<NotificationPanel 
  notifications={notifications}
  onDismiss={(id) => dismissNotification(id)}
  onMarkAsRead={(id) => markAsRead(id)}
  showFilters={true}
/>
```
```

---

## 🎯 שלב 10: הוספה ל-Showcase

### 10.1 עדכן את ShowcaseAll.jsx
```jsx
// 1. הוסף import
import NotificationPanel from './common/NotificationPanel';

// 2. הוסף לרשימת הרכיבים
common: [
  // ...
  { 
    name: 'NotificationPanel', 
    Component: NotificationPanel, 
    description: 'Notification management panel' 
  },
]
```

---

## ✅ Checklist סופי

- [ ] הרכיב עובד בכל הגדלים
- [ ] הרכיב עובד בכל הערכות נושא
- [ ] אין ערכים קשיחים
- [ ] יש תמיכה ב-RTL
- [ ] הרכיב מופיע ב-components.index.json
- [ ] הרכיב מופיע ב-component_catalog.md
- [ ] הרכיב מופיע ב-component_configuration_guide.md
- [ ] הרכיב מופיע ב-Showcase
- [ ] יש דוגמאות שימוש
- [ ] קוד נקי ומתועד

---

## 🚀 טיפים נוספים

### 1. השתמש ב-Snippets
```bash
# צור snippet ל-VSCode עם הטמפלייט הבסיסי
```

### 2. בדוק רכיבים דומים
```bash
# הסתכל על רכיבים קיימים באותה קטגוריה
ls src/components/common/
```

### 3. בדוק ב-Console
```javascript
// בדוק שאין שגיאות
console.log('Component mounted:', componentName);
```

### 4. השתמש ב-DevTools
```bash
# React DevTools - בדוק props
# CSS DevTools - בדוק CSS Variables
```

---

**🎉 סיימת! הרכיב החדש שלך מוכן לשימוש ב-Vistara UI!**