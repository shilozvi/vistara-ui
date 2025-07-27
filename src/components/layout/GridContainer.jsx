/**
 * 🎯 Vistara UI - GridContainer Component
 * "Command your Design."
 * 
 * מערכת גריד רספונסיבית ומתקדמת
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const GridContainer = forwardRef(({ 
  // Grid configuration
  columns = 'auto', // number, 'auto', or custom grid-template-columns
  rows = 'auto', // number, 'auto', or custom grid-template-rows
  gap = 'normal', // 'none', 'compact', 'normal', 'spacious', or custom value
  
  // Responsive breakpoints
  responsive = {}, // { sm: { columns: 2 }, md: { columns: 3 }, lg: { columns: 4 } }
  
  // Alignment
  justifyItems = 'stretch', // 'start', 'end', 'center', 'stretch'
  alignItems = 'stretch', // 'start', 'end', 'center', 'stretch'
  justifyContent = 'start', // 'start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'
  alignContent = 'start', // 'start', 'end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly'
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  
  // Layout behavior
  autoFit = false, // Auto-fit columns based on min-width
  autoFill = false, // Auto-fill columns based on min-width
  minColumnWidth = '250px', // Minimum column width for auto-fit/auto-fill
  maxColumnWidth = '1fr', // Maximum column width for auto-fit/auto-fill
  
  // Content
  children,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  // Convert gap to CSS value
  const getGapValue = () => {
    const gapMap = {
      none: '0',
      compact: 'var(--space-2)',
      normal: 'var(--space-4)',
      spacious: 'var(--space-6)'
    };
    
    if (typeof gap === 'string' && gapMap[gap]) {
      return gapMap[gap];
    }
    
    return gap;
  };
  
  // Generate grid template columns
  const getGridTemplateColumns = () => {
    if (autoFit) {
      return `repeat(auto-fit, minmax(${minColumnWidth}, ${maxColumnWidth}))`;
    }
    
    if (autoFill) {
      return `repeat(auto-fill, minmax(${minColumnWidth}, ${maxColumnWidth}))`;
    }
    
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    
    if (columns === 'auto') {
      return 'auto';
    }
    
    return columns;
  };
  
  // Generate grid template rows
  const getGridTemplateRows = () => {
    if (typeof rows === 'number') {
      return `repeat(${rows}, auto)`;
    }
    
    if (rows === 'auto') {
      return 'auto';
    }
    
    return rows;
  };
  
  // Generate responsive styles
  const getResponsiveStyles = () => {
    const breakpoints = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    };
    
    let responsiveCSS = '';
    
    Object.entries(responsive).forEach(([breakpoint, config]) => {
      const minWidth = breakpoints[breakpoint];
      if (!minWidth) return;
      
      responsiveCSS += `
        @media (min-width: ${minWidth}) {
          .vistara-grid-responsive {
            ${config.columns ? `grid-template-columns: ${
              typeof config.columns === 'number' 
                ? `repeat(${config.columns}, 1fr)` 
                : config.columns
            };` : ''}
            ${config.rows ? `grid-template-rows: ${
              typeof config.rows === 'number' 
                ? `repeat(${config.rows}, auto)` 
                : config.rows
            };` : ''}
            ${config.gap ? `gap: ${
              typeof config.gap === 'string' && ['none', 'compact', 'normal', 'spacious'].includes(config.gap)
                ? getGapValue() 
                : config.gap
            };` : ''}
          }
        }
      `;
    });
    
    return responsiveCSS;
  };
  
  // Base grid styles
  const getGridStyles = () => {
    return normalizeStyle({
      display: 'grid',
      gridTemplateColumns: getGridTemplateColumns(),
      gridTemplateRows: getGridTemplateRows(),
      gap: getGapValue(),
      justifyItems,
      alignItems,
      justifyContent,
      alignContent,
      width: '100%',
      
      // Size adjustments
      ...(size === 'compact' && {
        gap: gap === 'normal' ? 'var(--space-2)' : getGapValue()
      }),
      
      ...(size === 'expanded' && {
        gap: gap === 'normal' ? 'var(--space-6)' : getGapValue()
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        padding: 'var(--space-1)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        backgroundColor: 'var(--color-background-secondary)'
      }),
      
      ...(theme === 'minimal' && {
        gap: gap === 'normal' ? 'var(--space-3)' : getGapValue()
      })
    });
  };
  
  return (
    <>
      <div
        ref={ref}
        className={`vistara-grid vistara-grid--${size} vistara-grid-responsive ${className || ''}`}
        style={{ ...getGridStyles(), ...style }}
        {...props}
      >
        {children}
      </div>
      
      {/* Responsive CSS */}
      {Object.keys(responsive).length > 0 && (
        <style jsx>{getResponsiveStyles()}</style>
      )}
    </>
  );
});

GridContainer.displayName = 'GridContainer';

export default GridContainer;