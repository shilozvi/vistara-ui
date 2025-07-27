/**
 * 🎯 Vistara UI - ModalDialog Component
 * "Command your Design."
 * 
 * מודל דיאלוג מתקדם עם backdrop ואנימציות
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const ModalDialog = forwardRef(({ 
  // Visibility
  open = false,
  onClose,
  
  // Content
  children,
  title,
  subtitle,
  
  // Layout
  size = 'normal', // 'compact', 'normal', 'large', 'fullscreen'
  theme = 'default', // 'default', 'minimal', 'detailed'
  
  // Behavior
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  preventScroll = true,
  
  // Animation
  animated = true,
  
  // Accessibility
  ariaLabel,
  ariaDescribedBy,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  
  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.(event);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscape, onClose]);
  
  // Handle focus management
  useEffect(() => {
    if (open) {
      // Store previous focus
      previousFocusRef.current = document.activeElement;
      
      // Focus modal
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      // Restore previous focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [open]);
  
  // Handle body scroll
  useEffect(() => {
    if (!preventScroll) return;
    
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, preventScroll]);
  
  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (closeOnBackdropClick && event.target === event.currentTarget) {
      onClose?.(event);
    }
  };
  
  // Handle close button click
  const handleCloseClick = (event) => {
    onClose?.(event);
  };
  
  if (!open) return null;
  
  // Close icon
  const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  
  // Backdrop styles
  const getBackdropStyles = () => {
    return normalizeStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)',
      
      ...(animated && {
        animation: 'fadeIn 0.2s ease-out'
      })
    });
  };
  
  // Modal styles
  const getModalStyles = () => {
    const sizeMap = {
      compact: {
        width: '400px',
        maxWidth: '90vw'
      },
      normal: {
        width: '600px',
        maxWidth: '90vw'
      },
      large: {
        width: '900px',
        maxWidth: '95vw'
      },
      fullscreen: {
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        borderRadius: 0
      }
    };
    
    return normalizeStyle({
      backgroundColor: 'var(--color-surface)',
      borderRadius: size === 'fullscreen' ? 0 : 'var(--border-radius-xl)',
      boxShadow: 'var(--shadow-2xl)',
      maxHeight: size === 'fullscreen' ? '100vh' : '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      outline: 'none',
      position: 'relative',
      
      ...sizeMap[size],
      
      ...(animated && {
        animation: 'slideIn 0.3s ease-out'
      }),
      
      ...(theme === 'detailed' && {
        border: '1px solid var(--color-border)',
        ':before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-light))'
        }
      })
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: 'var(--space-5) var(--space-5) var(--space-4) var(--space-5)',
      borderBottom: theme === 'minimal' ? 'none' : '1px solid var(--color-border)',
      backgroundColor: theme === 'detailed' ? 'var(--color-background-secondary)' : 'transparent'
    });
  };
  
  // Title styles
  const getTitleStyles = () => {
    return normalizeStyle({
      margin: 0,
      fontSize: 'var(--font-size-xl)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)',
      lineHeight: 1.3,
      paddingRight: 'var(--space-4)'
    });
  };
  
  // Subtitle styles
  const getSubtitleStyles = () => {
    return normalizeStyle({
      margin: 0,
      marginTop: 'var(--space-1)',
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-normal)',
      color: 'var(--color-text-secondary)',
      lineHeight: 1.4
    });
  };
  
  // Close button styles
  const getCloseButtonStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: 'var(--border-radius-md)',
      border: 'none',
      backgroundColor: 'transparent',
      color: 'var(--color-text-secondary)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      flexShrink: 0,
      
      ':hover': {
        backgroundColor: 'var(--color-background-secondary)',
        color: 'var(--color-text-primary)'
      },
      
      ':focus': {
        outline: '2px solid var(--color-primary-light)',
        outlineOffset: '2px'
      }
    });
  };
  
  // Content styles
  const getContentStyles = () => {
    return normalizeStyle({
      flex: 1,
      padding: 'var(--space-5)',
      paddingTop: title || subtitle ? 'var(--space-4)' : 'var(--space-5)',
      overflow: 'auto',
      
      // Custom scrollbar
      '::-webkit-scrollbar': {
        width: '8px'
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: 'var(--color-background-secondary)',
        borderRadius: '4px'
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: 'var(--color-border)',
        borderRadius: '4px',
        ':hover': {
          backgroundColor: 'var(--color-border-hover)'
        }
      }
    });
  };
  
  return (
    <div
      style={getBackdropStyles()}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      <div
        ref={ref || modalRef}
        className={`vistara-modal vistara-modal--${size} ${className || ''}`}
        style={{ ...getModalStyles(), ...style }}
        tabIndex={-1}
        {...props}
      >
        {/* Header */}
        {(title || subtitle || showCloseButton) && (
          <div style={getHeaderStyles()}>
            <div style={{ flex: 1 }}>
              {title && (
                <h2 style={getTitleStyles()}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p style={getSubtitleStyles()}>
                  {subtitle}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                style={getCloseButtonStyles()}
                onClick={handleCloseClick}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div style={getContentStyles()}>
          {children}
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
});

ModalDialog.displayName = 'ModalDialog';

export default ModalDialog;