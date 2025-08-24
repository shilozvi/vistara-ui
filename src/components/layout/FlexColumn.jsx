/**
 * 🎯 Vistara UI - FlexColumn Component
 * "Command your Design."
 * 
 * רכיב פריסה גמיש לעמודות עם Flexbox מתקדם
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const FlexColumn = forwardRef(({ 
  // Content
  children,
  
  // Flexbox properties
  justify = 'flex-start', // 'flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'
  align = 'stretch', // 'flex-start', 'center', 'flex-end', 'stretch', 'baseline'
  wrap = 'nowrap', // 'nowrap', 'wrap', 'wrap-reverse'
  direction = 'column', // 'column', 'column-reverse'
  
  // Spacing
  gap = 'normal', // 'none', 'compact', 'normal', 'expanded', 'large', or custom string/number
  
  // Responsive behavior
  responsive = false,
  breakpoint = 'md', // 'sm', 'md', 'lg' - when to change to row
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'contained', 'bordered'
  
  // Layout options
  fullWidth = false,
  fullHeight = false,
  
  // Overflow handling
  overflow = 'visible', // 'visible', 'hidden', 'scroll', 'auto'
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  // Gap mapping
  const getGapValue = () => {
    if (typeof gap === 'string') {
      const gapMap = {
        none: '0',
        compact: 'var(--space-1)',
        normal: 'var(--space-3)',
        expanded: 'var(--space-4)',
        large: 'var(--space-6)'
      };
      return gapMap[gap] || gap;
    }
    return typeof gap === 'number' ? `${gap}px` : gap;
  };
  
  // Responsive breakpoint mapping
  const getBreakpointValue = () => {
    const breakpointMap = {
      sm: '640px',
      md: '768px',
      lg: '1024px'
    };
    return breakpointMap[breakpoint] || breakpoint;
  };
  
  // Container styles
  const getContainerStyles = () => {
    const sizeMap = {
      compact: {
        padding: theme === 'detailed' ? 'var(--space-2)' : '0'
      },
      normal: {
        padding: theme === 'detailed' ? 'var(--space-3)' : '0'
      },
      expanded: {
        padding: theme === 'detailed' ? 'var(--space-4)' : '0'
      }
    };
    
    return normalizeStyle({
      display: 'flex',
      flexDirection: direction,
      justifyContent: justify,
      alignItems: align,
      flexWrap: wrap,
      gap: getGapValue(),
      fontFamily: 'var(--font-family-base)',
      overflow: overflow,
      
      // Size variations
      ...sizeMap[size],
      
      // Layout options
      ...(fullWidth && { width: '100%' }),
      ...(fullHeight && { height: '100%' }),
      
      // Variant styles
      ...(variant === 'contained' && {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-lg)'
      }),
      
      ...(variant === 'bordered' && {
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)'
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        backgroundColor: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-xl)',
        boxShadow: 'var(--shadow-sm)'
      }),
      
      // Responsive behavior
      ...(responsive && {
        [`@media (max-width: ${getBreakpointValue()})`]: {
          flexDirection: direction.includes('reverse') ? 'row-reverse' : 'row',
          alignItems: align === 'stretch' ? 'stretch' : 'flex-start'
        }
      })
    });
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-flex-column vistara-flex-column--${variant} vistara-flex-column--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {children}
    </div>
  );
});

FlexColumn.displayName = 'FlexColumn';

export default FlexColumn;