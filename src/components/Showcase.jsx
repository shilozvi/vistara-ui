/**
 * 🎪 Vistara UI - Component Showcase
 * "Command your Design."
 */

import React, { useState } from 'react';
import CompactTaskCard from './common/CompactTaskCard';
import TokenUsageMonitor from './data/TokenUsageMonitor';
import TasksTable from './data/TasksTable';
import SystemHealthDashboard from './display/SystemHealthDashboard';
import AgentCard from './display/AgentCard';
import BackupStatusCard from './monitoring/BackupStatusCard';
import ComponentsExplorer from './ComponentsExplorer';

const Showcase = () => {
  const [activeSection, setActiveSection] = useState('colors');

  const sections = [
    { id: 'colors', name: 'Colors', icon: '🎨' },
    { id: 'typography', name: 'Typography', icon: '🔤' },
    { id: 'spacing', name: 'Spacing', icon: '📏' },
    { id: 'components', name: 'Components', icon: '🧩' },
    { id: 'explorer', name: 'Explorer', icon: '🔍' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Navigation */}
      <nav className="lg:col-span-1">
        <div className="vistara-surface p-4 sticky top-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Design System
          </h3>
          <ul className="space-y-2">
            {sections.map(section => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeSection === section.id ? 'font-medium' : ''
                  }`}
                  style={{
                    backgroundColor: activeSection === section.id 
                      ? 'var(--color-primary-light)' 
                      : 'transparent',
                    color: activeSection === section.id 
                      ? 'var(--color-white)' 
                      : 'var(--color-text-secondary)'
                  }}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Content */}
      <main className="lg:col-span-3">
        {activeSection === 'colors' && <ColorsSection />}
        {activeSection === 'typography' && <TypographySection />}
        {activeSection === 'spacing' && <SpacingSection />}
        {activeSection === 'components' && <ComponentsSection />}
        {activeSection === 'explorer' && <ExplorerSection />}
      </main>
    </div>
  );
};

// Colors Section
const ColorsSection = () => {
  const colorGroups = [
    {
      name: 'Primary',
      colors: [
        { name: 'Primary', token: '--color-primary' },
        { name: 'Primary Light', token: '--color-primary-light' },
        { name: 'Primary Dark', token: '--color-primary-dark' }
      ]
    },
    {
      name: 'Status',
      colors: [
        { name: 'Success', token: '--color-success' },
        { name: 'Warning', token: '--color-warning' },
        { name: 'Error', token: '--color-error' },
        { name: 'Info', token: '--color-info' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
        🎨 Color Palette
      </h2>
      
      {colorGroups.map(group => (
        <div key={group.name} className="vistara-surface p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            {group.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.colors.map(color => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ColorSwatch = ({ name, token }) => (
  <div className="text-center">
    <div 
      className="w-full h-20 rounded-lg mb-2 border"
      style={{ 
        backgroundColor: `var(${token})`,
        borderColor: 'var(--color-border-light)'
      }}
    />
    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
      {name}
    </p>
    <code className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
      {token}
    </code>
  </div>
);

// Typography Section
const TypographySection = () => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
      🔤 Typography
    </h2>
    
    <div className="vistara-surface p-6 space-y-6">
      <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)' }}>
        Heading 1 - The quick brown fox
      </div>
      <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-semibold)' }}>
        Heading 2 - The quick brown fox
      </div>
      <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-medium)' }}>
        Heading 3 - The quick brown fox
      </div>
      <div style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)' }}>
        Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </div>
      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
        Small text - Secondary information and captions.
      </div>
    </div>
  </div>
);

// Spacing Section
const SpacingSection = () => {
  const spacings = [
    { name: '1', token: '--space-1' },
    { name: '2', token: '--space-2' },
    { name: '4', token: '--space-4' },
    { name: '6', token: '--space-6' },
    { name: '8', token: '--space-8' },
    { name: '12', token: '--space-12' }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
        📏 Spacing Scale
      </h2>
      
      <div className="vistara-surface p-6">
        <div className="space-y-4">
          {spacings.map(spacing => (
            <div key={spacing.name} className="flex items-center gap-4">
              <code className="w-20 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {spacing.token}
              </code>
              <div 
                className="bg-current opacity-20 rounded"
                style={{ 
                  width: `var(${spacing.token})`,
                  height: '1rem',
                  backgroundColor: 'var(--color-primary)'
                }}
              />
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Space {spacing.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Components Section
const ComponentsSection = () => {
  // Sample task data for demonstration
  const sampleTasks = [
    {
      Task_ID: 'TSK001',
      Task_Name: 'Implement Dark Mode Support',
      Status: 'In Progress',
      Priority: 'High',
      Current_Owner: 'Falcon',
      Project: 'Vistara UI',
      Last_Action: '🟡 IN PROGRESS: Working on CSS Variables integration'
    },
    {
      Task_ID: 'TSK002', 
      Task_Name: 'Migrate CompactTaskCard Component',
      Status: 'Completed',
      Priority: 'Medium',
      Current_Owner: 'Falcon',
      Project: 'Vistara UI',
      Last_Action: '🟢 COMPLETED: Successfully migrated with CSS Variables'
    },
    {
      Task_ID: 'TSK003',
      Task_Name: 'Create Design Token System',
      Status: 'Review',
      Priority: 'Critical',
      Current_Owner: 'River',
      Project: 'Vistara UI',
      Last_Action: '🟦 REVIEW: Design system tokens ready for approval'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
        🧩 Components - 6 Components Migrated from TitanMind
      </h2>
      
      {/* CompactTaskCard Section */}
      <div className="vistara-surface p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          CompactTaskCard - ✅ Migrated from TitanMind
        </h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Task card component with multiple sizes and full CSS Variables support.
        </p>
        
        {/* Size Variants */}
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Normal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleTasks.map(task => (
                <CompactTaskCard 
                  key={task.Task_ID}
                  task={task}
                  onComplete={(id) => console.log('Complete:', id)}
                  onDelete={(id) => console.log('Delete:', id)}
                  size="normal"
                />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Small
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sampleTasks.slice(0, 2).map(task => (
                <CompactTaskCard 
                  key={`small-${task.Task_ID}`}
                  task={task}
                  onComplete={(id) => console.log('Complete:', id)}
                  onDelete={(id) => console.log('Delete:', id)}
                  size="small"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TokenUsageMonitor Section */}
      <div className="vistara-surface p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          TokenUsageMonitor - ✅ Migrated from TitanMind
        </h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Real-time token usage monitoring with size variants and detailed insights.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Normal, Theme: Default
            </h4>
            <TokenUsageMonitor 
              size="normal"
              theme="default"
              mockData={true}
            />
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Compact, Theme: Minimal
            </h4>
            <TokenUsageMonitor 
              size="compact"
              theme="minimal"
              mockData={true}
            />
          </div>
        </div>
      </div>

      {/* SystemHealthDashboard Section */}
      <div className="vistara-surface p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          SystemHealthDashboard - ✅ Migrated from TitanMind
        </h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Comprehensive system monitoring dashboard with health indicators and performance metrics.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Normal, Theme: Default
            </h4>
            <SystemHealthDashboard 
              size="normal"
              theme="default"
              mockData={true}
            />
          </div>
        </div>
      </div>

      {/* AgentCard Section */}
      <div className="vistara-surface p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          AgentCard - ✅ Migrated from TitanMind
        </h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Agent status monitoring with real-time updates and health tracking.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Normal, Theme: Default
            </h4>
            <AgentCard 
              size="normal"
              theme="default"
              mockData={true}
            />
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Compact, Theme: Minimal
            </h4>
            <AgentCard 
              size="compact"
              theme="minimal"
              mockData={true}
            />
          </div>
        </div>
      </div>

      {/* BackupStatusCard Section */}
      <div className="vistara-surface p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          BackupStatusCard - ✅ Migrated from TitanMind
        </h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Comprehensive backup monitoring with storage usage and activity tracking.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Normal, Theme: Default
            </h4>
            <BackupStatusCard 
              size="normal"
              theme="default"
              mockData={true}
            />
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Compact, Theme: Minimal
            </h4>
            <BackupStatusCard 
              size="compact"
              theme="minimal"
              mockData={true}
            />
          </div>
        </div>
      </div>

      {/* TasksTable Section */}
      <div className="vistara-surface p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          TasksTable - ✅ Migrated from TitanMind
        </h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Full-featured task management table with CRUD operations, filtering, and sorting.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Size: Normal, Theme: Default
            </h4>
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              <TasksTable 
                size="normal"
                theme="default"
                mockData={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Migration Success Summary */}
      <div className="vistara-surface p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            6 TitanMind Components Successfully Migrated!
          </h3>
          <p style={{ color: 'var(--color-text-secondary)' }} className="mb-4">
            All components now use 100% CSS Variables with no hardcoded values.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div style={{ color: 'var(--color-success)' }}>✅ CompactTaskCard</div>
            <div style={{ color: 'var(--color-success)' }}>✅ TokenUsageMonitor</div>
            <div style={{ color: 'var(--color-success)' }}>✅ SystemHealthDashboard</div>
            <div style={{ color: 'var(--color-success)' }}>✅ AgentCard</div>
            <div style={{ color: 'var(--color-success)' }}>✅ BackupStatusCard</div>
            <div style={{ color: 'var(--color-success)' }}>✅ TasksTable</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Explorer Section
const ExplorerSection = () => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
      🔍 Components Explorer - חיפוש אינטראקטיבי
    </h2>
    
    <div className="vistara-surface p-6">
      <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
        כלי חיפוש מתקדם לגילוי וחקירת רכיבים לפי קטגוריות, תגיות ומורכבות.
      </p>
      
      <div style={{ height: '600px' }}>
        <ComponentsExplorer 
          size="normal"
          theme="default"
        />
      </div>
    </div>

    <div className="vistara-surface p-6">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
        🎯 תכונות ה-Explorer
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>🔍 חיפוש חכם</h4>
          <ul style={{ color: 'var(--color-text-secondary)' }}>
            <li>• חיפוש לפי שם רכיב</li>
            <li>• חיפוש בתיאור</li>
            <li>• חיפוש לפי תגיות</li>
            <li>• חיפוש בתכונות</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>🎛️ סינון מתקדם</h4>
          <ul style={{ color: 'var(--color-text-secondary)' }}>
            <li>• סינון לפי קטגוריה</li>
            <li>• סינון לפי מורכבות</li>
            <li>• סינון לפי תגיות</li>
            <li>• משולב עם components.index.json</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default Showcase;