/**
 * 🎯 Vistara UI - SecondaryButton Component
 * "Command your Design."
 * 
 * כפתור משני לפעולות רגילות
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const SecondaryButton = forwardRef(({ 
  // Content
  children,
  leftIcon,
  rightIcon,
  
  // States
  disabled = false,
  loading = false,
  active = false,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'outlined', // 'solid', 'outlined', 'ghost'
  
  // Interaction
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  
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
    gap: 'var(--space-2)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius-md)',
    fontFamily: 'var(--font-family-base)',
    fontWeight: 'var(--font-weight-medium)',
    lineHeight: 1.5,
    textAlign: 'center',
    textDecoration: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
    
    ':focus': {
      outline: '2px solid var(--color-primary-light)',
      outlineOffset: '2px'
    }
  });
  
  // Size variants
  const sizeStyles = {
    compact: normalizeStyle({
      padding: 'var(--space-2) var(--space-3)',
      fontSize: 'var(--font-size-sm)',
      minHeight: '32px'
    }),
    normal: normalizeStyle({
      padding: 'var(--space-3) var(--space-4)',
      fontSize: 'var(--font-size-base)',
      minHeight: '40px'
    }),
    expanded: normalizeStyle({
      padding: 'var(--space-4) var(--space-6)',
      fontSize: 'var(--font-size-lg)',
      minHeight: '48px'
    })
  };
  
  // Theme + Variant combinations
  const getThemeStyles = () => {
    const base = {
      default: {
        solid: {
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-secondary-contrast)',
          borderColor: 'var(--color-secondary)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-secondary-hover)',
            borderColor: 'var(--color-secondary-hover)',
            boxShadow: 'var(--shadow-sm)'
          } : {}
        },
        outlined: {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          borderColor: 'var(--color-border)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-background-secondary)',
            borderColor: 'var(--color-border-hover)'
          } : {}
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          borderColor: 'transparent',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-background-secondary)'
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
          backgroundColor: 'var(--color-background-secondary)',
          color: 'var(--color-text-primary)',
          borderColor: 'var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-background-tertiary)',
            boxShadow: 'var(--shadow-md)',
            transform: 'translateY(-1px)'
          } : {}
        },
        outlined: {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          borderColor: 'var(--color-border)',
          borderWidth: '2px',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-background-secondary)',
            borderColor: 'var(--color-primary-light)',
            transform: 'translateY(-1px)'
          } : {}
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          borderColor: 'transparent',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-background-secondary)',
            color: 'var(--color-text-primary)',
            borderColor: 'var(--color-background-secondary)'
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
      backgroundColor: 'var(--color-background-tertiary)',
      borderColor: 'var(--color-border-hover)'
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
      className={`vistara-secondary-button ${className || ''}`}
      style={buttonStyles}
      {...props}
    >
      {/* Loading state */}
      {loading && <LoadingSpinner />}
      
      {/* Left icon */}
      {!loading && leftIcon && (
        <span className="vistara-button-left-icon">
          {leftIcon}
        </span>
      )}
      
      {/* Content */}
      {children && (
        <span className="vistara-button-content">
          {children}
        </span>
      )}
      
      {/* Right icon */}
      {!loading && rightIcon && (
        <span className="vistara-button-right-icon">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

SecondaryButton.displayName = 'SecondaryButton';

export default SecondaryButton;