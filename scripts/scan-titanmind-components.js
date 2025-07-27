#!/usr/bin/env node
/**
 * 🔍 TitanMind Component Scanner
 * Scans and maps all components in TitanMind for migration
 */

const fs = require('fs');
const path = require('path');

const TITANMIND_PATH = '/Users/zvishilovitsky/TitanMind/dashboard/frontend/src/components';
const OUTPUT_FILE = './titanmind-components-map.json';

// Component patterns to look for
const COMPONENT_PATTERNS = {
  functional: /(?:const|function)\s+(\w+)\s*=?\s*(?:\([^)]*\)|[^=]*)\s*=>\s*{/g,
  class: /class\s+(\w+)\s+extends\s+(?:React\.)?Component/g,
  export: /export\s+(?:default\s+)?(?:const|function|class)\s+(\w+)/g
};

// Categories based on directory structure
const CATEGORY_MAP = {
  'common': 'common',
  'features': 'features',
  'pages': 'pages',
  'layout': 'layout',
  'settings': 'settings',
  'forms': 'forms',
  'icons': 'icons',
  'interaction': 'interaction',
  'monitoring': 'monitoring',
  'tasks': 'tasks',
  'dashboard': 'dashboard'
};

const componentMap = {
  meta: {
    scanDate: new Date().toISOString(),
    totalComponents: 0,
    byCategory: {},
    byComplexity: {
      simple: [],
      medium: [],
      complex: []
    }
  },
  components: {}
};

function analyzeComplexity(content, filePath) {
  const lines = content.split('\n').length;
  const hasTailwind = /className=["'][^"']*(?:w-|h-|p-|m-|text-|bg-|border-|flex|grid)/g.test(content);
  const hasState = /useState|useReducer|this\.state/g.test(content);
  const hasEffects = /useEffect|componentDidMount|componentDidUpdate/g.test(content);
  const hasContext = /useContext|Context\.Consumer/g.test(content);
  const hasCustomHooks = /use[A-Z]\w+/g.test(content);
  
  let complexity = 'simple';
  let score = 0;
  
  if (lines > 500) score += 2;
  else if (lines > 200) score += 1;
  
  if (hasState) score += 1;
  if (hasEffects) score += 1;
  if (hasContext) score += 1;
  if (hasCustomHooks) score += 1;
  if (hasTailwind) score += 1;
  
  if (score >= 4) complexity = 'complex';
  else if (score >= 2) complexity = 'medium';
  
  return {
    complexity,
    features: {
      lines,
      hasTailwind,
      hasState,
      hasEffects,
      hasContext,
      hasCustomHooks
    }
  };
}

function extractComponentInfo(filePath, content) {
  const fileName = path.basename(filePath, '.jsx');
  const dirName = path.dirname(filePath).split('/').pop();
  const category = CATEGORY_MAP[dirName] || 'other';
  
  // Extract component names
  const components = new Set();
  
  Object.entries(COMPONENT_PATTERNS).forEach(([type, pattern]) => {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1] !== 'default') {
        components.add(match[1]);
      }
    }
  });
  
  // If no components found, use filename
  if (components.size === 0) {
    components.add(fileName);
  }
  
  const mainComponent = Array.from(components)[0];
  const { complexity, features } = analyzeComplexity(content, filePath);
  
  return {
    name: mainComponent,
    fileName,
    path: filePath.replace(TITANMIND_PATH, ''),
    category,
    complexity,
    features,
    components: Array.from(components),
    migrationStatus: 'pending',
    cssSystem: features.hasTailwind ? 'tailwind' : 'css-modules',
    priority: complexity === 'simple' ? 'low' : complexity === 'medium' ? 'medium' : 'high'
  };
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.')) {
      scanDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Skip test files and stories
        if (file.includes('.test.') || file.includes('.stories.')) {
          return;
        }
        
        const componentInfo = extractComponentInfo(filePath, content);
        
        componentMap.components[componentInfo.name] = componentInfo;
        componentMap.meta.totalComponents++;
        
        // Update category count
        if (!componentMap.meta.byCategory[componentInfo.category]) {
          componentMap.meta.byCategory[componentInfo.category] = [];
        }
        componentMap.meta.byCategory[componentInfo.category].push(componentInfo.name);
        
        // Update complexity count
        componentMap.meta.byComplexity[componentInfo.complexity].push(componentInfo.name);
        
        console.log(`✅ Found: ${componentInfo.name} (${componentInfo.complexity}) in ${componentInfo.category}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
      }
    }
  });
}

console.log('🔍 Scanning TitanMind components...\n');

if (fs.existsSync(TITANMIND_PATH)) {
  scanDirectory(TITANMIND_PATH);
  
  // Add migration statistics
  componentMap.meta.migrationStats = {
    completed: 6, // Components we already migrated
    pending: componentMap.meta.totalComponents - 6,
    estimatedDays: Math.ceil((componentMap.meta.totalComponents - 6) / 10)
  };
  
  // Sort components by priority
  componentMap.meta.migrationOrder = Object.entries(componentMap.components)
    .filter(([name, info]) => info.migrationStatus === 'pending')
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a[1].priority] - priorityOrder[b[1].priority];
    })
    .map(([name]) => name);
  
  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(componentMap, null, 2));
  
  console.log('\n📊 Scan Complete!');
  console.log(`Total Components: ${componentMap.meta.totalComponents}`);
  console.log(`Simple: ${componentMap.meta.byComplexity.simple.length}`);
  console.log(`Medium: ${componentMap.meta.byComplexity.medium.length}`);
  console.log(`Complex: ${componentMap.meta.byComplexity.complex.length}`);
  console.log(`\n📁 Results saved to: ${OUTPUT_FILE}`);
  
} else {
  console.error('❌ TitanMind path not found:', TITANMIND_PATH);
}