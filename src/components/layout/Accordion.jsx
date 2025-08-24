/**
 * 🎯 Vistara UI - Accordion Component
 * "Command your Design."
 * 
 * רכיב אקורדיון מתקדם עם אנימציות ותמיכה ברב-פתיחה
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const AccordionItem = ({ 
  title,
  children,
  isOpen,
  onToggle,
  disabled = false,
  icon,
  size,
  theme,
  variant
}) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);
  
  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);
  
  // Header styles
  const getHeaderStyles = () => {
    const sizeMap = {
      compact: {
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--font-size-sm)'
      },
      normal: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--font-size-base)'
      },
      expanded: {
        padding: 'var(--space-4) var(--space-5)',
        fontSize: 'var(--font-size-lg)'
      }
    };
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      border: 'none',
      outline: 'none',
      backgroundColor: isOpen ? 'var(--color-background-secondary)' : 'transparent',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 'var(--font-weight-semibold)',
      color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
      textAlign: 'left',
      transition: 'all 0.2s ease',
      borderBottom: variant === 'bordered' ? '1px solid var(--color-border)' : 'none',
      
      ...sizeMap[size],
      
      // Hover states
      ...(!disabled && {
        ':hover': {
          backgroundColor: 'var(--color-background-secondary)'
        }
      }),
      
      // Focus states
      ':focus': {
        backgroundColor: 'var(--color-background-secondary)',
        boxShadow: variant === 'outlined' ? '0 0 0 2px var(--color-primary-light)' : 'none'
      },
      
      // Theme variations
      ...(theme === 'detailed' && {
        borderRadius: 'var(--border-radius-md)',
        marginBottom: 'var(--space-1)'
      }),
      
      ...(disabled && {
        opacity: 0.5
      })
    });
  };
  
  // Content wrapper styles
  const getContentWrapperStyles = () => {
    return normalizeStyle({
      height: `${height}px`,
      overflow: 'hidden',
      transition: 'height 0.3s ease'
    });
  };
  
  // Content styles
  const getContentStyles = () => {
    const sizeMap = {
      compact: {
        padding: 'var(--space-2) var(--space-3) var(--space-3) var(--space-3)'
      },
      normal: {
        padding: 'var(--space-3) var(--space-4) var(--space-4) var(--space-4)'
      },
      expanded: {
        padding: 'var(--space-4) var(--space-5) var(--space-5) var(--space-5)'
      }
    };
    
    return normalizeStyle({
      color: 'var(--color-text-secondary)',
      lineHeight: 1.6,
      
      ...sizeMap[size],
      
      // Theme variations
      ...(theme === 'detailed' && {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-md)',
        margin: 'var(--space-1)',
        marginTop: 0
      })
    });
  };
  
  // Icon container styles
  const getIconContainerStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    });
  };
  
  // Chevron styles
  const getChevronStyles = () => {
    return normalizeStyle({
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
      color: 'var(--color-text-muted)'
    });
  };
  
  // Chevron icon
  const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  return (
    <div className="vistara-accordion-item">
      <button
        style={getHeaderStyles()}
        onClick={() => !disabled && onToggle()}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <div style={getIconContainerStyles()}>
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </div>
        
        <div style={getChevronStyles()}>
          <ChevronDown />
        </div>
      </button>
      
      <div style={getContentWrapperStyles()}>
        <div ref={contentRef} style={getContentStyles()}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Accordion = forwardRef(({ 
  // Content
  children,
  items = [], // [{ title, content, disabled, icon }]
  
  // Behavior
  allowMultiple = false,
  allowToggle = true,
  defaultOpenItems = [],
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'outlined', 'bordered', 'card'
  
  // Callbacks
  onChange,
  onItemToggle,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [openItems, setOpenItems] = useState(new Set(defaultOpenItems));
  
  // Handle item toggle
  const handleItemToggle = (index) => {
    const newOpenItems = new Set(openItems);
    
    if (newOpenItems.has(index)) {
      if (allowToggle) {
        newOpenItems.delete(index);
      }
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(index);
    }
    
    setOpenItems(newOpenItems);
    onChange?.(Array.from(newOpenItems));
    onItemToggle?.(index, newOpenItems.has(index));
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      width: '100%',
      
      // Variant styles
      ...(variant === 'outlined' && {
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        overflow: 'hidden'
      }),
      
      ...(variant === 'card' && {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }),
      
      ...(variant === 'bordered' && {
        border: 'none'
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        padding: 'var(--space-2)',
        backgroundColor: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-xl)'
      })
    });
  };
  
  // Item container styles
  const getItemContainerStyles = (index, isLast) => {
    return normalizeStyle({
      borderBottom: (variant !== 'card' && variant !== 'outlined' && !isLast) ? 
        '1px solid var(--color-border)' : 'none',
      
      // Theme variations
      ...(theme === 'detailed' && {
        marginBottom: isLast ? 0 : 'var(--space-2)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden'
      })
    });
  };
  
  // Render items from props or children
  const renderItems = () => {
    if (items.length > 0) {
      return items.map((item, index) => (
        <div 
          key={index} 
          style={getItemContainerStyles(index, index === items.length - 1)}
          className="vistara-accordion-item-container"
        >
          <AccordionItem
            title={item.title}
            isOpen={openItems.has(index)}
            onToggle={() => handleItemToggle(index)}
            disabled={item.disabled}
            icon={item.icon}
            size={size}
            theme={theme}
            variant={variant}
          >
            {item.content}
          </AccordionItem>
        </div>
      ));
    }
    
    // Handle children as AccordionItem components
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      
      return (
        <div 
          key={index} 
          style={getItemContainerStyles(index, index === React.Children.count(children) - 1)}
          className="vistara-accordion-item-container"
        >
          {React.cloneElement(child, {
            isOpen: openItems.has(index),
            onToggle: () => handleItemToggle(index),
            size,
            theme,
            variant
          })}
        </div>
      );
    });
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-accordion vistara-accordion--${variant} vistara-accordion--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {renderItems()}
    </div>
  );
});

Accordion.displayName = 'Accordion';
Accordion.Item = AccordionItem;

export default Accordion;