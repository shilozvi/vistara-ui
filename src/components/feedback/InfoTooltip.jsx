/**
 * 🎯 Vistara UI - InfoTooltip Component
 * "Command your Design."
 * 
 * טולטיפ מידע מתקדם עם מיקומים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const InfoTooltip = forwardRef(({ 
  // Content
  content,
  title,
  children,
  
  // Trigger
  trigger = 'hover', // 'hover', 'click', 'focus', 'manual'
  
  // Positioning
  placement = 'top', // 'top', 'bottom', 'left', 'right', 'top-start', 'top-end', etc.
  offset = 8,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'dark', // 'dark', 'light', 'primary'
  
  // Behavior
  visible,
  defaultVisible = false,
  disabled = false,
  interactive = false,
  showArrow = true,
  showDelay = 100,
  hideDelay = 100,
  maxWidth = 300,
  
  // Callbacks
  onVisibilityChange,
  onShow,
  onHide,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState(placement);
  
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  
  // Calculate position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = 0;
    let left = 0;
    let finalPlacement = placement;
    
    // Calculate position based on placement
    switch (placement) {
      case 'top':
      case 'top-start':
      case 'top-end':
        top = triggerRect.top - tooltipRect.height - offset;
        if (placement === 'top-start') {
          left = triggerRect.left;
        } else if (placement === 'top-end') {
          left = triggerRect.right - tooltipRect.width;
        } else {
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        }
        break;
        
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        top = triggerRect.bottom + offset;
        if (placement === 'bottom-start') {
          left = triggerRect.left;
        } else if (placement === 'bottom-end') {
          left = triggerRect.right - tooltipRect.width;
        } else {
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        }
        break;
        
      case 'left':
      case 'left-start':
      case 'left-end':
        left = triggerRect.left - tooltipRect.width - offset;
        if (placement === 'left-start') {
          top = triggerRect.top;
        } else if (placement === 'left-end') {
          top = triggerRect.bottom - tooltipRect.height;
        } else {
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        }
        break;
        
      case 'right':
      case 'right-start':
      case 'right-end':
        left = triggerRect.right + offset;
        if (placement === 'right-start') {
          top = triggerRect.top;
        } else if (placement === 'right-end') {
          top = triggerRect.bottom - tooltipRect.height;
        } else {
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        }
        break;
    }
    
    // Adjust for viewport boundaries
    if (left < 0) {
      left = 8;
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8;
    }
    
    if (top < 0) {
      if (placement.startsWith('top')) {
        top = triggerRect.bottom + offset;
        finalPlacement = placement.replace('top', 'bottom');
      } else {
        top = 8;
      }
    } else if (top + tooltipRect.height > viewportHeight) {
      if (placement.startsWith('bottom')) {
        top = triggerRect.top - tooltipRect.height - offset;
        finalPlacement = placement.replace('bottom', 'top');
      } else {
        top = viewportHeight - tooltipRect.height - 8;
      }
    }
    
    setPosition({ top, left });
    setActualPlacement(finalPlacement);
  };
  
  // Handle visibility
  const showTooltip = () => {
    if (disabled) return;
    
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      onShow?.();
      onVisibilityChange?.(true);
    }, showDelay);
  };
  
  const hideTooltip = () => {
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      onHide?.();
      onVisibilityChange?.(false);
    }, hideDelay);
  };
  
  const toggleTooltip = () => {
    if (isVisible) {
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
    if (trigger === 'hover' && !interactive) hideTooltip();
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
  
  // Handle controlled visibility
  useEffect(() => {
    if (typeof visible === 'boolean') {
      setIsVisible(visible);
    }
  }, [visible]);
  
  // Calculate position when visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      
      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isVisible, placement]);
  
  // Click outside to close
  useEffect(() => {
    if (trigger === 'click' && isVisible) {
      const handleClickOutside = (event) => {
        if (
          triggerRef.current && !triggerRef.current.contains(event.target) &&
          tooltipRef.current && !tooltipRef.current.contains(event.target)
        ) {
          hideTooltip();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [trigger, isVisible]);
  
  // Info icon (default trigger)
  const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </svg>
  );
  
  // Base trigger styles
  const triggerStyles = normalizeStyle({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'default' : 'pointer',
    color: 'var(--color-text-muted)',
    transition: 'color 0.2s ease',
    
    ':hover': !disabled ? {
      color: 'var(--color-primary)'
    } : {}
  });
  
  // Tooltip styles
  const getTooltipStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 10000,
      maxWidth: `${maxWidth}px`,
      padding: 'var(--space-3)',
      borderRadius: 'var(--border-radius-md)',
      fontSize: 'var(--font-size-sm)',
      lineHeight: 1.4,
      fontFamily: 'var(--font-family-base)',
      boxShadow: 'var(--shadow-xl)',
      pointerEvents: interactive ? 'auto' : 'none',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      transition: 'all 0.2s ease',
      top: position.top,
      left: position.left
    };
    
    // Size variants
    const sizeStyles = {
      compact: {
        padding: 'var(--space-2)',
        fontSize: 'var(--font-size-xs)',
        maxWidth: `${maxWidth * 0.8}px`
      },
      normal: {
        padding: 'var(--space-3)',
        fontSize: 'var(--font-size-sm)'
      },
      expanded: {
        padding: 'var(--space-4)',
        fontSize: 'var(--font-size-base)',
        maxWidth: `${maxWidth * 1.2}px`
      }
    };
    
    // Variant colors
    const variantStyles = {
      dark: {
        backgroundColor: 'var(--color-gray-900)',
        color: 'var(--color-white)',
        border: '1px solid var(--color-gray-700)'
      },
      light: {
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)'
      },
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-contrast)',
        border: '1px solid var(--color-primary-dark)'
      }
    };
    
    return normalizeStyle({
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    });
  };
  
  // Arrow styles
  const getArrowStyles = () => {
    const arrowSize = 6;
    const arrowColor = {
      dark: 'var(--color-gray-900)',
      light: 'var(--color-surface)',
      primary: 'var(--color-primary)'
    }[variant];
    
    const borderColor = {
      dark: 'var(--color-gray-700)',
      light: 'var(--color-border)',
      primary: 'var(--color-primary-dark)'
    }[variant];
    
    let arrowStyles = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid'
    };
    
    if (actualPlacement.startsWith('top')) {
      arrowStyles = {
        ...arrowStyles,
        top: '100%',
        left: '50%',
        marginLeft: `-${arrowSize}px`,
        borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
        borderColor: `${arrowColor} transparent transparent transparent`
      };
    } else if (actualPlacement.startsWith('bottom')) {
      arrowStyles = {
        ...arrowStyles,
        bottom: '100%',
        left: '50%',
        marginLeft: `-${arrowSize}px`,
        borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
        borderColor: `transparent transparent ${arrowColor} transparent`
      };
    } else if (actualPlacement.startsWith('left')) {
      arrowStyles = {
        ...arrowStyles,
        left: '100%',
        top: '50%',
        marginTop: `-${arrowSize}px`,
        borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
        borderColor: `transparent transparent transparent ${arrowColor}`
      };
    } else if (actualPlacement.startsWith('right')) {
      arrowStyles = {
        ...arrowStyles,
        right: '100%',
        top: '50%',
        marginTop: `-${arrowSize}px`,
        borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
        borderColor: `transparent ${arrowColor} transparent transparent`
      };
    }
    
    return normalizeStyle(arrowStyles);
  };
  
  return (
    <>
      {/* Trigger */}
      <span
        ref={triggerRef}
        className={`vistara-tooltip-trigger ${className || ''}`}
        style={{ ...triggerStyles, ...style }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isVisible ? 'vistara-tooltip' : undefined}
        {...props}
      >
        {children || <InfoIcon />}
      </span>
      
      {/* Tooltip */}
      {!disabled && (
        <div
          ref={tooltipRef}
          id="vistara-tooltip"
          role="tooltip"
          className="vistara-tooltip"
          style={getTooltipStyles()}
          onMouseEnter={interactive ? () => clearTimeout(hideTimeoutRef.current) : undefined}
          onMouseLeave={interactive ? hideTooltip : undefined}
        >
          {/* Title */}
          {title && (
            <div style={normalizeStyle({
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: content ? 'var(--space-1)' : 0
            })}>
              {title}
            </div>
          )}
          
          {/* Content */}
          <div>{content}</div>
          
          {/* Arrow */}
          {showArrow && (
            <div style={getArrowStyles()} />
          )}
          
          {/* Glow effect for detailed theme */}
          {theme === 'detailed' && (
            <div
              style={normalizeStyle({
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                boxShadow: `0 0 20px ${variant === 'primary' ? 'var(--color-primary-light)' : 'rgba(0, 0, 0, 0.3)'}`,
                opacity: 0.5,
                pointerEvents: 'none'
              })}
            />
          )}
        </div>
      )}
    </>
  );
});

InfoTooltip.displayName = 'InfoTooltip';

export default InfoTooltip;