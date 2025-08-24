# 🎨 מדריך עיצוב UI - Vistara UI

> **סטטוס:** ✅ Complete  
> **עודכן לאחרונה:** 2025-07-27  
> **רמת קושי:** Expert  
> **זמן קריאה:** כ־15 דקות  
> **שייך לקטגוריה:** 03_development  
> **מלא על ידי:** Falcon 🦅

---

## 🎯 סקירה כללית

Vistara UI משתמשת במערכת **Design Tokens** מתקדמת הבנויה על CSS Variables. זה מאפשר:
- ✅ עקביות מושלמת בעיצוב
- 🌓 החלפת נושאים דינמית (Dark/Light Mode)
- 🎨 התאמה אישית קלה
- 🔧 תחזוקה מהירה ויעילה

**הפילוסופיה:** "Command your Design" - שליטה מלאה בעיצוב!

**מדריך זה מתמקד ב:** רשימת כל הטוקנים והערכים הזמינים במערכת.
**לאיך לעבוד איתם:** ראה [CSS Variables Guide](./css_variables_guide.md)

---

## 🎨 מערכת הצבעים

### צבעים ראשיים (Primary)
```css
--color-primary: #6c5ce7;        /* Purple - הצבע הראשי */
--color-primary-light: #a29bfe;  /* גרסה בהירה */
--color-primary-dark: #5f3dc4;   /* גרסה כהה */
```

### צבעים משניים (Secondary)
```css
--color-secondary: #0984e3;      /* Blue - צבע משני */
--color-secondary-light: #74b9ff;
--color-secondary-dark: #0968b3;
```

### צבעי סטטוס (Status Colors)
```css
--color-success: #00b894;        /* ירוק - הצלחה */
--color-warning: #fdcb6e;        /* צהוב - אזהרה */
--color-error: #e17055;          /* אדום - שגיאה */
--color-info: #74b9ff;           /* כחול - מידע */
```

### צבעים ניטרליים (Neutral Scale)
```css
--color-gray-50: #f9fafb;   /* הכי בהיר */
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;  /* אמצע */
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;  /* הכי כהה */
```

### 🎯 צבעים סמנטיים (Semantic Colors)

**רקעים (Backgrounds):**
```css
--color-background-primary: var(--color-white);
--color-background-secondary: var(--color-gray-50);
--color-background-tertiary: var(--color-gray-100);
--color-background-inverse: var(--color-gray-900);
```

**טקסט (Text):**
```css
--color-text-primary: var(--color-gray-900);    /* טקסט ראשי */
--color-text-secondary: var(--color-gray-600);  /* טקסט משני */
--color-text-muted: var(--color-gray-400);      /* טקסט מעומעם */
--color-text-inverse: var(--color-white);       /* טקסט הפוך */
--color-text-link: var(--color-primary);        /* קישורים */
```

**גבולות (Borders):**
```css
--color-border-light: var(--color-gray-200);   /* גבול בהיר */
--color-border-medium: var(--color-gray-300);  /* גבול בינוני */
--color-border-strong: var(--color-gray-400);  /* גבול חזק */
--color-border-focus: var(--color-primary);    /* פוקוס */
```

---

## 🔤 מערכת הטיפוגרפיה

### משפחות פונטים
```css
--font-family-base: 'Inter', system-ui, -apple-system, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### גדלי פונטים (Font Sizes)
```css
--font-size-xs: 0.75rem;     /* 12px - קטן מאוד */
--font-size-sm: 0.875rem;    /* 14px - קטן */
--font-size-base: 1rem;      /* 16px - בסיס */
--font-size-lg: 1.125rem;    /* 18px - גדול */
--font-size-xl: 1.25rem;     /* 20px - גדול מאוד */
--font-size-2xl: 1.5rem;     /* 24px - כותרת קטנה */
--font-size-3xl: 1.875rem;   /* 30px - כותרת בינונית */
--font-size-4xl: 2.25rem;    /* 36px - כותרת גדולה */
```

### משקלי פונטים (Font Weights)
```css
--font-weight-light: 300;      /* דק */
--font-weight-normal: 400;     /* רגיל */
--font-weight-medium: 500;     /* בינוני */
--font-weight-semibold: 600;   /* חצי מודגש */
--font-weight-bold: 700;       /* מודגש */
```

### גובה שורות (Line Heights)
```css
--line-height-tight: 1.25;    /* צפוף */
--line-height-base: 1.5;      /* רגיל */
--line-height-relaxed: 1.75;  /* רחב */
```

### 📖 דוגמאות שימוש:
```jsx
// כותרת ראשית
<h1 style={{
  fontSize: 'var(--font-size-4xl)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text-primary)',
  lineHeight: 'var(--line-height-tight)'
}}>
  כותרת ראשית
</h1>

// טקסט גוף
<p style={{
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-normal)',
  color: 'var(--color-text-secondary)',
  lineHeight: 'var(--line-height-base)'
}}>
  טקסט גוף רגיל
</p>
```

---

## 📏 מערכת הריווחים (Spacing)

```css
--space-0: 0;           /* ללא ריווח */
--space-1: 0.25rem;     /* 4px - קטן מאוד */
--space-2: 0.5rem;      /* 8px - קטן */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px - בסיס */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px - בינוני */
--space-10: 2.5rem;     /* 40px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px - גדול */
--space-20: 5rem;       /* 80px - גדול מאוד */
```

### 📖 דוגמאות שימוש:
```jsx
// כרטיס עם padding
<div style={{
  padding: 'var(--space-6)',      // 24px מכל הצדדים
  margin: 'var(--space-4)',       // 16px margin
  gap: 'var(--space-3)'           // 12px בין אלמנטים
}}>
  תוכן הכרטיס
</div>
```

---

## 📐 גבולות ועיגולים (Borders & Radius)

### עובי גבולות
```css
--border-width-0: 0;      /* ללא גבול */
--border-width-1: 1px;    /* דק */
--border-width-2: 2px;    /* בינוני */
--border-width-4: 4px;    /* עבה */
```

### רדיוס עיגולים
```css
--border-radius-none: 0;         /* ללא עיגול */
--border-radius-sm: 0.25rem;     /* 4px - קטן */
--border-radius-md: 0.5rem;      /* 8px - בינוני */
--border-radius-lg: 0.75rem;     /* 12px - גדול */
--border-radius-xl: 1rem;        /* 16px - גדול מאוד */
--border-radius-full: 9999px;    /* עיגול מלא */
```

---

## 🎭 צללים (Shadows)

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);        /* קטן */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);       /* בינוני */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);     /* גדול */
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);     /* גדול מאוד */
```

### 📖 דוגמאות שימוש:
```jsx
// כרטיס עם צל
<div style={{
  boxShadow: 'var(--shadow-lg)',
  borderRadius: 'var(--border-radius-xl)',
  padding: 'var(--space-6)'
}}>
  כרטיס עם צל
</div>
```

---

## ⚡ אנימציות ומעברים (Animations)

### מעברים (Transitions)
```css
--transition-fast: all 0.1s ease-in-out;     /* מהיר */
--transition-base: all 0.2s ease-in-out;     /* רגיל */
--transition-slow: all 0.3s ease-in-out;     /* איטי */
```

### משכי זמן (Durations)
```css
--duration-fast: 150ms;    /* מהיר */
--duration-base: 200ms;    /* רגיל */
--duration-slow: 300ms;    /* איטי */
```

### עקומות תזמון (Easing)
```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🌙 מצב כהה (Dark Mode)

המערכת תומכת באופן אוטומטי במצב כהה באמצעות `[data-theme="dark"]`:

```css
[data-theme="dark"] {
  --color-background-primary: var(--color-gray-900);
  --color-background-secondary: var(--color-gray-800);
  --color-text-primary: var(--color-white);
  --color-text-secondary: var(--color-gray-300);
  /* ...מעבר אוטומטי לכל הצבעים */
}
```

### 🔄 החלפת נושאים:
```jsx
// החלפה דינמית
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
};
```

---

## 📱 עיצוב רספונסיבי (Responsive Design)

### נקודות שבירה מומלצות:
```css
/* Mobile First Approach */
.component {
  /* Mobile: 320px+ */
  padding: var(--space-4);
}

@media (min-width: 768px) {
  /* Tablet: 768px+ */
  .component {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  /* Desktop: 1024px+ */
  .component {
    padding: var(--space-8);
  }
}
```

---

## ♿ נגישות (Accessibility)

### כללי זהב:
1. **ניגודיות:** השתמש בצבעי טקסט עם ניגודיות מספקת
2. **פוקוס:** השתמש ב-`--color-border-focus` לאלמנטים מפוקסים
3. **גדלי פונטים:** לא פחות מ-`--font-size-sm` (14px)
4. **אזורי מגע:** לפחות 44px לכפתורים (שתמש ב-`--space-10` + padding)

### דוגמאות נגישות:
```jsx
// כפתור נגיש
<button style={{
  fontSize: 'var(--font-size-base)',
  padding: 'var(--space-3) var(--space-6)',
  minHeight: 'var(--space-10)',
  borderRadius: 'var(--border-radius-md)',
  border: `var(--border-width-2) solid var(--color-border-focus)`,
  transition: 'var(--transition-base)'
}}>
  כפתור נגיש
</button>
```

---

## 🎯 דוגמאות מעשיות

### כרטיס מושלם:
```jsx
const Card = ({ children }) => (
  <div style={{
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--border-radius-xl)',
    boxShadow: 'var(--shadow-lg)',
    padding: 'var(--space-6)',
    border: `var(--border-width-1) solid var(--color-border-light)`,
    transition: 'var(--transition-base)'
  }}>
    {children}
  </div>
);
```

### כפתור ראשי:
```jsx
const PrimaryButton = ({ children, onClick }) => (
  <button 
    onClick={onClick}
    style={{
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-semibold)',
      padding: 'var(--space-3) var(--space-6)',
      borderRadius: 'var(--border-radius-md)',
      border: 'none',
      boxShadow: 'var(--shadow-md)',
      transition: 'var(--transition-base)',
      cursor: 'pointer'
    }}
  >
    {children}
  </button>
);
```

---

## 📚 משאבים נוספים

1. **CSS Variables Guide** - `css_variables_guide.md` - איך לעבוד עם המשתנים
2. **Component Development** - `component_development.md` - פיתוח קומפוננטים
3. **Migration Guide** - `migration_guide.md` - מיגרציה מפרויקטים אחרים
4. **קובץ הטוקנים** - `src/styles/tokens.css` - הקובץ המקורי

---

**🦅 Falcon:** "Command your Design" - עכשיו יש לך שליטה מלאה בעיצוב! 🎯