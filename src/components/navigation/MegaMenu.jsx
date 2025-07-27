/**
 * 🎯 Vistara UI - MegaMenu Component
 * "Command your Design."
 * 
 * מנו על מתקדם עם תפריט מרובה עמודות ומדיה
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const MegaMenu = forwardRef(({ 
  // Menu items
  items = [], // [{ id, label, icon?, href?, columns?, featured?, media? }]
  
  // Trigger
  trigger = 'hover', // 'hover', 'click'
  delay = 200, // Hover delay in ms
  
  // Layout
  columns = 4,
  maxWidth = 1200,
  fullWidth = false,
  
  // Positioning
  position = 'bottom', // 'bottom', 'top'
  alignment = 'center', // 'left', 'center', 'right'
  
  // Content types
  showIcons = true,
  showDescriptions = true,
  showMedia = true,
  showFeatured = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'glass'
  variant = 'default', // 'default', 'cards', 'bordered'
  
  // Animation
  animated = true,
  animationDuration = 300,
  
  // Callbacks
  onItemClick,
  onMenuOpen,
  onMenuClose,
  
  // Standard props
  className,
  style,
  children,
  ...props
}, ref) => {
  
  const [activeItem, setActiveItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredSubItem, setHoveredSubItem] = useState(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  
  // Handle menu open
  const openMenu = (item) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setActiveItem(item);
    setIsOpen(true);
    onMenuOpen?.(item);
  };
  
  // Handle menu close
  const closeMenu = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setActiveItem(null);
      setIsOpen(false);
      onMenuClose?.();
    }, trigger === 'hover' ? delay : 0);
  };
  
  // Handle item hover
  const handleItemHover = (item) => {
    if (trigger === 'hover' && item.columns) {
      openMenu(item);
    }
  };
  
  // Handle item click
  const handleItemClick = (item, event) => {
    if (trigger === 'click' && item.columns) {
      event?.preventDefault();
      if (activeItem?.id === item.id && isOpen) {
        closeMenu();
      } else {
        openMenu(item);
      }
    } else {
      onItemClick?.(item, event);
      closeMenu();
    }
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      closeMenu();
    }
  };
  
  // Handle sub-item click
  const handleSubItemClick = (subItem, event) => {
    onItemClick?.(subItem, event);
    closeMenu();
  };
  
  // Handle outside clicks
  useEffect(() => {
    if (trigger !== 'click' || !isOpen) return;
    
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, trigger]);
  
  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      fontFamily: 'var(--font-family-base)'
    });
  };
  
  // Menu bar styles
  const getMenuBarStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      padding: size === 'compact' ? 'var(--space-2)' : 'var(--space-3)',
      backgroundColor: theme === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-surface)',
      borderRadius: theme === 'modern' ? 'var(--border-radius-xl)' : 'var(--border-radius-lg)',
      border: variant === 'bordered' ? '1px solid var(--color-border)' : 'none',
      boxShadow: theme === 'modern' ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      
      ...(theme === 'glass' && {
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      })
    });
  };
  
  // Menu item styles
  const getMenuItemStyles = (item) => {
    const isActive = activeItem?.id === item.id && isOpen;
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: size === 'compact' ? 
        'var(--space-2) var(--space-3)' : 
        'var(--space-3) var(--space-4)',
      borderRadius: 'var(--border-radius-md)',
      backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
      color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-primary)',
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      border: 'none',
      outline: 'none',
      background: 'none',
      
      ':hover': {
        backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'
      }
    });
  };
  
  // Dropdown styles
  const getDropdownStyles = () => {
    const dropdownWidth = fullWidth ? '100vw' : `${maxWidth}px`;
    
    return normalizeStyle({
      position: 'absolute',
      top: position === 'bottom' ? '100%' : 'auto',
      bottom: position === 'top' ? '100%' : 'auto',
      left: alignment === 'left' ? 0 : 
            alignment === 'center' ? '50%' : 'auto',
      right: alignment === 'right' ? 0 : 'auto',
      transform: alignment === 'center' ? 'translateX(-50%)' : 'none',
      width: dropdownWidth,
      maxWidth: fullWidth ? 'none' : `${maxWidth}px`,
      backgroundColor: theme === 'glass' ? 'rgba(255, 255, 255, 0.95)' : 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-xl)',
      boxShadow: 'var(--shadow-2xl)',
      padding: 'var(--space-6)',
      marginTop: position === 'bottom' ? 'var(--space-2)' : 0,
      marginBottom: position === 'top' ? 'var(--space-2)' : 0,
      zIndex: 1000,
      
      // Animation
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transform: `${alignment === 'center' ? 'translateX(-50%)' : ''} translateY(${isOpen ? '0' : (position === 'bottom' ? '-10px' : '10px')})`,
      transition: animated ? `all ${animationDuration}ms ease` : 'none',
      
      ...(theme === 'glass' && {
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }),
      
      ...(theme === 'modern' && {
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-background-secondary) 100%)'
      })
    });
  };
  
  // Content grid styles
  const getContentGridStyles = () => {
    const activeColumns = activeItem?.columns || [];
    const gridColumns = activeColumns.length;
    
    return normalizeStyle({
      display: 'grid',
      gridTemplateColumns: `repeat(${Math.min(gridColumns, columns)}, 1fr)`,
      gap: 'var(--space-6)',
      
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        gap: 'var(--space-4)'
      }
    });
  };
  
  // Column styles
  const getColumnStyles = () => {
    return normalizeStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    });
  };
  
  // Column header styles
  const getColumnHeaderStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-bold)',
      color: 'var(--color-text-primary)',
      marginBottom: 'var(--space-2)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    });
  };
  
  // Sub-item styles
  const getSubItemStyles = (subItem) => {
    const isHovered = hoveredSubItem?.id === subItem.id;
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      padding: 'var(--space-3)',
      borderRadius: 'var(--border-radius-lg)',
      backgroundColor: isHovered ? 'var(--color-background-secondary)' : 'transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      color: 'inherit',
      
      ...(variant === 'cards' && {
        backgroundColor: isHovered ? 'var(--color-primary-light)' : 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        ':hover': {
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-2px)'
        }
      })
    });
  };
  
  // Featured item styles
  const getFeaturedItemStyles = () => {
    return normalizeStyle({
      gridColumn: 'span 2',
      backgroundColor: 'var(--color-primary-light)',
      borderRadius: 'var(--border-radius-xl)',
      padding: 'var(--space-6)',
      position: 'relative',
      overflow: 'hidden',
      
      '@media (max-width: 768px)': {
        gridColumn: 'span 1'
      }
    });
  };
  
  // Media styles
  const getMediaStyles = () => {
    return normalizeStyle({
      width: '48px',
      height: '48px',
      borderRadius: 'var(--border-radius-lg)',
      backgroundColor: 'var(--color-background-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'var(--font-size-xl)',
      flexShrink: 0
    });
  };
  
  // Render featured item
  const renderFeaturedItem = (item) => {
    if (!item.featured) return null;
    
    return (
      <div style={getFeaturedItemStyles()}>
        {item.media && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: `url(${item.media})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }} />
        )}
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{
            margin: '0 0 var(--space-2) 0',
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary-dark)'
          }}>
            {item.title || item.label}
          </h3>
          
          {item.description && (
            <p style={{
              margin: '0 0 var(--space-4) 0',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5
            }}>
              {item.description}
            </p>
          )}
          
          {item.cta && (
            <button style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-contrast)',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--space-2) var(--space-4)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: 'var(--color-primary-dark)'
              }
            }}>
              {item.cta}
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // Render sub-item
  const renderSubItem = (subItem) => {
    return (
      <a
        key={subItem.id}
        href={subItem.href}
        style={getSubItemStyles(subItem)}
        onClick={(e) => handleSubItemClick(subItem, e)}
        onMouseEnter={() => setHoveredSubItem(subItem)}
        onMouseLeave={() => setHoveredSubItem(null)}
      >
        {/* Icon/Media */}
        {showMedia && (subItem.icon || subItem.media) && (
          <div style={getMediaStyles()}>
            {subItem.media ? (
              <img
                src={subItem.media}
                alt={subItem.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 'inherit'
                }}
              />
            ) : (
              subItem.icon
            )}
          </div>
        )}
        
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: showDescriptions && subItem.description ? 'var(--space-1)' : 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {subItem.label}
          </div>
          
          {showDescriptions && subItem.description && (
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {subItem.description}
            </div>
          )}
        </div>
        
        {/* Badge */}
        {subItem.badge && (
          <div style={{
            backgroundColor: 'var(--color-warning)',
            color: 'var(--color-warning-contrast)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-bold)',
            padding: '2px 6px',
            borderRadius: 'var(--border-radius-sm)',
            marginLeft: 'var(--space-2)'
          }}>
            {subItem.badge}
          </div>
        )}
      </a>
    );
  };
  
  // Render dropdown content
  const renderDropdownContent = () => {
    if (!activeItem?.columns) return null;
    
    const featuredItems = activeItem.columns.filter(col => 
      col.items?.some(item => item.featured)
    );
    
    return (
      <div style={getContentGridStyles()}>
        {/* Featured items */}
        {showFeatured && featuredItems.map(column => 
          column.items.filter(item => item.featured).map(item => 
            renderFeaturedItem(item)
          )
        )}
        
        {/* Regular columns */}
        {activeItem.columns.map((column, index) => (
          <div key={index} style={getColumnStyles()}>
            {/* Column header */}
            {column.title && (
              <div style={getColumnHeaderStyles()}>
                {column.title}
              </div>
            )}
            
            {/* Column items */}
            {column.items?.filter(item => !item.featured || !showFeatured).map(renderSubItem)}
          </div>
        ))}
      </div>
    );
  };
  
  // Chevron icon
  const ChevronDownIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  return (
    <div
      ref={menuRef}
      className={`vistara-mega-menu vistara-mega-menu--${variant} vistara-mega-menu--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Menu Bar */}
      <div style={getMenuBarStyles()}>
        {items.map((item) => (
          <button
            key={item.id}
            style={getMenuItemStyles(item)}
            onMouseEnter={() => handleItemHover(item)}
            onClick={(e) => handleItemClick(item, e)}
          >
            {/* Icon */}
            {showIcons && item.icon && (
              <span style={{ fontSize: 'var(--font-size-lg)' }}>
                {item.icon}
              </span>
            )}
            
            {/* Label */}
            <span>{item.label}</span>
            
            {/* Dropdown indicator */}
            {item.columns && (
              <div style={{
                transform: isOpen && activeItem?.id === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                marginLeft: 'var(--space-1)'
              }}>
                <ChevronDownIcon />
              </div>
            )}
          </button>
        ))}
        
        {/* Custom content */}
        {children}
      </div>
      
      {/* Dropdown */}
      <div style={getDropdownStyles()}>
        {renderDropdownContent()}
      </div>
    </div>
  );
});

MegaMenu.displayName = 'MegaMenu';

export default MegaMenu;