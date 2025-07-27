/**
 * 🎯 Vistara UI - ErrorAlert Component
 * "Command your Design."
 * 
 * התראות שגיאה מתקדמות עם פעולות
 */

import React, { forwardRef, useState } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const ErrorAlert = forwardRef(({ 
  // Content
  title = 'Error',
  message,
  children,
  details,
  
  // Type of error
  severity = 'error', // 'error', 'warning', 'critical'
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'filled', // 'filled', 'outlined', 'minimal'
  
  // Behavior
  dismissible = true,
  showIcon = true,
  collapsible = false,
  defaultExpanded = false,
  
  // Actions
  actions = [], // Array of action buttons
  retryAction,
  contactSupport,
  
  // Callbacks
  onDismiss,
  onRetry,
  onContactSupport,
  onActionClick,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showDetails, setShowDetails] = useState(false);
  
  if (!isVisible) return null;
  
  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };
  
  const handleRetry = () => {
    onRetry?.();
    if (retryAction?.closeOnClick !== false) {
      handleDismiss();
    }
  };
  
  const handleContactSupport = () => {
    onContactSupport?.();
    if (contactSupport?.closeOnClick !== false) {
      handleDismiss();
    }
  };
  
  // Icons for different severities
  const getIcon = () => {
    const icons = {
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
      critical: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
        </svg>
      )
    };
    return icons[severity];
  };
  
  const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronIcon = ({ expanded }) => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none"
      style={{ 
        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease'
      }}
    >
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  // Base styles
  const baseStyles = normalizeStyle({
    display: 'flex',
    gap: 'var(--space-3)',
    padding: 'var(--space-4)',
    borderRadius: 'var(--border-radius-lg)',
    fontFamily: 'var(--font-family-base)',
    border: '1px solid transparent',
    position: 'relative',
    width: '100%'
  });
  
  // Size variants
  const sizeStyles = {
    compact: normalizeStyle({
      padding: 'var(--space-3)',
      gap: 'var(--space-2)',
      fontSize: 'var(--font-size-sm)'
    }),
    normal: normalizeStyle({
      padding: 'var(--space-4)',
      gap: 'var(--space-3)',
      fontSize: 'var(--font-size-base)'
    }),
    expanded: normalizeStyle({
      padding: 'var(--space-5)',
      gap: 'var(--space-4)',
      fontSize: 'var(--font-size-base)'
    })
  };
  
  // Severity colors
  const getSeverityColors = () => {
    const colors = {
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
      critical: {
        filled: {
          backgroundColor: 'var(--color-danger-dark)',
          color: 'var(--color-danger-contrast)',
          borderColor: 'var(--color-danger-dark)',
          boxShadow: '0 0 20px var(--color-danger-light)'
        },
        outlined: {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-danger-dark)',
          borderColor: 'var(--color-danger-dark)',
          borderWidth: '2px'
        },
        minimal: {
          backgroundColor: 'var(--color-danger-light)',
          color: 'var(--color-danger-dark)',
          borderColor: 'var(--color-danger-light)',
          borderLeft: '4px solid var(--color-danger)'
        }
      }
    };
    
    return normalizeStyle(colors[severity][variant]);
  };
  
  // Combined styles
  const alertStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...getSeverityColors(),
    ...style
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-error-alert vistara-error-alert--${severity} vistara-error-alert--${variant} ${className || ''}`}
      style={alertStyles}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {/* Icon */}
      {showIcon && (
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          {getIcon()}
        </div>
      )}
      
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header with title and controls */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
          <div style={{ flex: 1 }}>
            {/* Title */}
            <div style={normalizeStyle({
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: message || children ? 'var(--space-1)' : 0,
              lineHeight: 1.4,
              fontSize: size === 'compact' ? 'var(--font-size-base)' : 'var(--font-size-lg)'
            })}>
              {title}
            </div>
            
            {/* Message */}
            {message && (
              <div style={normalizeStyle({
                lineHeight: 1.5,
                opacity: variant === 'filled' ? 0.9 : 0.8,
                marginBottom: children || details || actions.length > 0 ? 'var(--space-2)' : 0
              })}>
                {message}
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: 'var(--space-1)', flexShrink: 0 }}>
            {/* Expand/collapse button */}
            {collapsible && (details || children) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
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
                  ':hover': { opacity: 1 }
                })}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                <ChevronIcon expanded={isExpanded} />
              </button>
            )}
            
            {/* Dismiss button */}
            {dismissible && (
              <button
                onClick={handleDismiss}
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
                  ':hover': { opacity: 1 }
                })}
                aria-label="Dismiss alert"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>
        
        {/* Expandable content */}
        {(!collapsible || isExpanded) && (
          <>
            {/* Custom children */}
            {children}
            
            {/* Details */}
            {details && (
              <div style={normalizeStyle({
                marginTop: 'var(--space-2)',
                padding: 'var(--space-3)',
                backgroundColor: variant === 'filled' ? 'rgba(0, 0, 0, 0.1)' : 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'var(--font-family-mono)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              })}>
                {details}
              </div>
            )}
          </>
        )}
        
        {/* Actions */}
        {(actions.length > 0 || retryAction || contactSupport) && (
          <div style={normalizeStyle({
            display: 'flex',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-3)',
            flexWrap: 'wrap'
          })}>
            {/* Retry action */}
            {retryAction && (
              <button
                onClick={handleRetry}
                style={normalizeStyle({
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: variant === 'filled' ? 'rgba(255, 255, 255, 0.2)' : 'var(--color-primary)',
                  color: variant === 'filled' ? 'currentColor' : 'var(--color-primary-contrast)',
                  border: variant === 'filled' ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    backgroundColor: variant === 'filled' ? 'rgba(255, 255, 255, 0.3)' : 'var(--color-primary-hover)'
                  }
                })}
              >
                {retryAction.label || 'Retry'}
              </button>
            )}
            
            {/* Contact support */}
            {contactSupport && (
              <button
                onClick={handleContactSupport}
                style={normalizeStyle({
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: 'transparent',
                  color: 'currentColor',
                  border: '1px solid currentColor',
                  borderRadius: 'var(--border-radius-md)',
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
                {contactSupport.label || 'Contact Support'}
              </button>
            )}
            
            {/* Custom actions */}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onActionClick?.(action, index)}
                style={normalizeStyle({
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: action.primary ? 'currentColor' : 'transparent',
                  color: action.primary ? 'var(--color-surface)' : 'currentColor',
                  border: action.primary ? 'none' : '1px solid currentColor',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                })}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Pulse animation for critical errors */}
      {severity === 'critical' && theme === 'detailed' && (
        <div
          style={normalizeStyle({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            animation: 'pulse 2s infinite',
            backgroundColor: 'var(--color-danger)',
            opacity: 0.1,
            pointerEvents: 'none'
          })}
        />
      )}
    </div>
  );
});

ErrorAlert.displayName = 'ErrorAlert';

export default ErrorAlert;