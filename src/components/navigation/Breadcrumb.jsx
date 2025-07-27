/**
 * 🎯 Vistara UI - Breadcrumb Component
 * "Command your Design."
 * 
 * ניווט breadcrumb מתקדם עם RTL ואפשרויות עיצוב
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Breadcrumb = forwardRef(({ 
  // Items
  items = [], // [{ label, href, icon, disabled, onClick }]
  
  // Separators
  separator = '/',
  customSeparator,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'underlined', 'pills'
  
  // Behavior
  maxItems = 0, // 0 = no limit, or number to show with collapse
  showHome = true,
  homeIcon,
  homeLabel = 'Home',
  homeHref = '/',
  
  // Interactions
  onItemClick,
  
  // RTL support
  dir, // 'ltr' | 'rtl' - auto-detected if not provided
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  // Auto-detect RTL
  const isRTL = dir === 'rtl' || (typeof document !== 'undefined' && document.dir === 'rtl');
  
  // Default icons
  const HomeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronIcon = () => (
    <svg 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill="none"
      style={{ 
        transform: isRTL ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.2s ease'
      }}
    >
      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const MoreIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
      <circle cx="19" cy="12" r="1" fill="currentColor"/>
      <circle cx="5" cy="12" r="1" fill="currentColor"/>
    </svg>
  );
  
  // Prepare items with home
  const allItems = [
    ...(showHome ? [{
      label: homeLabel,
      href: homeHref,
      icon: homeIcon || <HomeIcon />,
      isHome: true
    }] : []),
    ...items
  ];
  
  // Handle item collapse
  const getDisplayItems = () => {
    if (maxItems <= 0 || allItems.length <= maxItems) {
      return allItems;
    }
    
    const first = allItems[0];
    const last = allItems.slice(-2); // Last 2 items
    const collapsed = allItems.slice(1, -2);
    
    return [
      first,
      { label: '...', isCollapsed: true, collapsedItems: collapsed },
      ...last
    ];
  };
  
  const displayItems = getDisplayItems();
  
  // Handle item click
  const handleItemClick = (item, index, event) => {
    if (item.disabled || !item.href) {
      event.preventDefault();
    }
    
    item.onClick?.(event);
    onItemClick?.(item, index, event);
  };
  
  // Base styles
  const baseStyles = normalizeStyle({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--space-1)',
    fontFamily: 'var(--font-family-base)',
    direction: isRTL ? 'rtl' : 'ltr'
  });
  
  // Size variants
  const sizeStyles = {
    compact: normalizeStyle({
      fontSize: 'var(--font-size-xs)',
      gap: 'var(--space-1)'
    }),
    normal: normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      gap: 'var(--space-2)'
    }),
    expanded: normalizeStyle({
      fontSize: 'var(--font-size-base)',
      gap: 'var(--space-3)'
    })
  };
  
  // Item base styles
  const getItemStyles = (item, isLast) => {
    const baseItemStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      textDecoration: 'none',
      color: isLast ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
      fontWeight: isLast ? 'var(--font-weight-medium)' : 'var(--font-weight-normal)',
      cursor: item.disabled ? 'default' : (item.href || item.onClick) ? 'pointer' : 'default',
      opacity: item.disabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      borderRadius: 'var(--border-radius-sm)',
      
      ...(variant === 'pills' && {
        padding: 'var(--space-1) var(--space-2)',
        backgroundColor: isLast ? 'var(--color-primary-light)' : 'transparent',
        ':hover': !item.disabled && !isLast ? {
          backgroundColor: 'var(--color-background-secondary)'
        } : {}
      }),
      
      ...(variant === 'underlined' && {
        borderBottom: isLast ? '2px solid var(--color-primary)' : '2px solid transparent',
        paddingBottom: 'var(--space-1)'
      }),
      
      ':hover': !item.disabled && !isLast ? {
        color: 'var(--color-primary)',
        ...(theme === 'detailed' && {
          transform: 'translateY(-1px)'
        })
      } : {}
    };
    
    return normalizeStyle(baseItemStyles);
  };
  
  // Separator styles
  const separatorStyles = normalizeStyle({
    display: 'inline-flex',
    alignItems: 'center',
    color: 'var(--color-text-muted)',
    fontSize: '0.8em',
    userSelect: 'none',
    opacity: 0.6
  });
  
  // Collapsed dropdown styles (for future enhancement)
  const collapsedStyles = normalizeStyle({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--space-1)',
    padding: 'var(--space-1) var(--space-2)',
    borderRadius: 'var(--border-radius-sm)',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--color-background-secondary)',
      color: 'var(--color-primary)'
    }
  });
  
  // Combined styles
  const breadcrumbStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...style
  };
  
  return (
    <nav
      ref={ref}
      className={`vistara-breadcrumb vistara-breadcrumb--${variant} ${className || ''}`}
      style={breadcrumbStyles}
      aria-label="Breadcrumb navigation"
      {...props}
    >
      <ol style={{ 
        display: 'flex', 
        alignItems: 'center', 
        listStyle: 'none', 
        margin: 0, 
        padding: 0,
        gap: 'inherit'
      }}>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const showSeparator = !isLast;
          
          return (
            <React.Fragment key={index}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'inherit' }}>
                {/* Collapsed indicator */}
                {item.isCollapsed ? (
                  <span 
                    style={collapsedStyles}
                    title={`${item.collapsedItems.length} hidden items`}
                  >
                    <MoreIcon />
                  </span>
                ) : (
                  /* Regular item */
                  item.href ? (
                    <a
                      href={item.href}
                      style={getItemStyles(item, isLast)}
                      onClick={(e) => handleItemClick(item, index, e)}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {/* Icon */}
                      {item.icon && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {item.icon}
                        </span>
                      )}
                      
                      {/* Label */}
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <span
                      style={getItemStyles(item, isLast)}
                      onClick={item.onClick ? (e) => handleItemClick(item, index, e) : undefined}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {/* Icon */}
                      {item.icon && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {item.icon}
                        </span>
                      )}
                      
                      {/* Label */}
                      <span>{item.label}</span>
                    </span>
                  )
                )}
              </li>
              
              {/* Separator */}
              {showSeparator && (
                <li style={separatorStyles} aria-hidden="true">
                  {customSeparator || (
                    separator === '/' ? <ChevronIcon /> : separator
                  )}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
      
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": allItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.label,
              ...(item.href && { "item": item.href })
            }))
          })
        }}
      />
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;