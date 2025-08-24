# 🧩 פיתוח קומפוננטים - Vistara UI

> **סטטוס:** ✅ Complete  
> **עודכן לאחרונה:** 2025-07-27  
> **רמת קושי:** Intermediate  
> **זמן קריאה:** כ־12 דקות  
> **שייך לקטגוריה:** 03_development  
> **מלא על ידי:** Falcon 🦅

---

## 🎯 סקירה כללית

מדריך זה יסביר איך לפתח קומפוננטים חדשים ב-Vistara UI עם מערכת CSS Variables. המטרה: קומפוננטים מודולריים, גמישים וללא hardcoded values.

---

## 🏗️ ארכיטקטורת קומפוננטים

### 📁 מבנה התיקיות
```
src/components/
├── common/              # קומפוננטים בסיסיים
│   ├── Button/
│   ├── Card/
│   └── CompactTaskCard/
├── data/                # קומפוננטי נתונים
│   ├── TokenUsageMonitor/
│   └── TasksTable/
├── display/             # קומפוננטי תצוגה
│   ├── AgentCard/
│   └── SystemHealthDashboard/
├── monitoring/          # קומפוננטי ניטור
│   └── BackupStatusCard/
└── utils/              # כלי עזר
    └── normalizeStyle.js
```

### 🎯 עקרונות התכנון
1. **ללא hardcoded values** - רק CSS Variables (ראה [UI Design Guide](./ui_design_guide.md) לכל הטוקנים)
2. **מודולריות** - כל קומפוננט עצמאי
3. **גמישות** - תמיכה בגדלים ו-themes שונים
4. **נגישות** - תמיכה מלאה בנגישות
5. **ביצועים** - קוד מיטובח ומהיר

---

## 🚀 יצירת קומפוננט חדש - Step by Step

### שלב 1: תכנון הקומפוננט

לפני שמתחילים לכתב, תשאל את עצמך:
- **מה התפקיד של הקומפוננט?**
- **אילו props הוא צריך?**
- **אילו variants יש לו?** (גדלים, צבעים, מצבים)
- **איך הוא מתנהג ב-dark mode?**

### שלב 2: יצירת הקובץ

```bash
# יצירת קומפוננט חדש
mkdir src/components/common/MyButton
touch src/components/common/MyButton/MyButton.jsx
```

### שלב 3: התמפלט הבסיסי

```jsx
/**
 * 🎯 Vistara UI - MyButton Component  
 * "Command your Design."
 * 
 * [תיאור הקומפוננט]
 * 
 * ✅ Fully normalized - No hardcoded values
 * ✅ CSS Variables only
 * ✅ Modular and reusable
 */

import React from 'react';
import { normalizeStyle, withNormalizedStyles } from '../../utils/normalizeStyle';

const MyButton = ({ 
  children,
  onClick,
  variant = 'primary',
  size = 'normal',
  disabled = false,
  ...props 
}) => {
  
  // 1. הגדרת variants
  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      borderColor: 'var(--color-primary)'
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-white)',
      borderColor: 'var(--color-secondary)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)'
    }
  };

  // 2. הגדרת גדלים
  const sizes = {
    small: {
      padding: 'var(--space-2) var(--space-4)',
      fontSize: 'var(--font-size-sm)',
      minHeight: 'var(--space-8)'
    },
    normal: {
      padding: 'var(--space-3) var(--space-6)',
      fontSize: 'var(--font-size-base)',
      minHeight: 'var(--space-10)'
    },
    large: {
      padding: 'var(--space-4) var(--space-8)',
      fontSize: 'var(--font-size-lg)',
      minHeight: 'var(--space-12)'
    }
  };

  // 3. בניית הסטיילים
  const buttonStyles = normalizeStyle({
    ...variants[variant],
    ...sizes[size],
    border: `var(--border-width-1) solid`,
    borderRadius: 'var(--border-radius-md)',
    fontWeight: 'var(--font-weight-semibold)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.5' : '1',
    transition: 'var(--transition-base)',
    fontFamily: 'var(--font-family-base)'
  });

  return (
    <button
      className="vistara-component"
      style={buttonStyles}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Export עם style normalization
export default withNormalizedStyles(MyButton);
```

---

## 🎨 עבודה עם CSS Variables

**למדריך מלא:** ראה [CSS Variables Guide](./css_variables_guide.md)

### כלל זהב לקומפוננטים:
- תמיד השתמש ב-`var(--token-name)` במקום ערכים קשיחים
- השתמש ב-`normalizeStyle()` לנרמול סטיילים
- בדוק שכל הטוקנים קיימים ב-`tokens.css`

---

## 📏 מערכת הגדלים (Sizing System)

### 🎯 גישה מומלצת - 3 גדלים סטנדרטיים
```jsx
const sizeConfigs = {
  small: {
    padding: 'var(--space-2)',
    fontSize: 'var(--font-size-sm)',
    iconSize: '14px',
    minHeight: 'var(--space-8)'
  },
  normal: {
    padding: 'var(--space-3)',
    fontSize: 'var(--font-size-base)',
    iconSize: '16px',
    minHeight: 'var(--space-10)'
  },
  large: {
    padding: 'var(--space-4)',
    fontSize: 'var(--font-size-lg)',
    iconSize: '20px',
    minHeight: 'var(--space-12)'
  }
};
```

### 📱 שימוש בגדלים
```jsx
const Card = ({ size = 'normal', children }) => {
  const config = sizeConfigs[size];
  
  return (
    <div style={{
      padding: config.padding,
      fontSize: config.fontSize,
      minHeight: config.minHeight
    }}>
      {children}
    </div>
  );
};
```

---

## 🎨 מערכת ה-Variants

### 🎯 דוגמה מ-CompactTaskCard
```jsx
// Status variants
const getStatusStyles = (status) => {
  const baseStyle = {
    color: 'var(--color-white)',
    fontWeight: 'var(--font-weight-medium)'
  };

  switch (status?.toLowerCase()) {
    case 'completed': 
      return { ...baseStyle, backgroundColor: 'var(--color-success)' };
    case 'in progress': 
      return { ...baseStyle, backgroundColor: 'var(--color-info)' };
    case 'review': 
      return { ...baseStyle, backgroundColor: 'var(--color-primary)' };
    default: 
      return { ...baseStyle, backgroundColor: 'var(--color-gray-600)' };
  }
};
```

### 🎨 Button variants
```jsx
const ButtonVariants = {
  primary: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    hoverBg: 'var(--color-primary-dark)'
  },
  secondary: {
    backgroundColor: 'var(--color-secondary)',
    color: 'var(--color-white)',
    hoverBg: 'var(--color-secondary-dark)'
  },
  success: {
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-white)',
    hoverBg: 'var(--color-success-dark)'
  },
  danger: {
    backgroundColor: 'var(--color-error)',
    color: 'var(--color-white)',
    hoverBg: 'var(--color-error-dark)'
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    hoverBg: 'var(--color-primary-light)'
  }
};
```

---

## 🌓 תמיכה ב-Dark Mode

### ✅ אוטומטי עם CSS Variables
```jsx
// הקומפוננט לא צריך לדעת על dark mode!
const CardComponent = () => (
  <div style={{
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    borderColor: 'var(--color-border-light)'
  }}>
    {/* התוכן משתנה אוטומטי */}
  </div>
);
```

המערכת מטפלת בכל אוטומטית ב-`tokens.css`:
```css
/* Light mode */
:root {
  --color-surface: #ffffff;
  --color-text-primary: #111827;
}

/* Dark mode */
[data-theme="dark"] {
  --color-surface: #1f2937;
  --color-text-primary: #ffffff;
}
```

---

## 🎭 אפקטי Hover ו-States

### 🎯 הדרך הנכונה - עם CSS Variables
```jsx
const Button = ({ variant, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyles = {
    backgroundColor: `var(--button-${variant}-bg)`,
    color: `var(--button-${variant}-color)`,
    transition: 'var(--transition-base)'
  };
  
  const hoverStyles = {
    backgroundColor: `var(--button-${variant}-hover)`,
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-lg)'
  };

  return (
    <button
      style={isHovered ? { ...baseStyles, ...hoverStyles } : baseStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};
```

### 🎨 אפקטים מתקדמים
```jsx
// אפקט loading
const [isLoading, setIsLoading] = useState(false);

const loadingStyles = {
  opacity: '0.7',
  cursor: 'not-allowed',
  animation: 'pulse 2s infinite'
};

// אפקט focus
const focusStyles = {
  outline: 'none',
  boxShadow: `0 0 0 3px var(--color-primary-light)`,
  borderColor: 'var(--color-primary)'
};
```

---

## ♿ נגישות (Accessibility)

### 🎯 כללי זהב לנגישות
```jsx
const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false,
  ariaLabel,
  role = "button"
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel || children}
    role={role}
    tabIndex={disabled ? -1 : 0}
    style={{
      minHeight: 'var(--space-10)', // לפחות 44px
      fontSize: 'var(--font-size-base)', // לפחות 16px
      color: 'var(--color-text-primary)',
      backgroundColor: 'var(--color-surface)',
      border: `var(--border-width-2) solid var(--color-border-focus)`,
      borderRadius: 'var(--border-radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer'
    }}
  >
    {children}
  </button>
);
```

### 📋 Checklist נגישות
- ✅ **גדלי מגע:** לפחות 44px (השתמש ב-`--space-10`)
- ✅ **ניגודיות:** השתמש בצבעי הטקסט של המערכת
- ✅ **פוקוס:** תמיד הגדר focus states
- ✅ **ARIA labels:** לאלמנטים ללא טקסט ברור
- ✅ **Keyboard navigation:** תמיכה מלאה במקלדת

---

## 🔧 כלי עזר - normalizeStyle

### 🎯 מה זה עושה?
```javascript
// utils/normalizeStyle.js
export const normalizeStyle = (styles) => {
  // מנקה ומנרמל סטיילים
  // מוסיף fallbacks
  // מטפל ב-vendor prefixes
  return cleanedStyles;
};

export const withNormalizedStyles = (Component) => {
  // HOC שמוסיף נרמליזציה אוטומטית
  return (props) => <Component {...props} />;
};
```

### 📝 שימוש
```jsx
// במקום:
const styles = {
  backgroundColor: 'var(--color-primary)',
  padding: 'var(--space-4)'
};

// השתמש ב:
const styles = normalizeStyle({
  backgroundColor: 'var(--color-primary)',
  padding: 'var(--space-4)'
});
```

---

## 🧪 בדיקות (Testing)

### 🎯 בדיקות בסיסיות
```jsx
// MyButton.test.jsx
import { render, fireEvent } from '@testing-library/react';
import MyButton from './MyButton';

describe('MyButton', () => {
  test('renders with correct variant styles', () => {
    const { getByRole } = render(
      <MyButton variant="primary">Click me</MyButton>
    );
    
    const button = getByRole('button');
    expect(button).toHaveStyle({
      backgroundColor: 'var(--color-primary)'
    });
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <MyButton onClick={handleClick}>Click me</MyButton>
    );
    
    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('supports different sizes', () => {
    const { getByRole } = render(
      <MyButton size="large">Large Button</MyButton>
    );
    
    const button = getByRole('button');
    expect(button).toHaveStyle({
      fontSize: 'var(--font-size-lg)'
    });
  });
});
```

---

## 📚 תיעוד קומפוננטים

### 🎯 תמפלט תיעוד
```jsx
/**
 * # MyButton Component
 * 
 * ## Description
 * כפתור גמיש עם תמיכה במספר variants וגדלים
 * 
 * ## Props
 * - `variant` (string): 'primary' | 'secondary' | 'outline' | 'danger'
 * - `size` (string): 'small' | 'normal' | 'large'  
 * - `disabled` (boolean): האם הכפתור מושבת
 * - `onClick` (function): פונקציה שמופעלת בלחיצה
 * - `children` (node): התוכן של הכפתור
 * 
 * ## Examples
 * ```jsx
 * <MyButton variant="primary" size="large">
 *   Primary Button
 * </MyButton>
 * 
 * <MyButton variant="outline" onClick={handleClick}>
 *   Outline Button  
 * </MyButton>
 * ```
 * 
 * ## CSS Variables Used
 * - `--color-primary` - צבע רקע primary
 * - `--color-white` - צבע טקסט
 * - `--space-*` - ריווחים
 * - `--font-size-*` - גדלי פונטים
 */
```

---

## 🎯 Best Practices

### ✅ עשה:
1. **תמיד השתמש ב-CSS Variables** ולא בערכים קשיחים
2. **תמיכה ב-3 גדלים סטנדרטיים:** small, normal, large
3. **הוסף תמיכה בנגישות** מההתחלה
4. **כתוב בדיקות** לפונקציונליות הבסיסית
5. **תעד את הקומפוננט** עם דוגמאות שימוש
6. **השתמש ב-normalizeStyle** לקונסיסטנטיות

### ❌ אל תעשה:
1. **hardcoded values** בשום מקום
2. **קומפוננטים ללא תמיכה ב-dark mode**
3. **פונקציונליות ללא בדיקות**
4. **קומפוננטים ללא תיעוד**
5. **גדלי מגע קטנים מ-44px**

---

## 🚀 דוגמאות מתקדמות

### 1️⃣ קומפוננט עם אנימציות
```jsx
const AnimatedCard = ({ children, delay = 0 }) => (
  <div
    style={{
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-md)',
      animation: `fadeIn var(--duration-slow) ease-out ${delay}ms`,
      transition: 'var(--transition-base)'
    }}
  >
    {children}
  </div>
);
```

### 2️⃣ קומפוננט responsive
```jsx
const ResponsiveGrid = ({ children, columns = { mobile: 1, tablet: 2, desktop: 3 } }) => (
  <div
    style={{
      display: 'grid',
      gap: 'var(--space-4)',
      gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`,
      '@media (min-width: 768px)': {
        gridTemplateColumns: `repeat(${columns.tablet}, 1fr)`
      },
      '@media (min-width: 1024px)': {
        gridTemplateColumns: `repeat(${columns.desktop}, 1fr)`
      }
    }}
  >
    {children}
  </div>
);
```

---

## 📚 משאבים נוספים

1. **UI Design Guide** - `ui_design_guide.md` - כל הטוקנים הזמינים
2. **CSS Variables Guide** - `css_variables_guide.md` - איך לעבוד עם המשתנים  
3. **Migration Guide** - `migration_guide.md` - העברת קומפוננטים מ-TitanMind
4. **דוגמאות קיימות** - `src/components/` - CompactTaskCard, TokenUsageMonitor וועוד

---

**🦅 Falcon:** "קומפוננט מושלם = CSS Variables + נגישות + תיעוד!" 🎯