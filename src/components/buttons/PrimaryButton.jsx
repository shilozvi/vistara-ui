/**
 * 🎯 Vistara UI - PrimaryButton Component
 * "Command your Design."
 * 
 * כפתור ראשי מתקדם עם states ואפקטים
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const PrimaryButton = forwardRef(({ 
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
  variant = 'solid', // 'solid', 'outlined', 'ghost'
  
  // Interaction
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  
  // Standard props
  type = 'button',
  className,
  style,
  ...props
}, ref) => {
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none"
      style={{
        animation: 'spin 1s linear infinite'
      }}
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
    border: '1px solid transparent',
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
    overflow: 'hidden',
    
    // Focus styles
    ':focus': {
      outline: '2px solid var(--color-primary)',
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
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
          borderColor: 'var(--color-primary)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-hover)',
            borderColor: 'var(--color-primary-hover)',
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-md)'
          } : {},
          ':active': !disabled && !loading ? {
            transform: 'translateY(0)',
            boxShadow: 'var(--shadow-sm)'
          } : {}
        },
        outlined: {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          borderColor: 'var(--color-primary)',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-light)',
            borderColor: 'var(--color-primary-hover)'
          } : {}
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          borderColor: 'transparent',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-light)'
          } : {}
        }
      },
      minimal: {
        solid: {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
          borderColor: 'var(--color-primary)',
          boxShadow: 'none',
          ':hover': !disabled && !loading ? {
            opacity: 0.9
          } : {}
        },
        outlined: {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          borderColor: 'var(--color-border)',
          ':hover': !disabled && !loading ? {
            borderColor: 'var(--color-primary)'
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
      detailed: {
        solid: {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-contrast)',
          borderColor: 'var(--color-primary)',
          boxShadow: 'var(--shadow-lg)',
          backgroundImage: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          ':hover': !disabled && !loading ? {
            boxShadow: 'var(--shadow-xl)',
            transform: 'translateY(-2px)'
          } : {},
          ':active': !disabled && !loading ? {
            transform: 'translateY(0)',
            boxShadow: 'var(--shadow-md)'
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
            transform: 'translateY(-1px)',
            boxShadow: 'var(--shadow-md)'
          } : {}
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          borderColor: 'transparent',
          ':hover': !disabled && !loading ? {
            backgroundColor: 'var(--color-primary-light)',
            borderColor: 'var(--color-primary-light)',
            borderWidth: '1px'
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
      borderColor: 'var(--color-primary-dark)'
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
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      className={`vistara-primary-button ${className || ''}`}
      style={buttonStyles}
      {...props}
    >
      {/* Loading state */}
      {loading && (
        <LoadingSpinner />
      )}
      
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
      
      {/* Ripple effect (detailed theme only) */}
      {theme === 'detailed' && (
        <span 
          className="vistara-button-ripple"
          style={normalizeStyle({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            borderRadius: 'inherit',
            pointerEvents: 'none'
          })}
        />
      )}
      
      {/* Loading text */}
      {loading && theme === 'detailed' && (
        <span style={normalizeStyle({
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          whiteSpace: 'nowrap'
        })}>
          Loading...
        </span>
      )}
    </button>
  );
});

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;