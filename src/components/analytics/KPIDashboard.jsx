/**
 * 🎯 Vistara UI - KPIDashboard Component
 * "Command your Design."
 * 
 * לוח מחוונים KPI מתקדם עם ריאל-טיים ואנליטיקס
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const KPIDashboard = forwardRef(({ 
  // Data
  metrics = [], // [{ id, title, value, target, trend, ... }]
  
  // Layout
  columns = 'auto', // 'auto', 1, 2, 3, 4, 6
  gap = 'var(--space-4)',
  
  // Time period
  timeRange = '24h',
  refreshInterval = 30000, // 30 seconds
  
  // Filtering & Sorting
  categories = [],
  selectedCategory = 'all',
  sortBy = 'none', // 'none', 'value', 'change', 'name'
  sortOrder = 'desc',
  
  // Display options
  showFilters = true,
  showExport = true,
  showRefresh = true,
  showFullscreen = false,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed', 'executive'
  variant = 'default', // 'default', 'cards', 'table', 'tiles'
  
  // Thresholds
  globalThresholds = {
    excellent: 90,
    good: 75,
    warning: 50,
    critical: 25
  },
  
  // Behavior
  realTimeUpdates = false,
  autoRefresh = false,
  
  // Callbacks
  onMetricClick,
  onCategoryChange,
  onTimeRangeChange,
  onExport,
  onRefresh,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [filteredMetrics, setFilteredMetrics] = useState(metrics);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const refreshTimer = useRef(null);
  const containerRef = useRef(null);
  
  // Filter and sort metrics
  useEffect(() => {
    let filtered = [...metrics];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(metric => metric.category === selectedCategory);
    }
    
    // Sort metrics
    if (sortBy !== 'none') {
      filtered.sort((a, b) => {
        let aVal, bVal;
        
        switch (sortBy) {
          case 'value':
            aVal = typeof a.value === 'number' ? a.value : 0;
            bVal = typeof b.value === 'number' ? b.value : 0;
            break;
          case 'change':
            aVal = a.change || 0;
            bVal = b.change || 0;
            break;
          case 'name':
            aVal = a.title || '';
            bVal = b.title || '';
            break;
          default:
            return 0;
        }
        
        if (typeof aVal === 'string') {
          return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }
    
    setFilteredMetrics(filtered);
  }, [metrics, selectedCategory, sortBy, sortOrder]);
  
  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return;
    
    refreshTimer.current = setInterval(() => {
      handleRefresh();
    }, refreshInterval);
    
    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
    };
  }, [autoRefresh, refreshInterval]);
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    setLastUpdate(new Date());
    
    try {
      await onRefresh?.();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle export
  const handleExport = () => {
    const exportData = filteredMetrics.map(metric => ({
      title: metric.title,
      value: metric.value,
      change: metric.change,
      target: metric.target,
      category: metric.category,
      lastUpdated: metric.lastUpdated
    }));
    
    onExport?.(exportData);
  };
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Get metric status
  const getMetricStatus = (metric) => {
    const { value, target, thresholds = globalThresholds } = metric;
    
    if (typeof value !== 'number') return 'normal';
    
    let percentage;
    if (target) {
      percentage = (value / target) * 100;
    } else {
      percentage = value;
    }
    
    if (percentage >= thresholds.excellent) return 'excellent';
    if (percentage >= thresholds.good) return 'good';
    if (percentage >= thresholds.warning) return 'warning';
    return 'critical';
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      width: '100%',
      height: isFullscreen ? '100vh' : 'auto',
      backgroundColor: isFullscreen ? 'var(--color-background)' : 'transparent',
      padding: isFullscreen ? 'var(--space-4)' : 0,
      
      // Theme variations
      ...(theme === 'executive' && {
        backgroundColor: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-xl)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-xl)'
      })
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-4)',
      flexWrap: 'wrap',
      gap: 'var(--space-3)'
    });
  };
  
  // Controls styles
  const getControlsStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      flexWrap: 'wrap'
    });
  };
  
  // Grid styles
  const getGridStyles = () => {
    let gridColumns;
    if (columns === 'auto') {
      const metricCount = filteredMetrics.length;
      if (metricCount <= 2) gridColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
      else if (metricCount <= 4) gridColumns = 'repeat(2, 1fr)';
      else if (metricCount <= 6) gridColumns = 'repeat(3, 1fr)';
      else gridColumns = 'repeat(4, 1fr)';
    } else {
      gridColumns = `repeat(${columns}, 1fr)`;
    }
    
    return normalizeStyle({
      display: 'grid',
      gridTemplateColumns: gridColumns,
      gap,
      
      // Responsive adjustments
      '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
      },
      
      '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr'
      }
    });
  };
  
  // Metric card styles
  const getMetricCardStyles = (metric) => {
    const status = getMetricStatus(metric);
    
    const statusColors = {
      excellent: 'var(--color-success)',
      good: 'var(--color-info)',
      warning: 'var(--color-warning)',
      critical: 'var(--color-danger)',
      normal: 'var(--color-border)'
    };
    
    const baseStyles = {
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      padding: size === 'compact' ? 'var(--space-3)' : 'var(--space-4)',
      cursor: onMetricClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      borderLeftWidth: '4px',
      borderLeftColor: statusColors[status]
    };
    
    if (variant === 'tiles') {
      return normalizeStyle({
        ...baseStyles,
        borderRadius: 'var(--border-radius-xl)',
        boxShadow: 'var(--shadow-md)',
        ':hover': onMetricClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-lg)'
        } : {}
      });
    }
    
    if (variant === 'cards') {
      return normalizeStyle({
        ...baseStyles,
        boxShadow: 'var(--shadow-sm)',
        ':hover': onMetricClick ? {
          boxShadow: 'var(--shadow-md)'
        } : {}
      });
    }
    
    return normalizeStyle(baseStyles);
  };
  
  // Button styles
  const getButtonStyles = (variant = 'secondary') => {
    const variants = {
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-contrast)',
        border: 'none'
      },
      secondary: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)'
      }
    };
    
    return normalizeStyle({
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--border-radius-md)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      outline: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      
      ...variants[variant],
      
      ':hover': {
        opacity: 0.8
      },
      
      ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
      }
    });
  };
  
  // Select styles
  const getSelectStyles = () => {
    return normalizeStyle({
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--border-radius-md)',
      border: '1px solid var(--color-border)',
      fontSize: 'var(--font-size-sm)',
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
      outline: 'none',
      cursor: 'pointer'
    });
  };
  
  // Render filters
  const renderFilters = () => {
    if (!showFilters) return null;
    
    return (
      <div style={getControlsStyles()}>
        {/* Category filter */}
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            style={getSelectStyles()}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        )}
        
        {/* Sort controls */}
        <select
          value={sortBy}
          onChange={(e) => {
            const newSortBy = e.target.value;
            // Toggle sort order if same field selected
            if (newSortBy === sortBy) {
              // Will be handled by parent
            }
          }}
          style={getSelectStyles()}
        >
          <option value="none">No Sort</option>
          <option value="value">Sort by Value</option>
          <option value="change">Sort by Change</option>
          <option value="name">Sort by Name</option>
        </select>
        
        {/* Time range */}
        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange?.(e.target.value)}
          style={getSelectStyles()}
        >
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>
    );
  };
  
  // Render controls
  const renderControls = () => {
    return (
      <div style={getControlsStyles()}>
        {/* Refresh button */}
        {showRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            style={getButtonStyles('secondary')}
          >
            <RefreshIcon />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
        
        {/* Export button */}
        {showExport && (
          <button
            onClick={handleExport}
            style={getButtonStyles('secondary')}
          >
            <ExportIcon />
            Export
          </button>
        )}
        
        {/* Fullscreen button */}
        {showFullscreen && (
          <button
            onClick={toggleFullscreen}
            style={getButtonStyles('secondary')}
          >
            <FullscreenIcon />
            Fullscreen
          </button>
        )}
      </div>
    );
  };
  
  // Render metric value
  const renderMetricValue = (metric) => {
    const { value, unit = '', format } = metric;
    
    let displayValue = value;
    if (typeof value === 'number') {
      if (format === 'percentage') {
        displayValue = `${value.toFixed(1)}%`;
      } else if (format === 'currency') {
        displayValue = `$${value.toLocaleString()}`;
      } else {
        displayValue = value.toLocaleString();
      }
    }
    
    return (
      <div style={{
        fontSize: size === 'compact' ? 'var(--font-size-xl)' : 'var(--font-size-2xl)',
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--space-1)'
      }}>
        {displayValue}
        {unit && (
          <span style={{
            fontSize: '0.6em',
            fontWeight: 'var(--font-weight-normal)',
            color: 'var(--color-text-muted)',
            marginLeft: 'var(--space-1)'
          }}>
            {unit}
          </span>
        )}
      </div>
    );
  };
  
  // Render metric change
  const renderMetricChange = (metric) => {
    const { change, changeType = 'percentage' } = metric;
    
    if (change === undefined) return null;
    
    const isPositive = change > 0;
    const isNegative = change < 0;
    
    let changeColor = 'var(--color-text-muted)';
    if (isPositive) changeColor = 'var(--color-success)';
    if (isNegative) changeColor = 'var(--color-danger)';
    
    let displayChange = change;
    if (changeType === 'percentage') {
      displayChange = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;
    }
    
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        fontSize: 'var(--font-size-sm)',
        color: changeColor,
        fontWeight: 'var(--font-weight-medium)'
      }}>
        {isPositive && <TrendUpIcon />}
        {isNegative && <TrendDownIcon />}
        <span>{displayChange}</span>
      </div>
    );
  };
  
  // Icons
  const RefreshIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2"/>
      <path d="m21 3-3 5h5" stroke="currentColor" strokeWidth="2"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2"/>
      <path d="m3 21 3-5H1" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ExportIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2"/>
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const FullscreenIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 16.2V21m0 0h4.8M3 21l6-6" stroke="currentColor" strokeWidth="2"/>
      <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" stroke="currentColor" strokeWidth="2"/>
      <path d="M3 7.8V3m0 0h4.8M3 3l6 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const TrendUpIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2"/>
      <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const TrendDownIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" stroke="currentColor" strokeWidth="2"/>
      <polyline points="17 18 23 18 23 12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  return (
    <div
      ref={containerRef}
      className={`vistara-kpi-dashboard vistara-kpi-dashboard--${variant} vistara-kpi-dashboard--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {/* Header */}
      <div style={getHeaderStyles()}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: size === 'compact' ? 'var(--font-size-lg)' : 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)'
          }}>
            KPI Dashboard
          </h2>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            marginTop: 'var(--space-1)'
          }}>
            Last updated: {lastUpdate.toLocaleTimeString()}
            {realTimeUpdates && <span style={{ marginLeft: 'var(--space-1)' }}>• Live</span>}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          {renderFilters()}
          {renderControls()}
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div style={getGridStyles()}>
        {filteredMetrics.map((metric, index) => (
          <div
            key={metric.id || index}
            style={getMetricCardStyles(metric)}
            onClick={() => onMetricClick?.(metric)}
          >
            {/* Metric Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-2)'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-muted)'
              }}>
                {metric.title}
              </h3>
              
              {metric.icon && (
                <div style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--font-size-lg)'
                }}>
                  {metric.icon}
                </div>
              )}
            </div>
            
            {/* Metric Value */}
            {renderMetricValue(metric)}
            
            {/* Metric Change */}
            {renderMetricChange(metric)}
            
            {/* Target Progress */}
            {metric.target && (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-1)'
                }}>
                  <span>Progress</span>
                  <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                </div>
                <div style={{
                  height: '4px',
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((metric.value / metric.target) * 100, 100)}%`,
                    backgroundColor: 'var(--color-primary)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredMetrics.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-8)',
          color: 'var(--color-text-muted)'
        }}>
          <div style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>
            No metrics found
          </div>
          <div style={{ fontSize: 'var(--font-size-sm)' }}>
            Try adjusting your filters or add some metrics to get started.
          </div>
        </div>
      )}
    </div>
  );
});

KPIDashboard.displayName = 'KPIDashboard';

export default KPIDashboard;