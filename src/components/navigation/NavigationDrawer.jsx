/**
 * 🎯 Vistara UI - NavigationDrawer Component
 * "Command your Design."
 * 
 * משרת ניווט מתקדם עם מנו מתקפל ואינטראקטיביות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const NavigationDrawer = forwardRef(({ 
  // Visibility
  open = false,
  onClose,
  
  // Navigation items
  items = [], // [{ id, label, icon, href, children?, badge?, disabled? }]
  activeItem,
  
  // Layout
  width = 280,
  collapsible = true,
  collapsed = false,
  collapsedWidth = 72,
  
  // Position & behavior
  position = 'left', // 'left', 'right'
  overlay = true,
  backdrop = true,
  closeOnClickOutside = true,
  persistent = false, // Stays open, no overlay
  
  // Header
  header,
  showHeader = true,
  headerHeight = 64,
  
  // Footer
  footer,
  showFooter = false,
  
  // Search
  searchable = true,
  searchPlaceholder = 'Search navigation...',
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed', 'modern'
  variant = 'default', // 'default', 'floating', 'bordered'
  
  // Callbacks
  onItemClick,
  onToggleCollapse,
  onSearchChange,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const drawerRef = useRef(null);
  const backdropRef = useRef(null);
  
  // Handle outside clicks
  useEffect(() => {
    if (!open || !closeOnClickOutside) return;
    
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose?.();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, closeOnClickOutside, onClose]);
  
  // Handle escape key
  useEffect(() => {
    if (!open) return;
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);
  
  // Filter items based on search
  const filteredItems = searchTerm ? 
    items.filter(item => 
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.children?.some(child => 
        child.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) : items;
  
  // Handle item click
  const handleItemClick = (item, event) => {
    event?.preventDefault();
    
    // Handle group expansion
    if (item.children) {
      const newExpanded = new Set(expandedGroups);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedGroups(newExpanded);
    }
    
    onItemClick?.(item, event);
    
    // Close drawer on mobile after selection
    if (overlay && !item.children) {
      onClose?.();
    }
  };
  
  // Handle collapse toggle
  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggleCollapse?.(newCollapsed);
  };
  
  // Handle search
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      position: 'fixed',
      top: 0,
      bottom: 0,
      zIndex: persistent ? 1000 : 1050,
      display: 'flex',
      pointerEvents: open ? 'auto' : 'none'
    });
  };
  
  // Backdrop styles
  const getBackdropStyles = () => {
    return normalizeStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease',
      pointerEvents: open ? 'auto' : 'none'
    });
  };
  
  // Drawer styles
  const getDrawerStyles = () => {
    const currentWidth = isCollapsed ? collapsedWidth : width;
    
    return normalizeStyle({
      position: 'relative',
      width: `${currentWidth}px`,
      height: '100vh',
      backgroundColor: 'var(--color-surface)',
      boxShadow: 'var(--shadow-xl)',
      transform: open ? 'translateX(0)' : 
                position === 'left' ? `translateX(-${currentWidth}px)` : `translateX(${currentWidth}px)`,
      transition: 'transform 0.3s ease, width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'var(--font-family-base)',
      
      // Variant styles
      ...(variant === 'floating' && {
        margin: 'var(--space-3)',
        height: 'calc(100vh - var(--space-6))',
        borderRadius: 'var(--border-radius-xl)',
        border: '1px solid var(--color-border)'
      }),
      
      ...(variant === 'bordered' && {
        borderRight: position === 'left' ? '1px solid var(--color-border)' : 'none',
        borderLeft: position === 'right' ? '1px solid var(--color-border)' : 'none'
      }),
      
      // Theme variations
      ...(theme === 'modern' && {
        background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-background-secondary) 100%)'
      })
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      height: `${headerHeight}px`,
      padding: isCollapsed ? 'var(--space-3)' : 'var(--space-4)',
      borderBottom: theme !== 'minimal' ? '1px solid var(--color-border)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      
      ...(theme === 'detailed' && {
        backgroundColor: 'var(--color-background-secondary)'
      })
    });
  };
  
  // Search styles
  const getSearchStyles = () => {
    return normalizeStyle({
      position: 'relative',
      margin: isCollapsed ? 'var(--space-2)' : 'var(--space-3) var(--space-4)',
      flexShrink: 0
    });
  };
  
  const getSearchInputStyles = () => {
    return normalizeStyle({
      width: '100%',
      padding: 'var(--space-2) var(--space-3)',
      paddingLeft: 'var(--space-8)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      fontSize: 'var(--font-size-sm)',
      backgroundColor: 'var(--color-background-secondary)',
      color: 'var(--color-text-primary)',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      
      ':focus': {
        borderColor: 'var(--color-primary)',
        boxShadow: '0 0 0 2px var(--color-primary-light)'
      },
      
      '::placeholder': {
        color: 'var(--color-text-muted)'
      }
    });
  };
  
  // Navigation styles
  const getNavStyles = () => {
    return normalizeStyle({
      flex: 1,
      overflowY: 'auto',
      padding: isCollapsed ? 'var(--space-2)' : 'var(--space-3) 0'
    });
  };
  
  // Item styles
  const getItemStyles = (item, level = 0) => {
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups.has(item.id);
    
    const paddingLeft = isCollapsed ? 'var(--space-3)' : 
                      level === 0 ? 'var(--space-4)' : `calc(var(--space-4) + ${level * 20}px)`;
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: `var(--space-2) var(--space-3) var(--space-2) ${paddingLeft}`,
      margin: isCollapsed ? 'var(--space-1) var(--space-2)' : 'var(--space-1) var(--space-3)',
      borderRadius: 'var(--border-radius-md)',
      border: 'none',
      outline: 'none',
      backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
      color: isActive ? 'var(--color-primary-dark)' : 
             item.disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      gap: 'var(--space-2)',
      
      ...(!item.disabled && {
        ':hover': {
          backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'
        }
      }),
      
      // Theme variations
      ...(theme === 'minimal' && {
        borderRadius: 0,
        margin: 0,
        borderBottom: level === 0 ? '1px solid var(--color-border)' : 'none'
      }),
      
      ...(isCollapsed && {
        justifyContent: 'center',
        padding: 'var(--space-3)'
      })
    });
  };
  
  // Icon styles
  const getIconStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-lg)',
      flexShrink: 0,
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    });
  };
  
  // Badge styles
  const getBadgeStyles = () => {
    return normalizeStyle({
      backgroundColor: 'var(--color-danger)',
      color: 'var(--color-white)',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-bold)',
      padding: '2px 6px',
      borderRadius: '10px',
      minWidth: '18px',
      textAlign: 'center',
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
      borderRadius: '50%',
      border: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'var(--font-size-sm)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.2s ease',
      zIndex: 1,
      
      ':hover': {
        backgroundColor: 'var(--color-background-secondary)',
        transform: 'translateY(-50%) scale(1.1)'
      }
    });
  };
  
  // Render search
  const renderSearch = () => {
    if (!searchable || isCollapsed) return null;
    
    return (
      <div style={getSearchStyles()}>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: 'var(--space-3)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none'
          }}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={getSearchInputStyles()}
          />
        </div>
      </div>
    );
  };
  
  // Render navigation item
  const renderNavigationItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups.has(item.id);
    
    return (
      <div key={item.id}>
        <button
          style={getItemStyles(item, level)}
          onClick={(e) => handleItemClick(item, e)}
          disabled={item.disabled}
          title={isCollapsed ? item.label : undefined}
        >
          {/* Icon */}
          {item.icon && (
            <div style={getIconStyles()}>
              {item.icon}
            </div>
          )}
          
          {/* Label */}
          {!isCollapsed && (
            <span style={{ flex: 1, textAlign: 'left', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
          )}
          
          {/* Badge */}
          {!isCollapsed && item.badge && (
            <span style={getBadgeStyles()}>
              {item.badge}
            </span>
          )}
          
          {/* Expand/collapse arrow */}
          {!isCollapsed && hasChildren && (
            <div style={{
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              marginLeft: 'var(--space-1)'
            }}>
              <ChevronRightIcon />
            </div>
          )}
        </button>
        
        {/* Children */}
        {!isCollapsed && hasChildren && isExpanded && (
          <div style={{ overflow: 'hidden' }}>
            {item.children.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  // Icons
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronRightIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const MenuIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  if (persistent) {
    // Persistent drawer (always visible, no overlay)
    return (
      <div
        ref={ref}
        className={`vistara-navigation-drawer vistara-navigation-drawer--${variant} vistara-navigation-drawer--${size} ${className || ''}`}
        style={{ ...getDrawerStyles(), position: 'relative', transform: 'none', ...style }}
        {...props}
      >
        {/* Collapse button */}
        {collapsible && (
          <button
            style={getCollapseButtonStyles()}
            onClick={handleCollapseToggle}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        )}
        
        {/* Header */}
        {showHeader && (
          <div style={getHeaderStyles()}>
            {header || (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MenuIcon />
                {!isCollapsed && (
                  <span style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)'
                  }}>
                    Navigation
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Search */}
        {renderSearch()}
        
        {/* Navigation */}
        <nav style={getNavStyles()}>
          {filteredItems.map(item => renderNavigationItem(item))}
        </nav>
        
        {/* Footer */}
        {showFooter && footer && (
          <div style={{
            padding: isCollapsed ? 'var(--space-2)' : 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--color-border)',
            flexShrink: 0
          }}>
            {footer}
          </div>
        )}
      </div>
    );
  }
  
  // Modal drawer (with overlay)
  return (
    <div style={getContainerStyles()}>
      {/* Backdrop */}
      {backdrop && overlay && (
        <div
          ref={backdropRef}
          style={getBackdropStyles()}
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`vistara-navigation-drawer vistara-navigation-drawer--${variant} vistara-navigation-drawer--${size} ${className || ''}`}
        style={{ ...getDrawerStyles(), [position]: 0, ...style }}
        {...props}
      >
        {/* Header */}
        {showHeader && (
          <div style={getHeaderStyles()}>
            {header || (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MenuIcon />
                {!isCollapsed && (
                  <span style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)'
                  }}>
                    Navigation
                  </span>
                )}
              </div>
            )}
            
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 'var(--space-1)',
                color: 'var(--color-text-muted)',
                borderRadius: 'var(--border-radius-sm)',
                ':hover': {
                  backgroundColor: 'var(--color-background-secondary)'
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        )}
        
        {/* Search */}
        {renderSearch()}
        
        {/* Navigation */}
        <nav style={getNavStyles()}>
          {filteredItems.map(item => renderNavigationItem(item))}
        </nav>
        
        {/* Footer */}
        {showFooter && footer && (
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            borderTop: '1px solid var(--color-border)',
            flexShrink: 0
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});

NavigationDrawer.displayName = 'NavigationDrawer';

export default NavigationDrawer;