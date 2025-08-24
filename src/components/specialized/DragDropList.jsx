/**
 * 🎯 Vistara UI - DragDropList Component
 * "Command your Design."
 * 
 * רשימה עם גרירה ושחרור מתקדמת
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const DragDropList = forwardRef(({
  // Items
  items = [], // [{ id, content, group?, disabled?, locked? }]
  groups = [], // [{ id, label, color?, maxItems? }]
  
  // Layout
  layout = 'vertical', // 'vertical', 'horizontal', 'grid', 'kanban'
  columns = 3, // For grid/kanban layout
  
  // Behavior
  allowReorder = true,
  allowGrouping = false,
  allowNesting = false,
  maxNestingLevel = 3,
  
  // Visual feedback
  showDragHandle = true,
  showDropZone = true,
  showPlaceholder = true,
  animateDrag = true,
  
  // Constraints
  lockAxis = null, // 'x', 'y', null
  dragThreshold = 5, // pixels before drag starts
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'cards'
  variant = 'default', // 'default', 'bordered', 'elevated'
  
  // Callbacks
  onReorder,
  onDragStart,
  onDragEnd,
  onDrop,
  onGroupChange,
  
  // Item renderer
  renderItem,
  renderGroup,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [localItems, setLocalItems] = useState(items);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [draggedOverGroup, setDraggedOverGroup] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState(null); // 'before', 'after', 'inside'
  
  const containerRef = useRef(null);
  const dragImageRef = useRef(null);
  
  // Update items when prop changes
  useEffect(() => {
    setLocalItems(items);
  }, [items]);
  
  // Group items by group id
  const groupedItems = groups.length > 0 ? groups.reduce((acc, group) => {
    acc[group.id] = localItems.filter(item => item.group === group.id);
    return acc;
  }, {}) : { default: localItems };
  
  // Handle drag start
  const handleDragStart = (e, item, index) => {
    if (item.disabled || item.locked || !allowReorder) {
      e.preventDefault();
      return;
    }
    
    setDraggedItem({ item, index });
    setIsDragging(true);
    
    // Set drag image
    if (dragImageRef.current) {
      e.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
    
    // Set drag data
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    
    // Calculate offset
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    onDragStart?.(item, index);
  };
  
  // Handle drag over
  const handleDragOver = (e, overItem, overIndex, overGroup) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!draggedItem) return;
    
    // Calculate drop position
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    let position = 'after';
    if (allowNesting && overItem && !overItem.locked) {
      // Check if dropping inside
      if (y > height * 0.3 && y < height * 0.7) {
        position = 'inside';
      } else if (y < height * 0.5) {
        position = 'before';
      }
    } else {
      position = y < height * 0.5 ? 'before' : 'after';
    }
    
    setDraggedOverItem({ item: overItem, index: overIndex });
    setDraggedOverGroup(overGroup);
    setDropPosition(position);
  };
  
  // Handle drag leave
  const handleDragLeave = (e) => {
    // Only clear if leaving the container
    if (e.currentTarget.contains(e.relatedTarget)) return;
    
    setDraggedOverItem(null);
    setDraggedOverGroup(null);
    setDropPosition(null);
  };
  
  // Handle drop
  const handleDrop = (e, targetItem, targetIndex, targetGroup) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const newItems = [...localItems];
    const { item: sourceItem, index: sourceIndex } = draggedItem;
    
    // Remove from source
    const sourceGroupItems = groupedItems[sourceItem.group || 'default'];
    const actualSourceIndex = localItems.findIndex(i => i.id === sourceItem.id);
    newItems.splice(actualSourceIndex, 1);
    
    // Add to target
    if (targetItem && dropPosition === 'inside' && allowNesting) {
      // Nest inside target item
      const updatedItem = { ...sourceItem, parent: targetItem.id };
      const targetIdx = newItems.findIndex(i => i.id === targetItem.id);
      newItems.splice(targetIdx + 1, 0, updatedItem);
    } else {
      // Regular reorder
      let insertIndex = targetIndex;
      
      if (targetGroup && targetGroup !== (sourceItem.group || 'default')) {
        // Moving to different group
        sourceItem.group = targetGroup === 'default' ? undefined : targetGroup;
        
        if (allowGrouping && groups.length > 0) {
          // Find insertion point in target group
          const targetGroupItems = groupedItems[targetGroup] || [];
          if (targetGroupItems.length === 0) {
            insertIndex = newItems.length;
          } else {
            const lastItemInGroup = targetGroupItems[targetGroupItems.length - 1];
            insertIndex = newItems.findIndex(i => i.id === lastItemInGroup.id) + 1;
          }
        }
      } else {
        // Same group reorder
        if (dropPosition === 'before') {
          insertIndex = targetIndex;
        } else {
          insertIndex = targetIndex + 1;
        }
        
        // Adjust index if source was before target
        if (actualSourceIndex < targetIndex) {
          insertIndex--;
        }
      }
      
      newItems.splice(insertIndex, 0, sourceItem);
    }
    
    setLocalItems(newItems);
    onReorder?.(newItems, sourceItem, targetItem);
    onDrop?.(sourceItem, targetItem, dropPosition);
    
    // Reset drag state
    setDraggedItem(null);
    setDraggedOverItem(null);
    setDraggedOverGroup(null);
    setDropPosition(null);
    setIsDragging(false);
  };
  
  // Handle drag end
  const handleDragEnd = (e) => {
    setIsDragging(false);
    setDraggedItem(null);
    setDraggedOverItem(null);
    setDraggedOverGroup(null);
    setDropPosition(null);
    
    onDragEnd?.();
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      width: '100%',
      
      ...(layout === 'grid' && {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 'var(--space-4)'
      }),
      
      ...(layout === 'kanban' && {
        display: 'flex',
        gap: 'var(--space-4)',
        overflowX: 'auto'
      })
    });
  };
  
  // Group container styles
  const getGroupContainerStyles = () => {
    return normalizeStyle({
      ...(layout === 'kanban' && {
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column'
      }),
      
      ...(theme === 'cards' && {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-3)',
        boxShadow: 'var(--shadow-sm)'
      })
    });
  };
  
  // Group header styles
  const getGroupHeaderStyles = (group) => {
    return normalizeStyle({
      padding: 'var(--space-3)',
      marginBottom: 'var(--space-3)',
      fontSize: 'var(--font-size-lg)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)',
      borderBottom: '2px solid ' + (group.color || 'var(--color-border)'),
      
      ...(theme === 'minimal' && {
        borderBottom: 'none',
        marginBottom: 'var(--space-2)'
      })
    });
  };
  
  // List styles
  const getListStyles = () => {
    return normalizeStyle({
      display: layout === 'horizontal' ? 'flex' : 'flex',
      flexDirection: layout === 'horizontal' ? 'row' : 'column',
      gap: size === 'compact' ? 'var(--space-2)' : 'var(--space-3)',
      minHeight: showDropZone ? '100px' : 'auto',
      position: 'relative',
      
      ...(variant === 'bordered' && {
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-3)'
      })
    });
  };
  
  // Item styles
  const getItemStyles = (item, isDraggedOver) => {
    const isBeingDragged = draggedItem?.item.id === item.id;
    
    return normalizeStyle({
      padding: size === 'compact' ? 'var(--space-2)' : 'var(--space-3)',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      cursor: item.disabled || item.locked ? 'not-allowed' : 'move',
      opacity: isBeingDragged ? 0.5 : item.disabled ? 0.6 : 1,
      transition: animateDrag ? 'all 0.2s ease' : 'none',
      userSelect: 'none',
      position: 'relative',
      
      ...(variant === 'elevated' && {
        boxShadow: 'var(--shadow-sm)',
        ':hover': {
          boxShadow: 'var(--shadow-md)'
        }
      }),
      
      ...(theme === 'modern' && {
        backgroundColor: 'var(--color-background-secondary)',
        border: 'none'
      }),
      
      ...(isDraggedOver && dropPosition === 'inside' && {
        backgroundColor: 'var(--color-primary-light)',
        border: '2px solid var(--color-primary)'
      })
    });
  };
  
  // Placeholder styles
  const getPlaceholderStyles = (position) => {
    if (!showPlaceholder || !isDragging || position !== 'before' && position !== 'after') {
      return { display: 'none' };
    }
    
    return normalizeStyle({
      position: 'absolute',
      backgroundColor: 'var(--color-primary)',
      opacity: 0.3,
      zIndex: 1,
      pointerEvents: 'none',
      
      ...(layout === 'horizontal' ? {
        width: '3px',
        height: '100%',
        top: 0,
        [position === 'before' ? 'left' : 'right']: '-2px'
      } : {
        height: '3px',
        width: '100%',
        left: 0,
        [position === 'before' ? 'top' : 'bottom']: '-2px'
      })
    });
  };
  
  // Drag handle styles
  const getDragHandleStyles = () => {
    return normalizeStyle({
      display: showDragHandle ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      color: 'var(--color-text-muted)',
      cursor: 'grab',
      marginRight: 'var(--space-2)',
      flexShrink: 0,
      
      ':active': {
        cursor: 'grabbing'
      }
    });
  };
  
  // Drop zone styles
  const getDropZoneStyles = (isActive) => {
    if (!showDropZone || localItems.length > 0) return { display: 'none' };
    
    return normalizeStyle({
      border: '2px dashed var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      padding: 'var(--space-6)',
      textAlign: 'center',
      color: 'var(--color-text-muted)',
      backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
      transition: 'all 0.2s ease'
    });
  };
  
  // Render drag handle
  const DragHandle = () => (
    <div style={getDragHandleStyles()}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="5" r="1" fill="currentColor" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="9" cy="19" r="1" fill="currentColor" />
        <circle cx="15" cy="5" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
        <circle cx="15" cy="19" r="1" fill="currentColor" />
      </svg>
    </div>
  );
  
  // Render item
  const renderListItem = (item, index, groupId = 'default') => {
    const isDraggedOver = draggedOverItem?.item?.id === item.id;
    const showPlaceholderBefore = isDraggedOver && dropPosition === 'before';
    const showPlaceholderAfter = isDraggedOver && dropPosition === 'after';
    
    return (
      <div
        key={item.id}
        draggable={!item.disabled && !item.locked && allowReorder}
        onDragStart={(e) => handleDragStart(e, item, index)}
        onDragOver={(e) => handleDragOver(e, item, index, groupId)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, item, index, groupId)}
        onDragEnd={handleDragEnd}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {showPlaceholderBefore && <div style={getPlaceholderStyles('before')} />}
        
        <div style={getItemStyles(item, isDraggedOver && dropPosition === 'inside')}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {showDragHandle && <DragHandle />}
            
            {renderItem ? (
              renderItem(item, index, isDraggedOver)
            ) : (
              <div style={{ flex: 1 }}>
                {item.content || `Item ${index + 1}`}
              </div>
            )}
          </div>
          
          {/* Nested items */}
          {allowNesting && item.children && (
            <div style={{ marginLeft: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              {item.children.map((child, childIndex) => 
                renderListItem(child, childIndex, groupId)
              )}
            </div>
          )}
        </div>
        
        {showPlaceholderAfter && <div style={getPlaceholderStyles('after')} />}
      </div>
    );
  };
  
  // Render group
  const renderGroupSection = (groupId, group) => {
    const items = groupedItems[groupId] || [];
    const isDraggedOver = draggedOverGroup === groupId;
    
    return (
      <div
        key={groupId}
        style={getGroupContainerStyles()}
        onDragOver={(e) => {
          e.preventDefault();
          setDraggedOverGroup(groupId);
        }}
        onDragLeave={() => setDraggedOverGroup(null)}
        onDrop={(e) => handleDrop(e, null, items.length, groupId)}
      >
        {group && renderGroup ? (
          renderGroup(group, items.length)
        ) : group ? (
          <div style={getGroupHeaderStyles(group)}>
            {group.label}
            {group.maxItems && (
              <span style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
                marginLeft: 'var(--space-2)'
              }}>
                ({items.length}/{group.maxItems})
              </span>
            )}
          </div>
        ) : null}
        
        <div style={getListStyles()}>
          {items.length === 0 ? (
            <div style={getDropZoneStyles(isDraggedOver)}>
              Drop items here
            </div>
          ) : (
            items.map((item, index) => renderListItem(item, index, groupId))
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div
      ref={containerRef}
      className={`vistara-drag-drop-list vistara-drag-drop-list--${variant} vistara-drag-drop-list--${size} vistara-drag-drop-list--${layout} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {/* Hidden drag image */}
      <div
        ref={dragImageRef}
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '200px',
          padding: 'var(--space-2)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--border-radius-md)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {draggedItem?.item.content || 'Dragging...'}
      </div>
      
      {/* Render groups or single list */}
      {groups.length > 0 && allowGrouping ? (
        Object.keys(groupedItems).map(groupId => {
          const group = groups.find(g => g.id === groupId);
          return renderGroupSection(groupId, group);
        })
      ) : (
        renderGroupSection('default', null)
      )}
    </div>
  );
});

DragDropList.displayName = 'DragDropList';

export default DragDropList;