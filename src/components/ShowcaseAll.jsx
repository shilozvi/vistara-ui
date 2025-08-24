/**
 * 🎪 Vistara UI - Complete Component Showcase
 * "Command your Design."
 * 
 * Displays ALL 74 migrated components from TitanMind
 */

import React, { useState } from 'react';

// Common Components (68)
import AgentAvatar from './common/AgentAvatar';
import AgentStatus from './common/AgentStatus';
import AgentStatusMonitor from './common/AgentStatusMonitor';
import AgentTriggerPanel from './common/AgentTriggerPanel';
import AsyncChatButton from './common/AsyncChatButton';
import BulkTaskUpload from './common/BulkTaskUpload';
import ChatInput from './common/ChatInput';
import ChatPanel from './common/ChatPanel';
import ChatTasksMonitor from './common/ChatTasksMonitor';
import ChatWindow from './common/ChatWindow';
import CompactTaskCard from './common/CompactTaskCard';
import CreateTaskPage from './common/CreateTaskPage';
import Dashboard from './common/Dashboard';
import DashboardMainView from './common/DashboardMainView';
import DashboardTaskSection from './common/DashboardTaskSection';
import DataSettings from './common/DataSettings';
import GPTSettings from './common/GPTSettings';
import Header from './common/Header';
import Layout from './common/Layout';
import LazyImage from './common/LazyImage';
import MainView from './common/MainView';
import ManagementPanel from './common/ManagementPanel';
import MessageBubble from './common/MessageBubble';
import MessageTimer from './common/MessageTimer';
import MonitorPage from './common/MonitorPage';
import Navigation from './common/Navigation';
import NotificationBell from './common/NotificationBell';
import NotificationToast from './common/NotificationToast';
import Phi3ManagerChat from './common/Phi3ManagerChat';
import ProcessMonitor from './common/ProcessMonitor';
import QuickActions from './common/QuickActions';
import RecentActivity from './common/RecentActivity';
import SimpleMainView from './common/SimpleMainView';
import StreamingButton from './common/StreamingButton';
import StreamingMessage from './common/StreamingMessage';
import SystemLogs from './common/SystemLogs';
import SystemStats from './common/SystemStats';
import TaskBotPanel from './common/TaskBotPanel';
import TaskCard from './common/TaskCard';
import TaskDetailModal from './common/TaskDetailModal';
import TaskFilters from './common/TaskFilters';
import TaskManager from './common/TaskManager';
import TaskSummaryCompact from './common/TaskSummaryCompact';
import TasksCSVTable from './common/TasksCSVTable';
import TasksTable from './common/TasksTable';
import TerminalPoolStatus from './common/TerminalPoolStatus';
import ThemeButton from './common/ThemeButton';
import ThemeDemo from './common/ThemeDemo';
import ThemeToggle from './common/ThemeToggle';
import TokenAnalytics from './common/TokenAnalytics';
import TokenUsageMonitor from './common/TokenUsageMonitor';
import TokenUsageWidget from './common/TokenUsageWidget';
import TypingIndicator from './common/TypingIndicator';
import VoiceInput from './common/VoiceInput';
import VoiceSettings from './common/VoiceSettings';
import VoiceTestPage from './common/VoiceTestPage';
import VoiceWave from './common/VoiceWave';

// Data Components (2)
import TokenUsageMonitorData from './data/TokenUsageMonitor';
import TasksTableData from './data/TasksTable';

// Display Components (2)
import AgentCardDisplay from './display/AgentCard';
import SystemHealthDashboardDisplay from './display/SystemHealthDashboard';

// Monitoring Components (4)
import BackupMonitorNew from './monitoring/BackupMonitor.new';
import BackupStatusCard from './monitoring/BackupStatusCard';
import HealthStatusWidget from './monitoring/HealthStatusWidget';
import SystemResourcesMonitor from './monitoring/SystemResourcesMonitor';

const ShowcaseAll = () => {
  const [activeCategory, setActiveCategory] = useState('common');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Components', count: 74 },
    { id: 'common', name: 'Common', count: 58 },
    { id: 'data', name: 'Data', count: 2 },
    { id: 'display', name: 'Display', count: 2 },
    { id: 'monitoring', name: 'Monitoring', count: 4 }
  ];

  // Component registry with metadata
  const components = {
    common: [
      { name: 'AgentAvatar', Component: AgentAvatar, description: 'Avatar display for AI agents' },
      { name: 'AgentStatus', Component: AgentStatus, description: 'Agent status indicator' },
      { name: 'AgentStatusMonitor', Component: AgentStatusMonitor, description: 'Real-time agent monitoring' },
      { name: 'AgentTriggerPanel', Component: AgentTriggerPanel, description: 'Agent trigger controls' },
      { name: 'AsyncChatButton', Component: AsyncChatButton, description: 'Asynchronous chat button' },
      { name: 'BulkTaskUpload', Component: BulkTaskUpload, description: 'Bulk task upload interface' },
      { name: 'ChatInput', Component: ChatInput, description: 'Chat input component' },
      { name: 'ChatPanel', Component: ChatPanel, description: 'Chat panel container' },
      { name: 'ChatTasksMonitor', Component: ChatTasksMonitor, description: 'Chat tasks monitoring' },
      { name: 'ChatWindow', Component: ChatWindow, description: 'Chat window component' },
      { name: 'CompactTaskCard', Component: CompactTaskCard, description: 'Compact task card display' },
      { name: 'CreateTaskPage', Component: CreateTaskPage, description: 'Task creation page' },
      { name: 'Dashboard', Component: Dashboard, description: 'Main dashboard component' },
      { name: 'DashboardMainView', Component: DashboardMainView, description: 'Dashboard main view' },
      { name: 'DashboardTaskSection', Component: DashboardTaskSection, description: 'Dashboard task section' },
      { name: 'DataSettings', Component: DataSettings, description: 'Data settings panel' },
      { name: 'GPTSettings', Component: GPTSettings, description: 'GPT configuration settings' },
      { name: 'Header', Component: Header, description: 'Application header' },
      { name: 'Layout', Component: Layout, description: 'Layout wrapper component' },
      { name: 'LazyImage', Component: LazyImage, description: 'Lazy loading image' },
      { name: 'MainView', Component: MainView, description: 'Main view container' },
      { name: 'ManagementPanel', Component: ManagementPanel, description: 'Management control panel' },
      { name: 'MessageBubble', Component: MessageBubble, description: 'Chat message bubble' },
      { name: 'MessageTimer', Component: MessageTimer, description: 'Message timer display' },
      { name: 'MonitorPage', Component: MonitorPage, description: 'Monitoring page' },
      { name: 'Navigation', Component: Navigation, description: 'Navigation component' },
      { name: 'NotificationBell', Component: NotificationBell, description: 'Notification bell icon' },
      { name: 'NotificationToast', Component: NotificationToast, description: 'Toast notification' },
      { name: 'Phi3ManagerChat', Component: Phi3ManagerChat, description: 'Phi3 manager chat interface' },
      { name: 'ProcessMonitor', Component: ProcessMonitor, description: 'Process monitoring display' },
      { name: 'QuickActions', Component: QuickActions, description: 'Quick action buttons' },
      { name: 'RecentActivity', Component: RecentActivity, description: 'Recent activity feed' },
      { name: 'SimpleMainView', Component: SimpleMainView, description: 'Simplified main view' },
      { name: 'StreamingButton', Component: StreamingButton, description: 'Streaming action button' },
      { name: 'StreamingMessage', Component: StreamingMessage, description: 'Streaming message display' },
      { name: 'SystemLogs', Component: SystemLogs, description: 'System logs viewer' },
      { name: 'SystemStats', Component: SystemStats, description: 'System statistics display' },
      { name: 'TaskBotPanel', Component: TaskBotPanel, description: 'Task bot control panel' },
      { name: 'TaskCard', Component: TaskCard, description: 'Task card component' },
      { name: 'TaskDetailModal', Component: TaskDetailModal, description: 'Task detail modal' },
      { name: 'TaskFilters', Component: TaskFilters, description: 'Task filtering controls' },
      { name: 'TaskManager', Component: TaskManager, description: 'Task management interface' },
      { name: 'TaskSummaryCompact', Component: TaskSummaryCompact, description: 'Compact task summary' },
      { name: 'TasksCSVTable', Component: TasksCSVTable, description: 'CSV task table' },
      { name: 'TasksTable', Component: TasksTable, description: 'Tasks table display' },
      { name: 'TerminalPoolStatus', Component: TerminalPoolStatus, description: 'Terminal pool status' },
      { name: 'ThemeButton', Component: ThemeButton, description: 'Theme toggle button' },
      { name: 'ThemeDemo', Component: ThemeDemo, description: 'Theme demonstration' },
      { name: 'ThemeToggle', Component: ThemeToggle, description: 'Theme toggle switch' },
      { name: 'TokenAnalytics', Component: TokenAnalytics, description: 'Token usage analytics' },
      { name: 'TokenUsageMonitor', Component: TokenUsageMonitor, description: 'Token usage monitoring' },
      { name: 'TokenUsageWidget', Component: TokenUsageWidget, description: 'Token usage widget' },
      { name: 'TypingIndicator', Component: TypingIndicator, description: 'Typing indicator animation' },
      { name: 'VoiceInput', Component: VoiceInput, description: 'Voice input interface' },
      { name: 'VoiceSettings', Component: VoiceSettings, description: 'Voice settings panel' },
      { name: 'VoiceTestPage', Component: VoiceTestPage, description: 'Voice testing page' },
      { name: 'VoiceWave', Component: VoiceWave, description: 'Voice waveform display' }
    ],
    data: [
      { name: 'TokenUsageMonitor', Component: TokenUsageMonitorData, description: 'Token usage data monitoring' },
      { name: 'TasksTable', Component: TasksTableData, description: 'Tasks data table' }
    ],
    display: [
      { name: 'AgentCard', Component: AgentCardDisplay, description: 'Agent card display' },
      { name: 'SystemHealthDashboard', Component: SystemHealthDashboardDisplay, description: 'System health dashboard' }
    ],
    monitoring: [
      { name: 'BackupMonitor', Component: BackupMonitorNew, description: 'Backup monitoring panel' },
      { name: 'BackupStatusCard', Component: BackupStatusCard, description: 'Backup status card' },
      { name: 'HealthStatusWidget', Component: HealthStatusWidget, description: 'Health status widget' },
      { name: 'SystemResourcesMonitor', Component: SystemResourcesMonitor, description: 'System resources monitor' }
    ]
  };

  // Get components to display
  const getDisplayComponents = () => {
    let componentsToShow = [];
    
    if (activeCategory === 'all') {
      Object.values(components).forEach(categoryComponents => {
        componentsToShow = [...componentsToShow, ...categoryComponents];
      });
    } else {
      componentsToShow = components[activeCategory] || [];
    }

    // Filter by search query
    if (searchQuery) {
      componentsToShow = componentsToShow.filter(comp => 
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return componentsToShow;
  };

  const displayComponents = getDisplayComponents();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            🎯 Vistara UI - All Components
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
            74 Components Migrated from TitanMind with Full CSS Variables Support
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-lg flex-1 min-w-[300px]"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)'
            }}
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeCategory === category.id ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: activeCategory === category.id 
                  ? 'var(--color-primary)' 
                  : 'var(--color-surface)',
                color: activeCategory === category.id 
                  ? 'var(--color-white)' 
                  : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Showing {displayComponents.length} components
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayComponents.map(({ name, Component, description }) => (
            <div 
              key={name}
              className="p-6 rounded-lg"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {name}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {description}
              </p>
              
              {/* Component Preview */}
              <div 
                className="p-4 rounded"
                style={{ 
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Component size="compact" />
                </React.Suspense>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {displayComponents.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-text-secondary)' }}>
              No components found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowcaseAll;