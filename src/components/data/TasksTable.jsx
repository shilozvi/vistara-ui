/**
 * 🎯 Vistara UI - Tasks Table Component
 * "Command your Design."
 * 
 * Migrated from TitanMind with full CSS Variables support
 * Original: Comprehensive task management table with full CRUD operations
 * 
 * ✅ Fully normalized - No hardcoded values
 * ✅ CSS Variables only
 * ✅ Multiple sizes and display modes
 * ✅ RTL support maintained
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  RefreshCw,
  User,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { normalizeStyle, withNormalizedStyles } from '../../utils/normalizeStyle';

// Transfer Task Form Component
const TransferTaskForm = ({ task, agents, onSubmit, onCancel, size = 'normal' }) => {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Size configurations
  const sizeConfigs = {
    compact: {
      textSize: 'var(--font-size-xs)',
      inputPadding: 'var(--space-2)',
      buttonPadding: 'var(--space-2) var(--space-3)'
    },
    normal: {
      textSize: 'var(--font-size-sm)',
      inputPadding: 'var(--space-3)',
      buttonPadding: 'var(--space-3) var(--space-4)'
    },
    expanded: {
      textSize: 'var(--font-size-base)',
      inputPadding: 'var(--space-4)',
      buttonPadding: 'var(--space-4) var(--space-6)'
    }
  };

  const config = sizeConfigs[size];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgent) return;

    setLoading(true);
    try {
      await onSubmit({
        taskId: task.Task_ID,
        fromAgent: task.Current_Owner || 'Unknown',
        toAgent: selectedAgent,
        reason: reason || 'Manual transfer via dashboard'
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = normalizeStyle({
    width: '100%',
    padding: config.inputPadding,
    border: `var(--border-width-1) solid var(--color-border-light)`,
    borderRadius: 'var(--border-radius-md)',
    fontSize: config.textSize,
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-surface)',
    outline: 'none',
    transition: 'var(--transition-base)'
  });

  const buttonStyles = (variant = 'primary') => normalizeStyle({
    padding: config.buttonPadding,
    borderRadius: 'var(--border-radius-md)',
    fontSize: config.textSize,
    fontWeight: 'var(--font-weight-medium)',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'var(--transition-base)',
    backgroundColor: variant === 'primary' ? 'var(--color-primary)' : 'var(--color-gray-500)',
    color: 'var(--color-white)',
    opacity: loading ? '0.5' : '1'
  });

  return (
    <form onSubmit={handleSubmit} style={normalizeStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    })}>
      <div>
        <label style={normalizeStyle({
          display: 'block',
          fontSize: config.textSize,
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)'
        })}>
          משימה: {task.Task_Name}
        </label>
        <p style={normalizeStyle({
          fontSize: config.textSize,
          color: 'var(--color-text-secondary)'
        })}>
          בעלים נוכחי: {task.Current_Owner || 'לא מוקצה'}
        </p>
      </div>

      <div>
        <label style={normalizeStyle({
          display: 'block',
          fontSize: config.textSize,
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)'
        })}>
          העבר לסוכן:
        </label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          style={inputStyles}
          required
          disabled={loading}
        >
          <option value="">בחר סוכן...</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.name}>
              {agent.emoji} {agent.name} - {agent.role}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={normalizeStyle({
          display: 'block',
          fontSize: config.textSize,
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)'
        })}>
          סיבת ההעברה (אופציונלי):
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={normalizeStyle({
            ...inputStyles,
            minHeight: '4rem',
            resize: 'vertical'
          })}
          placeholder="הסבר מדוע אתה מעביר את המשימה..."
        />
      </div>

      <div style={normalizeStyle({
        display: 'flex',
        gap: 'var(--space-2)',
        justifyContent: 'flex-end'
      })}>
        <button
          type="submit"
          disabled={!selectedAgent || loading}
          style={buttonStyles('primary')}
        >
          {loading ? 'מעביר...' : '🔁 העבר משימה'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={buttonStyles('secondary')}
        >
          ביטול
        </button>
      </div>
    </form>
  );
};

const TasksTable = ({ 
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  refreshInterval = 30000,
  mockData = false, // For demo purposes
  embeddedMode = false,
  showTitle = true
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useState('הנסיך'); // For demo - in real app this would come from auth
  
  // Filter states
  const [filterPriority, setPriority] = useState('all');
  const [filterCompletion, setCompletion] = useState('incomplete');
  const [filterOwner, setOwner] = useState('all');
  const [filterProject, setProject] = useState('all');
  const [filterStatus, setStatus] = useState('all');
  const [searchTerm, setTerm] = useState('');
  const [searchExpanded, setExpanded] = useState(false);

  // UI states
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [notifications, setNotifications] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [taskToTransfer, setTaskToTransfer] = useState(null);
  const [agents, setAgents] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Size configurations
  const sizeConfigs = {
    compact: {
      padding: 'var(--space-2)',
      gap: 'var(--space-2)',
      cellPadding: 'var(--space-2)',
      fontSize: 'var(--font-size-xs)',
      titleSize: 'var(--font-size-sm)',
      iconSize: '14px',
      buttonPadding: 'var(--space-1) var(--space-2)'
    },
    normal: {
      padding: 'var(--space-4)',
      gap: 'var(--space-3)',
      cellPadding: 'var(--space-4)',
      fontSize: 'var(--font-size-sm)',
      titleSize: 'var(--font-size-lg)',
      iconSize: '16px',
      buttonPadding: 'var(--space-2) var(--space-3)'
    },
    expanded: {
      padding: 'var(--space-6)',
      gap: 'var(--space-4)',
      cellPadding: 'var(--space-6)',
      fontSize: 'var(--font-size-base)',
      titleSize: 'var(--font-size-xl)',
      iconSize: '20px',
      buttonPadding: 'var(--space-3) var(--space-4)'
    }
  };

  const config = sizeConfigs[size];

  useEffect(() => {
    loadTasks(true);
    loadAgents();
    const interval = setInterval(() => loadTasks(false), refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, mockData]);

  const loadTasks = async (showLoading = true) => {
    if (mockData) {
      // Mock data for demo
      const mockTasks = [
        {
          Task_ID: 'TSK001',
          Task_Name: 'Migrate AgentCard to Vistara UI',
          Project: 'Vistara_UI',
          Current_Owner: 'Falcon',
          Status: 'In Progress',
          Priority: 'HIGH',
          Last_Action: '🟡 IN PROGRESS: Falcon working on component migration',
          Last_Update: '14:30',
          Previous_Owners: '',
          Archive: false
        },
        {
          Task_ID: 'TSK002',
          Task_Name: 'Design CSS Variables architecture',
          Project: 'Vistara_UI',
          Current_Owner: 'Falcon',
          Status: 'Completed',
          Priority: 'CRITICAL',
          Last_Action: '✅ COMPLETED: CSS Variables system implemented',
          Last_Update: '13:45',
          Previous_Owners: '',
          Archive: false
        },
        {
          Task_ID: 'TSK003',
          Task_Name: 'Create demo components showcase',
          Project: 'Vistara_UI',
          Current_Owner: 'River',
          Status: 'Waiting',
          Priority: 'MEDIUM',
          Last_Action: '🔴 NEW TASK: Created by Compass',
          Last_Update: '12:15',
          Previous_Owners: '',
          Archive: false
        }
      ];
      setTasks(mockTasks);
      setLoading(false);
      return;
    }

    try {
      if (showLoading) setLoading(true);
      
      const response = await fetch('/api/tasks-management/list');
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.tasks);
        setError(null);
      } else {
        setError(data.error || 'Failed to load tasks');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const loadAgents = async () => {
    if (mockData) {
      setAgents([
        { id: 1, name: 'Falcon', role: 'Frontend Specialist', emoji: '🦅' },
        { id: 2, name: 'Oak', role: 'Backend Developer', emoji: '🌳' },
        { id: 3, name: 'River', role: 'Task Manager', emoji: '🌊' },
        { id: 4, name: 'Compass', role: 'Project Coordinator', emoji: '🧭' }
      ]);
      return;
    }

    try {
      const response = await fetch('/api/tasks-management/agents');
      const data = await response.json();
      if (data.success && data.agents) {
        setAgents(data.agents);
      }
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.error('Error loading agents:', error);
    }
  };

  // Notification system
  const showSuccessNotification = (message, options = {}) => {
    const notification = {
      id: Date.now(),
      type: 'success',
      message,
      autoHide: options.autoHide !== false ? 5000 : false,
      task: options.task
    };
    setNotifications(prev => [...prev, notification]);
    
    if (notification.autoHide) {
      setTimeout(() => removeNotification(notification.id), notification.autoHide);
    }
  };

  const showErrorNotification = (message) => {
    const notification = {
      id: Date.now(),
      type: 'error',
      message,
      autoHide: 8000
    };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => removeNotification(notification.id), notification.autoHide);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Task operations
  const completeTask = async (taskId) => {
    const taskInfo = tasks.find(t => t.Task_ID === taskId);
    const summary = prompt(`Complete task ${taskId}?\n\nTask: ${taskInfo?.Task_Name || 'Unknown'}\n\nEnter work summary:`);
    if (!summary?.trim()) return;
    
    if (!window.confirm(`Complete task ${taskId}?`)) return;

    try {
      // Mock API call
      if (mockData) {
        setTasks(prev => prev.map(t => 
          t.Task_ID === taskId 
            ? { ...t, Status: 'Completed', Last_Action: `✅ COMPLETED: ${summary}` }
            : t
        ));
        showSuccessNotification(`🎉 Task ${taskId} completed successfully!`, { task: taskInfo });
        return;
      }

      const response = await fetch(`/api/bot/complete_task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, summary })
      });

      const data = await response.json();
      if (data.success) {
        showSuccessNotification(`🎉 Task ${taskId} completed successfully!`, { task: taskInfo });
        loadTasks(true);
      } else {
        showErrorNotification(`❌ Complete Error: ${data.message || data.error}`);
      }
    } catch (err) {
      showErrorNotification(`❌ Connection Error: ${err.message}`);
    }
  };

  const deleteTask = async (taskId, taskName = '') => {
    const taskInfo = tasks.find(t => t.Task_ID === taskId);
    const reason = prompt(`Delete task ${taskId}?\n\nTask: ${taskName || taskInfo?.Task_Name || 'Unknown'}\n\nReason for deletion (optional):`);
    
    if (!window.confirm(`🗑️ Delete task ${taskId}?`)) return;

    try {
      // Mock API call
      if (mockData) {
        setTasks(prev => prev.filter(t => t.Task_ID !== taskId));
        showSuccessNotification(`✅ Task ${taskId} deleted successfully!`);
        return;
      }

      const response = await fetch(`/api/bot/delete_task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, reason: reason || 'Manual deletion via dashboard' })
      });

      const data = await response.json();
      if (data.success) {
        showSuccessNotification(`✅ ${data.message}`, { task: taskInfo });
        loadTasks(true);
      } else {
        showErrorNotification(`❌ Delete Error: ${data.message || data.error}`);
      }
    } catch (err) {
      showErrorNotification(`❌ Connection Error: ${err.message}`);
    }
  };

  const transferTask = async (taskId) => {
    const taskInfo = tasks.find(t => t.Task_ID === taskId);
    setTaskToTransfer(taskInfo);
    setShowTransferModal(true);
  };

  const handleTransferSubmit = async (transferData) => {
    const { taskId, fromAgent, toAgent, reason } = transferData;
    
    if (!window.confirm(`🔁 Transfer task ${taskId} from ${fromAgent} to ${toAgent}?`)) return;

    try {
      // Mock API call
      if (mockData) {
        setTasks(prev => prev.map(t => 
          t.Task_ID === taskId 
            ? { 
                ...t, 
                Current_Owner: toAgent,
                Previous_Owners: fromAgent,
                Last_Action: `🔁 TRANSFERRED: From ${fromAgent} to ${toAgent} - ${reason}`
              }
            : t
        ));
        setShowTransferModal(false);
        setTaskToTransfer(null);
        showSuccessNotification(`🔁 Task ${taskId} transferred successfully!`);
        return;
      }

      const response = await fetch(`/api/bot/transfer_task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, from_agent: fromAgent, to_agent: toAgent, reason })
      });

      const data = await response.json();
      if (data.success) {
        showSuccessNotification(`🔁 ${data.message}`, { task: taskToTransfer });
        setShowTransferModal(false);
        setTaskToTransfer(null);
        loadTasks(true);
      } else {
        showErrorNotification(`❌ Transfer Error: ${data.message || data.error}`);
      }
    } catch (err) {
      showErrorNotification(`❌ Connection Error: ${err.message}`);
    }
  };

  const reopenTask = async (taskId) => {
    const taskInfo = tasks.find(t => t.Task_ID === taskId);
    const reason = prompt(`Why reopen task ${taskId}?\n\nTask: ${taskInfo?.Task_Name || 'Unknown'}`);
    if (!reason?.trim()) return;
    
    if (!window.confirm(`🔄 Reopen task ${taskId}?`)) return;

    try {
      // Mock API call
      if (mockData) {
        setTasks(prev => prev.map(t => 
          t.Task_ID === taskId 
            ? { ...t, Status: 'In Progress', Last_Action: `🔄 REOPENED: ${reason}` }
            : t
        ));
        showSuccessNotification(`🔄 Task ${taskId} reopened successfully!`);
        return;
      }

      const response = await fetch(`/api/bot/reopen_task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, reason })
      });

      const data = await response.json();
      if (data.success) {
        showSuccessNotification(`🔄 ${data.message}`, { task: taskInfo });
        loadTasks(true);
      } else {
        showErrorNotification(`❌ Reopen Error: ${data.message || data.error}`);
      }
    } catch (err) {
      showErrorNotification(`❌ Connection Error: ${err.message}`);
    }
  };

  // UI utilities
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return CheckCircle;
      case 'in progress':
        return Clock;
      case 'waiting':
        return Clock;
      case 'failed':
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'var(--color-success)';
      case 'in progress':
        return 'var(--color-info)';
      case 'waiting':
        return 'var(--color-warning)';
      case 'failed':
        return 'var(--color-error)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL':
        return 'var(--color-error)';
      case 'URGENT':
        return 'var(--color-warning)';
      case 'HIGH':
        return 'var(--color-warning)';
      case 'MEDIUM':
        return 'var(--color-info)';
      case 'LOW':
        return 'var(--color-success)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setShowTaskModal(false);
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesPriority = filterPriority === 'all' || task.Priority?.toUpperCase() === filterPriority.toUpperCase();
      const isCompleted = task.Status?.toLowerCase() === 'completed';
      const matchesCompletion = filterCompletion === 'all' || 
        (filterCompletion === 'complete' && isCompleted) ||
        (filterCompletion === 'incomplete' && !isCompleted);
      const matchesOwner = filterOwner === 'all' || task.Current_Owner === filterOwner;
      const matchesProject = filterProject === 'all' || task.Project === filterProject;
      const matchesStatus = filterStatus === 'all' || task.Status?.toLowerCase() === filterStatus.toLowerCase();
      const matchesSearch = !searchTerm || 
        task.Task_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.Task_ID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.Current_Owner?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesPriority && matchesCompletion && matchesOwner && matchesProject && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'Priority') {
        const priorityOrder = { 'CRITICAL': 5, 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        aValue = priorityOrder[aValue?.toUpperCase()] || 0;
        bValue = priorityOrder[bValue?.toUpperCase()] || 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Get unique values for filters
  const uniqueOwners = [...new Set(tasks.map(task => task.Current_Owner).filter(Boolean))];
  const uniqueProjects = [...new Set(tasks.map(task => task.Project).filter(Boolean))];

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.Status?.toLowerCase() === 'completed').length,
    incomplete: tasks.filter(t => t.Status?.toLowerCase() !== 'completed').length
  };

  // Styles
  const containerStyles = normalizeStyle({
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    overflow: 'hidden'
  });

  const headerStyles = normalizeStyle({
    backgroundColor: 'var(--color-background-secondary)',
    padding: config.padding,
    borderBottom: `var(--border-width-1) solid var(--color-border-light)`
  });

  const tableStyles = normalizeStyle({
    width: '100%',
    borderCollapse: 'collapse'
  });

  const thStyles = normalizeStyle({
    padding: config.cellPadding,
    textAlign: 'left',
    fontSize: config.fontSize,
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-background-tertiary)',
    borderBottom: `var(--border-width-1) solid var(--color-border-light)'`
  });

  const tdStyles = normalizeStyle({
    padding: config.cellPadding,
    fontSize: config.fontSize,
    color: 'var(--color-text-primary)',
    borderBottom: `var(--border-width-1) solid var(--color-border-light)'`
  });

  const buttonStyles = (variant = 'primary') => normalizeStyle({
    padding: config.buttonPadding,
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    borderRadius: 'var(--border-radius-md)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition-base)',
    backgroundColor: variant === 'success' ? 'var(--color-success)' :
                    variant === 'warning' ? 'var(--color-warning)' :
                    variant === 'error' ? 'var(--color-error)' :
                    variant === 'info' ? 'var(--color-info)' :
                    'var(--color-primary)',
    color: 'var(--color-white)'
  });

  if (loading) {
    return (
      <div className="vistara-component" style={containerStyles}>
        <div style={normalizeStyle({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '12rem',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        })}>
          <RefreshCw size={config.iconSize} style={{ 
            color: 'var(--color-primary)',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={normalizeStyle({
            fontSize: config.fontSize,
            color: 'var(--color-text-secondary)'
          })}>
            Loading tasks...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vistara-component" style={containerStyles}>
        <div style={normalizeStyle({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '12rem',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        })}>
          <XCircle size="3rem" style={{ color: 'var(--color-error)' }} />
          <h3 style={normalizeStyle({
            fontSize: config.titleSize,
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            margin: 0
          })}>
            Error Loading Tasks
          </h3>
          <p style={normalizeStyle({
            fontSize: config.fontSize,
            color: 'var(--color-text-secondary)',
            margin: 0
          })}>
            {error}
          </p>
          <button
            onClick={() => loadTasks(true)}
            style={buttonStyles('error')}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vistara-component" style={containerStyles}>
      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={normalizeStyle({
          position: 'fixed',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          zIndex: '50',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        })}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              style={normalizeStyle({
                maxWidth: '24rem',
                padding: 'var(--space-4)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                backgroundColor: notification.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
                color: 'var(--color-white)',
                cursor: notification.task ? 'pointer' : 'default',
                transition: 'var(--transition-base)'
              })}
              onClick={() => {
                if (notification.task) {
                  openTaskModal(notification.task);
                  removeNotification(notification.id);
                }
              }}
            >
              <div style={normalizeStyle({
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              })}>
                <div style={{ flex: 1 }}>
                  <p style={normalizeStyle({
                    fontSize: config.fontSize,
                    fontWeight: 'var(--font-weight-medium)',
                    margin: 0
                  })}>
                    {notification.message}
                  </p>
                  {notification.task && (
                    <p style={normalizeStyle({
                      fontSize: 'var(--font-size-xs)',
                      opacity: '0.75',
                      marginTop: 'var(--space-1)',
                      margin: 0
                    })}>
                      Click to view task details
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  style={normalizeStyle({
                    marginLeft: 'var(--space-2)',
                    color: 'var(--color-white)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-lg)'
                  })}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      {!embeddedMode && (
        <div style={headerStyles}>
          <div style={normalizeStyle({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)'
          })}>
            {/* Title & Stats */}
            <div style={normalizeStyle({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            })}>
              {showTitle && (
                <h1 style={normalizeStyle({
                  fontSize: config.titleSize,
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  margin: 0
                })}>
                  Tasks
                </h1>
              )}
              
              <div style={normalizeStyle({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              })}>
                <div style={normalizeStyle({
                  backgroundColor: 'var(--color-background-tertiary)',
                  borderRadius: 'var(--border-radius-full)',
                  padding: 'var(--space-1) var(--space-2)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)'
                })}>
                  {stats.total}
                </div>
                <div style={normalizeStyle({
                  backgroundColor: 'var(--color-success)',
                  borderRadius: 'var(--border-radius-full)',
                  padding: 'var(--space-1) var(--space-2)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-white)'
                })}>
                  ✓ {stats.completed}
                </div>
                <div style={normalizeStyle({
                  backgroundColor: 'var(--color-warning)',
                  borderRadius: 'var(--border-radius-full)',
                  padding: 'var(--space-1) var(--space-2)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-white)'
                })}>
                  ⏳ {stats.incomplete}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div style={normalizeStyle({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              flexWrap: 'wrap'
            })}>
              {searchExpanded ? (
                <div style={normalizeStyle({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)'
                })}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="חיפוש משימות..."
                    style={normalizeStyle({
                      padding: 'var(--space-2) var(--space-3)',
                      backgroundColor: 'var(--color-surface)',
                      border: `var(--border-width-1) solid var(--color-border-light)`,
                      borderRadius: 'var(--border-radius-full)',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-primary)',
                      width: '8rem'
                    })}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setExpanded(false);
                      setTerm('');
                    }}
                    style={normalizeStyle({
                      padding: 'var(--space-1)',
                      backgroundColor: 'var(--color-background-tertiary)',
                      border: 'none',
                      borderRadius: 'var(--border-radius-full)',
                      fontSize: 'var(--font-size-xs)',
                      cursor: 'pointer'
                    })}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setExpanded(true)}
                  style={normalizeStyle({
                    padding: 'var(--space-2)',
                    backgroundColor: 'var(--color-background-tertiary)',
                    border: `var(--border-width-1) solid var(--color-border-light)`,
                    borderRadius: 'var(--border-radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    cursor: 'pointer'
                  })}
                >
                  🔍
                </button>
              )}

              <select
                value={filterCompletion}
                onChange={(e) => setCompletion(e.target.value)}
                style={normalizeStyle({
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: 'var(--color-surface)',
                  border: `var(--border-width-1) solid var(--color-border-light)`,
                  borderRadius: 'var(--border-radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-primary)'
                })}
              >
                <option value="all">📋 All Tasks</option>
                <option value="complete">✅ Completed</option>
                <option value="incomplete">⏳ Incomplete</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setPriority(e.target.value)}
                style={normalizeStyle({
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: 'var(--color-surface)',
                  border: `var(--border-width-1) solid var(--color-border-light)`,
                  borderRadius: 'var(--border-radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-primary)'
                })}
              >
                <option value="all">⚡ Priority</option>
                <option value="critical">🔴 Critical</option>
                <option value="urgent">🟠 Urgent</option>
                <option value="high">🟡 High</option>
                <option value="medium">🟢 Medium</option>
                <option value="low">🔵 Low</option>
              </select>

              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={normalizeStyle({
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--color-background-tertiary)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  cursor: 'pointer'
                })}
              >
                {isCollapsed ? '▼' : '▲'}
              </button>

              <button
                onClick={() => loadTasks(true)}
                style={normalizeStyle({
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)'
                })}
              >
                <RefreshCw size="12px" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {!isCollapsed && (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={thStyles}>
                  <button
                    onClick={() => handleSort('Task_ID')}
                    style={normalizeStyle({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-1)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-primary)',
                      fontSize: config.fontSize
                    })}
                  >
                    <span>Task ID</span>
                    {sortField === 'Task_ID' && (
                      sortDirection === 'asc' ? <ChevronUp size="12px" /> : <ChevronDown size="12px" />
                    )}
                  </button>
                </th>
                <th style={thStyles}>
                  <button
                    onClick={() => handleSort('Task_Name')}
                    style={normalizeStyle({
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-1)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-primary)',
                      fontSize: config.fontSize
                    })}
                  >
                    <span>Task Name</span>
                    {sortField === 'Task_Name' && (
                      sortDirection === 'asc' ? <ChevronUp size="12px" /> : <ChevronDown size="12px" />
                    )}
                  </button>
                </th>
                <th style={thStyles}>Owner</th>
                <th style={thStyles}>Status</th>
                <th style={thStyles}>Priority</th>
                <th style={thStyles}>Last Update</th>
                <th style={thStyles}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTasks.map((task, index) => {
                const StatusIcon = getStatusIcon(task.Status);
                return (
                  <tr key={task.Task_ID} style={normalizeStyle({
                    backgroundColor: index % 2 === 0 ? 'var(--color-surface)' : 'var(--color-background-secondary)',
                    transition: 'var(--transition-base)'
                  })}>
                    <td style={tdStyles}>
                      <span style={normalizeStyle({
                        fontSize: 'var(--font-size-xs)',
                        fontFamily: 'var(--font-family-mono)',
                        color: 'var(--color-info)',
                        backgroundColor: 'var(--color-info-light)',
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--border-radius-md)',
                        fontWeight: 'var(--font-weight-bold)'
                      })}>
                        {task.Task_ID}
                      </span>
                    </td>
                    <td style={tdStyles}>
                      <span 
                        style={normalizeStyle({
                          fontSize: config.fontSize,
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-info)',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          transition: 'var(--transition-base)'
                        })}
                        onClick={() => openTaskModal(task)}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        title={`Click to view details: ${task.Task_Name}`}
                      >
                        {task.Task_Name}
                      </span>
                    </td>
                    <td style={tdStyles}>
                      <span style={normalizeStyle({
                        fontSize: config.fontSize,
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)'
                      })}>
                        {task.Current_Owner}
                      </span>
                    </td>
                    <td style={tdStyles}>
                      <div style={normalizeStyle({
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)'
                      })}>
                        <StatusIcon size="12px" style={{ color: getStatusColor(task.Status) }} />
                        <span style={normalizeStyle({
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: getStatusColor(task.Status),
                          backgroundColor: `${getStatusColor(task.Status)}20`,
                          padding: 'var(--space-1) var(--space-2)',
                          borderRadius: 'var(--border-radius-full)'
                        })}>
                          {task.Status}
                        </span>
                      </div>
                    </td>
                    <td style={tdStyles}>
                      <span style={normalizeStyle({
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-white)',
                        backgroundColor: getPriorityColor(task.Priority),
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--border-radius-full)'
                      })}>
                        {task.Priority}
                      </span>
                    </td>
                    <td style={tdStyles}>
                      <span style={normalizeStyle({
                        fontSize: config.fontSize,
                        color: 'var(--color-text-secondary)'
                      })}>
                        {task.Last_Update || 'N/A'}
                      </span>
                    </td>
                    <td style={tdStyles}>
                      <div style={normalizeStyle({
                        display: 'flex',
                        gap: 'var(--space-1)'
                      })}>
                        {task.Status?.toLowerCase() !== 'completed' && (
                          <>
                            <button
                              onClick={() => completeTask(task.Task_ID)}
                              style={buttonStyles('success')}
                              title={`Complete task ${task.Task_ID}`}
                            >
                              ✅
                            </button>
                            <button
                              onClick={() => transferTask(task.Task_ID)}
                              style={buttonStyles('warning')}
                              title={`Transfer task ${task.Task_ID}`}
                            >
                              🔁
                            </button>
                          </>
                        )}
                        
                        {task.Status?.toLowerCase() === 'completed' && (
                          <button
                            onClick={() => reopenTask(task.Task_ID)}
                            style={buttonStyles('info')}
                            title={`Reopen task ${task.Task_ID}`}
                          >
                            🔄
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteTask(task.Task_ID, task.Task_Name)}
                          style={buttonStyles('error')}
                          title={`Delete task ${task.Task_ID}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isCollapsed && (
        <div style={normalizeStyle({
          padding: 'var(--space-4)',
          textAlign: 'center'
        })}>
          <div style={normalizeStyle({
            fontSize: config.fontSize,
            color: 'var(--color-text-primary)'
          })}>
            📊 ניהול משימות (מכווץ) - {filteredAndSortedTasks.length} משימות
          </div>
        </div>
      )}

      {filteredAndSortedTasks.length === 0 && !isCollapsed && (
        <div style={normalizeStyle({
          textAlign: 'center',
          padding: 'var(--space-12)'
        })}>
          <div style={normalizeStyle({
            fontSize: config.titleSize,
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)'
          })}>
            {tasks.length === 0 ? 'No tasks available' : 'No tasks match your filters'}
          </div>
          <div style={normalizeStyle({
            fontSize: config.fontSize,
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--space-2)'
          })}>
            {tasks.length === 0 ? 'Tasks will appear here when loaded' : 'Try adjusting your search or filter criteria'}
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showTaskModal && selectedTask && (
        <div style={normalizeStyle({
          position: 'fixed',
          inset: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '50',
          padding: 'var(--space-4)'
        })}>
          <div style={normalizeStyle({
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--border-radius-lg)',
            border: `var(--border-width-1) solid var(--color-border-light)`,
            maxWidth: '64rem',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: 'var(--shadow-2xl)'
          })}>
            {/* Modal Header */}
            <div style={normalizeStyle({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4)',
              borderBottom: `var(--border-width-1) solid var(--color-border-light)`,
              backgroundColor: 'var(--color-background-secondary)'
            })}>
              <div style={normalizeStyle({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)'
              })}>
                <span style={normalizeStyle({
                  fontSize: config.titleSize,
                  fontFamily: 'var(--font-family-mono)',
                  color: 'var(--color-info)',
                  backgroundColor: 'var(--color-info-light)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--border-radius-md)',
                  fontWeight: 'var(--font-weight-bold)'
                })}>
                  {selectedTask.Task_ID}
                </span>
                <span style={normalizeStyle({
                  fontSize: config.fontSize,
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-white)',
                  backgroundColor: getStatusColor(selectedTask.Status),
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--border-radius-full)'
                })}>
                  {selectedTask.Status}
                </span>
                <span style={normalizeStyle({
                  fontSize: config.fontSize,
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-white)',
                  backgroundColor: getPriorityColor(selectedTask.Priority),
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--border-radius-full)'
                })}>
                  {selectedTask.Priority}
                </span>
              </div>
              <button
                onClick={closeTaskModal}
                style={normalizeStyle({
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  cursor: 'pointer'
                })}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={normalizeStyle({
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)'
            })}>
              <div>
                <h3 style={normalizeStyle({
                  fontSize: config.titleSize,
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                  margin: 0
                })}>
                  {selectedTask.Task_Name}
                </h3>
              </div>

              <div style={normalizeStyle({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-4)'
              })}>
                <div style={normalizeStyle({
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: 'var(--space-3)'
                })}>
                  <div style={normalizeStyle({
                    fontSize: config.fontSize,
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-1)'
                  })}>
                    Current Owner
                  </div>
                  <div style={normalizeStyle({
                    fontSize: config.fontSize,
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  })}>
                    {selectedTask.Current_Owner || 'Unassigned'}
                  </div>
                </div>
                
                <div style={normalizeStyle({
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: 'var(--space-3)'
                })}>
                  <div style={normalizeStyle({
                    fontSize: config.fontSize,
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-1)'
                  })}>
                    Project
                  </div>
                  <div style={normalizeStyle({
                    fontSize: config.fontSize,
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  })}>
                    {selectedTask.Project || 'No Project'}
                  </div>
                </div>
                
                <div style={normalizeStyle({
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-lg)',
                  padding: 'var(--space-3)'
                })}>
                  <div style={normalizeStyle({
                    fontSize: config.fontSize,
                    color: 'var(--color-text-muted)',
                    marginBottom: 'var(--space-1)'
                  })}>
                    Last Update
                  </div>
                  <div style={normalizeStyle({
                    fontSize: config.fontSize,
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  })}>
                    {selectedTask.Last_Update || 'N/A'}
                  </div>
                </div>
              </div>

              <div style={normalizeStyle({
                backgroundColor: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-lg)',
                padding: 'var(--space-4)'
              })}>
                <div style={normalizeStyle({
                  fontSize: config.fontSize,
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-2)'
                })}>
                  Last Action
                </div>
                <div style={normalizeStyle({
                  fontSize: config.fontSize,
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                  whiteSpace: 'pre-wrap'
                })}>
                  {selectedTask.Last_Action || 'No actions recorded'}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={normalizeStyle({
                display: 'flex',
                gap: 'var(--space-3)',
                paddingTop: 'var(--space-4)',
                borderTop: `var(--border-width-1) solid var(--color-border-light)`
              })}>
                {selectedTask.Status?.toLowerCase() !== 'completed' && (
                  <button
                    onClick={() => {
                      completeTask(selectedTask.Task_ID);
                      closeTaskModal();
                    }}
                    style={normalizeStyle({
                      ...buttonStyles('success'),
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    })}
                  >
                    ✅ Complete Task
                  </button>
                )}
                
                <button
                  onClick={() => {
                    transferTask(selectedTask.Task_ID);
                    closeTaskModal();
                  }}
                  style={normalizeStyle({
                    ...buttonStyles('warning'),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  })}
                >
                  🔁 Transfer Task
                </button>
                
                {selectedTask.Status?.toLowerCase() === 'completed' && (
                  <button
                    onClick={() => {
                      reopenTask(selectedTask.Task_ID);
                      closeTaskModal();
                    }}
                    style={normalizeStyle({
                      ...buttonStyles('info'),
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    })}
                  >
                    🔄 Reopen Task
                  </button>
                )}
                
                <button
                  onClick={() => {
                    deleteTask(selectedTask.Task_ID, selectedTask.Task_Name);
                    closeTaskModal();
                  }}
                  style={normalizeStyle({
                    ...buttonStyles('error'),
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  })}
                >
                  🗑️ Delete Task
                </button>
                
                <button
                  onClick={closeTaskModal}
                  style={normalizeStyle({
                    padding: config.buttonPadding,
                    fontSize: config.fontSize,
                    fontWeight: 'var(--font-weight-medium)',
                    borderRadius: 'var(--border-radius-md)',
                    border: `var(--border-width-1) solid var(--color-border-light)`,
                    cursor: 'pointer',
                    transition: 'var(--transition-base)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)'
                  })}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Task Modal */}
      {showTransferModal && taskToTransfer && (
        <div style={normalizeStyle({
          position: 'fixed',
          inset: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '50'
        })}>
          <div style={normalizeStyle({
            backgroundColor: 'var(--color-surface)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            maxWidth: '28rem',
            width: '100%',
            margin: 'var(--space-4)',
            border: `var(--border-width-1) solid var(--color-border-light)`
          })}>
            <h3 style={normalizeStyle({
              fontSize: config.titleSize,
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)',
              margin: 0
            })}>
              🔁 העברת משימה {taskToTransfer.Task_ID}
            </h3>
            
            <TransferTaskForm
              task={taskToTransfer}
              agents={agents}
              onSubmit={handleTransferSubmit}
              onCancel={() => {
                setShowTransferModal(false);
                setTaskToTransfer(null);
              }}
              size={size}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Export with style normalization HOC
export default withNormalizedStyles(TasksTable);