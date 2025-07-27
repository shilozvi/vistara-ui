/**
 * 🎯 Vistara UI - SidebarMenu Component
 * "Command your Design."
 * 
 * תפריט צדדי מתקדם עם קטגוריות וקיפול
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const SidebarMenu = forwardRef(({ 
  // Menu items
  items = [], // [{ id, label, icon, href, children, badge, disabled, onClick }]
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'filled', // 'filled', 'outlined', 'minimal'
  
  // Behavior
  collapsed = false,
  collapsible = true,
  defaultOpenItems = [],
  showIcons = true,
  showBadges = true,
  
  // Active state
  activeItem,
  
  // Callbacks
  onItemClick,
  onToggleCollapse,
  onItemToggle,
  
  // Branding
  logo,
  title,
  subtitle,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [openItems, setOpenItems] = useState(new Set(defaultOpenItems));
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  
  const sidebarRef = useRef(null);
  
  // Handle item click
  const handleItemClick = (item, event) => {
    if (item.disabled) return;
    
    // If item has children, toggle it
    if (item.children && item.children.length > 0) {
      toggleItem(item.id);
      event.preventDefault();
      return;
    }
    
    // Call callbacks
    item.onClick?.(event);
    onItemClick?.(item, event);
  };
  
  // Toggle item open/close
  const toggleItem = (itemId) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      onItemToggle?.(itemId, newSet.has(itemId));
      return newSet;
    });
  };
  
  // Handle sidebar collapse
  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggleCollapse?.(newCollapsed);
  };
  
  // Icons
  const ChevronDown = ({ isOpen }) => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease'
      }}
    >
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const DefaultIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
    </svg>
  );
  
  // Base styles
  const getSidebarStyles = () => {
    const baseStyles = {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'var(--font-family-base)',
      borderRight: '1px solid var(--color-border)',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      position: 'relative',
      
      // Width based on collapse state
      width: isCollapsed ? '64px' : '280px',
      minWidth: isCollapsed ? '64px' : '280px',
      
      // Size variants
      ...(size === 'compact' && {
        width: isCollapsed ? '56px' : '240px',
        minWidth: isCollapsed ? '56px' : '240px'
      }),
      ...(size === 'expanded' && {
        width: isCollapsed ? '72px' : '320px',
        minWidth: isCollapsed ? '72px' : '320px'
      })
    };
    
    // Variant styles
    const variantStyles = {
      filled: {
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-sm)'
      },
      outlined: {
        backgroundColor: 'var(--color-background)',
        borderRight: '1px solid var(--color-border)'
      },
      minimal: {
        backgroundColor: 'transparent',
        borderRight: 'none'
      }
    };
    
    return normalizeStyle({
      ...baseStyles,
      ...variantStyles[variant]
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: size === 'compact' ? 'var(--space-3)' : size === 'expanded' ? 'var(--space-5)' : 'var(--space-4)',
      borderBottom: '1px solid var(--color-border)',
      position: 'relative',
      minHeight: size === 'compact' ? '56px' : size === 'expanded' ? '72px' : '64px',
      
      ...(theme === 'detailed' && {
        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%)',
        color: 'var(--color-primary-contrast)'
      })
    });
  };
  
  // Menu item styles
  const getMenuItemStyles = (item, level = 0, isActive = false) => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: `var(--space-2) var(--space-3)`,
      margin: '0 var(--space-2)',
      borderRadius: 'var(--border-radius-md)',
      textDecoration: 'none',
      color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
      fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      opacity: item.disabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      userSelect: 'none',
      position: 'relative',
      
      // Nested items indentation
      paddingLeft: `calc(var(--space-3) + ${level * 20}px)`,
      
      // Size variants
      ...(size === 'compact' && {
        padding: `var(--space-1) var(--space-2)`,
        fontSize: 'var(--font-size-sm)'
      }),
      ...(size === 'expanded' && {
        padding: `var(--space-3) var(--space-4)`,
        fontSize: 'var(--font-size-base)'
      }),
      
      // Active state
      ...(isActive && {
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        ...(theme === 'detailed' && {
          boxShadow: 'var(--shadow-sm)',
          transform: 'translateX(2px)'
        })
      }),
      
      // Hover state
      ':hover': !item.disabled && !isActive ? {
        backgroundColor: 'var(--color-background-secondary)',
        color: 'var(--color-text-primary)',
        ...(theme === 'detailed' && {
          transform: 'translateX(1px)'
        })
      } : {}
    };
    
    return normalizeStyle(baseStyles);
  };
  
  // Badge styles
  const getBadgeStyles = () => {
    return normalizeStyle({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '18px',
      height: '18px',
      backgroundColor: 'var(--color-danger)',
      color: 'var(--color-danger-contrast)',
      borderRadius: '9px',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      paddingLeft: '6px',
      paddingRight: '6px',
      marginLeft: 'auto'
    });
  };
  
  // Collapse button styles
  const getCollapseButtonStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '50%',
      right: '-12px',
      transform: 'translateY(-50%)',
      width: '24px',
      height: '24px',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--color-text-secondary)',
      transition: 'all 0.2s ease',
      zIndex: 10,
      
      ':hover': {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-contrast)',
        borderColor: 'var(--color-primary)'
      }
    });
  };
  
  // Scroll area styles
  const getScrollAreaStyles = () => {
    return normalizeStyle({
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: 'var(--space-2) 0',
      
      // Custom scrollbar
      '::-webkit-scrollbar': {
        width: '6px'
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: 'transparent'
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: 'var(--color-border)',
        borderRadius: '3px',
        ':hover': {
          backgroundColor: 'var(--color-border-hover)'
        }
      }
    });
  };
  
  // Render menu item recursively
  const renderMenuItem = (item, level = 0) => {
    const isActive = activeItem === item.id;
    const isOpen = openItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    
    const ItemTag = item.href ? 'a' : 'div';
    
    return (
      <div key={item.id}>
        <ItemTag
          href={item.href}
          style={getMenuItemStyles(item, level, isActive)}
          onClick={(e) => handleItemClick(item, e)}
          title={isCollapsed ? item.label : undefined}
        >
          {/* Icon */}
          {showIcons && (
            <span style={{ 
              display: 'flex', 
              alignItems: 'center',
              minWidth: '16px',
              justifyContent: 'center'
            }}>
              {item.icon || <DefaultIcon />}
            </span>
          )}
          
          {/* Label */}
          {!isCollapsed && (
            <>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
              
              {/* Badge */}
              {showBadges && item.badge && (
                <span style={getBadgeStyles()}>
                  {item.badge}
                </span>
              )}
              
              {/* Chevron for items with children */}
              {hasChildren && (
                <ChevronDown isOpen={isOpen} />
              )}
            </>
          )}
        </ItemTag>
        
        {/* Children */}
        {hasChildren && isOpen && !isCollapsed && (
          <div style={{ marginTop: 'var(--space-1)' }}>
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <aside
      ref={ref}
      className={`vistara-sidebar vistara-sidebar--${variant} ${isCollapsed ? 'vistara-sidebar--collapsed' : ''} ${className || ''}`}
      style={{ ...getSidebarStyles(), ...style }}
      {...props}
    >
      {/* Header */}
      <div style={getHeaderStyles()}>
        {/* Logo/Icon */}
        {logo && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            minWidth: '24px'
          }}>
            {logo}
          </div>
        )}
        
        {/* Title & Subtitle */}
        {!isCollapsed && (title || subtitle) && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {title && (
              <div style={normalizeStyle({
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: theme === 'detailed' ? 'inherit' : 'var(--color-text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              })}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={normalizeStyle({
                fontSize: 'var(--font-size-sm)',
                color: theme === 'detailed' ? 'inherit' : 'var(--color-text-muted)',
                opacity: 0.8,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              })}>
                {subtitle}
              </div>
            )}
          </div>
        )}
        
        {/* Collapse button */}
        {collapsible && (
          <button
            style={getCollapseButtonStyles()}
            onClick={toggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <MenuIcon />
          </button>
        )}
      </div>
      
      {/* Menu Items */}
      <div style={getScrollAreaStyles()}>
        {items.map(item => renderMenuItem(item))}
      </div>
      
      {/* Footer slot for additional content */}
      <div style={normalizeStyle({
        padding: 'var(--space-2)',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: variant === 'filled' ? 'var(--color-background-secondary)' : 'transparent'
      })}>
        {/* Can be used for user profile, settings, etc. */}
      </div>
    </aside>
  );
});

SidebarMenu.displayName = 'SidebarMenu';

export default SidebarMenu;