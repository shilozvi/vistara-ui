/**
 * 🎯 Vistara UI - Drawer Component
 * "Command your Design."
 * 
 * רכיב מגירה צידית מתקדם עם אנימציות וגמישות
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Drawer = forwardRef(({ 
  // Content
  children,
  title,
  footer,
  
  // Behavior
  open = false,
  onClose,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  lockScroll = true,
  
  // Position & Layout
  placement = 'right', // 'left', 'right', 'top', 'bottom'
  width = 400, // For left/right drawers
  height = 300, // For top/bottom drawers
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded', 'full'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'bordered', 'floating'
  
  // Header options
  showHeader = true,
  showCloseButton = true,
  headerActions,
  
  // Animation
  animation = 'slide', // 'slide', 'fade', 'scale'
  duration = 300,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Lock/unlock body scroll
  useEffect(() => {
    if (!lockScroll) return;
    
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, lockScroll]);
  
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !open) return;
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, closeOnEscape, onClose]);
  
  // Focus trap (basic implementation)
  useEffect(() => {
    if (!open || !drawerRef.current) return;
    
    const drawer = drawerRef.current;
    const focusableElements = drawer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [open]);
  
  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose?.();
    }
  };
  
  // Size calculations
  const getSizeValues = () => {
    const isHorizontal = placement === 'left' || placement === 'right';
    
    const sizeMap = {
      compact: isHorizontal ? { width: 280 } : { height: 200 },
      normal: isHorizontal ? { width: 400 } : { height: 300 },
      expanded: isHorizontal ? { width: 520 } : { height: 400 },
      full: isHorizontal ? { width: '100vw' } : { height: '100vh' }
    };
    
    // Custom width/height override size presets
    if (isHorizontal && width) {
      return { width: typeof width === 'number' ? `${width}px` : width };
    } else if (!isHorizontal && height) {
      return { height: typeof height === 'number' ? `${height}px` : height };
    }
    
    return sizeMap[size] || sizeMap.normal;
  };
  
  // Overlay styles
  const getOverlayStyles = () => {
    return normalizeStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: theme === 'detailed' ? 'blur(4px)' : 'none',
      
      // Animation
      opacity: open ? 1 : 0,
      transition: `opacity ${duration}ms ease`,
      visibility: open ? 'visible' : 'hidden',
      
      ...(theme === 'minimal' && {
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      })
    });
  };
  
  // Drawer styles
  const getDrawerStyles = () => {
    const sizeValues = getSizeValues();
    const isHorizontal = placement === 'left' || placement === 'right';
    
    // Base positioning
    let positionStyles = {};
    let transformValue = '';
    
    switch (placement) {
      case 'left':
        positionStyles = { 
          top: 0, 
          left: 0, 
          bottom: 0,
          height: '100vh'
        };
        transformValue = open ? 'translateX(0)' : 'translateX(-100%)';
        break;
      case 'right':
        positionStyles = { 
          top: 0, 
          right: 0, 
          bottom: 0,
          height: '100vh'
        };
        transformValue = open ? 'translateX(0)' : 'translateX(100%)';
        break;
      case 'top':
        positionStyles = { 
          top: 0, 
          left: 0, 
          right: 0,
          width: '100vw'
        };
        transformValue = open ? 'translateY(0)' : 'translateY(-100%)';
        break;
      case 'bottom':
        positionStyles = { 
          bottom: 0, 
          left: 0, 
          right: 0,
          width: '100vw'
        };
        transformValue = open ? 'translateY(0)' : 'translateY(100%)';
        break;
    }
    
    // Animation variants
    let animationStyles = {};
    switch (animation) {
      case 'slide':
        animationStyles = {
          transform: transformValue,
          transition: `transform ${duration}ms ease`
        };
        break;
      case 'fade':
        animationStyles = {
          opacity: open ? 1 : 0,
          transition: `opacity ${duration}ms ease`
        };
        break;
      case 'scale':
        animationStyles = {
          transform: open ? 'scale(1)' : 'scale(0.95)',
          opacity: open ? 1 : 0,
          transition: `all ${duration}ms ease`
        };
        break;
    }
    
    return normalizeStyle({
      position: 'fixed',
      zIndex: 10000,
      backgroundColor: 'var(--color-surface)',
      fontFamily: 'var(--font-family-base)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      
      ...positionStyles,
      ...sizeValues,
      ...animationStyles,
      
      // Variant styles
      ...(variant === 'default' && {
        boxShadow: 'var(--shadow-2xl)'
      }),
      
      ...(variant === 'bordered' && {
        border: `1px solid var(--color-border)`,
        boxShadow: 'var(--shadow-xl)'
      }),
      
      ...(variant === 'floating' && placement !== 'top' && placement !== 'bottom' && {
        borderRadius: placement === 'left' ? '0 var(--border-radius-xl) var(--border-radius-xl) 0' : 
                      placement === 'right' ? 'var(--border-radius-xl) 0 0 var(--border-radius-xl)' :
                      'var(--border-radius-xl)',
        margin: 'var(--space-4)',
        ...(placement === 'left' && { left: 0, height: 'calc(100vh - 32px)' }),
        ...(placement === 'right' && { right: 0, height: 'calc(100vh - 32px)' })
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        borderLeft: placement === 'right' ? '4px solid var(--color-primary)' : 'none',
        borderRight: placement === 'left' ? '4px solid var(--color-primary)' : 'none',
        borderTop: placement === 'bottom' ? '4px solid var(--color-primary)' : 'none',
        borderBottom: placement === 'top' ? '4px solid var(--color-primary)' : 'none'
      })
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-4) var(--space-4) var(--space-3) var(--space-4)',
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: theme === 'detailed' ? 'var(--color-background-secondary)' : 'transparent',
      minHeight: '60px'
    });
  };
  
  // Title styles
  const getTitleStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-lg)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)',
      margin: 0,
      flex: 1
    });
  };
  
  // Close button styles
  const getCloseButtonStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: 'var(--border-radius-md)',
      cursor: 'pointer',
      color: 'var(--color-text-muted)',
      transition: 'all 0.2s ease',
      
      ':hover': {
        backgroundColor: 'var(--color-background-secondary)',
        color: 'var(--color-text-primary)'
      },
      
      ':focus': {
        outline: 'none',
        boxShadow: '0 0 0 2px var(--color-primary-light)'
      }
    });
  };
  
  // Content styles
  const getContentStyles = () => {
    return normalizeStyle({
      flex: 1,
      overflow: 'auto',
      padding: 'var(--space-4)',
      color: 'var(--color-text-secondary)',
      lineHeight: 1.6
    });
  };
  
  // Footer styles
  const getFooterStyles = () => {
    return normalizeStyle({
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--space-3) var(--space-4)',
      backgroundColor: theme === 'detailed' ? 'var(--color-background-secondary)' : 'transparent',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-2)'
    });
  };
  
  // Close icon
  const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  if (!open) return null;
  
  return (
    <div
      ref={overlayRef}
      className={`vistara-drawer-overlay ${className || ''}`}
      style={{ ...getOverlayStyles(), ...style }}
      onClick={handleOverlayClick}
      {...props}
    >
      <div
        ref={drawerRef}
        className={`vistara-drawer vistara-drawer--${placement} vistara-drawer--${variant}`}
        style={getDrawerStyles()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Header */}
        {showHeader && (title || showCloseButton || headerActions) && (
          <div style={getHeaderStyles()}>
            {title && (
              <h2 id="drawer-title" style={getTitleStyles()}>
                {title}
              </h2>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {headerActions}
              
              {showCloseButton && (
                <button
                  type="button"
                  style={getCloseButtonStyles()}
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Content */}
        <div style={getContentStyles()}>
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div style={getFooterStyles()}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});

Drawer.displayName = 'Drawer';

export default Drawer;