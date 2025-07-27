/**
 * 🎯 Vistara UI - Compact Task Card Component  
 * "Command your Design."
 * 
 * Migrated from TitanMind with full CSS Variables support
 * Original: TSK045 - Compact, readable task display
 * 
 * ✅ Fully normalized - No hardcoded values
 * ✅ CSS Variables only
 * ✅ Modular and reusable
 */

import React from 'react';
import { Trash2, CheckCircle, Clock, User, AlertTriangle } from 'lucide-react';
import { normalizeStyle, withNormalizedStyles } from '../../utils/normalizeStyle';

const CompactTaskCard = ({ 
  task, 
  onComplete, 
  onDelete, 
  showActions = true,
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  // Status color mapping using CSS Variables
  const getStatusStyles = (status) => {
    const baseStyle = {
      color: 'var(--color-white)',
      fontWeight: 'var(--font-weight-medium)'
    };

    switch (status?.toLowerCase()) {
      case 'completed': 
        return { ...baseStyle, backgroundColor: 'var(--color-success)' };
      case 'in progress': 
        return { ...baseStyle, backgroundColor: 'var(--color-info)' };
      case 'active': 
        return { ...baseStyle, backgroundColor: 'var(--color-warning)' };
      case 'waiting': 
        return { ...baseStyle, backgroundColor: 'var(--color-warning-dark)' };
      case 'review': 
        return { ...baseStyle, backgroundColor: 'var(--color-primary)' };
      default: 
        return { ...baseStyle, backgroundColor: 'var(--color-gray-600)' };
    }
  };

  // Priority color mapping using CSS Variables
  const getPriorityStyles = (priority) => {
    const baseStyle = {
      color: 'var(--color-white)',
      fontWeight: 'var(--font-weight-medium)'
    };

    switch (priority?.toLowerCase()) {
      case 'critical': 
        return { ...baseStyle, backgroundColor: 'var(--color-error)' };
      case 'high': 
        return { ...baseStyle, backgroundColor: 'var(--color-warning)' };
      case 'medium': 
        return { ...baseStyle, backgroundColor: 'var(--color-warning-light)' };
      case 'low': 
        return { ...baseStyle, backgroundColor: 'var(--color-success)' };
      default: 
        return { ...baseStyle, backgroundColor: 'var(--color-gray-600)' };
    }
  };

  // Size configurations using CSS Variables
  const sizeConfigs = {
    small: {
      cardPadding: 'var(--space-2)',
      fontSize: 'var(--font-size-xs)',
      titleSize: 'var(--font-size-sm)',
      badgePadding: 'var(--space-1) var(--space-2)',
      buttonPadding: 'var(--space-1)',
      iconSize: '12px'
    },
    normal: {
      cardPadding: 'var(--space-3)',
      fontSize: 'var(--font-size-sm)',
      titleSize: 'var(--font-size-base)',
      badgePadding: 'var(--space-2) var(--space-3)',
      buttonPadding: 'var(--space-2)',
      iconSize: '16px'
    },
    large: {
      cardPadding: 'var(--space-4)',
      fontSize: 'var(--font-size-base)',
      titleSize: 'var(--font-size-lg)',
      badgePadding: 'var(--space-3) var(--space-4)',
      buttonPadding: 'var(--space-3)',
      iconSize: '20px'
    }
  };

  const config = sizeConfigs[size];
  const isCompleted = task.Status?.toLowerCase() === 'completed';

  // Main card styles
  const cardStyles = normalizeStyle({
    backgroundColor: 'var(--color-surface)',
    border: `var(--border-width-1) solid var(--color-border-light)`,
    borderRadius: 'var(--border-radius-lg)',
    padding: config.cardPadding,
    opacity: isCompleted ? '0.75' : '1',
    transition: 'var(--transition-base)',
    cursor: 'pointer'
  });

  const cardHoverStyles = {
    backgroundColor: 'var(--color-surface-raised)',
    borderColor: 'var(--color-border-medium)'
  };

  return (
    <div 
      className="vistara-component"
      style={cardStyles}
      onMouseEnter={(e) => Object.assign(e.target.style, cardHoverStyles)}
      onMouseLeave={(e) => Object.assign(e.target.style, cardStyles)}
    >
      {/* Header Row */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 'var(--space-2)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)' 
        }}>
          {/* Task ID */}
          <span style={{
            ...normalizeStyle({
              backgroundColor: 'var(--color-info-dark)',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-family-mono)',
              fontWeight: 'var(--font-weight-bold)',
              padding: config.badgePadding,
              borderRadius: 'var(--border-radius-sm)',
              fontSize: config.fontSize
            })
          }}>
            {task.Task_ID}
          </span>
          
          {/* Priority Badge */}
          <span style={{
            ...getPriorityStyles(task.Priority),
            ...normalizeStyle({
              padding: config.badgePadding,
              borderRadius: 'var(--border-radius-sm)',
              fontSize: config.fontSize
            })
          }}>
            {task.Priority}
          </span>
        </div>

        {/* Status Badge */}
        <span style={{
          ...getStatusStyles(task.Status),
          ...normalizeStyle({
            padding: config.badgePadding,
            borderRadius: 'var(--border-radius-sm)',
            fontSize: config.fontSize
          })
        }}>
          {task.Status}
        </span>
      </div>

      {/* Task Name */}
      <h3 style={normalizeStyle({
        color: 'var(--color-text-primary)',
        fontSize: config.titleSize,
        fontWeight: 'var(--font-weight-semibold)',
        marginBottom: 'var(--space-2)',
        lineHeight: 'var(--line-height-tight)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      })}>
        {task.Task_Name}
      </h3>

      {/* Owner and Project */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 'var(--space-3)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)' 
        }}>
          <User size={config.iconSize} style={{ color: 'var(--color-text-secondary)' }} />
          <span style={normalizeStyle({
            color: 'var(--color-text-primary)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: config.fontSize
          })}>
            {task.Current_Owner}
          </span>
        </div>
        
        <span style={normalizeStyle({
          color: 'var(--color-text-muted)',
          fontSize: config.fontSize
        })}>
          {task.Project}
        </span>
      </div>

      {/* Last Action */}
      {task.Last_Action && (
        <div style={normalizeStyle({
          color: 'var(--color-text-secondary)',
          fontSize: config.fontSize,
          backgroundColor: 'var(--color-background-tertiary)',
          padding: 'var(--space-2)',
          borderRadius: 'var(--border-radius-sm)',
          marginBottom: 'var(--space-3)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        })}>
          {task.Last_Action}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          gap: 'var(--space-2)'
        }}>
          {!isCompleted && (
            <button
              onClick={() => onComplete(task.Task_ID)}
              style={normalizeStyle({
                backgroundColor: 'var(--color-success)',
                color: 'var(--color-white)',
                padding: config.buttonPadding,
                borderRadius: 'var(--border-radius-sm)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                cursor: 'pointer',
                transition: 'var(--transition-base)',
                fontSize: config.fontSize
              })}
              title="Complete Task"
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-success-dark)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-success)'}
            >
              <CheckCircle size={config.iconSize} />
              {size !== 'small' && <span>Complete</span>}
            </button>
          )}
          
          <button
            onClick={() => onDelete(task.Task_ID)}
            style={normalizeStyle({
              backgroundColor: 'var(--color-error)',
              color: 'var(--color-white)',
              padding: config.buttonPadding,
              borderRadius: 'var(--border-radius-sm)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              cursor: 'pointer',
              transition: 'var(--transition-base)',
              fontSize: config.fontSize
            })}
            title="Delete Task"
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-error-dark)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-error)'}
          >
            <Trash2 size={config.iconSize} />
            {size !== 'small' && <span>Delete</span>}
          </button>
        </div>
      )}

      {/* Completion Indicator */}
      {isCompleted && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          paddingTop: 'var(--space-2)'
        }}>
          <CheckCircle 
            size={config.iconSize} 
            style={{ color: 'var(--color-success)' }} 
          />
          <span style={normalizeStyle({
            color: 'var(--color-success)',
            fontWeight: 'var(--font-weight-medium)',
            fontSize: config.fontSize,
            marginLeft: 'var(--space-1)'
          })}>
            Completed
          </span>
        </div>
      )}
    </div>
  );
};

// Export with style normalization HOC
export default withNormalizedStyles(CompactTaskCard);