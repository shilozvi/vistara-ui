/**
 * 🎯 Vistara UI - ToastNotification Component
 * "Command your Design."
 * 
 * הודעות toast מתקדמות עם אנימציות
 */

import React, { useState, useEffect, forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const ToastNotification = forwardRef(({ 
  // Content
  title,
  message,
  children,
  
  // Type and styling
  type = 'info', // 'success', 'error', 'warning', 'info'
  variant = 'filled', // 'filled', 'outlined', 'minimal'
  
  // Behavior
  visible = true,
  autoHide = true,
  duration = 4000,
  showProgress = true,
  
  // Position (when used standalone)
  position = 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
  
  // Actions
  actionButton,
  showCloseButton = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  
  // Callbacks
  onClose,
  onAction,
  onShow,
  onHide,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [isVisible, setIsVisible] = useState(visible);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(100);
  
  // Auto-hide timer
  useEffect(() => {
    if (visible && autoHide && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      // Progress bar animation
      if (showProgress) {
        const progressTimer = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev - (100 / (duration / 100));
            return newProgress <= 0 ? 0 : newProgress;
          });
        }, 100);
        
        return () => {
          clearTimeout(timer);
          clearInterval(progressTimer);
        };
      }
      
      return () => clearTimeout(timer);
    }
  }, [visible, autoHide, duration, showProgress]);
  
  // Handle visibility changes
  useEffect(() => {
    if (visible !== isVisible) {
      if (visible) {
        setIsVisible(true);
        setIsAnimating(true);
        onShow?.();
      } else {
        handleClose();
      }
    }
  }, [visible]);
  
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onHide?.();
      onClose?.();
    }, 300); // Animation duration
  };
  
  const handleAction = () => {
    onAction?.();
    if (actionButton?.closeOnClick !== false) {
      handleClose();
    }
  };
  
  if (!isVisible) return null;
  
  // Icons for different types
  const getTypeIcon = () => {
    const icons = {
      success: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      error: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      warning: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="17" r="1" fill="currentColor"/>
        </svg>
      ),
      info: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="8" r="1" fill="currentColor"/>
        </svg>
      )
    };
    return icons[type];
  };
  
  const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  // Position styles (for standalone usage)
  const getPositionStyles = () => {
    const positions = {
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
      'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
    };
    return positions[position] || positions['top-right'];
  };
  
  // Base styles
  const baseStyles = normalizeStyle({
    position: 'fixed',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-3)',
    minWidth: '300px',
    maxWidth: '500px',
    padding: 'var(--space-4)',
    borderRadius: 'var(--border-radius-lg)',
    fontFamily: 'var(--font-family-base)',
    boxShadow: 'var(--shadow-xl)',
    border: '1px solid transparent',
    
    // Animation
    transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
    opacity: isAnimating ? 1 : 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    
    ...getPositionStyles()
  });
  
  // Size variants
  const sizeStyles = {
    compact: normalizeStyle({
      padding: 'var(--space-3)',
      minWidth: '250px',
      fontSize: 'var(--font-size-sm)'
    }),
    normal: normalizeStyle({
      padding: 'var(--space-4)',
      minWidth: '300px',
      fontSize: 'var(--font-size-base)'
    }),
    expanded: normalizeStyle({
      padding: 'var(--space-5)',
      minWidth: '350px',
      fontSize: 'var(--font-size-base)'
    })
  };
  
  // Type colors
  const getTypeColors = () => {
    const colors = {
      success: {
        filled: {
          backgroundColor: 'var(--color-success)',
          color: 'var(--color-success-contrast)',
          borderColor: 'var(--color-success)'
        },
        outlined: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-success)',
          borderColor: 'var(--color-success)'
        },
        minimal: {
          backgroundColor: 'var(--color-success-light)',
          color: 'var(--color-success-dark)',
          borderColor: 'transparent'
        }
      },
      error: {
        filled: {
          backgroundColor: 'var(--color-danger)',
          color: 'var(--color-danger-contrast)',
          borderColor: 'var(--color-danger)'
        },
        outlined: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-danger)',
          borderColor: 'var(--color-danger)'
        },
        minimal: {
          backgroundColor: 'var(--color-danger-light)',
          color: 'var(--color-danger-dark)',
          borderColor: 'transparent'
        }
      },
      warning: {
        filled: {
          backgroundColor: 'var(--color-warning)',
          color: 'var(--color-warning-contrast)',
          borderColor: 'var(--color-warning)'
        },
        outlined: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-warning)',
          borderColor: 'var(--color-warning)'
        },
        minimal: {
          backgroundColor: 'var(--color-warning-light)',
          color: 'var(--color-warning-dark)',
          borderColor: 'transparent'
        }
      },
      info: {
        filled: {
          backgroundColor: 'var(--color-info)',
          color: 'var(--color-info-contrast)',
          borderColor: 'var(--color-info)'
        },
        outlined: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-info)',
          borderColor: 'var(--color-info)'
        },
        minimal: {
          backgroundColor: 'var(--color-info-light)',
          color: 'var(--color-info-dark)',
          borderColor: 'transparent'
        }
      }
    };
    
    return normalizeStyle(colors[type][variant]);
  };
  
  // Combined styles
  const toastStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...getTypeColors(),
    ...style
  };
  
  // Progress bar styles
  const progressBarStyles = normalizeStyle({
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    backgroundColor: 'currentColor',
    opacity: 0.3,
    borderRadius: '0 0 var(--border-radius-lg) var(--border-radius-lg)',
    transition: 'width 0.1s linear',
    width: `${progress}%`
  });
  
  return (
    <div
      ref={ref}
      className={`vistara-toast vistara-toast--${type} vistara-toast--${variant} ${className || ''}`}
      style={toastStyles}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {/* Icon */}
      {theme !== 'minimal' && (
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          {getTypeIcon()}
        </div>
      )}
      
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Title */}
        {title && (
          <div style={normalizeStyle({
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: message || children ? 'var(--space-1)' : 0,
            lineHeight: 1.4
          })}>
            {title}
          </div>
        )}
        
        {/* Message */}
        {message && (
          <div style={normalizeStyle({
            opacity: 0.9,
            lineHeight: 1.5,
            fontSize: title ? 'var(--font-size-sm)' : 'inherit'
          })}>
            {message}
          </div>
        )}
        
        {/* Custom children */}
        {children}
        
        {/* Action button */}
        {actionButton && (
          <button
            onClick={handleAction}
            style={normalizeStyle({
              marginTop: 'var(--space-2)',
              padding: 'var(--space-1) var(--space-2)',
              backgroundColor: 'transparent',
              color: 'currentColor',
              border: '1px solid currentColor',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: 'currentColor',
                color: variant === 'filled' ? 'var(--color-surface)' : 'var(--color-surface)'
              }
            })}
          >
            {actionButton.label || actionButton.children}
          </button>
        )}
      </div>
      
      {/* Close button */}
      {showCloseButton && (
        <button
          onClick={handleClose}
          style={normalizeStyle({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            padding: 0,
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: 'var(--border-radius-sm)',
            color: 'currentColor',
            opacity: 0.7,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            ':hover': {
              opacity: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)'
            }
          })}
          aria-label="Close notification"
        >
          <CloseIcon />
        </button>
      )}
      
      {/* Progress bar */}
      {showProgress && autoHide && duration > 0 && (
        <div style={progressBarStyles} />
      )}
      
      {/* Glow effect for detailed theme */}
      {theme === 'detailed' && variant === 'filled' && (
        <div
          style={normalizeStyle({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            boxShadow: `0 0 20px var(--color-${type})`,
            opacity: 0.3,
            pointerEvents: 'none'
          })}
        />
      )}
    </div>
  );
});

ToastNotification.displayName = 'ToastNotification';

export default ToastNotification;