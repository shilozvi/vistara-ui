/**
 * 🎯 Vistara UI - Popover Component
 * "Command your Design."
 * 
 * רכיב פופאובר מתקדם עם תוכן עשיר ומיקום חכם
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Popover = forwardRef(({ 
  // Content
  children,
  content,
  title,
  footer,
  
  // Behavior
  trigger = 'click', // 'click', 'hover', 'focus', 'manual'
  open,
  defaultOpen = false,
  disabled = false,
  closeOnClickOutside = true,
  closeOnEscape = true,
  
  // Positioning
  placement = 'bottom', // 'top', 'bottom', 'left', 'right', 'top-start', etc.
  offset = 8,
  arrow = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded', 'large'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'bordered', 'elevated'
  
  // Timing
  delay = 0,
  hideDelay = 100,
  
  // Callbacks
  onOpen,
  onClose,
  onToggle,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [isOpen, setIsOpen] = useState(open !== undefined ? open : defaultOpen);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState(placement);
  
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const timeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  
  // Handle controlled state
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);
  
  // Calculate position
  const calculatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.pageYOffset;
    const scrollX = window.pageXOffset;
    
    let newPosition = { top: 0, left: 0 };
    let newPlacement = placement;
    
    // Calculate initial position based on placement
    switch (placement) {
      case 'top':
        newPosition = {
          top: triggerRect.top + scrollY - popoverRect.height - offset,
          left: triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2
        };
        break;
      case 'bottom':
        newPosition = {
          top: triggerRect.bottom + scrollY + offset,
          left: triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2
        };
        break;
      case 'left':
        newPosition = {
          top: triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2,
          left: triggerRect.left + scrollX - popoverRect.width - offset
        };
        break;
      case 'right':
        newPosition = {
          top: triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2,
          left: triggerRect.right + scrollX + offset
        };
        break;
      case 'top-start':
        newPosition = {
          top: triggerRect.top + scrollY - popoverRect.height - offset,
          left: triggerRect.left + scrollX
        };
        break;
      case 'top-end':
        newPosition = {
          top: triggerRect.top + scrollY - popoverRect.height - offset,
          left: triggerRect.right + scrollX - popoverRect.width
        };
        break;
      case 'bottom-start':
        newPosition = {
          top: triggerRect.bottom + scrollY + offset,
          left: triggerRect.left + scrollX
        };
        break;
      case 'bottom-end':
        newPosition = {
          top: triggerRect.bottom + scrollY + offset,
          left: triggerRect.right + scrollX - popoverRect.width
        };
        break;
    }
    
    // Auto-adjust if popover goes outside viewport
    if (newPosition.left < scrollX + 8) {
      newPosition.left = scrollX + 8;
    } else if (newPosition.left + popoverRect.width > scrollX + viewportWidth - 8) {
      newPosition.left = scrollX + viewportWidth - popoverRect.width - 8;
    }
    
    if (newPosition.top < scrollY + 8) {
      if (placement.includes('top')) {
        newPosition.top = triggerRect.bottom + scrollY + offset;
        newPlacement = placement.replace('top', 'bottom');
      } else {
        newPosition.top = scrollY + 8;
      }
    } else if (newPosition.top + popoverRect.height > scrollY + viewportHeight - 8) {
      if (placement.includes('bottom')) {
        newPosition.top = triggerRect.top + scrollY - popoverRect.height - offset;
        newPlacement = placement.replace('bottom', 'top');
      } else {
        newPosition.top = scrollY + viewportHeight - popoverRect.height - 8;
      }
    }
    
    setPosition(newPosition);
    setActualPlacement(newPlacement);
  };
  
  // Show popover
  const showPopover = () => {
    if (disabled) return;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
        onOpen?.();
        onToggle?.(true);
      }, delay);
    } else {
      setIsOpen(true);
      onOpen?.();
      onToggle?.(true);
    }
  };
  
  // Hide popover
  const hidePopover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (hideDelay > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        onClose?.();
        onToggle?.(false);
      }, hideDelay);
    } else {
      setIsOpen(false);
      onClose?.();
      onToggle?.(false);
    }
  };
  
  // Toggle popover
  const togglePopover = () => {
    if (isOpen) {
      hidePopover();
    } else {
      showPopover();
    }
  };
  
  // Event handlers
  const handleMouseEnter = () => {
    if (trigger === 'hover') showPopover();
  };
  
  const handleMouseLeave = () => {
    if (trigger === 'hover') hidePopover();
  };
  
  const handleClick = (e) => {
    e.stopPropagation();
    if (trigger === 'click') togglePopover();
  };
  
  const handleFocus = () => {
    if (trigger === 'focus') showPopover();
  };
  
  const handleBlur = () => {
    if (trigger === 'focus') hidePopover();
  };
  
  // Click outside handler
  useEffect(() => {
    if (!isOpen || !closeOnClickOutside) return;
    
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        hidePopover();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnClickOutside]);
  
  // Escape key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        hidePopover();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape]);
  
  // Position calculation on open
  useEffect(() => {
    if (isOpen) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(calculatePosition, 0);
      
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
      
      return () => {
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isOpen, placement]);
  
  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);
  
  // Popover styles
  const getPopoverStyles = () => {
    const sizeMap = {
      compact: {
        minWidth: '180px',
        maxWidth: '240px',
        padding: 'var(--space-2)'
      },
      normal: {
        minWidth: '240px',
        maxWidth: '320px',
        padding: 'var(--space-3)'
      },
      expanded: {
        minWidth: '320px',
        maxWidth: '400px',
        padding: 'var(--space-4)'
      },
      large: {
        minWidth: '400px',
        maxWidth: '600px',
        padding: 'var(--space-5)'
      }
    };
    
    return normalizeStyle({
      position: 'absolute',
      top: position.top,
      left: position.left,
      zIndex: 9998,
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-lg)',
      fontFamily: 'var(--font-family-base)',
      fontSize: 'var(--font-size-sm)',
      lineHeight: 1.5,
      color: 'var(--color-text-primary)',
      pointerEvents: 'auto',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'default' && {
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xl)'
      }),
      
      ...(variant === 'bordered' && {
        border: '2px solid var(--color-primary)',
        boxShadow: 'var(--shadow-lg)'
      }),
      
      ...(variant === 'elevated' && {
        border: 'none',
        boxShadow: 'var(--shadow-2xl)'
      }),
      
      // Animation
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'scale(1)' : 'scale(0.95)',
      transition: 'all 0.2s ease',
      visibility: isOpen ? 'visible' : 'hidden',
      
      // Theme variations
      ...(theme === 'minimal' && {
        border: 'none',
        boxShadow: 'var(--shadow-md)'
      }),
      
      ...(theme === 'detailed' && {
        boxShadow: 'var(--shadow-2xl)',
        border: '1px solid var(--color-border)'
      })
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      borderBottom: '1px solid var(--color-border)',
      paddingBottom: 'var(--space-2)',
      marginBottom: 'var(--space-3)',
      fontSize: 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)'
    });
  };
  
  // Content styles
  const getContentStyles = () => {
    return normalizeStyle({
      color: 'var(--color-text-secondary)',
      lineHeight: 1.6
    });
  };
  
  // Footer styles
  const getFooterStyles = () => {
    return normalizeStyle({
      borderTop: '1px solid var(--color-border)',
      paddingTop: 'var(--space-2)',
      marginTop: 'var(--space-3)',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 'var(--space-2)'
    });
  };
  
  // Arrow styles
  const getArrowStyles = () => {
    const arrowSize = 8;
    let arrowStyles = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    };
    
    const borderColor = variant === 'bordered' ? 'var(--color-primary)' : 'var(--color-border)';
    const bgColor = 'var(--color-surface)';
    
    // Position arrow based on popover placement
    switch (actualPlacement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        arrowStyles = {
          ...arrowStyles,
          bottom: -arrowSize,
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: `${bgColor} transparent transparent transparent`
        };
        if (actualPlacement === 'top') {
          arrowStyles.left = '50%';
          arrowStyles.transform = 'translateX(-50%)';
        } else if (actualPlacement === 'top-start') {
          arrowStyles.left = '16px';
        } else {
          arrowStyles.right = '16px';
        }
        break;
        
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        arrowStyles = {
          ...arrowStyles,
          top: -arrowSize,
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent ${bgColor} transparent`
        };
        if (actualPlacement === 'bottom') {
          arrowStyles.left = '50%';
          arrowStyles.transform = 'translateX(-50%)';
        } else if (actualPlacement === 'bottom-start') {
          arrowStyles.left = '16px';
        } else {
          arrowStyles.right = '16px';
        }
        break;
        
      case 'left':
        arrowStyles = {
          ...arrowStyles,
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent transparent ${bgColor}`
        };
        break;
        
      case 'right':
        arrowStyles = {
          ...arrowStyles,
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: `transparent ${bgColor} transparent transparent`
        };
        break;
    }
    
    return normalizeStyle(arrowStyles);
  };
  
  return (
    <>
      {/* Trigger element */}
      <span
        ref={triggerRef}
        className={`vistara-popover-trigger ${className || ''}`}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {children}
      </span>
      
      {/* Popover */}
      {content && (
        <div
          ref={popoverRef}
          className={`vistara-popover vistara-popover--${variant} vistara-popover--${size}`}
          style={getPopoverStyles()}
          role="dialog"
          aria-modal="false"
        >
          {/* Header */}
          {title && (
            <div style={getHeaderStyles()}>
              {title}
            </div>
          )}
          
          {/* Content */}
          <div style={getContentStyles()}>
            {content}
          </div>
          
          {/* Footer */}
          {footer && (
            <div style={getFooterStyles()}>
              {footer}
            </div>
          )}
          
          {/* Arrow */}
          {arrow && (
            <div style={getArrowStyles()} />
          )}
        </div>
      )}
    </>
  );
});

Popover.displayName = 'Popover';

export default Popover;