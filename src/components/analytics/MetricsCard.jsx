/**
 * 🎯 Vistara UI - MetricsCard Component
 * "Command your Design."
 * 
 * כרטיס מטריקות מתקדם עם גרפים ואינדיקטורים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const MetricsCard = forwardRef(({ 
  // Core data
  title,
  value,
  previousValue,
  unit = '',
  
  // Trend & Change
  showTrend = true,
  trendPeriod = '30d',
  change,
  changeType = 'percentage', // 'percentage', 'absolute', 'custom'
  
  // Visual elements
  icon,
  color = 'primary',
  
  // Mini chart
  chartData = [],
  chartType = 'line', // 'line', 'bar', 'area'
  showMiniChart = false,
  
  // KPI indicators
  target,
  threshold,
  status = 'normal', // 'normal', 'warning', 'critical', 'success'
  
  // Comparison
  comparison,
  comparisonLabel,
  
  // Time series
  timeRange = '24h',
  lastUpdated,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded', 'large'
  theme = 'default', // 'default', 'minimal', 'detailed', 'dashboard'
  variant = 'default', // 'default', 'outlined', 'filled', 'glass'
  
  // Layout
  layout = 'vertical', // 'vertical', 'horizontal'
  
  // Behavior
  clickable = false,
  loading = false,
  
  // Callbacks
  onClick,
  onTrendClick,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [isHovered, setIsHovered] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);
  const chartRef = useRef(null);
  
  // Animate value
  useEffect(() => {
    if (typeof value !== 'number') return;
    
    const startTime = Date.now();
    const startValue = animatedValue;
    const targetValue = value;
    const duration = 1000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValue(startValue + (targetValue - startValue) * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  // Calculate trend
  const calculateTrend = () => {
    if (!showTrend || previousValue === undefined || value === undefined) return null;
    
    let changeValue;
    if (change !== undefined) {
      changeValue = change;
    } else {
      changeValue = value - previousValue;
    }
    
    const isPositive = changeValue > 0;
    const isNegative = changeValue < 0;
    
    let displayValue;
    if (changeType === 'percentage') {
      const percentage = previousValue !== 0 ? (changeValue / Math.abs(previousValue)) * 100 : 0;
      displayValue = `${isPositive ? '+' : ''}${percentage.toFixed(1)}%`;
    } else if (changeType === 'absolute') {
      displayValue = `${isPositive ? '+' : ''}${changeValue.toLocaleString()}`;
    } else {
      displayValue = changeValue;
    }
    
    return {
      value: changeValue,
      displayValue,
      isPositive,
      isNegative,
      isNeutral: changeValue === 0
    };
  };
  
  // Color mapping
  const getColorStyles = () => {
    const colorMap = {
      primary: {
        main: 'var(--color-primary)',
        light: 'var(--color-primary-light)',
        dark: 'var(--color-primary-dark)'
      },
      success: {
        main: 'var(--color-success)',
        light: 'var(--color-success-light)',
        dark: 'var(--color-success-dark)'
      },
      warning: {
        main: 'var(--color-warning)',
        light: 'var(--color-warning-light)',
        dark: 'var(--color-warning-dark)'
      },
      danger: {
        main: 'var(--color-danger)',
        light: 'var(--color-danger-light)',
        dark: 'var(--color-danger-dark)'
      },
      info: {
        main: 'var(--color-info)',
        light: 'var(--color-info-light)',
        dark: 'var(--color-info-dark)'
      },
      neutral: {
        main: 'var(--color-gray-500)',
        light: 'var(--color-gray-100)',
        dark: 'var(--color-gray-700)'
      }
    };
    
    return colorMap[color] || colorMap.primary;
  };
  
  // Status color mapping
  const getStatusColor = () => {
    const statusMap = {
      normal: 'var(--color-text-muted)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      critical: 'var(--color-danger)'
    };
    
    return statusMap[status] || statusMap.normal;
  };
  
  // Container styles
  const getContainerStyles = () => {
    const colors = getColorStyles();
    
    const sizeMap = {
      compact: {
        padding: 'var(--space-3)',
        minHeight: '100px'
      },
      normal: {
        padding: 'var(--space-4)',
        minHeight: '140px'
      },
      expanded: {
        padding: 'var(--space-5)',
        minHeight: '180px'
      },
      large: {
        padding: 'var(--space-6)',
        minHeight: '220px'
      }
    };
    
    return normalizeStyle({
      display: 'flex',
      flexDirection: layout === 'horizontal' ? 'row' : 'column',
      alignItems: layout === 'horizontal' ? 'center' : 'flex-start',
      gap: layout === 'horizontal' ? 'var(--space-4)' : 'var(--space-2)',
      fontFamily: 'var(--font-family-base)',
      borderRadius: 'var(--border-radius-lg)',
      cursor: clickable ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'default' && {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }),
      
      ...(variant === 'outlined' && {
        backgroundColor: 'var(--color-surface)',
        border: `2px solid ${colors.main}`,
        boxShadow: 'none'
      }),
      
      ...(variant === 'filled' && {
        backgroundColor: colors.light,
        border: 'none',
        color: colors.dark
      }),
      
      ...(variant === 'glass' && {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: 'var(--shadow-lg)'
      }),
      
      // Hover states
      ...(clickable && isHovered && {
        transform: 'translateY(-2px)',
        boxShadow: 'var(--shadow-lg)'
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        borderLeft: `4px solid ${colors.main}`,
        boxShadow: 'var(--shadow-md)'
      }),
      
      ...(theme === 'dashboard' && {
        backgroundColor: 'var(--color-background-secondary)',
        border: 'none',
        borderRadius: 'var(--border-radius-xl)'
      }),
      
      // Loading state
      ...(loading && {
        opacity: 0.7,
        pointerEvents: 'none'
      })
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: layout === 'vertical' ? 'var(--space-2)' : 0
    });
  };
  
  // Icon container styles
  const getIconContainerStyles = () => {
    const colors = getColorStyles();
    
    const sizeMap = {
      compact: { width: '32px', height: '32px', fontSize: '16px' },
      normal: { width: '40px', height: '40px', fontSize: '20px' },
      expanded: { width: '48px', height: '48px', fontSize: '24px' },
      large: { width: '56px', height: '56px', fontSize: '28px' }
    };
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      backgroundColor: variant === 'filled' ? 'rgba(255,255,255,0.2)' : colors.light,
      color: variant === 'filled' ? 'inherit' : colors.main,
      flexShrink: 0,
      
      ...sizeMap[size]
    });
  };
  
  // Title styles
  const getTitleStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      color: variant === 'filled' ? 'inherit' : 'var(--color-text-muted)',
      margin: 0,
      lineHeight: 1.2
    });
  };
  
  // Value styles
  const getValueStyles = () => {
    const sizeMap = {
      compact: 'var(--font-size-lg)',
      normal: 'var(--font-size-xl)',
      expanded: 'var(--font-size-2xl)',
      large: 'var(--font-size-3xl)'
    };
    
    return normalizeStyle({
      fontSize: sizeMap[size],
      fontWeight: 'var(--font-weight-bold)',
      color: variant === 'filled' ? 'inherit' : 'var(--color-text-primary)',
      margin: 'var(--space-1) 0',
      lineHeight: 1.1,
      fontFeatureSettings: '"tnum"' // Tabular numbers
    });
  };
  
  // Trend indicator styles
  const getTrendStyles = (trend) => {
    let trendColor = 'var(--color-text-muted)';
    if (trend?.isPositive) trendColor = 'var(--color-success)';
    if (trend?.isNegative) trendColor = 'var(--color-danger)';
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: trendColor,
      cursor: onTrendClick ? 'pointer' : 'default'
    });
  };
  
  // Mini chart styles
  const getMiniChartStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: '40px',
      marginTop: 'var(--space-2)'
    });
  };
  
  // Status indicator styles
  const getStatusIndicatorStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: 'var(--space-2)',
      right: 'var(--space-2)',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: getStatusColor()
    });
  };
  
  // Render mini chart
  const renderMiniChart = () => {
    if (!showMiniChart || !chartData.length) return null;
    
    const colors = getColorStyles();
    const chartHeight = 40;
    const chartWidth = 120;
    
    const maxValue = Math.max(...chartData);
    const minValue = Math.min(...chartData);
    const range = maxValue - minValue || 1;
    
    if (chartType === 'line') {
      const points = chartData.map((value, index) => {
        const x = (index / (chartData.length - 1)) * chartWidth;
        const y = chartHeight - ((value - minValue) / range) * chartHeight;
        return `${x},${y}`;
      }).join(' ');
      
      return (
        <div style={getMiniChartStyles()}>
          <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            <polyline
              points={points}
              fill="none"
              stroke={colors.main}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    }
    
    if (chartType === 'bar') {
      const barWidth = chartWidth / chartData.length;
      
      return (
        <div style={getMiniChartStyles()}>
          <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {chartData.map((value, index) => {
              const barHeight = (value / maxValue) * chartHeight;
              const x = index * barWidth;
              const y = chartHeight - barHeight;
              
              return (
                <rect
                  key={index}
                  x={x + 1}
                  y={y}
                  width={barWidth - 2}
                  height={barHeight}
                  fill={colors.main}
                  opacity={0.7}
                />
              );
            })}
          </svg>
        </div>
      );
    }
    
    return null;
  };
  
  // Trend icons
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
  
  const TrendNeutralIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  // Calculate display value
  const getDisplayValue = () => {
    if (loading) return '---';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') {
      return animatedValue.toLocaleString(undefined, {
        minimumFractionDigits: value % 1 === 0 ? 0 : 1,
        maximumFractionDigits: value % 1 === 0 ? 0 : 2
      });
    }
    return value;
  };
  
  const trend = calculateTrend();
  
  if (loading) {
    return (
      <div style={normalizeStyle({
        ...getContainerStyles(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      })}>
        <div style={{ color: 'var(--color-text-muted)' }}>Loading...</div>
      </div>
    );
  }
  
  return (
    <div
      ref={ref}
      className={`vistara-metrics-card vistara-metrics-card--${variant} vistara-metrics-card--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Status indicator */}
      {status !== 'normal' && <div style={getStatusIndicatorStyles()} />}
      
      {/* Header */}
      <div style={getHeaderStyles()}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && <div style={getTitleStyles()}>{title}</div>}
          
          {/* Main value */}
          <div style={getValueStyles()}>
            {getDisplayValue()}
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
          
          {/* Trend indicator */}
          {trend && (
            <div style={getTrendStyles(trend)} onClick={onTrendClick}>
              {trend.isPositive && <TrendUpIcon />}
              {trend.isNegative && <TrendDownIcon />}
              {trend.isNeutral && <TrendNeutralIcon />}
              <span>{trend.displayValue}</span>
              {trendPeriod && (
                <span style={{ opacity: 0.7 }}>({trendPeriod})</span>
              )}
            </div>
          )}
          
          {/* Comparison */}
          {comparison !== undefined && (
            <div style={normalizeStyle({
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-1)'
            })}>
              {comparisonLabel || 'vs previous'}: {comparison}
            </div>
          )}
          
          {/* Target/Threshold */}
          {(target !== undefined || threshold !== undefined) && (
            <div style={normalizeStyle({
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-1)'
            })}>
              {target !== undefined && `Target: ${target}`}
              {threshold !== undefined && `Threshold: ${threshold}`}
            </div>
          )}
        </div>
        
        {/* Icon */}
        {icon && (
          <div style={getIconContainerStyles()}>
            {icon}
          </div>
        )}
      </div>
      
      {/* Mini chart */}
      {renderMiniChart()}
      
      {/* Last updated */}
      {lastUpdated && (
        <div style={normalizeStyle({
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          marginTop: 'var(--space-2)',
          textAlign: layout === 'horizontal' ? 'right' : 'left'
        })}>
          Updated: {lastUpdated}
        </div>
      )}
    </div>
  );
});

MetricsCard.displayName = 'MetricsCard';

export default MetricsCard;