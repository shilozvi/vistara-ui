/**
 * 🎯 Vistara UI - TabsNavigation Component
 * "Command your Design."
 * 
 * טאבים מתקדמים עם אנימציות וגלילה
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const TabsNavigation = forwardRef(({ 
  // Tabs data
  tabs = [], // [{ id, label, icon, disabled, badge, content }]
  activeTab,
  defaultActiveTab,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'underlined', // 'underlined', 'pills', 'enclosed', 'minimal'
  orientation = 'horizontal', // 'horizontal', 'vertical'
  
  // Behavior
  scrollable = false, // Enable horizontal scrolling for many tabs
  centered = false,
  fullWidth = false,
  keepMounted = false, // Keep inactive tab content in DOM
  lazy = true, // Lazy load tab content
  
  // Animation
  animated = true,
  
  // Callbacks
  onChange,
  onTabClick,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [internalActiveTab, setInternalActiveTab] = useState(
    activeTab || defaultActiveTab || (tabs.length > 0 ? tabs[0].id : null)
  );
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const tabsRef = useRef(null);
  const tabListRef = useRef(null);
  const activeTabRef = useRef(null);
  
  // Use controlled or uncontrolled state
  const currentActiveTab = activeTab !== undefined ? activeTab : internalActiveTab;
  
  // Handle tab change
  const handleTabChange = (tabId, tab, event) => {
    if (tab.disabled) return;
    
    if (activeTab === undefined) {
      setInternalActiveTab(tabId);
    }
    
    onChange?.(tabId, tab);
    onTabClick?.(tabId, tab, event);
  };
  
  // Update indicator position
  const updateIndicator = () => {
    if (!activeTabRef.current || variant === 'minimal') return;
    
    const activeElement = activeTabRef.current;
    const rect = activeElement.getBoundingClientRect();
    const containerRect = tabListRef.current.getBoundingClientRect();
    
    if (orientation === 'horizontal') {
      setIndicatorStyle({
        left: rect.left - containerRect.left,
        width: rect.width,
        height: variant === 'underlined' ? '2px' : rect.height,
        top: variant === 'underlined' ? 'auto' : rect.top - containerRect.top,
        bottom: variant === 'underlined' ? 0 : 'auto'
      });
    } else {
      setIndicatorStyle({
        top: rect.top - containerRect.top,
        height: rect.height,
        width: variant === 'underlined' ? '2px' : rect.width,
        left: variant === 'underlined' ? 0 : rect.left - containerRect.left,
        right: variant === 'underlined' ? 'auto' : 'auto'
      });
    }
  };
  
  // Check scroll state
  const checkScrollState = () => {
    if (!scrollable || !tabListRef.current) return;
    
    const element = tabListRef.current;
    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth);
    setShowScrollButtons(element.scrollWidth > element.clientWidth);
  };
  
  // Scroll functions
  const scrollLeft = () => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (tabListRef.current) {
      tabListRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  // Effects
  useEffect(() => {
    updateIndicator();
    checkScrollState();
    
    const handleResize = () => {
      updateIndicator();
      checkScrollState();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentActiveTab, tabs, variant, orientation]);
  
  useEffect(() => {
    if (scrollable && tabListRef.current) {
      const element = tabListRef.current;
      element.addEventListener('scroll', checkScrollState);
      return () => element.removeEventListener('scroll', checkScrollState);
    }
  }, [scrollable]);
  
  // Icons
  const ChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  // Base styles
  const baseStyles = normalizeStyle({
    display: 'flex',
    flexDirection: orientation === 'vertical' ? 'row' : 'column',
    fontFamily: 'var(--font-family-base)',
    width: '100%'
  });
  
  // Tab list container styles
  const tabListContainerStyles = normalizeStyle({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    ...(orientation === 'vertical' && {
      flexDirection: 'column',
      alignItems: 'stretch',
      width: 'auto',
      minWidth: '200px'
    })
  });
  
  // Tab list styles
  const getTabListStyles = () => {
    const baseTabListStyles = {
      display: 'flex',
      position: 'relative',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      
      ...(orientation === 'horizontal' && {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottom: variant === 'underlined' || variant === 'enclosed' ? '1px solid var(--color-border)' : 'none',
        ...(scrollable && {
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '::-webkit-scrollbar': {
            display: 'none'
          }
        }),
        ...(centered && !fullWidth && {
          justifyContent: 'center'
        })
      }),
      
      ...(orientation === 'vertical' && {
        flexDirection: 'column',
        borderRight: variant === 'underlined' || variant === 'enclosed' ? '1px solid var(--color-border)' : 'none'
      }),
      
      ...(variant === 'enclosed' && {
        backgroundColor: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-1)'
      })
    };
    
    return normalizeStyle(baseTabListStyles);
  };
  
  // Individual tab styles
  const getTabStyles = (tab, isActive) => {
    const baseTabStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      border: 'none',
      background: 'transparent',
      cursor: tab.disabled ? 'not-allowed' : 'pointer',
      opacity: tab.disabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      fontFamily: 'inherit',
      fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
      color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
      textDecoration: 'none',
      userSelect: 'none',
      position: 'relative',
      whiteSpace: 'nowrap',
      
      // Size variants
      ...(size === 'compact' && {
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--font-size-sm)'
      }),
      ...(size === 'normal' && {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--font-size-base)'
      }),
      ...(size === 'expanded' && {
        padding: 'var(--space-4) var(--space-5)',
        fontSize: 'var(--font-size-lg)'
      }),
      
      // Full width
      ...(fullWidth && orientation === 'horizontal' && {
        flex: 1,
        justifyContent: 'center'
      }),
      
      // Variant-specific styles
      ...(variant === 'pills' && {
        borderRadius: 'var(--border-radius-lg)',
        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
        color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-text-secondary)',
        ':hover': !tab.disabled && !isActive ? {
          backgroundColor: 'var(--color-background-secondary)'
        } : {}
      }),
      
      ...(variant === 'enclosed' && {
        borderRadius: 'var(--border-radius-md)',
        backgroundColor: isActive ? 'var(--color-surface)' : 'transparent',
        boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
      }),
      
      ...(variant === 'minimal' && {
        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        ':hover': !tab.disabled && !isActive ? {
          color: 'var(--color-text-primary)'
        } : {}
      }),
      
      // Default hover
      ':hover': !tab.disabled && !isActive && variant === 'underlined' ? {
        color: 'var(--color-primary)'
      } : {},
      
      // Focus styles
      ':focus': {
        outline: '2px solid var(--color-primary-light)',
        outlineOffset: '2px'
      }
    };
    
    return normalizeStyle(baseTabStyles);
  };
  
  // Indicator styles
  const getIndicatorStyles = () => {
    if (variant === 'minimal' || variant === 'pills' || variant === 'enclosed') {
      return { display: 'none' };
    }
    
    return normalizeStyle({
      position: 'absolute',
      backgroundColor: 'var(--color-primary)',
      transition: animated ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      borderRadius: variant === 'underlined' ? '1px' : 'var(--border-radius-sm)',
      zIndex: 1,
      ...indicatorStyle
    });
  };
  
  // Scroll button styles
  const scrollButtonStyles = normalizeStyle({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius-sm)',
    cursor: 'pointer',
    color: 'var(--color-text-secondary)',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--color-background-secondary)',
      color: 'var(--color-text-primary)'
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  });
  
  // Content styles
  const contentStyles = normalizeStyle({
    flex: 1,
    padding: size === 'compact' ? 'var(--space-3)' : size === 'expanded' ? 'var(--space-5)' : 'var(--space-4)',
    ...(orientation === 'vertical' && {
      borderLeft: '1px solid var(--color-border)',
      marginLeft: 'var(--space-1)'
    })
  });
  
  // Find active tab content
  const activeTabData = tabs.find(tab => tab.id === currentActiveTab);
  
  return (
    <div
      ref={ref}
      className={`vistara-tabs vistara-tabs--${variant} vistara-tabs--${orientation} ${className || ''}`}
      style={{ ...baseStyles, ...style }}
      {...props}
    >
      {/* Tab List Container */}
      <div style={tabListContainerStyles}>
        {/* Left scroll button */}
        {scrollable && showScrollButtons && orientation === 'horizontal' && (
          <button
            style={scrollButtonStyles}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
        )}
        
        {/* Tab List */}
        <ul
          ref={tabListRef}
          role="tablist"
          style={getTabListStyles()}
          aria-orientation={orientation}
        >
          {/* Indicator */}
          <div style={getIndicatorStyles()} />
          
          {/* Tabs */}
          {tabs.map((tab) => {
            const isActive = tab.id === currentActiveTab;
            
            return (
              <li key={tab.id} role="none">
                <button
                  ref={isActive ? activeTabRef : null}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  style={getTabStyles(tab, isActive)}
                  onClick={(e) => handleTabChange(tab.id, tab, e)}
                  disabled={tab.disabled}
                >
                  {/* Icon */}
                  {tab.icon && (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {tab.icon}
                    </span>
                  )}
                  
                  {/* Label */}
                  <span>{tab.label}</span>
                  
                  {/* Badge */}
                  {tab.badge && (
                    <span
                      style={normalizeStyle({
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
                        paddingRight: '6px'
                      })}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        
        {/* Right scroll button */}
        {scrollable && showScrollButtons && orientation === 'horizontal' && (
          <button
            style={scrollButtonStyles}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        )}
      </div>
      
      {/* Tab Content */}
      <div style={contentStyles}>
        {tabs.map((tab) => {
          const isActive = tab.id === currentActiveTab;
          const shouldRender = isActive || keepMounted || !lazy;
          
          if (!shouldRender) return null;
          
          return (
            <div
              key={tab.id}
              id={`panel-${tab.id}`}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={tab.id}
              style={{
                display: isActive ? 'block' : 'none',
                outline: 'none'
              }}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
});

TabsNavigation.displayName = 'TabsNavigation';

export default TabsNavigation;