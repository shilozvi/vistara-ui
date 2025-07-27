const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all component files
const componentFiles = glob.sync('src/components/**/*.jsx', {
  cwd: path.join(__dirname, '..'),
  ignore: [
    '**/Showcase.jsx',
    '**/ComponentsExplorer.jsx',
    '**/index.js.jsx',
    '**/*-patch.js.jsx',
    '**/TailwindTest.jsx'
  ]
});

console.log(`Found ${componentFiles.length} components to index`);

// Read existing index to preserve metadata
let existingIndex = {};
try {
  existingIndex = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/components.index.json'), 'utf8'));
} catch (e) {
  console.log('No existing index found, creating new one');
}

// Build new component index
const newComponents = {};

componentFiles.forEach(filePath => {
  const componentName = path.basename(filePath, '.jsx');
  const category = filePath.split('/')[2]; // Extract category from path
  
  // Check if component already exists in index
  if (existingIndex.components && existingIndex.components[componentName]) {
    newComponents[componentName] = existingIndex.components[componentName];
  } else {
    // Create new entry
    newComponents[componentName] = {
      path: filePath,
      category: category,
      props: ["size", "theme", "className", "style"],
      requiredProps: [],
      variants: {
        size: ["compact", "normal", "expanded"],
        theme: ["default", "minimal", "detailed"]
      },
      status: "migrated",
      migrationDate: new Date().toISOString().split('T')[0],
      sourceComponent: `TitanMind/${componentName}`,
      tags: [category, "ui", "component"],
      description: `${componentName} component migrated from TitanMind`,
      features: [
        "CSS Variables only",
        "Multiple size variants", 
        "Theme customization",
        "RTL support"
      ],
      dependencies: ["normalizeStyle", "withNormalizedStyles"],
      hasDemo: true,
      complexity: "simple"
    };
  }
});

// Create updated index
const updatedIndex = {
  meta: {
    version: "0.2.0",
    lastUpdated: new Date().toISOString().split('T')[0],
    totalComponents: Object.keys(newComponents).length,
    description: "Vistara UI Component Library Index - מערכת חיפוש וניהול רכיבים"
  },
  components: newComponents,
  searchIndex: {
    byCategory: {},
    byTags: {},
    byComplexity: {}
  }
};

// Build search indices
Object.entries(newComponents).forEach(([name, component]) => {
  // By category
  if (!updatedIndex.searchIndex.byCategory[component.category]) {
    updatedIndex.searchIndex.byCategory[component.category] = [];
  }
  updatedIndex.searchIndex.byCategory[component.category].push(name);
  
  // By tags
  component.tags.forEach(tag => {
    if (!updatedIndex.searchIndex.byTags[tag]) {
      updatedIndex.searchIndex.byTags[tag] = [];
    }
    updatedIndex.searchIndex.byTags[tag].push(name);
  });
  
  // By complexity
  if (!updatedIndex.searchIndex.byComplexity[component.complexity]) {
    updatedIndex.searchIndex.byComplexity[component.complexity] = [];
  }
  updatedIndex.searchIndex.byComplexity[component.complexity].push(name);
});

// Write updated index
fs.writeFileSync(
  path.join(__dirname, '../src/data/components.index.json'),
  JSON.stringify(updatedIndex, null, 2)
);

console.log(`✅ Component index updated with ${Object.keys(newComponents).length} components`);
console.log(`📊 Categories: ${Object.keys(updatedIndex.searchIndex.byCategory).join(', ')}`);
console.log(`🏷️  Total tags: ${Object.keys(updatedIndex.searchIndex.byTags).length}`);