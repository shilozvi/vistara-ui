/**
 * 🎯 Vistara UI - Card Component
 * "Command your Design."
 * 
 * רכיב כרטיס בסיסי ומגוון לתוכן
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Card = forwardRef(({ 
  // Content
  children,
  title,
  subtitle,
  header,
  footer,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'elevated', // 'elevated', 'outlined', 'filled', 'flat'
  
  // Layout
  padding = 'normal', // 'none', 'compact', 'normal', 'spacious'
  hoverable = false,
  clickable = false,
  
  // Interactions
  onClick,
  onMouseEnter,
  onMouseLeave,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  // Base card styles
  const getCardStyles = () => {
    const baseStyles = {
      display: 'block',
      fontFamily: 'var(--font-family-base)',
      borderRadius: 'var(--border-radius-lg)',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      cursor: clickable ? 'pointer' : 'default',
      
      // Variant styles
      ...(variant === 'elevated' && {
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid transparent'
      }),
      
      ...(variant === 'outlined' && {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'none'
      }),
      
      ...(variant === 'filled' && {
        backgroundColor: 'var(--color-background-secondary)',
        border: '1px solid transparent',
        boxShadow: 'none'
      }),
      
      ...(variant === 'flat' && {
        backgroundColor: 'transparent',
        border: '1px solid transparent',
        boxShadow: 'none'
      }),
      
      // Hover effects
      ...(hoverable && {
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: variant === 'elevated' ? 'var(--shadow-xl)' : variant === 'outlined' ? 'var(--shadow-md)' : 'none'
        }
      }),
      
      ...(clickable && {
        ':hover': {
          transform: 'translateY(-1px)',
          boxShadow: variant === 'elevated' ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
        },
        ':active': {
          transform: 'translateY(0)',
          boxShadow: variant === 'elevated' ? 'var(--shadow-sm)' : 'none'
        }
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        ':before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-light))',
          borderRadius: 'var(--border-radius-lg) var(--border-radius-lg) 0 0'
        }
      })
    };
    
    return normalizeStyle(baseStyles);
  };
  
  // Content container styles
  const getContentStyles = () => {
    const paddingMap = {
      none: '0',
      compact: 'var(--space-3)',
      normal: 'var(--space-4)',
      spacious: 'var(--space-6)'
    };
    
    return normalizeStyle({
      padding: paddingMap[padding],
      
      // Size adjustments
      ...(size === 'compact' && {
        padding: padding === 'normal' ? 'var(--space-3)' : paddingMap[padding]
      }),
      ...(size === 'expanded' && {
        padding: padding === 'normal' ? 'var(--space-5)' : paddingMap[padding]
      })
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      padding: getContentStyles().padding,
      paddingBottom: children ? 'var(--space-3)' : getContentStyles().padding,
      borderBottom: children ? '1px solid var(--color-border)' : 'none'
    });
  };
  
  // Title styles
  const getTitleStyles = () => {
    return normalizeStyle({
      margin: 0,
      fontSize: size === 'compact' ? 'var(--font-size-lg)' : size === 'expanded' ? 'var(--font-size-2xl)' : 'var(--font-size-xl)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)',
      lineHeight: 1.3
    });
  };
  
  // Subtitle styles
  const getSubtitleStyles = () => {
    return normalizeStyle({
      margin: 0,
      marginTop: 'var(--space-1)',
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-normal)',
      color: 'var(--color-text-secondary)',
      lineHeight: 1.4
    });
  };
  
  // Footer styles
  const getFooterStyles = () => {
    return normalizeStyle({
      padding: getContentStyles().padding,
      paddingTop: children ? 'var(--space-3)' : getContentStyles().padding,
      borderTop: children ? '1px solid var(--color-border)' : 'none',
      backgroundColor: theme === 'minimal' ? 'transparent' : 'var(--color-background-secondary)'
    });
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-card vistara-card--${variant} vistara-card--${size} ${className || ''}`}
      style={{ ...getCardStyles(), ...style }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {/* Header Section */}
      {(header || title || subtitle) && (
        <div style={getHeaderStyles()}>
          {header || (
            <div>
              {title && (
                <h3 style={getTitleStyles()}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p style={getSubtitleStyles()}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Main Content */}
      {children && (
        <div style={getContentStyles()}>
          {children}
        </div>
      )}
      
      {/* Footer Section */}
      {footer && (
        <div style={getFooterStyles()}>
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;