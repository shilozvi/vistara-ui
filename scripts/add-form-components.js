const fs = require('fs');
const path = require('path');

// Read existing index
const indexPath = path.join(__dirname, '../src/data/components.index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

// Add new form components
const formComponents = {
  "TextInput": {
    "path": "src/components/forms/TextInput.jsx",
    "category": "forms",
    "props": [
      "value", "defaultValue", "onChange", "onBlur", "onFocus",
      "placeholder", "type", "name", "id", "autoComplete",
      "readOnly", "disabled", "required", "maxLength", "minLength", "pattern",
      "error", "helperText", "validateOnBlur", "validator",
      "size", "theme", "variant",
      "leftIcon", "rightIcon", "prefix", "suffix",
      "onLeftIconClick", "onRightIconClick", "label",
      "className", "style"
    ],
    "requiredProps": [],
    "variants": {
      "size": ["compact", "normal", "expanded"],
      "theme": ["default", "minimal", "detailed"],
      "variant": ["outlined", "filled", "underlined"]
    },
    "status": "new",
    "createdDate": "2025-07-27",
    "tags": ["input", "text", "form", "validation", "ui"],
    "description": "Flexible text input with validation, icons, and theming support",
    "features": [
      "Multiple variants (outlined, filled, underlined)",
      "Icon support (left/right)",
      "Prefix/suffix support",
      "Built-in validation",
      "Helper text",
      "Character counter",
      "CSS Variables only"
    ],
    "dependencies": ["normalizeStyle", "withNormalizedStyles"],
    "hasDemo": true,
    "complexity": "medium"
  },
  "PasswordInput": {
    "path": "src/components/forms/PasswordInput.jsx",
    "category": "forms",
    "props": [
      "showStrengthIndicator", "showVisibilityToggle",
      "strengthRules", "onStrengthChange",
      "size", "theme"
    ],
    "requiredProps": [],
    "variants": {
      "size": ["compact", "normal", "expanded"],
      "theme": ["default", "minimal", "detailed"]
    },
    "status": "new",
    "createdDate": "2025-07-27",
    "tags": ["password", "input", "form", "security", "validation"],
    "description": "Secure password input with visibility toggle and strength indicator",
    "features": [
      "Show/hide password toggle",
      "Password strength indicator",
      "Customizable strength rules",
      "Password requirements display",
      "Inherits all TextInput features"
    ],
    "dependencies": ["TextInput", "normalizeStyle"],
    "hasDemo": true,
    "complexity": "medium"
  },
  "EmailInput": {
    "path": "src/components/forms/EmailInput.jsx",
    "category": "forms",
    "props": [
      "suggestDomains", "commonDomains", "validateOnType",
      "allowedDomains", "blockedDomains", "onValidEmail",
      "size", "theme"
    ],
    "requiredProps": [],
    "variants": {
      "size": ["compact", "normal", "expanded"],
      "theme": ["default", "minimal", "detailed"]
    },
    "status": "new",
    "createdDate": "2025-07-27",
    "tags": ["email", "input", "form", "validation", "autocomplete"],
    "description": "Email input with built-in validation and domain suggestions",
    "features": [
      "Domain autocomplete",
      "Email format validation",
      "Domain whitelist/blacklist",
      "Valid email indicator",
      "Keyboard navigation for suggestions",
      "Inherits all TextInput features"
    ],
    "dependencies": ["TextInput", "normalizeStyle"],
    "hasDemo": true,
    "complexity": "medium"
  },
  "SearchInput": {
    "path": "src/components/forms/SearchInput.jsx",
    "category": "forms",
    "props": [
      "onSearch", "searchOnType", "debounceDelay", "minChars",
      "suggestions", "showSuggestions", "maxSuggestions", "getSuggestions",
      "showHistory", "searchHistory", "maxHistoryItems", "onClearHistory",
      "filters", "activeFilters", "onFilterChange",
      "isLoading", "size", "theme", "placeholder"
    ],
    "requiredProps": ["onSearch"],
    "variants": {
      "size": ["compact", "normal", "expanded"],
      "theme": ["default", "minimal", "detailed"]
    },
    "status": "new",
    "createdDate": "2025-07-27",
    "tags": ["search", "input", "form", "suggestions", "filters", "history"],
    "description": "Powerful search input with suggestions, history, and filters",
    "features": [
      "Real-time search suggestions",
      "Search history",
      "Filter dropdowns",
      "Debounced search",
      "Async suggestions support",
      "Loading states",
      "Keyboard navigation",
      "Inherits all TextInput features"
    ],
    "dependencies": ["TextInput", "normalizeStyle"],
    "hasDemo": true,
    "complexity": "complex"
  }
};

// Add to index
Object.entries(formComponents).forEach(([name, component]) => {
  index.components[name] = component;
});

// Update meta
index.meta.totalComponents = Object.keys(index.components).length;
index.meta.lastUpdated = new Date().toISOString().split('T')[0];
index.meta.version = "0.3.0";

// Update search indices
if (!index.searchIndex) {
  index.searchIndex = { byCategory: {}, byTags: {}, byComplexity: {} };
}

// Add forms category
if (!index.searchIndex.byCategory.forms) {
  index.searchIndex.byCategory.forms = [];
}

Object.entries(formComponents).forEach(([name, component]) => {
  // By category
  index.searchIndex.byCategory.forms.push(name);
  
  // By tags
  component.tags.forEach(tag => {
    if (!index.searchIndex.byTags[tag]) {
      index.searchIndex.byTags[tag] = [];
    }
    index.searchIndex.byTags[tag].push(name);
  });
  
  // By complexity
  if (!index.searchIndex.byComplexity[component.complexity]) {
    index.searchIndex.byComplexity[component.complexity] = [];
  }
  index.searchIndex.byComplexity[component.complexity].push(name);
});

// Write updated index
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

console.log('✅ Added 4 form components to index');
console.log(`📊 Total components: ${index.meta.totalComponents}`);