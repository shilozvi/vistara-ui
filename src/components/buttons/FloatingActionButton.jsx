/**
 * 🎯 Vistara UI - FloatingActionButton Component
 * "Command your Design."
 * 
 * כפתור צף לפעולות מהירות
 */

import React, { forwardRef, useState } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const FloatingActionButton = forwardRef(({ 
  // Content
  icon,
  children,
  label,
  
  // Position
  position = 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left', 'custom'
  offset = 24, // Distance from edge in pixels
  
  // States
  disabled = false,
  loading = false,
  expanded = false, // Show label
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'solid', // 'solid', 'outlined'
  
  // Extended functionality
  actions = [], // Array of sub-actions for detailed theme
  showActions = false,
  
  // Interaction
  onClick,
  onMouseEnter,
  onMouseLeave,
  onActionClick,
  
  // Accessibility
  'aria-label': ariaLabel,
  tooltip,
  
  // Standard props
  type = 'button',
  className,
  style,
  ...props
}, ref) => {
  
  const [isHovered, setIsHovered] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(showActions);
  
  // Handle mouse events
  const handleMouseEnter = (e) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };
  
  const handleMouseLeave = (e) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };
  
  const handleClick = (e) => {
    if (actions.length > 0 && theme === 'detailed') {
      setActionsVisible(!actionsVisible);
    }
    onClick?.(e);
  };
  
  // Loading spinner
  const LoadingSpinner = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="8"
      />
    </svg>
  );
  
  // Plus icon (default)
  const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 5v14M5 12h14" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
  
  // Position styles
  const getPositionStyles = () => {
    if (position === 'custom') return {};
    
    const positions = {
      'bottom-right': {
        position: 'fixed',
        bottom: `${offset}px`,
        right: `${offset}px`,
        zIndex: 1000
      },
      'bottom-left': {
        position: 'fixed',
        bottom: `${offset}px`,
        left: `${offset}px`,
        zIndex: 1000
      },
      'top-right': {
        position: 'fixed',
        top: `${offset}px`,
        right: `${offset}px`,
        zIndex: 1000
      },
      'top-left': {
        position: 'fixed',
        top: `${offset}px`,
        left: `${offset}px`,
        zIndex: 1000
      }
    };
    
    return positions[position] || positions['bottom-right'];
  };
  
  // Base styles
  const baseStyles = normalizeStyle({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: expanded ? 'var(--space-2)' : 0,
    border: 'none',
    borderRadius: expanded ? 'var(--border-radius-xl)' : '50%',
    fontFamily: 'var(--font-family-base)',
    fontWeight: 'var(--font-weight-medium)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'var(--shadow-xl)',
    transform: isHovered && !disabled && !loading ? 'scale(1.1)' : 'scale(1)',
    
    ':focus': {
      outline: '2px solid var(--color-primary-light)',
      outlineOffset: '2px'
    },
    
    ...getPositionStyles()
  });
  
  // Size variants
  const sizeStyles = {
    compact: normalizeStyle({
      width: expanded ? 'auto' : '48px',
      height: '48px',
      fontSize: 'var(--font-size-base)',
      padding: expanded ? 'var(--space-3) var(--space-4)' : 'var(--space-3)'
    }),
    normal: normalizeStyle({
      width: expanded ? 'auto' : '56px',
      height: '56px',
      fontSize: 'var(--font-size-lg)',
      padding: expanded ? 'var(--space-4) var(--space-5)' : 'var(--space-4)'
    }),
    expanded: normalizeStyle({
      width: expanded ? 'auto' : '64px',
      height: '64px',
      fontSize: 'var(--font-size-xl)',
      padding: expanded ? 'var(--space-5) var(--space-6)' : 'var(--space-5)'
    })
  };
  
  // Theme + Variant combinations
  const getThemeStyles = () => {
    const base = {
      default: {
        solid: {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-hover)',
            boxShadow: 'var(--shadow-2xl)'
          } : {}
        },
        outlined: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-primary)',
          border: '2px solid var(--color-primary)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-light)',
            borderColor: 'var(--color-primary-hover)'
          } : {}
        }
      },
      minimal: {
        solid: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-background-secondary)'
          } : {}
        },
        outlined: {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          border: '2px solid var(--color-border)',
          backdropFilter: 'blur(10px)',
          ':hover': !disabled && !loading ? {
            borderColor: 'var(--color-text-muted)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          } : {}
        }
      },
      detailed: {
        solid: {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
          backgroundImage: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          boxShadow: 'var(--shadow-2xl)',
          ':hover': !disabled && !loading ? {
            backgroundImage: 'linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%)',
            boxShadow: 'var(--shadow-2xl), 0 0 20px var(--color-primary-light)'
          } : {},
          '::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            padding: '2px',
            background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary-dark))',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude'
          }
        },
        outlined: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-primary)',
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(var(--color-surface), var(--color-surface)), linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'content-box, border-box',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary-dark)'
          } : {}
        }
      }
    };
    
    return normalizeStyle(base[theme][variant]);
  };
  
  // State styles
  const stateStyles = normalizeStyle({
    ...(disabled && {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'scale(1)'
    }),
    ...(loading && {
      cursor: 'wait'
    })
  });
  
  // Combined styles
  const buttonStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...getThemeStyles(),
    ...stateStyles,
    ...style
  };
  
  // Action button styles
  const actionButtonStyles = (index) => normalizeStyle({
    position: 'absolute',
    bottom: actionsVisible ? `${(index + 1) * 60}px` : '0',
    right: '0',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-lg)',
    transition: 'all 0.3s ease',
    opacity: actionsVisible ? 1 : 0,
    transform: actionsVisible ? 'scale(1)' : 'scale(0.5)',
    transitionDelay: actionsVisible ? `${index * 50}ms` : '0ms',
    cursor: 'pointer',
    
    ':hover': {
      backgroundColor: 'var(--color-background-secondary)',
      transform: actionsVisible ? 'scale(1.1)' : 'scale(0.5)'
    }
  });
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Main FAB */}
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={ariaLabel || label || tooltip}
        title={tooltip || label}
        className={`vistara-fab ${className || ''}`}
        style={buttonStyles}
        {...props}
      >
        {/* Icon */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          icon || children || <PlusIcon />
        )}
        
        {/* Label (when expanded) */}
        {expanded && label && !loading && (
          <span style={{ whiteSpace: 'nowrap' }}>
            {label}
          </span>
        )}
        
        {/* Ripple effect for detailed theme */}
        {theme === 'detailed' && isHovered && !disabled && !loading && (
          <span
            style={normalizeStyle({
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              borderRadius: 'inherit',
              backgroundColor: 'var(--color-primary-light)',
              opacity: 0.3,
              transform: 'translate(-50%, -50%) scale(0)',
              animation: 'ripple 0.6s ease-out',
              pointerEvents: 'none'
            })}
          />
        )}
      </button>
      
      {/* Action buttons (detailed theme only) */}
      {theme === 'detailed' && actions.length > 0 && (
        <>
          {actions.map((action, index) => (
            <button
              key={index}
              style={actionButtonStyles(index)}
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.(action, index);
              }}
              title={action.label}
              aria-label={action.label}
            >
              {action.icon}
            </button>
          ))}
        </>
      )}
    </div>
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

export default FloatingActionButton;