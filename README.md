# 🎯 Vistara UI

> **"Command your Design."**

Professional React component library with AI-first development methodology and full CSS Variables support.

## ✨ Features

- 🎨 **Full CSS Variables** - No hardcoded values, complete design system control
- ⚡ **AI-First Development** - Built for rapid development and easy modification  
- 🔧 **Auto-Migration Tools** - Convert components from any codebase automatically
- 🌙 **Dark Mode Ready** - Built-in theme switching support
- 📱 **Responsive Design** - Mobile-first approach with flexible sizing
- 🧩 **Modular Components** - Fully independent, reusable components

## 🚀 Quick Start

### Installation

```bash
# Clone and install
git clone <repository-url>
cd vistara-ui
npm install

# Start development server
npm run dev
```

### View Components

Open `http://localhost:3000` to see the interactive component showcase with:
- 🎨 Color palette
- 🔤 Typography system  
- 📏 Spacing scale
- 🧩 Live component examples

## 🎨 Design System

### CSS Variables Architecture

Vistara UI uses a **3-layer CSS Variables system**:

```css
/* Layer 1: Raw colors */
--raw-blue-500: #2196f3;

/* Layer 2: Semantic meaning */  
--color-primary: var(--raw-blue-500);

/* Layer 3: Usage context */
--button-background: var(--color-primary);
```

### Quick Customization

Change your entire theme by updating variables in `src/styles/tokens.css`:

```css
:root {
  --color-primary: #your-brand-color;
  --font-family-base: 'Your Font', sans-serif;
  --border-radius-md: 12px;
}
```

## 🧩 Components

### CompactTaskCard ✅

Migrated from TitanMind with full CSS Variables support:

```jsx
import { CompactTaskCard } from 'vistara-ui';

<CompactTaskCard 
  task={taskData}
  size="normal" // small, normal, large
  onComplete={handleComplete}
  onDelete={handleDelete}
/>
```

**Features:**
- Multiple sizes (small, normal, large)
- Status & priority color coding
- Fully responsive
- Zero hardcoded values

### More Components Coming Soon

- ThemeButton
- NotificationBell  
- Navigation components
- Form components

## 🔧 Development Tools

### Hardcoded Values Detection

```bash
# Scan for hardcoded values
npm run scan-hardcoded

# Auto-convert (dry run)
npm run convert-hardcoded-dry

# Auto-convert (apply changes)
npm run convert-hardcoded
```

### Migration from Other Projects

1. **Copy component files** to `src/components/`
2. **Run detection**: `npm run scan-hardcoded`
3. **Auto-convert**: `npm run convert-hardcoded`
4. **Test and refine** manually

### Style Normalization

Use the built-in utility to ensure CSS Variables compliance:

```jsx
import { normalizeStyle, withNormalizedStyles } from './utils/normalizeStyle';

// Automatic normalization
const MyComponent = withNormalizedStyles(YourComponent);

// Manual normalization  
const styles = normalizeStyle({
  color: '#ffffff', // → var(--color-white)
  padding: '16px'   // → var(--space-4)
});
```

## 📁 Project Structure

```
vistara-ui/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── layout/          # Layout components  
│   │   ├── forms/           # Form components
│   │   └── data/            # Data display components
│   ├── styles/
│   │   ├── base.css         # Base styles & resets
│   │   └── tokens.css       # Design tokens
│   └── utils/
│       └── normalizeStyle.js # Style utilities
├── scripts/
│   ├── detect-hardcoded-values.js  # Detection tool
│   └── auto-convert-hardcoded.js   # Conversion tool
└── public/
    └── index.html
```

## 🎯 AI-First Development

### 15-Minute Project Creation

1. **Clone Vistara UI** (2 min)
2. **Update design tokens** (5 min)  
3. **Generate components** (8 min)
4. **Validation & testing** (immediate)

### 2-Minute Component Changes

1. **Identify CSS variable** (30 sec)
2. **Update token value** (1 min)
3. **See live changes** (30 sec)

### Component Standards

- ✅ **Max 200 lines** per component
- ✅ **Single responsibility** principle
- ✅ **Configuration-driven** via props
- ✅ **CSS Variables only** - no hardcoded values
- ✅ **AI-readable** documentation

## 🔄 Migration Guide

### From TitanMind

1. **Identify component** for migration
2. **Copy to Vistara UI** structure
3. **Run auto-conversion** tools
4. **Update Showcase.jsx** with examples
5. **Test all size variants**

### From Other Projects

1. **Analysis**: Run `npm run scan-hardcoded`
2. **Conversion**: Run `npm run convert-hardcoded`
3. **Integration**: Update imports and props
4. **Validation**: Test responsiveness and themes

## 🌙 Theme System

### Built-in Themes

- **Light Theme** (default)
- **Dark Theme** (`data-theme="dark"`)

### Custom Themes

Create your own theme by extending the token system:

```css
[data-theme="custom"] {
  --color-primary: #your-color;
  --color-background-primary: #your-bg;
  /* ... more overrides */
}
```

```jsx
// Apply theme
document.documentElement.setAttribute('data-theme', 'custom');
```

## 📊 Performance

- **Bundle Size**: < 300KB (optimized)
- **Load Time**: < 1.5 seconds
- **Build Time**: < 2 minutes  
- **Component Generation**: < 30 seconds

## 🤝 Contributing

### Component Development

1. **Create component** in appropriate category
2. **Use CSS Variables** exclusively
3. **Add to Showcase.jsx** with examples
4. **Run validation**: `npm run validate-design-system`
5. **Submit PR** with migration notes

### Design Token Updates

1. **Update `tokens.css`** with new variables
2. **Test all components** for compatibility
3. **Update documentation** if needed

## 🛡️ Quality Assurance

- **Pre-commit hooks** validate CSS Variables usage
- **Automated testing** for component integrity
- **Performance monitoring** for bundle size
- **Design system validation** on every build

## 🎉 Success Metrics

- ✅ **15-minute** project setup
- ✅ **2-minute** component modifications  
- ✅ **Zero hardcoded** values in production
- ✅ **100% AI-documented** components
- ✅ **80%+ component reusability** across projects

---

**Built with ❤️ by Falcon 🦅**  
*AI-First UI Development Methodology*