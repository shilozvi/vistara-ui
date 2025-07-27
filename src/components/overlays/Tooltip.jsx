/**
 * 🎯 Vistara UI - Tooltip Component
 * "Command your Design."
 * 
 * רכיב טיפ מתקדם עם מיקום אוטומטי ואנימציות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Tooltip = forwardRef(({ 
  // Content
  children,
  content,
  title,
  
  // Behavior
  trigger = 'hover', // 'hover', 'click', 'focus', 'manual'
  open,
  defaultOpen = false,
  disabled = false,
  
  // Positioning
  placement = 'top', // 'top', 'bottom', 'left', 'right', 'top-start', 'top-end', etc.
  offset = 8,
  arrow = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'dark', // 'dark', 'light', 'primary', 'success', 'warning', 'danger'
  
  // Timing
  delay = 0,
  hideDelay = 0,
  
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
  const tooltipRef = useRef(null);
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
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let newPosition = { top: 0, left: 0 };
    let newPlacement = placement;
    
    // Calculate initial position based on placement
    switch (placement) {
      case 'top':
        newPosition = {
          top: triggerRect.top - tooltipRect.height - offset,
          left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        };
        break;
      case 'bottom':
        newPosition = {
          top: triggerRect.bottom + offset,
          left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        };
        break;
      case 'left':
        newPosition = {
          top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
          left: triggerRect.left - tooltipRect.width - offset
        };
        break;
      case 'right':
        newPosition = {
          top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
          left: triggerRect.right + offset
        };
        break;
      case 'top-start':
        newPosition = {
          top: triggerRect.top - tooltipRect.height - offset,
          left: triggerRect.left
        };
        break;
      case 'top-end':
        newPosition = {
          top: triggerRect.top - tooltipRect.height - offset,
          left: triggerRect.right - tooltipRect.width
        };
        break;
      case 'bottom-start':
        newPosition = {
          top: triggerRect.bottom + offset,
          left: triggerRect.left
        };
        break;
      case 'bottom-end':
        newPosition = {
          top: triggerRect.bottom + offset,
          left: triggerRect.right - tooltipRect.width
        };
        break;
    }
    
    // Auto-adjust if tooltip goes outside viewport
    if (newPosition.left < 0) {
      newPosition.left = 8;
    } else if (newPosition.left + tooltipRect.width > viewportWidth) {
      newPosition.left = viewportWidth - tooltipRect.width - 8;
    }
    
    if (newPosition.top < 0) {
      if (placement.includes('top')) {
        newPosition.top = triggerRect.bottom + offset;
        newPlacement = placement.replace('top', 'bottom');
      } else {
        newPosition.top = 8;
      }
    } else if (newPosition.top + tooltipRect.height > viewportHeight) {
      if (placement.includes('bottom')) {
        newPosition.top = triggerRect.top - tooltipRect.height - offset;
        newPlacement = placement.replace('bottom', 'top');
      } else {
        newPosition.top = viewportHeight - tooltipRect.height - 8;
      }
    }
    
    setPosition(newPosition);
    setActualPlacement(newPlacement);
  };
  
  // Show tooltip
  const showTooltip = () => {
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
  
  // Hide tooltip
  const hideTooltip = () => {
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
  
  // Toggle tooltip
  const toggleTooltip = () => {
    if (isOpen) {
      hideTooltip();
    } else {
      showTooltip();
    }
  };
  
  // Event handlers
  const handleMouseEnter = () => {
    if (trigger === 'hover') showTooltip();
  };
  
  const handleMouseLeave = () => {
    if (trigger === 'hover') hideTooltip();
  };
  
  const handleClick = () => {
    if (trigger === 'click') toggleTooltip();
  };
  
  const handleFocus = () => {
    if (trigger === 'focus') showTooltip();
  };
  
  const handleBlur = () => {
    if (trigger === 'focus') hideTooltip();
  };
  
  // Position calculation on open
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
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
  
  // Tooltip styles
  const getTooltipStyles = () => {
    const sizeMap = {
      compact: {
        padding: 'var(--space-1) var(--space-2)',
        fontSize: 'var(--font-size-xs)',
        maxWidth: '200px'
      },
      normal: {
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--font-size-sm)',
        maxWidth: '300px'
      },
      expanded: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--font-size-base)',
        maxWidth: '400px'
      }
    };
    
    const variantMap = {
      dark: {
        backgroundColor: 'var(--color-gray-900)',
        color: 'var(--color-white)',
        border: 'none'
      },
      light: {
        backgroundColor: 'var(--color-white)',
        color: 'var(--color-gray-900)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)'
      },
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-contrast)',
        border: 'none'
      },
      success: {
        backgroundColor: 'var(--color-success)',
        color: 'var(--color-success-contrast)',
        border: 'none'
      },
      warning: {
        backgroundColor: 'var(--color-warning)',
        color: 'var(--color-warning-contrast)',
        border: 'none'
      },
      danger: {
        backgroundColor: 'var(--color-danger)',
        color: 'var(--color-danger-contrast)',
        border: 'none'
      }
    };
    
    return normalizeStyle({
      position: 'fixed',
      top: position.top,
      left: position.left,
      zIndex: 9999,
      borderRadius: 'var(--border-radius-md)',
      fontFamily: 'var(--font-family-base)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 1.4,
      wordWrap: 'break-word',
      textAlign: 'center',
      pointerEvents: 'none',
      userSelect: 'none',
      
      ...sizeMap[size],
      ...variantMap[variant],
      
      // Animation
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'scale(1)' : 'scale(0.95)',
      transition: 'all 0.2s ease',
      visibility: isOpen ? 'visible' : 'hidden',
      
      // Theme variations
      ...(theme === 'detailed' && {
        boxShadow: variant === 'light' ? 'var(--shadow-xl)' : 'var(--shadow-lg)'
      })
    });
  };
  
  // Arrow styles
  const getArrowStyles = () => {
    const variantMap = {
      dark: 'var(--color-gray-900)',
      light: 'var(--color-white)',
      primary: 'var(--color-primary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)'
    };
    
    const arrowSize = 6;
    let arrowStyles = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    };
    
    // Position arrow based on tooltip placement
    switch (actualPlacement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        arrowStyles = {
          ...arrowStyles,
          bottom: -arrowSize,
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: `${variantMap[variant]} transparent transparent transparent`
        };
        if (actualPlacement === 'top') {
          arrowStyles.left = '50%';
          arrowStyles.transform = 'translateX(-50%)';
        } else if (actualPlacement === 'top-start') {
          arrowStyles.left = '12px';
        } else {
          arrowStyles.right = '12px';
        }
        break;
        
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        arrowStyles = {
          ...arrowStyles,
          top: -arrowSize,
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent ${variantMap[variant]} transparent`
        };
        if (actualPlacement === 'bottom') {
          arrowStyles.left = '50%';
          arrowStyles.transform = 'translateX(-50%)';
        } else if (actualPlacement === 'bottom-start') {
          arrowStyles.left = '12px';
        } else {
          arrowStyles.right = '12px';
        }
        break;
        
      case 'left':
        arrowStyles = {
          ...arrowStyles,
          right: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent transparent ${variantMap[variant]}`
        };
        break;
        
      case 'right':
        arrowStyles = {
          ...arrowStyles,
          left: -arrowSize,
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: `transparent ${variantMap[variant]} transparent transparent`
        };
        break;
    }
    
    return normalizeStyle(arrowStyles);
  };
  
  // Title styles
  const getTitleStyles = () => {
    return normalizeStyle({
      fontWeight: 'var(--font-weight-semibold)',
      marginBottom: content ? 'var(--space-1)' : 0
    });
  };
  
  return (
    <>
      {/* Trigger element */}
      <span
        ref={triggerRef}
        className={`vistara-tooltip-trigger ${className || ''}`}
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
      
      {/* Tooltip */}
      {(content || title) && (
        <div
          ref={tooltipRef}
          className={`vistara-tooltip vistara-tooltip--${variant} vistara-tooltip--${size}`}
          style={getTooltipStyles()}
          role="tooltip"
        >
          {title && (
            <div style={getTitleStyles()}>
              {title}
            </div>
          )}
          
          {content && (
            <div>
              {content}
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

Tooltip.displayName = 'Tooltip';

export default Tooltip;