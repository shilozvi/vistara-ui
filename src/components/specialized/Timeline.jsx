/**
 * 🎯 Vistara UI - Timeline Component
 * "Command your Design."
 * 
 * רכיב ציר זמן מתקדם עם אינטראקטיביות ואנימציות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Timeline = forwardRef(({ 
  // Items
  items = [], // [{ id, date, title, description?, icon?, color?, status?, media?, tags? }]
  
  // Layout
  orientation = 'vertical', // 'vertical', 'horizontal'
  alignment = 'left', // 'left', 'right', 'alternate', 'center'
  
  // Display options
  showConnector = true,
  showDates = true,
  showIcons = true,
  showTags = true,
  dateFormat = 'short', // 'short', 'long', 'relative', 'custom'
  
  // Visual elements
  connectorStyle = 'solid', // 'solid', 'dashed', 'dotted', 'gradient'
  nodeSize = 'normal', // 'small', 'normal', 'large'
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'colorful'
  variant = 'default', // 'default', 'cards', 'detailed'
  
  // Animation
  animated = true,
  animationDuration = 500,
  staggerDelay = 100,
  
  // Interaction
  collapsible = false,
  initialExpanded = true,
  
  // Callbacks
  onItemClick,
  onItemHover,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [expandedItems, setExpandedItems] = useState(new Set(
    initialExpanded ? items.map(item => item.id) : []
  ));
  const [hoveredItem, setHoveredItem] = useState(null);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const containerRef = useRef(null);
  
  // Intersection observer for animations
  useEffect(() => {
    if (!animated) {
      setVisibleItems(new Set(items.map(item => item.id)));
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-item-id');
            setVisibleItems(prev => new Set([...prev, itemId]));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe all timeline items
    const itemElements = containerRef.current?.querySelectorAll('[data-item-id]');
    itemElements?.forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, [items, animated]);
  
  // Handle item click
  const handleItemClick = (item, event) => {
    if (collapsible) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    }
    
    onItemClick?.(item, event);
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    switch (dateFormat) {
      case 'short':
        return dateObj.toLocaleDateString();
      case 'long':
        return dateObj.toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'relative':
        const now = new Date();
        const diff = now - dateObj;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
      default:
        return dateObj.toLocaleDateString();
    }
  };
  
  // Get item color
  const getItemColor = (item) => {
    if (item.color) return item.color;
    
    const colorMap = {
      completed: 'var(--color-success)',
      active: 'var(--color-primary)',
      pending: 'var(--color-warning)',
      cancelled: 'var(--color-danger)',
      default: 'var(--color-text-muted)'
    };
    
    return colorMap[item.status] || colorMap.default;
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      position: 'relative',
      width: '100%',
      
      // Theme variations
      ...(theme === 'modern' && {
        backgroundColor: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-xl)',
        padding: 'var(--space-4)'
      })
    });
  };
  
  // Timeline wrapper styles
  const getTimelineWrapperStyles = () => {
    return normalizeStyle({
      display: 'flex',
      flexDirection: orientation === 'horizontal' ? 'row' : 'column',
      gap: orientation === 'horizontal' ? 0 : 'var(--space-4)',
      position: 'relative',
      padding: orientation === 'horizontal' ? 'var(--space-4) 0' : 0,
      overflowX: orientation === 'horizontal' ? 'auto' : 'visible'
    });
  };
  
  // Connector line styles
  const getConnectorStyles = () => {
    if (!showConnector) return null;
    
    const connectorStyleMap = {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted'
    };
    
    return normalizeStyle({
      position: 'absolute',
      backgroundColor: connectorStyle === 'gradient' ? 
        'transparent' : 'var(--color-border)',
      backgroundImage: connectorStyle === 'gradient' ? 
        'linear-gradient(180deg, var(--color-primary) 0%, var(--color-info) 100%)' : 'none',
      borderStyle: connectorStyleMap[connectorStyle] || 'solid',
      
      ...(orientation === 'vertical' && {
        width: '2px',
        top: 0,
        bottom: 0,
        left: alignment === 'center' ? '50%' : 
              alignment === 'right' ? 'calc(100% - 20px)' : '20px',
        transform: alignment === 'center' ? 'translateX(-50%)' : 'none'
      }),
      
      ...(orientation === 'horizontal' && {
        height: '2px',
        left: 0,
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)'
      })
    });
  };
  
  // Item container styles
  const getItemContainerStyles = (item, index) => {
    const isVisible = visibleItems.has(item.id);
    const isExpanded = expandedItems.has(item.id);
    const isAlternate = alignment === 'alternate' && index % 2 === 1;
    
    return normalizeStyle({
      display: 'flex',
      alignItems: orientation === 'vertical' ? 'flex-start' : 'center',
      gap: 'var(--space-3)',
      opacity: animated ? (isVisible ? 1 : 0) : 1,
      transform: animated ? 
        (isVisible ? 'translateX(0)' : 
          alignment === 'right' || isAlternate ? 'translateX(-20px)' : 'translateX(20px)') : 'none',
      transition: animated ? 
        `all ${animationDuration}ms ease ${index * staggerDelay}ms` : 'none',
      
      ...(orientation === 'vertical' && {
        flexDirection: alignment === 'right' || isAlternate ? 'row-reverse' : 'row',
        width: '100%',
        marginBottom: 'var(--space-4)'
      }),
      
      ...(orientation === 'horizontal' && {
        flexDirection: 'column',
        minWidth: '200px',
        flex: '0 0 auto'
      }),
      
      ...(alignment === 'center' && orientation === 'vertical' && {
        paddingLeft: isAlternate ? '50%' : 0,
        paddingRight: isAlternate ? 0 : '50%'
      })
    });
  };
  
  // Node styles
  const getNodeStyles = (item) => {
    const color = getItemColor(item);
    const isHovered = hoveredItem === item.id;
    
    const sizeMap = {
      small: { width: '24px', height: '24px', fontSize: '12px' },
      normal: { width: '40px', height: '40px', fontSize: '16px' },
      large: { width: '56px', height: '56px', fontSize: '20px' }
    };
    
    return normalizeStyle({
      ...sizeMap[nodeSize],
      borderRadius: '50%',
      backgroundColor: theme === 'colorful' ? color : 'var(--color-surface)',
      border: `3px solid ${color}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      position: 'relative',
      zIndex: 1,
      cursor: collapsible || onItemClick ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      color: theme === 'colorful' ? 'white' : color,
      
      ...(isHovered && {
        transform: 'scale(1.1)',
        boxShadow: `0 0 0 4px ${color}20`
      })
    });
  };
  
  // Content styles
  const getContentStyles = (item, index) => {
    const isAlternate = alignment === 'alternate' && index % 2 === 1;
    
    return normalizeStyle({
      flex: 1,
      minWidth: 0,
      textAlign: alignment === 'right' || isAlternate ? 'right' : 'left',
      
      ...(variant === 'cards' && {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        cursor: onItemClick ? 'pointer' : 'default',
        
        ':hover': {
          boxShadow: 'var(--shadow-md)',
          transform: 'translateY(-2px)'
        }
      })
    });
  };
  
  // Date styles
  const getDateStyles = (item, index) => {
    const isAlternate = alignment === 'alternate' && index % 2 === 1;
    
    return normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-muted)',
      fontWeight: 'var(--font-weight-medium)',
      marginBottom: 'var(--space-1)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      justifyContent: alignment === 'right' || isAlternate ? 'flex-end' : 'flex-start'
    });
  };
  
  // Title styles
  const getTitleStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-base)' : 'var(--font-size-lg)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)',
      margin: '0 0 var(--space-2) 0',
      lineHeight: 1.3
    });
  };
  
  // Description styles
  const getDescriptionStyles = (isExpanded) => {
    return normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-secondary)',
      lineHeight: 1.5,
      margin: 0,
      maxHeight: collapsible && !isExpanded ? 0 : '1000px',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease',
      opacity: collapsible && !isExpanded ? 0 : 1
    });
  };
  
  // Tag styles
  const getTagStyles = () => {
    return normalizeStyle({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      backgroundColor: 'var(--color-background-secondary)',
      borderRadius: 'var(--border-radius-sm)',
      fontSize: 'var(--font-size-xs)',
      color: 'var(--color-text-secondary)',
      marginRight: 'var(--space-1)',
      marginTop: 'var(--space-1)'
    });
  };
  
  // Icons
  const DefaultIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const CalendarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  return (
    <div
      ref={containerRef}
      className={`vistara-timeline vistara-timeline--${variant} vistara-timeline--${size} vistara-timeline--${orientation} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      <div style={getTimelineWrapperStyles()}>
        {/* Connector line */}
        {showConnector && <div style={getConnectorStyles()} />}
        
        {/* Timeline items */}
        {items.map((item, index) => {
          const isExpanded = expandedItems.has(item.id);
          
          return (
            <div
              key={item.id}
              data-item-id={item.id}
              style={getItemContainerStyles(item, index)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Node */}
              <div
                style={getNodeStyles(item)}
                onClick={(e) => handleItemClick(item, e)}
              >
                {showIcons && (item.icon || <DefaultIcon />)}
              </div>
              
              {/* Content */}
              <div
                style={getContentStyles(item, index)}
                onClick={(e) => variant === 'cards' && handleItemClick(item, e)}
              >
                {/* Date */}
                {showDates && item.date && (
                  <div style={getDateStyles(item, index)}>
                    <CalendarIcon />
                    {formatDate(item.date)}
                  </div>
                )}
                
                {/* Title */}
                <h3 style={getTitleStyles()}>
                  {item.title}
                </h3>
                
                {/* Description */}
                {item.description && (
                  <p style={getDescriptionStyles(isExpanded)}>
                    {item.description}
                  </p>
                )}
                
                {/* Media */}
                {item.media && isExpanded && (
                  <div style={{
                    marginTop: 'var(--space-2)',
                    borderRadius: 'var(--border-radius-md)',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={item.media}
                      alt={item.title}
                      style={{
                        width: '100%',
                        maxWidth: '300px',
                        height: 'auto',
                        display: 'block'
                      }}
                    />
                  </div>
                )}
                
                {/* Tags */}
                {showTags && item.tags && item.tags.length > 0 && (
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    {item.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} style={getTagStyles()}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

Timeline.displayName = 'Timeline';

export default Timeline;