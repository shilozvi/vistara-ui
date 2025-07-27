#!/usr/bin/env node
/**
 * 📚 Component Index Updater
 * Automatically updates components.index.json after migration
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_INDEX = '../src/data/components.index.json';
const VISTARA_COMPONENTS = '../src/components';

function updateComponentIndex(componentName, componentInfo) {
  try {
    // Load existing index
    const indexPath = path.join(__dirname, COMPONENTS_INDEX);
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    
    // Add new component
    index.components[componentName] = {
      path: componentInfo.path,
      category: componentInfo.category,
      props: componentInfo.props || [],
      requiredProps: componentInfo.requiredProps || [],
      variants: {
        size: ["compact", "normal", "expanded"],
        theme: ["default", "minimal", "detailed"]
      },
      status: "migrated",
      migrationDate: new Date().toISOString().split('T')[0],
      sourceComponent: `TitanMind/${componentName}`,
      tags: componentInfo.tags || [],
      description: componentInfo.description || "",
      features: componentInfo.features || [],
      dependencies: ["normalizeStyle", "withNormalizedStyles"],
      hasDemo: false,
      complexity: componentInfo.complexity || "medium"
    };
    
    // Update metadata
    index.meta.totalComponents = Object.keys(index.components).length;
    index.meta.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Update categories
    if (!index.categories[componentInfo.category]) {
      index.categories[componentInfo.category] = {
        description: `${componentInfo.category} components`,
        components: []
      };
    }
    if (!index.categories[componentInfo.category].components.includes(componentName)) {
      index.categories[componentInfo.category].components.push(componentName);
    }
    
    // Update tags
    componentInfo.tags.forEach(tag => {
      if (!index.tags[tag]) {
        index.tags[tag] = [];
      }
      if (!index.tags[tag].includes(componentName)) {
        index.tags[tag].push(componentName);
      }
    });
    
    // Update search indices
    if (!index.search.byComplexity[componentInfo.complexity]) {
      index.search.byComplexity[componentInfo.complexity] = [];
    }
    index.search.byComplexity[componentInfo.complexity].push(componentName);
    
    if (!index.search.byStatus.migrated.includes(componentName)) {
      index.search.byStatus.migrated.push(componentName);
    }
    
    // Save updated index
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    
    console.log(`✅ Updated component index for: ${componentName}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error updating component index:`, error.message);
    return false;
  }
}

function batchUpdateIndex(componentsInfo) {
  console.log(`\n📚 Updating component index for ${componentsInfo.length} components...`);
  
  let successful = 0;
  componentsInfo.forEach(info => {
    if (updateComponentIndex(info.name, info)) {
      successful++;
    }
  });
  
  console.log(`\n✅ Successfully updated ${successful} components in index`);
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: node update-component-index.js <component-name> [category] [complexity]');
    console.log('   or: node update-component-index.js --scan');
    process.exit(1);
  }
  
  if (args[0] === '--scan') {
    // Auto-scan and update all components
    console.log('🔍 Scanning Vistara components directory...');
    // Implementation for auto-scan
  } else {
    const [name, category = 'common', complexity = 'medium'] = args;
    updateComponentIndex(name, {
      path: `src/components/${category}/${name}.jsx`,
      category,
      complexity,
      tags: [category],
      description: `${name} component`
    });
  }
}

module.exports = { updateComponentIndex, batchUpdateIndex };