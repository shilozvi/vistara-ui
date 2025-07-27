/**
 * 🎯 Vistara UI - Kanban Component
 * "Command your Design."
 * 
 * לוח קאנבן מתקדם עם גרירה ושחרור
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Kanban = forwardRef(({
  // Columns and cards
  columns = [], // [{ id, title, color?, limit?, cards: [{ id, title, description?, assignee?, tags?, priority? }] }]
  
  // Behavior
  allowDrag = true,
  allowAddCard = true,
  allowEditCard = true,
  allowDeleteCard = true,
  allowColumnEdit = false,
  
  // Constraints
  columnLimits = true, // Enforce WIP limits
  allowCrossColumnDrag = true,
  
  // Visual options
  showCardCount = true,
  showColumnActions = true,
  showCardTags = true,
  showCardAssignee = true,
  showCardPriority = true,
  cardLayout = 'default', // 'default', 'compact', 'detailed'
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'colorful'
  variant = 'default', // 'default', 'bordered', 'elevated'
  
  // Callbacks
  onCardMove,
  onCardAdd,
  onCardEdit,
  onCardDelete,
  onColumnEdit,
  
  // Custom renderers
  renderCard,
  renderColumnHeader,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [localColumns, setLocalColumns] = useState(columns);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  const [draggedOverCard, setDraggedOverCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [addingCard, setAddingCard] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  
  const containerRef = useRef(null);
  
  // Update columns when prop changes
  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);
  
  // Handle drag start
  const handleDragStart = (e, card, columnId) => {
    if (!allowDrag) return;
    
    setDraggedCard({ card, columnId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ card, columnId }));
  };
  
  // Handle drag over
  const handleDragOver = (e, columnId, cardId = null) => {
    e.preventDefault();
    if (!allowDrag || !draggedCard) return;
    
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverColumn(columnId);
    setDraggedOverCard(cardId);
  };
  
  // Handle drop
  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!allowDrag || !draggedCard || !allowCrossColumnDrag && draggedCard.columnId !== targetColumnId) return;
    
    const { card, columnId: sourceColumnId } = draggedCard;
    
    // Check column limit
    if (columnLimits) {
      const targetColumn = localColumns.find(col => col.id === targetColumnId);
      if (targetColumn.limit && targetColumn.cards.length >= targetColumn.limit && sourceColumnId !== targetColumnId) {
        // Column is full
        setDraggedCard(null);
        setDraggedOverColumn(null);
        setDraggedOverCard(null);
        return;
      }
    }
    
    // Update columns
    const newColumns = localColumns.map(column => {
      if (column.id === sourceColumnId) {
        // Remove from source
        return {
          ...column,
          cards: column.cards.filter(c => c.id !== card.id)
        };
      } else if (column.id === targetColumnId) {
        // Add to target
        const newCards = [...column.cards];
        
        // Find insert position
        if (draggedOverCard) {
          const index = newCards.findIndex(c => c.id === draggedOverCard);
          newCards.splice(index + 1, 0, card);
        } else {
          newCards.push(card);
        }
        
        return {
          ...column,
          cards: newCards
        };
      }
      return column;
    });
    
    setLocalColumns(newColumns);
    onCardMove?.(card, sourceColumnId, targetColumnId);
    
    // Reset drag state
    setDraggedCard(null);
    setDraggedOverColumn(null);
    setDraggedOverCard(null);
  };
  
  // Handle add card
  const handleAddCard = (columnId) => {
    if (!newCardTitle.trim()) return;
    
    const newCard = {
      id: Date.now().toString(),
      title: newCardTitle,
      createdAt: new Date()
    };
    
    const newColumns = localColumns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: [...column.cards, newCard]
        };
      }
      return column;
    });
    
    setLocalColumns(newColumns);
    onCardAdd?.(newCard, columnId);
    setNewCardTitle('');
    setAddingCard(null);
  };
  
  // Handle delete card
  const handleDeleteCard = (cardId, columnId) => {
    const newColumns = localColumns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: column.cards.filter(c => c.id !== cardId)
        };
      }
      return column;
    });
    
    setLocalColumns(newColumns);
    onCardDelete?.(cardId, columnId);
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      display: 'flex',
      gap: 'var(--space-4)',
      padding: 'var(--space-4)',
      overflowX: 'auto',
      minHeight: '500px',
      backgroundColor: theme === 'modern' ? 'var(--color-background-secondary)' : 'transparent'
    });
  };
  
  // Column styles
  const getColumnStyles = (column) => {
    const isDraggedOver = draggedOverColumn === column.id;
    
    return normalizeStyle({
      flex: '0 0 300px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-lg)',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      
      ...(variant === 'bordered' && {
        border: '1px solid var(--color-border)'
      }),
      
      ...(variant === 'elevated' && {
        boxShadow: 'var(--shadow-md)'
      }),
      
      ...(isDraggedOver && {
        backgroundColor: 'var(--color-primary-light)',
        transform: 'scale(1.02)'
      })
    });
  };
  
  // Column header styles
  const getColumnHeaderStyles = (column) => {
    return normalizeStyle({
      padding: size === 'compact' ? 'var(--space-3)' : 'var(--space-4)',
      backgroundColor: column.color || 'var(--color-background-secondary)',
      borderBottom: '2px solid ' + (column.color || 'var(--color-border)'),
      
      ...(theme === 'minimal' && {
        backgroundColor: 'transparent',
        borderBottom: 'none'
      })
    });
  };
  
  // Column title styles
  const getColumnTitleStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-base)' : 'var(--font-size-lg)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)',
      marginBottom: 'var(--space-1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    });
  };
  
  // Card count styles
  const getCardCountStyles = (column) => {
    const isAtLimit = columnLimits && column.limit && column.cards.length >= column.limit;
    
    return normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      color: isAtLimit ? 'var(--color-danger)' : 'var(--color-text-muted)',
      fontWeight: isAtLimit ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)'
    });
  };
  
  // Cards container styles
  const getCardsContainerStyles = () => {
    return normalizeStyle({
      flex: 1,
      padding: 'var(--space-3)',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    });
  };
  
  // Card styles
  const getCardStyles = (card, isDragging) => {
    return normalizeStyle({
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      padding: cardLayout === 'compact' ? 'var(--space-2)' : 'var(--space-3)',
      cursor: allowDrag ? 'move' : 'default',
      opacity: isDragging ? 0.5 : 1,
      transition: 'all 0.2s ease',
      
      ...(theme === 'colorful' && {
        borderLeftWidth: '4px',
        borderLeftColor: card.priority === 'high' ? 'var(--color-danger)' :
                        card.priority === 'medium' ? 'var(--color-warning)' : 'var(--color-success)'
      }),
      
      ':hover': {
        boxShadow: 'var(--shadow-md)',
        transform: 'translateY(-2px)'
      }
    });
  };
  
  // Card title styles
  const getCardTitleStyles = () => {
    return normalizeStyle({
      fontSize: cardLayout === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-primary)',
      marginBottom: cardLayout === 'compact' ? 'var(--space-1)' : 'var(--space-2)'
    });
  };
  
  // Card description styles
  const getCardDescriptionStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-secondary)',
      lineHeight: 1.4,
      marginBottom: 'var(--space-2)',
      display: cardLayout === 'compact' ? 'none' : 'block'
    });
  };
  
  // Tag styles
  const getTagStyles = (tag) => {
    return normalizeStyle({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      backgroundColor: 'var(--color-background-secondary)',
      borderRadius: 'var(--border-radius-sm)',
      fontSize: 'var(--font-size-xs)',
      color: 'var(--color-text-secondary)',
      marginRight: 'var(--space-1)'
    });
  };
  
  // Priority indicator styles
  const getPriorityStyles = (priority) => {
    const colors = {
      high: 'var(--color-danger)',
      medium: 'var(--color-warning)',
      low: 'var(--color-success)'
    };
    
    return normalizeStyle({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: colors[priority] || 'var(--color-text-muted)',
      marginLeft: 'var(--space-2)'
    });
  };
  
  // Add card button styles
  const getAddCardButtonStyles = () => {
    return normalizeStyle({
      width: '100%',
      padding: 'var(--space-3)',
      backgroundColor: 'transparent',
      border: '1px dashed var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      color: 'var(--color-text-muted)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: 'var(--font-size-sm)',
      
      ':hover': {
        backgroundColor: 'var(--color-background-secondary)',
        borderColor: 'var(--color-primary)'
      }
    });
  };
  
  // Add card input styles
  const getAddCardInputStyles = () => {
    return normalizeStyle({
      width: '100%',
      padding: 'var(--space-2)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-sm)',
      fontSize: 'var(--font-size-sm)',
      outline: 'none',
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
      
      ':focus': {
        borderColor: 'var(--color-primary)'
      }
    });
  };
  
  // Render card
  const renderKanbanCard = (card, columnId, isDragging) => {
    if (renderCard) {
      return renderCard(card, columnId, isDragging);
    }
    
    return (
      <div
        key={card.id}
        draggable={allowDrag}
        onDragStart={(e) => handleDragStart(e, card, columnId)}
        onDragOver={(e) => handleDragOver(e, columnId, card.id)}
        style={getCardStyles(card, isDragging)}
      >
        <div style={getCardTitleStyles()}>
          {card.title}
          {showCardPriority && card.priority && (
            <div style={getPriorityStyles(card.priority)} />
          )}
        </div>
        
        {card.description && (
          <div style={getCardDescriptionStyles()}>
            {card.description}
          </div>
        )}
        
        {showCardTags && card.tags && card.tags.length > 0 && (
          <div style={{ marginBottom: 'var(--space-2)' }}>
            {card.tags.map((tag, index) => (
              <span key={index} style={getTagStyles(tag)}>
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {showCardAssignee && card.assignee && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-contrast)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 'var(--font-weight-bold)',
              marginRight: 'var(--space-2)'
            }}>
              {card.assignee.charAt(0).toUpperCase()}
            </div>
            {card.assignee}
          </div>
        )}
        
        {allowDeleteCard && (
          <button
            style={{
              position: 'absolute',
              top: 'var(--space-2)',
              right: 'var(--space-2)',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: 'var(--border-radius-sm)',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              ':hover': {
                backgroundColor: 'var(--color-danger-light)',
                color: 'var(--color-danger)'
              }
            }}
            onClick={() => handleDeleteCard(card.id, columnId)}
          >
            ×
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div
      ref={containerRef}
      className={`vistara-kanban vistara-kanban--${variant} vistara-kanban--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {localColumns.map(column => (
        <div
          key={column.id}
          style={getColumnStyles(column)}
          onDragOver={(e) => handleDragOver(e, column.id)}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column Header */}
          <div style={getColumnHeaderStyles(column)}>
            {renderColumnHeader ? (
              renderColumnHeader(column)
            ) : (
              <>
                <div style={getColumnTitleStyles()}>
                  <span>{column.title}</span>
                  {showCardCount && (
                    <span style={getCardCountStyles(column)}>
                      {column.cards.length}
                      {column.limit && ` / ${column.limit}`}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Cards */}
          <div style={getCardsContainerStyles()}>
            {column.cards.map(card => 
              renderKanbanCard(
                card, 
                column.id, 
                draggedCard?.card.id === card.id
              )
            )}
            
            {/* Add Card */}
            {allowAddCard && (
              addingCard === column.id ? (
                <div>
                  <input
                    type="text"
                    value={newCardTitle}
                    onChange={(e) => setNewCardTitle(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCard(column.id);
                      }
                    }}
                    onBlur={() => {
                      if (!newCardTitle.trim()) {
                        setAddingCard(null);
                      }
                    }}
                    style={getAddCardInputStyles()}
                    placeholder="Enter card title..."
                    autoFocus
                  />
                  <div style={{
                    display: 'flex',
                    gap: 'var(--space-2)',
                    marginTop: 'var(--space-2)'
                  }}>
                    <button
                      onClick={() => handleAddCard(column.id)}
                      style={{
                        padding: 'var(--space-1) var(--space-3)',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-primary-contrast)',
                        border: 'none',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setAddingCard(null);
                        setNewCardTitle('');
                      }}
                      style={{
                        padding: 'var(--space-1) var(--space-3)',
                        backgroundColor: 'transparent',
                        color: 'var(--color-text-muted)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: 'var(--font-size-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingCard(column.id)}
                  style={getAddCardButtonStyles()}
                >
                  + Add a card
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

Kanban.displayName = 'Kanban';

export default Kanban;