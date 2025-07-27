#!/usr/bin/env node

/**
 * 🔧 Auto-Convert Hardcoded Values Script
 * "Command your Design."
 * 
 * Automatically converts hardcoded values to CSS Variables
 */

const fs = require('fs');
const path = require('path');

// Conversion mappings
const CONVERSIONS = {
  // Hex Colors → CSS Variables
  '#ffffff': 'var(--color-white)',
  '#000000': 'var(--color-black)',
  '#6c5ce7': 'var(--color-primary)',
  '#a29bfe': 'var(--color-primary-light)',
  '#5f3dc4': 'var(--color-primary-dark)',
  '#0984e3': 'var(--color-secondary)',
  '#74b9ff': 'var(--color-secondary-light)',
  '#00b894': 'var(--color-success)',
  '#55efc4': 'var(--color-success-light)',
  '#e17055': 'var(--color-error)',
  '#fab1a0': 'var(--color-error-light)',
  '#fdcb6e': 'var(--color-warning)',
  '#ffeaa7': 'var(--color-warning-light)',
  
  // Pixel Values → Space Tokens
  '4px': 'var(--space-1)',
  '8px': 'var(--space-2)',
  '12px': 'var(--space-3)',
  '16px': 'var(--space-4)',
  '20px': 'var(--space-5)',
  '24px': 'var(--space-6)',
  '32px': 'var(--space-8)',
  '40px': 'var(--space-10)',
  '48px': 'var(--space-12)',
  '64px': 'var(--space-16)',
  
  // Border Radius
  '0.25rem': 'var(--border-radius-sm)',
  '0.5rem': 'var(--border-radius-md)',
  '0.75rem': 'var(--border-radius-lg)',
  '1rem': 'var(--border-radius-xl)',
  
  // Font Sizes
  '12px': 'var(--font-size-xs)',
  '14px': 'var(--font-size-sm)',
  '16px': 'var(--font-size-base)',
  '18px': 'var(--font-size-lg)',
  '20px': 'var(--font-size-xl)',
  '24px': 'var(--font-size-2xl)',
  '30px': 'var(--font-size-3xl)',
  '36px': 'var(--font-size-4xl)'
};

// Tailwind class conversions to CSS-in-JS style objects
const TAILWIND_CONVERSIONS = [
  // Background colors
  { 
    pattern: /className="([^"]*\s)?bg-gray-900(\s[^"]*)?"/, 
    replacement: 'style={{backgroundColor: "var(--color-background-primary)"}}'
  },
  { 
    pattern: /className="([^"]*\s)?bg-white(\s[^"]*)?"/, 
    replacement: 'style={{backgroundColor: "var(--color-white)"}}'
  },
  { 
    pattern: /className="([^"]*\s)?bg-blue-500(\s[^"]*)?"/, 
    replacement: 'style={{backgroundColor: "var(--color-primary)"}}'
  },
  
  // Text colors
  { 
    pattern: /className="([^"]*\s)?text-white(\s[^"]*)?"/, 
    replacement: 'style={{color: "var(--color-text-inverse)"}}'
  },
  { 
    pattern: /className="([^"]*\s)?text-gray-400(\s[^"]*)?"/, 
    replacement: 'style={{color: "var(--color-text-muted)"}}'
  },
  { 
    pattern: /className="([^"]*\s)?text-gray-900(\s[^"]*)?"/, 
    replacement: 'style={{color: "var(--color-text-primary)"}}'
  }
];

// Convert hardcoded values in file content
function convertFile(filePath, dryRun = false) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = [];
  let hasChanges = false;

  // Convert direct hardcoded values
  for (const [oldValue, newValue] of Object.entries(CONVERSIONS)) {
    const regex = new RegExp(oldValue.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&'), 'g');
    if (content.match(regex)) {
      content = content.replace(regex, newValue);
      changes.push(`${oldValue} → ${newValue}`);
      hasChanges = true;
    }
  }

  // Convert Tailwind classes to CSS-in-JS
  for (const conversion of TAILWIND_CONVERSIONS) {
    if (content.match(conversion.pattern)) {
      content = content.replace(conversion.pattern, conversion.replacement);
      changes.push(`Tailwind class → CSS-in-JS with variables`);
      hasChanges = true;
    }
  }

  // Add imports if needed
  if (hasChanges && !content.includes('normalizeStyle')) {
    const importLine = "import { normalizeStyle } from '../utils/normalizeStyle';\\n";
    content = content.replace(
      /(import React[^;]*;)/,
      `$1\\n${importLine}`
    );
  }

  if (!dryRun && hasChanges) {
    fs.writeFileSync(filePath, content);
  }

  return { hasChanges, changes, newContent: content };
}

// Convert all files in directory
function convertDirectory(dirPath, dryRun = false) {
  const results = [];
  
  function convertRecursive(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        convertRecursive(fullPath);
      } else if (stat.isFile() && ['.jsx', '.js', '.ts', '.tsx'].some(ext => item.endsWith(ext))) {
        const result = convertFile(fullPath, dryRun);
        if (result.hasChanges) {
          results.push({
            file: path.relative(dirPath, fullPath),
            changes: result.changes
          });
        }
      }
    }
  }
  
  convertRecursive(dirPath);
  return results;
}

// Generate report
function generateReport(results, dryRun = false) {
  console.log('🔧 Vistara UI - Auto-Convert Hardcoded Values');
  console.log('='.repeat(50));
  
  if (results.length === 0) {
    console.log('✅ No hardcoded values found to convert!');
    return;
  }
  
  const action = dryRun ? 'Would convert' : 'Converted';
  console.log(`${action} ${results.length} file(s):\\n`);
  
  results.forEach(result => {
    console.log(`📁 ${result.file}:`);
    result.changes.forEach(change => {
      console.log(`   ✓ ${change}`);
    });
    console.log('');
  });
  
  if (dryRun) {
    console.log('💡 Run without --dry-run to apply these changes');
  } else {
    console.log('✅ Conversion complete! Remember to:');
    console.log('   1. Test your components');
    console.log('   2. Check that CSS variables are properly defined');
    console.log('   3. Update any remaining Tailwind classes manually');
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const targetPath = args.find(arg => !arg.startsWith('--')) || './src';
  
  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Path not found: ${targetPath}`);
    process.exit(1);
  }
  
  console.log(`🔧 ${dryRun ? 'Analyzing' : 'Converting'} hardcoded values in ${targetPath}...\\n`);
  
  const results = convertDirectory(targetPath, dryRun);
  generateReport(results, dryRun);
}

if (require.main === module) {
  main();
}

module.exports = { convertFile, convertDirectory };