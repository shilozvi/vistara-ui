/**
 * 🎯 Vistara UI - TopNavbar Component
 * "Command your Design."
 * 
 * ניווט עליון מתקדם עם תפריטים וחיפוש
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const TopNavbar = forwardRef(({ 
  // Navigation items
  items = [], // [{ id, label, icon, href, children, badge, disabled, onClick }]
  
  // Brand/Logo
  brand,
  brandHref = '/',
  onBrandClick,
  
  // Actions (right side)
  actions = [], // [{ id, label, icon, onClick, badge, type: 'button'|'dropdown' }]
  
  // Search
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'filled', // 'filled', 'outlined', 'transparent'
  position = 'sticky', // 'static', 'sticky', 'fixed'
  
  // Behavior
  showShadow = true,
  bordered = true,
  responsive = true,
  
  // Mobile
  mobileBreakpoint = 768,
  showMobileMenu = false,
  onMobileMenuToggle,
  
  // Active state
  activeItem,
  
  // Callbacks
  onItemClick,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  const navbarRef = useRef(null);
  const searchRef = useRef(null);
  
  // Handle responsive behavior
  useEffect(() => {
    if (!responsive) return;
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsive, mobileBreakpoint]);
  
  // Handle dropdown clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle item click
  const handleItemClick = (item, event) => {
    if (item.disabled) return;
    
    // If item has children, toggle dropdown
    if (item.children && item.children.length > 0) {
      setShowDropdown(showDropdown === item.id ? null : item.id);
      event.preventDefault();
      return;
    }
    
    // Close any open dropdown
    setShowDropdown(null);
    
    // Call callbacks
    item.onClick?.(event);
    onItemClick?.(item, event);
  };
  
  // Handle search
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch?.(searchValue);
  };
  
  // Icons
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  // Base navbar styles
  const getNavbarStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      fontFamily: 'var(--font-family-base)',
      zIndex: 1000,
      
      // Position variants
      ...(position === 'sticky' && {
        position: 'sticky',
        top: 0
      }),
      ...(position === 'fixed' && {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      }),
      
      // Size variants
      ...(size === 'compact' && {
        padding: 'var(--space-2) var(--space-4)',
        minHeight: '48px'
      }),
      ...(size === 'normal' && {
        padding: 'var(--space-3) var(--space-6)',
        minHeight: '64px'
      }),
      ...(size === 'expanded' && {
        padding: 'var(--space-4) var(--space-8)',
        minHeight: '80px'
      }),
      
      // Responsive
      ...(isMobile && {
        padding: 'var(--space-2) var(--space-4)'
      })
    };
    
    // Variant styles
    const variantStyles = {
      filled: {
        backgroundColor: 'var(--color-surface)',
        ...(showShadow && {
          boxShadow: 'var(--shadow-sm)'
        }),
        ...(bordered && {
          borderBottom: '1px solid var(--color-border)'
        })
      },
      outlined: {
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-border)',
        ...(showShadow && {
          boxShadow: 'var(--shadow-sm)'
        })
      },
      transparent: {
        backgroundColor: 'transparent',
        backdropFilter: 'blur(10px)',
        ...(bordered && {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        })
      }
    };
    
    // Theme styles
    const themeStyles = {
      detailed: {
        background: theme === 'detailed' && variant === 'filled' 
          ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)'
          : undefined,
        color: theme === 'detailed' && variant === 'filled' 
          ? 'var(--color-primary-contrast)' 
          : undefined
      }
    };
    
    return normalizeStyle({
      ...baseStyles,
      ...variantStyles[variant],
      ...themeStyles
    });
  };
  
  // Brand styles
  const getBrandStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      textDecoration: 'none',
      color: 'inherit',
      fontWeight: 'var(--font-weight-bold)',
      fontSize: size === 'compact' ? 'var(--font-size-lg)' : size === 'expanded' ? 'var(--font-size-2xl)' : 'var(--font-size-xl)',
      transition: 'opacity 0.2s ease',
      
      ':hover': {
        opacity: 0.8
      }
    });
  };
  
  // Navigation menu styles
  const getNavMenuStyles = () => {
    return normalizeStyle({
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      flex: 1,
      justifyContent: 'center'
    });
  };
  
  // Menu item styles
  const getMenuItemStyles = (item, isActive = false) => {
    const hasChildren = item.children && item.children.length > 0;
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--border-radius-md)',
      textDecoration: 'none',
      color: isActive ? 'var(--color-primary)' : 'inherit',
      fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      opacity: item.disabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      position: 'relative',
      userSelect: 'none',
      
      // Size variants
      ...(size === 'compact' && {
        padding: 'var(--space-1) var(--space-2)',
        fontSize: 'var(--font-size-sm)'
      }),
      ...(size === 'expanded' && {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--font-size-base)'
      }),
      
      // Active state
      ...(isActive && {
        backgroundColor: variant === 'transparent' ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-primary-light)',
        color: 'var(--color-primary)'
      }),
      
      // Hover state
      ':hover': !item.disabled && !isActive ? {
        backgroundColor: variant === 'transparent' ? 'rgba(255, 255, 255, 0.05)' : 'var(--color-background-secondary)',
        color: 'var(--color-primary)'
      } : {}
    });
  };
  
  // Search styles
  const getSearchStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      backgroundColor: variant === 'transparent' ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-background-secondary)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      padding: 'var(--space-2) var(--space-3)',
      transition: 'all 0.2s ease',
      minWidth: '200px',
      
      ...(searchFocused && {
        borderColor: 'var(--color-primary)',
        backgroundColor: variant === 'transparent' ? 'rgba(255, 255, 255, 0.15)' : 'var(--color-surface)',
        boxShadow: '0 0 0 3px var(--color-primary-light)'
      }),
      
      ...(isMobile && {
        minWidth: '150px'
      })
    });
  };
  
  // Actions styles
  const getActionsStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    });
  };
  
  // Action button styles
  const getActionButtonStyles = (action) => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-1)',
      padding: 'var(--space-2)',
      border: 'none',
      borderRadius: 'var(--border-radius-md)',
      backgroundColor: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative',
      
      // Size variants
      ...(size === 'compact' && {
        padding: 'var(--space-1)',
        fontSize: 'var(--font-size-sm)'
      }),
      ...(size === 'expanded' && {
        padding: 'var(--space-3)',
        fontSize: 'var(--font-size-base)'
      }),
      
      ':hover': {
        backgroundColor: variant === 'transparent' ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-background-secondary)',
        color: 'var(--color-primary)'
      }
    });
  };
  
  // Badge styles
  const getBadgeStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '4px',
      right: '4px',
      minWidth: '16px',
      height: '16px',
      backgroundColor: 'var(--color-danger)',
      color: 'var(--color-danger-contrast)',
      borderRadius: '8px',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 4px'
    });
  };
  
  // Dropdown styles
  const getDropdownStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '100%',
      left: 0,
      minWidth: '200px',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: 1000,
      overflow: 'hidden',
      marginTop: 'var(--space-1)'
    });
  };
  
  // Mobile menu button styles
  const getMobileMenuButtonStyles = () => {
    return normalizeStyle({
      display: isMobile ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-2)',
      border: 'none',
      borderRadius: 'var(--border-radius-md)',
      backgroundColor: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      
      ':hover': {
        backgroundColor: variant === 'transparent' ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-background-secondary)'
      }
    });
  };
  
  return (
    <nav
      ref={ref}
      className={`vistara-navbar vistara-navbar--${variant} ${className || ''}`}
      style={{ ...getNavbarStyles(), ...style }}
      {...props}
    >
      {/* Brand */}
      {brand && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          {brandHref ? (
            <a
              href={brandHref}
              style={getBrandStyles()}
              onClick={onBrandClick}
            >
              {brand}
            </a>
          ) : (
            <div style={getBrandStyles()}>
              {brand}
            </div>
          )}
        </div>
      )}
      
      {/* Navigation Menu */}
      <ul style={getNavMenuStyles()}>
        {items.map((item) => {
          const isActive = activeItem === item.id;
          const isDropdownOpen = showDropdown === item.id;
          const hasChildren = item.children && item.children.length > 0;
          
          const ItemTag = item.href ? 'a' : 'div';
          
          return (
            <li key={item.id} style={{ position: 'relative' }}>
              <ItemTag
                href={item.href}
                style={getMenuItemStyles(item, isActive)}
                onClick={(e) => handleItemClick(item, e)}
              >
                {/* Icon */}
                {item.icon && (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </span>
                )}
                
                {/* Label */}
                <span>{item.label}</span>
                
                {/* Badge */}
                {item.badge && (
                  <span style={normalizeStyle({
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
                    marginLeft: 'var(--space-1)'
                  })}>
                    {item.badge}
                  </span>
                )}
                
                {/* Chevron for dropdowns */}
                {hasChildren && <ChevronDown />}
              </ItemTag>
              
              {/* Dropdown */}
              {hasChildren && isDropdownOpen && (
                <div style={getDropdownStyles()}>
                  {item.children.map((child) => (
                    <a
                      key={child.id}
                      href={child.href}
                      style={normalizeStyle({
                        display: 'block',
                        padding: 'var(--space-3) var(--space-4)',
                        textDecoration: 'none',
                        color: 'var(--color-text-primary)',
                        transition: 'all 0.2s ease',
                        borderBottom: '1px solid var(--color-border)',
                        ':last-child': {
                          borderBottom: 'none'
                        },
                        ':hover': {
                          backgroundColor: 'var(--color-background-secondary)',
                          color: 'var(--color-primary)'
                        }
                      })}
                      onClick={(e) => handleItemClick(child, e)}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      
      {/* Right Side */}
      <div style={getActionsStyles()}>
        {/* Search */}
        {searchable && !isMobile && (
          <form style={getSearchStyles()} onSubmit={handleSearchSubmit}>
            <SearchIcon />
            <input
              ref={searchRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={normalizeStyle({
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: 'inherit',
                fontSize: 'var(--font-size-sm)',
                flex: 1,
                '::placeholder': {
                  color: 'var(--color-text-muted)'
                }
              })}
            />
          </form>
        )}
        
        {/* Actions */}
        {actions.map((action) => (
          <button
            key={action.id}
            style={getActionButtonStyles(action)}
            onClick={action.onClick}
            title={action.label}
          >
            {action.icon && (
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {action.icon}
              </span>
            )}
            {!isMobile && action.label && <span>{action.label}</span>}
            {action.badge && (
              <span style={getBadgeStyles()}>
                {action.badge}
              </span>
            )}
          </button>
        ))}
        
        {/* Mobile Menu Button */}
        <button
          style={getMobileMenuButtonStyles()}
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <MenuIcon />
        </button>
      </div>
    </nav>
  );
});

TopNavbar.displayName = 'TopNavbar';

export default TopNavbar;