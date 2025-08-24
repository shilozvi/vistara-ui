/**
 * 🎯 Vistara UI - Badge Component
 * "Command your Design."
 * 
 * תג/תווית מתקדמת למידע ומצבים
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Badge = forwardRef(({ 
  // Content
  children,
  text,
  count,
  max = 99,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'filled', // 'filled', 'outlined', 'dot', 'pill'
  color = 'primary', // 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'
  
  // Behavior
  showZero = false,
  animated = false,
  pulse = false,
  
  // Layout
  position = 'relative', // 'relative', 'absolute'
  placement = 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  offset = { x: 0, y: 0 }, // { x: number, y: number }
  
  // Content
  icon,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  // Determine display text
  const getDisplayText = () => {
    if (text) return text;
    if (typeof count === 'number') {
      if (count === 0 && !showZero) return null;
      return count > max ? `${max}+` : count.toString();
    }
    return null;
  };
  
  const displayText = getDisplayText();
  const isDot = variant === 'dot';
  const showBadge = isDot || displayText !== null || icon;
  
  if (!showBadge) {
    return children || null;
  }
  
  // Color mapping
  const getColorStyles = () => {
    const colorMap = {
      primary: {
        bg: 'var(--color-primary)',
        text: 'var(--color-primary-contrast)',
        border: 'var(--color-primary-dark)'
      },
      secondary: {
        bg: 'var(--color-secondary)',
        text: 'var(--color-secondary-contrast)',
        border: 'var(--color-secondary-dark)'
      },
      success: {
        bg: 'var(--color-success)',
        text: 'var(--color-success-contrast)',
        border: 'var(--color-success-dark)'
      },
      warning: {
        bg: 'var(--color-warning)',
        text: 'var(--color-warning-contrast)',
        border: 'var(--color-warning-dark)'
      },
      danger: {
        bg: 'var(--color-danger)',
        text: 'var(--color-danger-contrast)',
        border: 'var(--color-danger-dark)'
      },
      info: {
        bg: 'var(--color-info)',
        text: 'var(--color-info-contrast)',
        border: 'var(--color-info-dark)'
      },
      neutral: {
        bg: 'var(--color-gray-500)',
        text: 'var(--color-white)',
        border: 'var(--color-gray-600)'
      }
    };
    
    return colorMap[color] || colorMap.primary;
  };
  
  // Badge container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      display: 'inline-block'
    });
  };
  
  // Badge styles
  const getBadgeStyles = () => {
    const colors = getColorStyles();
    
    const sizeMap = {
      compact: {
        minWidth: '16px',
        height: '16px',
        fontSize: 'var(--font-size-xs)',
        padding: '0 4px'
      },
      normal: {
        minWidth: '20px',
        height: '20px',
        fontSize: 'var(--font-size-xs)',
        padding: '0 6px'
      },
      expanded: {
        minWidth: '24px',
        height: '24px',
        fontSize: 'var(--font-size-sm)',
        padding: '0 8px'
      }
    };
    
    const placementMap = {
      'top-left': {
        top: `calc(-${sizeMap[size].height} / 2 + ${offset.y}px)`,
        left: `calc(-${sizeMap[size].minWidth} / 2 + ${offset.x}px)`
      },
      'top-right': {
        top: `calc(-${sizeMap[size].height} / 2 + ${offset.y}px)`,
        right: `calc(-${sizeMap[size].minWidth} / 2 - ${offset.x}px)`
      },
      'bottom-left': {
        bottom: `calc(-${sizeMap[size].height} / 2 - ${offset.y}px)`,
        left: `calc(-${sizeMap[size].minWidth} / 2 + ${offset.x}px)`
      },
      'bottom-right': {
        bottom: `calc(-${sizeMap[size].height} / 2 - ${offset.y}px)`,
        right: `calc(-${sizeMap[size].minWidth} / 2 - ${offset.x}px)`
      }
    };
    
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-family-base)',
      fontWeight: 'var(--font-weight-semibold)',
      lineHeight: 1,
      borderRadius: variant === 'pill' ? '999px' : isDot ? '50%' : 'var(--border-radius-md)',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      
      // Size
      ...sizeMap[size],
      
      // Dot variant adjustments
      ...(isDot && {
        width: sizeMap[size].height,
        minWidth: sizeMap[size].height,
        padding: 0
      }),
      
      // Position
      ...(position === 'absolute' && {
        position: 'absolute',
        zIndex: 10,
        ...placementMap[placement]
      }),
      
      // Variant styles
      ...(variant === 'filled' && {
        backgroundColor: colors.bg,
        color: colors.text,
        border: 'none'
      }),
      
      ...(variant === 'outlined' && {
        backgroundColor: 'transparent',
        color: colors.bg,
        border: `1px solid ${colors.bg}`
      }),
      
      ...(variant === 'dot' && {
        backgroundColor: colors.bg,
        border: '2px solid var(--color-surface)'
      }),
      
      ...(variant === 'pill' && {
        backgroundColor: colors.bg,
        color: colors.text,
        border: 'none'
      }),
      
      // Animation
      ...(animated && {
        transition: 'all 0.3s ease'
      }),
      
      ...(pulse && {
        animation: 'pulse 2s infinite'
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        boxShadow: `0 2px 4px ${colors.bg}40`
      }),
      
      ...(theme === 'minimal' && variant === 'filled' && {
        backgroundColor: `${colors.bg}15`,
        color: colors.bg,
        border: 'none'
      })
    };
    
    return normalizeStyle(baseStyles);
  };
  
  // Icon styles
  const getIconStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      marginRight: displayText ? 'var(--space-1)' : 0
    });
  };
  
  return (
    <span
      ref={ref}
      className={`vistara-badge-container ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {children}
      
      <span
        className={`vistara-badge vistara-badge--${variant} vistara-badge--${color} vistara-badge--${size}`}
        style={getBadgeStyles()}
      >
        {icon && !isDot && (
          <span style={getIconStyles()}>
            {icon}
          </span>
        )}
        
        {!isDot && displayText}
      </span>
      
      {/* Pulse animation */}
      {pulse && (
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}</style>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;