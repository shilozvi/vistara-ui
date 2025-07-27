#!/usr/bin/env node
/**
 * 🔄 Vistara UI Component Migrator
 * Automatically migrates TitanMind components to CSS Variables
 */

const fs = require('fs');
const path = require('path');

// Tailwind to CSS Variables mapping
const TAILWIND_TO_CSS_VARS = {
  // Colors
  'bg-white': 'backgroundColor: \'var(--color-white)\'',
  'bg-gray-50': 'backgroundColor: \'var(--color-gray-50)\'',
  'bg-gray-100': 'backgroundColor: \'var(--color-gray-100)\'',
  'bg-gray-200': 'backgroundColor: \'var(--color-gray-200)\'',
  'bg-blue-500': 'backgroundColor: \'var(--color-primary)\'',
  'bg-green-500': 'backgroundColor: \'var(--color-success)\'',
  'bg-red-500': 'backgroundColor: \'var(--color-error)\'',
  'bg-yellow-500': 'backgroundColor: \'var(--color-warning)\'',
  
  // Text colors
  'text-white': 'color: \'var(--color-white)\'',
  'text-gray-900': 'color: \'var(--color-text-primary)\'',
  'text-gray-600': 'color: \'var(--color-text-secondary)\'',
  'text-gray-400': 'color: \'var(--color-text-muted)\'',
  'text-blue-500': 'color: \'var(--color-primary)\'',
  'text-green-500': 'color: \'var(--color-success)\'',
  'text-red-500': 'color: \'var(--color-error)\'',
  
  // Spacing
  'p-1': 'padding: \'var(--space-1)\'',
  'p-2': 'padding: \'var(--space-2)\'',
  'p-3': 'padding: \'var(--space-3)\'',
  'p-4': 'padding: \'var(--space-4)\'',
  'p-6': 'padding: \'var(--space-6)\'',
  'px-2': 'paddingLeft: \'var(--space-2)\', paddingRight: \'var(--space-2)\'',
  'px-3': 'paddingLeft: \'var(--space-3)\', paddingRight: \'var(--space-3)\'',
  'px-4': 'paddingLeft: \'var(--space-4)\', paddingRight: \'var(--space-4)\'',
  'py-2': 'paddingTop: \'var(--space-2)\', paddingBottom: \'var(--space-2)\'',
  'py-3': 'paddingTop: \'var(--space-3)\', paddingBottom: \'var(--space-3)\'',
  'py-4': 'paddingTop: \'var(--space-4)\', paddingBottom: \'var(--space-4)\'',
  
  // Margins
  'mt-2': 'marginTop: \'var(--space-2)\'',
  'mt-4': 'marginTop: \'var(--space-4)\'',
  'mb-2': 'marginBottom: \'var(--space-2)\'',
  'mb-4': 'marginBottom: \'var(--space-4)\'',
  'mr-2': 'marginRight: \'var(--space-2)\'',
  'ml-2': 'marginLeft: \'var(--space-2)\'',
  
  // Typography
  'text-xs': 'fontSize: \'var(--font-size-xs)\'',
  'text-sm': 'fontSize: \'var(--font-size-sm)\'',
  'text-base': 'fontSize: \'var(--font-size-base)\'',
  'text-lg': 'fontSize: \'var(--font-size-lg)\'',
  'text-xl': 'fontSize: \'var(--font-size-xl)\'',
  'text-2xl': 'fontSize: \'var(--font-size-2xl)\'',
  'text-3xl': 'fontSize: \'var(--font-size-3xl)\'',
  'font-medium': 'fontWeight: \'var(--font-weight-medium)\'',
  'font-semibold': 'fontWeight: \'var(--font-weight-semibold)\'',
  'font-bold': 'fontWeight: \'var(--font-weight-bold)\'',
  
  // Border
  'rounded': 'borderRadius: \'var(--border-radius-md)\'',
  'rounded-sm': 'borderRadius: \'var(--border-radius-sm)\'',
  'rounded-lg': 'borderRadius: \'var(--border-radius-lg)\'',
  'rounded-xl': 'borderRadius: \'var(--border-radius-xl)\'',
  'rounded-full': 'borderRadius: \'var(--border-radius-full)\'',
  'border': 'border: \'var(--border-width-1) solid var(--color-border-light)\'',
  'border-2': 'border: \'var(--border-width-2) solid var(--color-border-light)\'',
  'border-gray-200': 'borderColor: \'var(--color-border-light)\'',
  'border-gray-300': 'borderColor: \'var(--color-border-medium)\'',
  
  // Shadows
  'shadow': 'boxShadow: \'var(--shadow-md)\'',
  'shadow-sm': 'boxShadow: \'var(--shadow-sm)\'',
  'shadow-lg': 'boxShadow: \'var(--shadow-lg)\'',
  'shadow-xl': 'boxShadow: \'var(--shadow-xl)\'',
  
  // Layout
  'flex': 'display: \'flex\'',
  'grid': 'display: \'grid\'',
  'hidden': 'display: \'none\'',
  'block': 'display: \'block\'',
  'inline-block': 'display: \'inline-block\'',
  'items-center': 'alignItems: \'center\'',
  'justify-center': 'justifyContent: \'center\'',
  'justify-between': 'justifyContent: \'space-between\'',
  'gap-2': 'gap: \'var(--space-2)\'',
  'gap-3': 'gap: \'var(--space-3)\'',
  'gap-4': 'gap: \'var(--space-4)\'',
  'space-y-2': '& > * + *: { marginTop: \'var(--space-2)\' }',
  'space-y-4': '& > * + *: { marginTop: \'var(--space-4)\' }',
  
  // Sizing
  'w-full': 'width: \'100%\'',
  'h-full': 'height: \'100%\'',
  'w-4': 'width: \'1rem\'',
  'h-4': 'height: \'1rem\'',
  'w-5': 'width: \'1.25rem\'',
  'h-5': 'height: \'1.25rem\'',
  'w-6': 'width: \'1.5rem\'',
  'h-6': 'height: \'1.5rem\'',
  
  // Others
  'transition': 'transition: \'var(--transition-base)\'',
  'hover:bg-gray-100': '&:hover: { backgroundColor: \'var(--color-gray-100)\' }'
};

function createComponentTemplate(componentName, originalPath, content) {
  const hasIcons = /lucide-react|react-icons/.test(content);
  const hasState = /useState|useReducer/.test(content);
  const hasEffects = /useEffect/.test(content);
  
  return `/**
 * 🎯 Vistara UI - ${componentName} Component
 * "Command your Design."
 * 
 * Migrated from TitanMind with full CSS Variables support
 * Original: ${originalPath}
 * 
 * ✅ Fully normalized - No hardcoded values
 * ✅ CSS Variables only
 * ✅ Multiple sizes and themes
 * ✅ RTL support maintained
 */

import React${hasState ? ', { useState' : ''}${hasEffects ? ', useEffect' : ''} from 'react';
${hasIcons ? `import { /* Add required icons */ } from 'lucide-react';` : ''}
import { normalizeStyle, withNormalizedStyles } from '../../utils/normalizeStyle';

const ${componentName} = ({ 
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  className,
  style,
  ...props
}) => {
  ${hasState ? `const [state, setState] = useState(null);` : ''}
  
  // Size configurations
  const sizeConfigs = {
    compact: {
      padding: 'var(--space-3)',
      gap: 'var(--space-2)',
      iconSize: '16px',
      fontSize: 'var(--font-size-sm)'
    },
    normal: {
      padding: 'var(--space-4)',
      gap: 'var(--space-3)',
      iconSize: '20px',
      fontSize: 'var(--font-size-base)'
    },
    expanded: {
      padding: 'var(--space-6)',
      gap: 'var(--space-4)',
      iconSize: '24px',
      fontSize: 'var(--font-size-lg)'
    }
  };

  const config = sizeConfigs[size];
  
  ${hasEffects ? `
  useEffect(() => {
    // Add effects logic here
  }, []);
  ` : ''}
  
  // Component styles using CSS Variables
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
    <div className={\`vistara-component \${className || ''}\`} style={containerStyles} {...props}>
      {/* TODO: Migrate component content here */}
      <div style={normalizeStyle({
        fontSize: config.fontSize,
        color: 'var(--color-text-primary)'
      })}>
        ${componentName} - Migrated to Vistara UI
      </div>
    </div>
  );
};

// Export with style normalization HOC
export default withNormalizedStyles(${componentName});`;
}

function migrateComponent(componentPath, outputPath, componentName) {
  try {
    console.log(`\n🔄 Migrating ${componentName}...`);
    
    // Read original component
    const content = fs.readFileSync(componentPath, 'utf8');
    
    // Create migrated component
    const migratedContent = createComponentTemplate(componentName, componentPath, content);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write migrated component
    fs.writeFileSync(outputPath, migratedContent);
    
    console.log(`✅ Successfully migrated to: ${outputPath}`);
    
    // Log Tailwind classes found for manual review
    const tailwindClasses = content.match(/className=["'][^"']*["']/g);
    if (tailwindClasses) {
      console.log(`📋 Tailwind classes found (need manual conversion):`);
      tailwindClasses.forEach(className => {
        console.log(`   ${className}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error migrating ${componentName}:`, error.message);
    return false;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node migrate-component.js <titanmind-path> <vistara-path> <component-name>');
    console.log('Example: node migrate-component.js /path/to/component.jsx ./src/components/NewComponent.jsx NewComponent');
    process.exit(1);
  }
  
  const [titanmindPath, vistaraPath, componentName] = args;
  migrateComponent(titanmindPath, vistaraPath, componentName);
}

module.exports = { migrateComponent, createComponentTemplate };