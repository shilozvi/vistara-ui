#!/usr/bin/env node

/**
 * 🔍 Hardcoded Values Detection Script
 * "Command your Design."
 * 
 * Automatically scans components for hardcoded values that should use CSS Variables
 */

const fs = require('fs');
const path = require('path');

// Patterns to detect hardcoded values
const HARDCODED_PATTERNS = {
  hexColors: /#[0-9A-Fa-f]{3,6}\b/g,
  pixelValues: /\b\d+px\b/g,
  remValues: /\b\d+(\.\d+)?rem\b/g,
  tailwindColors: /\b(bg|text|border)-(red|blue|green|yellow|purple|gray|orange|pink|indigo)(-\d+)?\b/g,
  rgbColors: /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g,
  rgbaColors: /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g
};

// CSS Variable suggestions
const SUGGESTIONS = {
  hexColors: {
    '#ffffff': 'var(--color-white)',
    '#000000': 'var(--color-black)',
    '#6c5ce7': 'var(--color-primary)',
    '#a29bfe': 'var(--color-primary-light)',
    '#5f3dc4': 'var(--color-primary-dark)',
    '#0984e3': 'var(--color-secondary)',
    '#00b894': 'var(--color-success)',
    '#e17055': 'var(--color-error)',
    '#fdcb6e': 'var(--color-warning)'
  },
  pixelValues: {
    '4px': 'var(--space-1)',
    '8px': 'var(--space-2)',
    '12px': 'var(--space-3)',
    '16px': 'var(--space-4)',
    '20px': 'var(--space-5)',
    '24px': 'var(--space-6)',
    '32px': 'var(--space-8)',
    '48px': 'var(--space-12)'
  },
  tailwindColors: {
    'bg-gray-900': 'backgroundColor: "var(--color-background-primary)"',
    'text-white': 'color: "var(--color-text-inverse)"',
    'bg-blue-500': 'backgroundColor: "var(--color-primary)"',
    'text-gray-400': 'color: "var(--color-text-muted)"'
  }
};

// Scan a single file
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const fileName = path.basename(filePath);

  for (const [patternName, pattern] of Object.entries(HARDCODED_PATTERNS)) {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const lines = content.split('\n');
        const lineNumber = lines.findIndex(line => line.includes(match)) + 1;
        const suggestion = SUGGESTIONS[patternName]?.[match] || 'Use appropriate CSS variable';
        
        issues.push({
          file: fileName,
          line: lineNumber,
          type: patternName,
          value: match,
          suggestion
        });
      });
    }
  }

  return issues;
}

// Scan directory recursively
function scanDirectory(dirPath, extensions = ['.jsx', '.js', '.ts', '.tsx']) {
  const allIssues = [];
  
  function scanRecursive(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanRecursive(fullPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        const issues = scanFile(fullPath);
        allIssues.push(...issues);
      }
    }
  }
  
  scanRecursive(dirPath);
  return allIssues;
}

// Generate report
function generateReport(issues) {
  console.log('🔍 Vistara UI - Hardcoded Values Detection Report');
  console.log('='.repeat(50));
  
  if (issues.length === 0) {
    console.log('✅ No hardcoded values found! Your code is clean.');
    return;
  }
  
  console.log(`⚠️  Found ${issues.length} hardcoded values that should use CSS variables:\n`);
  
  // Group by file
  const byFile = issues.reduce((acc, issue) => {
    if (!acc[issue.file]) acc[issue.file] = [];
    acc[issue.file].push(issue);
    return acc;
  }, {});
  
  for (const [file, fileIssues] of Object.entries(byFile)) {
    console.log(`📁 ${file}:`);
    fileIssues.forEach(issue => {
      console.log(`   Line ${issue.line}: ${issue.value} → ${issue.suggestion}`);
    });
    console.log('');
  }
  
  // Summary by type
  console.log('\n📊 Summary by type:');
  const byType = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {});
  
  for (const [type, count] of Object.entries(byType)) {
    console.log(`   ${type}: ${count} issues`);
  }
  
  console.log('\n💡 Quick fixes:');
  console.log('   1. Replace hex colors with CSS variables from tokens.css');
  console.log('   2. Replace pixel values with spacing tokens');
  console.log('   3. Replace Tailwind classes with style objects using CSS variables');
  console.log('   4. Use the normalizeStyle() utility for automatic conversion');
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const targetPath = args[0] || './src';
  
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Path not found: ${targetPath}`);
    process.exit(1);
  }
  
  console.log(`🔍 Scanning ${targetPath} for hardcoded values...\n`);
  
  const issues = scanDirectory(targetPath);
  generateReport(issues);
  
  // Exit with error code if issues found
  process.exit(issues.length > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { scanFile, scanDirectory, generateReport };