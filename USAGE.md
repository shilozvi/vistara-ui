# 🎯 Vistara UI - Usage Guide

## 📦 Installing as a Package

### Method 1: Local Development (Recommended)

```bash
# In your project directory
npm link /Users/zvishilovitsky/vistara-ui

# Then install in your target project
cd /your/target/project
npm link @vistara/ui
```

### Method 2: File Copy
```bash
# Copy the dist folder to your project
cp -r /Users/zvishilovitsky/vistara-ui/dist /your/project/node_modules/@vistara/ui/
```

### Method 3: Direct Build Import
```bash
# Build the library first
cd /Users/zvishilovitsky/vistara-ui
npm run build:lib

# Then import from dist in your project
```

## 🎨 Using in Your Project

### Import Components
```jsx
// ESM Import (recommended)
import { TextInput, AgentCard, TokenUsageMonitor } from '@vistara/ui';

// CommonJS Import
const { TextInput, AgentCard } = require('@vistara/ui');
```

### Import Styles
```jsx
// In your main app file
import '@vistara/ui/dist/index.css';
// or
import '@vistara/ui/dist/index.esm.css';
```

### Example Usage
```jsx
import React, { useState } from 'react';
import { 
  TextInput, 
  PasswordInput, 
  EmailInput, 
  SearchInput,
  AgentCard,
  TokenUsageMonitor 
} from '@vistara/ui';
import '@vistara/ui/dist/index.css';

function App() {
  const [formData, setFormData] = useState({});

  return (
    <div>
      {/* Form Components */}
      <TextInput 
        label="שם מלא"
        placeholder="הכנס שם..."
        size="normal"
        theme="default"
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      
      <PasswordInput 
        label="סיסמה"
        showStrengthIndicator={true}
        theme="detailed"
      />
      
      <EmailInput 
        label="אימייל"
        suggestDomains={true}
        validateOnType={true}
      />
      
      <SearchInput 
        placeholder="חפש..."
        onSearch={(query) => console.log('Search:', query)}
        showHistory={true}
      />
      
      {/* Display Components */}
      <AgentCard 
        agent={{
          name: "AI Assistant",
          status: "active",
          description: "Smart AI helper"
        }}
        size="expanded"
        theme="detailed"
      />
      
      {/* Monitoring Components */}
      <TokenUsageMonitor 
        refreshInterval={5000}
        showCosts={true}
        theme="minimal"
      />
    </div>
  );
}

export default App;
```

## 🎨 Customization

### Override CSS Variables
```css
/* In your global CSS */
:root {
  --color-primary: #7c3aed;
  --color-secondary: #06b6d4;
  --font-family-base: 'Inter', sans-serif;
  --border-radius-lg: 16px;
}
```

### Component-Specific Styling
```jsx
<TextInput 
  style={{ 
    '--color-primary': '#ef4444',
    '--border-radius-md': '12px' 
  }}
  className="my-custom-input"
/>
```

## 📊 Available Components

### 📝 Form Components (4)
- `TextInput` - Flexible text input with validation
- `PasswordInput` - Secure password with strength indicator  
- `EmailInput` - Email input with domain suggestions
- `SearchInput` - Advanced search with filters & history

### 🎯 Common Components (58)
- `Dashboard`, `TaskManager`, `AgentCard`
- `ChatInput`, `VoiceInput`, `NotificationBell`
- And 52 more...

### 📊 Data Components (2)
- `TokenUsageMonitor` - AI token usage tracking
- `TasksTable` - Advanced data table

### 🖼️ Display Components (2)
- `AgentCard` - AI agent display card
- `SystemHealthDashboard` - System status

### 🔍 Monitoring Components (4)
- `BackupStatusCard`, `HealthStatusWidget`
- `SystemResourcesMonitor` - And more

## 🔧 Props System

### Universal Props
Every component supports:
```jsx
<Component
  size="compact | normal | expanded"
  theme="default | minimal | detailed"
  className="custom-class"
  style={{ '--color-primary': '#custom' }}
/>
```

### Component-Specific Props
See the [Configuration Guide](./docs_VistaraUI/03_development/archive/component_configuration_guide.md) for detailed props documentation.

## 🎯 TypeScript Support

```tsx
import { TextInput, TextInputProps } from '@vistara/ui';

interface MyFormProps {
  onSubmit: (data: FormData) => void;
}

const MyForm: React.FC<MyFormProps> = ({ onSubmit }) => {
  const handleChange: TextInputProps['onChange'] = (e) => {
    // Full type safety
  };

  return <TextInput onChange={handleChange} />;
};
```

## 🚀 Performance Tips

### Tree Shaking
```jsx
// ✅ Good - Only imports what you need
import { TextInput } from '@vistara/ui';

// ❌ Avoid - Imports entire library  
import * as VistaraUI from '@vistara/ui';
```

### CSS Loading
```jsx
// Load CSS once in your main file
import '@vistara/ui/dist/index.css';

// Don't import in every component
```

## 🐛 Troubleshooting

### Common Issues

**CSS Variables not working:**
```jsx
// Make sure you imported the CSS
import '@vistara/ui/dist/index.css';
```

**Components not found:**
```bash
# Make sure the package is linked/installed
npm link @vistara/ui
# or
npm install /path/to/vistara-ui
```

**Build errors:**
```bash
# Rebuild the library
cd /path/to/vistara-ui
npm run build:lib
```

## 📈 Bundle Analysis

Current bundle sizes:
- **CommonJS**: ~280KB minified
- **ESM**: ~275KB minified  
- **CSS**: ~45KB minified
- **Total**: ~325KB (gzipped: ~85KB)

---

**💡 Need help? Check the [Component Catalog](./docs_VistaraUI/03_development/archive/component_catalog.md) for visual examples!**