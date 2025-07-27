/**
 * 🎯 Vistara UI - LoadingButton Component
 * "Command your Design."
 * 
 * כפתור עם states טעינה מתקדמים
 */

import React, { forwardRef, useState, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const LoadingButton = forwardRef(({ 
  // Content
  children,
  loadingText = 'Loading...',
  successText = 'Success!',
  errorText = 'Error',
  leftIcon,
  rightIcon,
  
  // Loading states
  loading = false,
  success = false,
  error = false,
  progress, // 0-100 for progress bar
  
  // Auto-reset success/error states
  autoReset = true,
  resetDelay = 2000,
  
  // States
  disabled = false,
  
  // Visual variants
  size = 'normal',
  theme = 'default',
  variant = 'solid',
  
  // Callbacks
  onClick,
  onLoadingComplete,
  onReset,
  
  // Standard props
  type = 'button',
  className,
  style,
  ...props
}, ref) => {
  
  const [internalSuccess, setInternalSuccess] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  
  // Handle success/error auto-reset
  useEffect(() => {
    if ((success || internalSuccess) && autoReset) {
      const timer = setTimeout(() => {
        setInternalSuccess(false);
        onReset?.();
      }, resetDelay);
      return () => clearTimeout(timer);
    }
  }, [success, internalSuccess, autoReset, resetDelay, onReset]);
  
  useEffect(() => {
    if ((error || internalError) && autoReset) {
      const timer = setTimeout(() => {
        setInternalError(false);
        onReset?.();
      }, resetDelay);
      return () => clearTimeout(timer);
    }
  }, [error, internalError, autoReset, resetDelay, onReset]);
  
  // Show progress bar when there's a progress value
  useEffect(() => {
    setShowProgress(typeof progress === 'number' && progress >= 0 && progress <= 100);
  }, [progress]);
  
  // Determine current state
  const isLoading = loading;
  const isSuccess = success || internalSuccess;
  const isError = error || internalError;
  const currentState = isLoading ? 'loading' : isSuccess ? 'success' : isError ? 'error' : 'default';
  
  // Loading animations
  const Spinner = () => (
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
  
  const Dots = () => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            animation: `bounce 1.4s infinite ease-in-out ${i * 0.16}s`
          }}
        />
      ))}
    </div>
  );
  
  const SuccessIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path 
        d="M20 6L9 17l-5-5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
  
  const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path 
        d="M6 6l12 12M6 18L18 6" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
  
  // Get current content
  const getCurrentContent = () => {
    switch (currentState) {
      case 'loading':
        return {
          text: loadingText,
          icon: theme === 'minimal' ? <Dots /> : <Spinner />
        };
      case 'success':
        return {
          text: successText,
          icon: <SuccessIcon />
        };
      case 'error':
        return {
          text: errorText,
          icon: <ErrorIcon />
        };
      default:
        return {
          text: children,
          icon: leftIcon
        };
    }
  };
  
  const currentContent = getCurrentContent();
  
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
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    
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
      minHeight: '32px',
      minWidth: '80px'
    }),
    normal: normalizeStyle({
      padding: 'var(--space-3) var(--space-4)',
      fontSize: 'var(--font-size-base)',
      minHeight: '40px',
      minWidth: '100px'
    }),
    expanded: normalizeStyle({
      padding: 'var(--space-4) var(--space-6)',
      fontSize: 'var(--font-size-lg)',
      minHeight: '48px',
      minWidth: '120px'
    })
  };
  
  // State-based colors
  const getStateStyles = () => {
    const states = {
      default: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-contrast)',
        borderColor: 'var(--color-primary)',
        ':hover': !disabled && !isLoading ? {
          backgroundColor: 'var(--color-primary-hover)'
        } : {}
      },
      loading: {
        backgroundColor: 'var(--color-info)',
        color: 'var(--color-info-contrast)',
        borderColor: 'var(--color-info)',
        cursor: 'wait'
      },
      success: {
        backgroundColor: 'var(--color-success)',
        color: 'var(--color-success-contrast)',
        borderColor: 'var(--color-success)',
        animation: theme === 'detailed' ? 'pulse 0.6s ease-in-out' : 'none'
      },
      error: {
        backgroundColor: 'var(--color-danger)',
        color: 'var(--color-danger-contrast)',
        borderColor: 'var(--color-danger)',
        animation: theme === 'detailed' ? 'shake 0.6s ease-in-out' : 'none'
      }
    };
    
    return normalizeStyle(states[currentState]);
  };
  
  // Combined styles
  const buttonStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...getStateStyles(),
    ...(disabled && { opacity: 0.6 }),
    ...style
  };
  
  // Progress bar styles
  const progressBarStyles = normalizeStyle({
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    backgroundColor: 'var(--color-primary-contrast)',
    opacity: 0.8,
    transition: 'width 0.3s ease',
    width: showProgress ? `${progress}%` : '0%'
  });
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      onClick={isLoading ? undefined : onClick}
      className={`vistara-loading-button vistara-loading-button--${currentState} ${className || ''}`}
      style={buttonStyles}
      {...props}
    >
      {/* Icon */}
      {currentContent.icon && (
        <span className="vistara-button-icon">
          {currentContent.icon}
        </span>
      )}
      
      {/* Text content */}
      <span className="vistara-button-content">
        {currentContent.text}
      </span>
      
      {/* Right icon (only in default state) */}
      {currentState === 'default' && rightIcon && (
        <span className="vistara-button-right-icon">
          {rightIcon}
        </span>
      )}
      
      {/* Progress bar */}
      {showProgress && (
        <div style={progressBarStyles} />
      )}
      
      {/* Shimmer effect for loading state */}
      {isLoading && theme === 'detailed' && (
        <div
          style={normalizeStyle({
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 2s infinite'
          })}
        />
      )}
    </button>
  );
});

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;