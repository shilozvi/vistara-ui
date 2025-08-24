/**
 * 🎯 Vistara UI - IconButton Component
 * "Command your Design."
 * 
 * כפתור אייקון עגול או מרובע
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const IconButton = forwardRef(({ 
  // Content
  icon,
  children, // fallback if no icon
  
  // States
  disabled = false,
  loading = false,
  active = false,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'ghost', // 'solid', 'outlined', 'ghost'
  shape = 'rounded', // 'rounded', 'square', 'circle'
  
  // Interaction
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  tooltip,
  
  // Standard props
  type = 'button',
  className,
  style,
  ...props
}, ref) => {
  
  // Loading spinner
  const LoadingSpinner = () => (
    <svg 
      width="16" 
      height="16" 
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
  
  // Base styles
  const baseStyles = normalizeStyle({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    fontFamily: 'var(--font-family-base)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
    flexShrink: 0,
    
    ':focus': {
      outline: '2px solid var(--color-primary-light)',
      outlineOffset: '2px'
    }
  });
  
  // Size variants
  const sizeStyles = {
    compact: normalizeStyle({
      width: '32px',
      height: '32px',
      fontSize: 'var(--font-size-sm)',
      padding: 'var(--space-2)'
    }),
    normal: normalizeStyle({
      width: '40px',
      height: '40px',
      fontSize: 'var(--font-size-base)',
      padding: 'var(--space-3)'
    }),
    expanded: normalizeStyle({
      width: '48px',
      height: '48px',
      fontSize: 'var(--font-size-lg)',
      padding: 'var(--space-4)'
    })
  };
  
  // Shape variants
  const shapeStyles = {
    rounded: {
      borderRadius: 'var(--border-radius-md)'
    },
    square: {
      borderRadius: 'var(--border-radius-sm)'
    },
    circle: {
      borderRadius: '50%'
    }
  };
  
  // Theme + Variant combinations
  const getThemeStyles = () => {
    const base = {
      default: {
        solid: {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
          borderColor: 'var(--color-primary)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-hover)',
            transform: 'scale(1.05)',
            boxShadow: 'var(--shadow-md)'
          } : {}
        },
        outlined: {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          borderColor: 'var(--color-border)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-light)',
            borderColor: 'var(--color-primary)'
          } : {}
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          borderColor: 'transparent',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-background-secondary)',
            color: 'var(--color-primary)'
          } : {}
        }
      },
      minimal: {
        solid: {
          backgroundColor: 'var(--color-background-secondary)',
          color: 'var(--color-text-primary)',
          borderColor: 'var(--color-border)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-background-tertiary)'
          } : {}
        },
        outlined: {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          borderColor: 'var(--color-border)',
          ':hover': !disabled && !loading ? {
            borderColor: 'var(--color-text-muted)'
          } : {}
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          borderColor: 'transparent',
          ':hover': !disabled && !loading ? {
            color: 'var(--color-text-primary)'
          } : {}
        }
      },
      detailed: {
        solid: {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
          borderColor: 'var(--color-primary)',
          boxShadow: 'var(--shadow-lg)',
          backgroundImage: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          ':hover': !disabled && !loading ? {
            transform: 'scale(1.1) rotate(3deg)',
            boxShadow: 'var(--shadow-xl)'
          } : {}
        },
        outlined: {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          borderColor: 'var(--color-primary)',
          borderWidth: '2px',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-contrast)',
            transform: 'scale(1.05)'
          } : {}
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          borderColor: 'transparent',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            transform: 'scale(1.05)',
            borderColor: 'var(--color-primary-light)'
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
      cursor: 'not-allowed'
    }),
    ...(loading && {
      cursor: 'wait'
    }),
    ...(active && {
      backgroundColor: 'var(--color-primary-dark)',
      borderColor: 'var(--color-primary-dark)',
      transform: 'scale(0.95)'
    })
  });
  
  // Combined styles
  const buttonStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...shapeStyles[shape],
    ...getThemeStyles(),
    ...stateStyles,
    ...style
  };
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={loading ? undefined : onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-label={ariaLabel || tooltip}
      aria-describedby={ariaDescribedBy}
      title={tooltip}
      className={`vistara-icon-button ${className || ''}`}
      style={buttonStyles}
      {...props}
    >
      {/* Loading state */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        // Icon or children
        icon || children
      )}
      
      {/* Pulse effect for detailed theme */}
      {theme === 'detailed' && !disabled && !loading && (
        <span 
          style={normalizeStyle({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            animation: active ? 'pulse 1s infinite' : 'none',
            backgroundColor: 'var(--color-primary)',
            opacity: 0.3,
            pointerEvents: 'none'
          })}
        />
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;