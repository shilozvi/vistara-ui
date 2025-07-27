/**
 * 🎯 Vistara UI - StatsCard Component
 * "Command your Design."
 * 
 * כרטיס סטטיסטיקות מתקדם עם אינדיקטורים וויזואליות
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const StatsCard = forwardRef(({ 
  // Content
  title,
  value,
  subtitle,
  description,
  
  // Trend & Change
  change,
  changeType = 'percentage', // 'percentage', 'value', 'custom'
  trend = 'neutral', // 'up', 'down', 'neutral'
  trendLabel,
  
  // Visual elements
  icon,
  color = 'primary', // 'primary', 'success', 'warning', 'danger', 'info', 'neutral'
  
  // Progress/Chart
  progress, // 0-100 for progress bar
  progressLabel,
  chart, // Custom chart component
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded', 'large'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'outlined', 'filled', 'gradient'
  
  // Layout
  layout = 'vertical', // 'vertical', 'horizontal'
  
  // Behavior
  loading = false,
  clickable = false,
  
  // Callbacks
  onClick,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  // Color mapping
  const getColorStyles = () => {
    const colorMap = {
      primary: {
        main: 'var(--color-primary)',
        light: 'var(--color-primary-light)',
        dark: 'var(--color-primary-dark)',
        contrast: 'var(--color-primary-contrast)'
      },
      success: {
        main: 'var(--color-success)',
        light: 'var(--color-success-light)',
        dark: 'var(--color-success-dark)',
        contrast: 'var(--color-success-contrast)'
      },
      warning: {
        main: 'var(--color-warning)',
        light: 'var(--color-warning-light)',
        dark: 'var(--color-warning-dark)',
        contrast: 'var(--color-warning-contrast)'
      },
      danger: {
        main: 'var(--color-danger)',
        light: 'var(--color-danger-light)',
        dark: 'var(--color-danger-dark)',
        contrast: 'var(--color-danger-contrast)'
      },
      info: {
        main: 'var(--color-info)',
        light: 'var(--color-info-light)',
        dark: 'var(--color-info-dark)',
        contrast: 'var(--color-info-contrast)'
      },
      neutral: {
        main: 'var(--color-gray-500)',
        light: 'var(--color-gray-100)',
        dark: 'var(--color-gray-700)',
        contrast: 'var(--color-white)'
      }
    };
    
    return colorMap[color] || colorMap.primary;
  };
  
  // Trend color mapping
  const getTrendColor = () => {
    const trendMap = {
      up: 'var(--color-success)',
      down: 'var(--color-danger)',
      neutral: 'var(--color-text-muted)'
    };
    
    return trendMap[trend] || trendMap.neutral;
  };
  
  // Card container styles
  const getCardStyles = () => {
    const colors = getColorStyles();
    
    const sizeMap = {
      compact: {
        padding: 'var(--space-3)',
        minHeight: '80px'
      },
      normal: {
        padding: 'var(--space-4)',
        minHeight: '120px'
      },
      expanded: {
        padding: 'var(--space-5)',
        minHeight: '160px'
      },
      large: {
        padding: 'var(--space-6)',
        minHeight: '200px'
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
      
      ...(variant === 'gradient' && {
        background: `linear-gradient(135deg, ${colors.main} 0%, ${colors.dark} 100%)`,
        border: 'none',
        color: colors.contrast
      }),
      
      // Clickable states
      ...(clickable && {
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: variant === 'gradient' ? 'var(--shadow-xl)' : 'var(--shadow-lg)'
        }
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        boxShadow: 'var(--shadow-lg)',
        borderLeft: `4px solid ${colors.main}`
      }),
      
      // Loading state
      ...(loading && {
        opacity: 0.7,
        pointerEvents: 'none'
      })
    });
  };
  
  // Header section styles
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
      backgroundColor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : colors.light,
      color: variant === 'gradient' ? colors.contrast : colors.main,
      flexShrink: 0,
      
      ...sizeMap[size]
    });
  };
  
  // Title styles
  const getTitleStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      color: variant === 'gradient' ? 'inherit' : 'var(--color-text-muted)',
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
      color: variant === 'gradient' ? 'inherit' : 'var(--color-text-primary)',
      margin: 'var(--space-1) 0',
      lineHeight: 1.1
    });
  };
  
  // Change indicator styles
  const getChangeStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: getTrendColor()
    });
  };
  
  // Progress bar styles
  const getProgressStyles = () => {
    const colors = getColorStyles();
    
    return normalizeStyle({
      width: '100%',
      height: '4px',
      backgroundColor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : 'var(--color-background-secondary)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: 'var(--space-2)'
    });
  };
  
  const getProgressFillStyles = () => {
    const colors = getColorStyles();
    
    return normalizeStyle({
      height: '100%',
      width: `${Math.min(Math.max(progress || 0, 0), 100)}%`,
      backgroundColor: variant === 'gradient' ? colors.contrast : colors.main,
      transition: 'width 0.3s ease'
    });
  };
  
  // Description styles
  const getDescriptionStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : 'var(--color-text-muted)',
      lineHeight: 1.4,
      marginTop: 'var(--space-1)'
    });
  };
  
  // Content section styles
  const getContentStyles = () => {
    return normalizeStyle({
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: layout === 'horizontal' ? 'center' : 'flex-start',
      minWidth: 0 // Prevent flex item from overflowing
    });
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
  
  const formatChange = () => {
    if (!change && change !== 0) return null;
    
    let formattedChange = change;
    if (changeType === 'percentage') {
      formattedChange = `${change > 0 ? '+' : ''}${change}%`;
    } else if (changeType === 'value') {
      formattedChange = `${change > 0 ? '+' : ''}${change}`;
    }
    
    return formattedChange;
  };
  
  if (loading) {
    return (
      <div style={normalizeStyle({
        ...getCardStyles(),
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
      className={`vistara-stats-card vistara-stats-card--${variant} vistara-stats-card--${size} ${className || ''}`}
      style={{ ...getCardStyles(), ...style }}
      onClick={onClick}
      {...props}
    >
      {/* Header with icon and title */}
      <div style={getHeaderStyles()}>
        <div style={getContentStyles()}>
          {title && <div style={getTitleStyles()}>{title}</div>}
          
          {/* Main value */}
          {value !== undefined && (
            <div style={getValueStyles()}>
              {typeof value === 'string' || typeof value === 'number' ? value : value}
            </div>
          )}
          
          {/* Subtitle */}
          {subtitle && (
            <div style={normalizeStyle({
              fontSize: 'var(--font-size-sm)',
              color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : 'var(--color-text-secondary)',
              fontWeight: 'var(--font-weight-medium)'
            })}>
              {subtitle}
            </div>
          )}
          
          {/* Change indicator */}
          {(change !== undefined || trendLabel) && (
            <div style={getChangeStyles()}>
              {trend === 'up' && <TrendUpIcon />}
              {trend === 'down' && <TrendDownIcon />}
              <span>
                {formatChange()} {trendLabel}
              </span>
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
      
      {/* Progress bar */}
      {progress !== undefined && (
        <div>
          <div style={getProgressStyles()}>
            <div style={getProgressFillStyles()} />
          </div>
          {progressLabel && (
            <div style={normalizeStyle({
              fontSize: 'var(--font-size-xs)',
              color: variant === 'gradient' ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)',
              marginTop: 'var(--space-1)',
              textAlign: 'right'
            })}>
              {progressLabel}
            </div>
          )}
        </div>
      )}
      
      {/* Custom chart */}
      {chart && (
        <div style={{ marginTop: 'var(--space-2)' }}>
          {chart}
        </div>
      )}
      
      {/* Description */}
      {description && (
        <div style={getDescriptionStyles()}>
          {description}
        </div>
      )}
    </div>
  );
});

StatsCard.displayName = 'StatsCard';

export default StatsCard;