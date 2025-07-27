#!/usr/bin/env node
/**
 * 🚀 Vistara UI Batch Component Migrator
 * Mass migration tool for TitanMind components
 */

const fs = require('fs');
const path = require('path');
const { migrateComponent } = require('./migrate-component');

const BATCH_CONFIG = {
  titanmindBase: '/Users/zvishilovitsky/TitanMind/dashboard/frontend/src/components',
  vistaraBase: '/Users/zvishilovitsky/vistara-ui/src/components',
  mapFile: './titanmind-components-map.json',
  batchSize: 5, // Components per batch
  categories: {
    'common': 'common',
    'features': 'features', 
    'pages': 'pages',
    'layout': 'layout',
    'settings': 'settings',
    'monitoring': 'monitoring',
    'forms': 'forms',
    'data': 'data',
    'display': 'display'
  }
};

class BatchMigrator {
  constructor() {
    this.componentMap = this.loadComponentMap();
    this.migrationLog = {
      session: new Date().toISOString(),
      successful: [],
      failed: [],
      skipped: []
    };
  }

  loadComponentMap() {
    try {
      const data = fs.readFileSync(BATCH_CONFIG.mapFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Failed to load component map:', error.message);
      console.log('💡 Run scan-titanmind-components.js first!');
      process.exit(1);
    }
  }

  getNextBatch(count = BATCH_CONFIG.batchSize) {
    const pending = Object.entries(this.componentMap.components)
      .filter(([name, info]) => info.migrationStatus === 'pending')
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a[1].priority] - priorityOrder[b[1].priority];
      })
      .slice(0, count);
    
    return pending;
  }

  determineOutputPath(componentInfo) {
    const category = BATCH_CONFIG.categories[componentInfo.category] || 'common';
    return path.join(BATCH_CONFIG.vistaraBase, category, `${componentInfo.fileName}.jsx`);
  }

  async migrateComponents(components) {
    console.log(`\n🚀 Starting batch migration of ${components.length} components...\n`);
    
    for (const [componentName, componentInfo] of components) {
      const titanmindPath = path.join(BATCH_CONFIG.titanmindBase, componentInfo.path);
      const vistaraPath = this.determineOutputPath(componentInfo);
      
      // Skip if already exists
      if (fs.existsSync(vistaraPath)) {
        console.log(`⏭️  Skipping ${componentName} - already exists`);
        this.migrationLog.skipped.push(componentName);
        continue;
      }
      
      // Migrate component
      const success = migrateComponent(titanmindPath, vistaraPath, componentName);
      
      if (success) {
        this.migrationLog.successful.push({
          name: componentName,
          from: titanmindPath,
          to: vistaraPath,
          complexity: componentInfo.complexity
        });
        
        // Update component map
        this.componentMap.components[componentName].migrationStatus = 'completed';
        this.componentMap.components[componentName].vistaraPath = vistaraPath;
      } else {
        this.migrationLog.failed.push({
          name: componentName,
          reason: 'Migration failed'
        });
      }
      
      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save updated component map
    this.saveComponentMap();
    this.saveMigrationLog();
  }

  saveComponentMap() {
    fs.writeFileSync(BATCH_CONFIG.mapFile, JSON.stringify(this.componentMap, null, 2));
  }

  saveMigrationLog() {
    const logFile = `./migration-log-${Date.now()}.json`;
    fs.writeFileSync(logFile, JSON.stringify(this.migrationLog, null, 2));
    console.log(`\n📄 Migration log saved to: ${logFile}`);
  }

  showProgress() {
    const total = Object.keys(this.componentMap.components).length;
    const completed = Object.values(this.componentMap.components)
      .filter(info => info.migrationStatus === 'completed').length;
    const pending = total - completed;
    
    console.log('\n📊 Migration Progress:');
    console.log(`Total Components: ${total}`);
    console.log(`✅ Completed: ${completed} (${Math.round((completed/total) * 100)}%)`);
    console.log(`⏳ Pending: ${pending}`);
    console.log(`\n📈 This session:`);
    console.log(`✅ Successful: ${this.migrationLog.successful.length}`);
    console.log(`❌ Failed: ${this.migrationLog.failed.length}`);
    console.log(`⏭️  Skipped: ${this.migrationLog.skipped.length}`);
  }

  async migrateByCategory(category) {
    const components = Object.entries(this.componentMap.components)
      .filter(([name, info]) => 
        info.category === category && info.migrationStatus === 'pending'
      );
    
    console.log(`\n🗂️  Migrating ${components.length} components from category: ${category}`);
    await this.migrateComponents(components);
  }

  async migrateByComplexity(complexity) {
    const components = Object.entries(this.componentMap.components)
      .filter(([name, info]) => 
        info.complexity === complexity && info.migrationStatus === 'pending'
      );
    
    console.log(`\n📊 Migrating ${components.length} ${complexity} components`);
    await this.migrateComponents(components);
  }

  generateMigrationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: Object.keys(this.componentMap.components).length,
        completed: Object.values(this.componentMap.components)
          .filter(info => info.migrationStatus === 'completed').length,
        byCategory: {},
        byComplexity: {}
      },
      nextBatch: this.getNextBatch(10).map(([name, info]) => ({
        name,
        complexity: info.complexity,
        category: info.category
      }))
    };
    
    // Count by category
    Object.values(this.componentMap.components).forEach(info => {
      if (!report.summary.byCategory[info.category]) {
        report.summary.byCategory[info.category] = { total: 0, completed: 0 };
      }
      report.summary.byCategory[info.category].total++;
      if (info.migrationStatus === 'completed') {
        report.summary.byCategory[info.category].completed++;
      }
    });
    
    console.log('\n📊 Migration Report:');
    console.log(JSON.stringify(report, null, 2));
    
    return report;
  }
}

// CLI Interface
async function main() {
  const migrator = new BatchMigrator();
  const args = process.argv.slice(2);
  const command = args[0] || 'batch';
  
  console.log('🎯 Vistara UI Batch Migrator\n');
  
  switch (command) {
    case 'batch':
      const count = parseInt(args[1]) || BATCH_CONFIG.batchSize;
      const batch = migrator.getNextBatch(count);
      await migrator.migrateComponents(batch);
      break;
      
    case 'category':
      const category = args[1];
      if (!category) {
        console.log('❌ Please specify a category');
        console.log('Available:', Object.keys(BATCH_CONFIG.categories).join(', '));
        break;
      }
      await migrator.migrateByCategory(category);
      break;
      
    case 'complexity':
      const complexity = args[1];
      if (!['simple', 'medium', 'complex'].includes(complexity)) {
        console.log('❌ Please specify complexity: simple, medium, or complex');
        break;
      }
      await migrator.migrateByComplexity(complexity);
      break;
      
    case 'all':
      const allPending = migrator.getNextBatch(1000);
      console.log(`⚠️  This will migrate ${allPending.length} components. Continue? (y/n)`);
      // In real implementation, add user confirmation
      await migrator.migrateComponents(allPending);
      break;
      
    case 'report':
      migrator.generateMigrationReport();
      break;
      
    default:
      console.log('📖 Usage:');
      console.log('  node batch-migrate.js batch [count]     - Migrate next batch');
      console.log('  node batch-migrate.js category <name>   - Migrate by category');
      console.log('  node batch-migrate.js complexity <type> - Migrate by complexity');
      console.log('  node batch-migrate.js all              - Migrate all pending');
      console.log('  node batch-migrate.js report           - Show migration report');
  }
  
  migrator.showProgress();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = BatchMigrator;