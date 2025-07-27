/**
 * 🎯 Vistara UI - ToggleSwitch Component
 * "Command your Design."
 * 
 * מתג הפעלה/כיבוי מתקדם עם אנימציות
 */

import React, { forwardRef, useState } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const ToggleSwitch = forwardRef(({ 
  // Value & state
  checked,
  defaultChecked = false,
  
  // Behavior
  disabled = false,
  readOnly = false,
  
  // Content
  label,
  description,
  onLabel = 'ON',
  offLabel = 'OFF',
  showLabels = false,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  color = 'primary', // 'primary', 'success', 'warning', 'danger'
  
  // Layout
  labelPosition = 'right', // 'left', 'right', 'top', 'bottom'
  
  // Icons
  checkedIcon,
  uncheckedIcon,
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  
  // Standard props
  id,
  name,
  value,
  className,
  style,
  ...props
}, ref) => {
  
  const [focused, setFocused] = useState(false);
  const isChecked = checked !== undefined ? checked : defaultChecked;
  
  // Handle change
  const handleChange = (event) => {
    if (disabled || readOnly) return;
    const newChecked = !isChecked;
    onChange?.(event, newChecked);
  };
  
  // Handle focus
  const handleFocus = (event) => {
    setFocused(true);
    onFocus?.(event);
  };
  
  // Handle blur
  const handleBlur = (event) => {
    setFocused(false);
    onBlur?.(event);
  };
  
  // Handle keyboard
  const handleKeyDown = (event) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      handleChange(event);
    }
  };
  
  // Container styles
  const getContainerStyles = () => {
    const isVertical = labelPosition === 'top' || labelPosition === 'bottom';
    
    return normalizeStyle({
      display: 'inline-flex',
      alignItems: isVertical ? 'center' : 'center',
      flexDirection: 
        labelPosition === 'left' ? 'row-reverse' :
        labelPosition === 'top' ? 'column' :
        labelPosition === 'bottom' ? 'column-reverse' :
        'row',
      gap: isVertical ? 'var(--space-2)' : 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-family-base)',
      
      ...(size === 'compact' && {
        gap: isVertical ? 'var(--space-1)' : 'var(--space-2)'
      }),
      
      ...(size === 'expanded' && {
        gap: isVertical ? 'var(--space-3)' : 'var(--space-4)'
      })
    });
  };
  
  // Input styles (hidden)
  const getInputStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0,
      margin: 0,
      padding: 0
    });
  };
  
  // Switch track styles
  const getTrackStyles = () => {
    const sizeMap = {
      compact: {
        width: '36px',
        height: '20px',
        padding: '2px'
      },
      normal: {
        width: '44px',
        height: '24px',
        padding: '2px'
      },
      expanded: {
        width: '52px',
        height: '28px',
        padding: '3px'
      }
    };
    
    const colorMap = {
      primary: 'var(--color-primary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)'
    };
    
    return normalizeStyle({
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      width: sizeMap[size].width,
      height: sizeMap[size].height,
      padding: sizeMap[size].padding,
      backgroundColor: isChecked ? colorMap[color] : 'var(--color-gray-300)',
      borderRadius: '999px',
      transition: 'all 0.2s ease',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: theme === 'detailed' ? '1px solid var(--color-border)' : 'none',
      
      // Focus styles
      ...(focused && {
        boxShadow: `0 0 0 3px ${isChecked ? colorMap[color] : 'var(--color-gray-300)'}20`
      }),
      
      // Disabled styles
      ...(disabled && {
        opacity: 0.5,
        cursor: 'not-allowed'
      }),
      
      // Theme variations
      ...(theme === 'minimal' && {
        backgroundColor: 'transparent',
        border: `2px solid ${isChecked ? colorMap[color] : 'var(--color-border)'}`
      }),
      
      ...(theme === 'detailed' && isChecked && {
        boxShadow: `0 2px 8px ${colorMap[color]}40`
      })
    });
  };
  
  // Switch thumb styles
  const getThumbStyles = () => {
    const sizeMap = {
      compact: {
        size: '16px',
        translateX: isChecked ? '16px' : '0px'
      },
      normal: {
        size: '20px',
        translateX: isChecked ? '20px' : '0px'
      },
      expanded: {
        size: '22px',
        translateX: isChecked ? '21px' : '0px'
      }
    };
    
    return normalizeStyle({
      width: sizeMap[size].size,
      height: sizeMap[size].size,
      backgroundColor: 'var(--color-white)',
      borderRadius: '50%',
      transform: `translateX(${sizeMap[size].translateX})`,
      transition: 'transform 0.2s ease',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size === 'compact' ? '8px' : size === 'normal' ? '10px' : '12px',
      color: isChecked ? 'var(--color-primary)' : 'var(--color-gray-400)',
      
      // Theme variations
      ...(theme === 'detailed' && {
        boxShadow: 'var(--shadow-md)'
      })
    });
  };
  
  // Labels container styles
  const getLabelsContainerStyles = () => {
    return normalizeStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: description ? 'var(--space-1)' : 0
    });
  };
  
  // Label styles
  const getLabelStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : size === 'expanded' ? 'var(--font-size-lg)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
      lineHeight: 1.4,
      userSelect: 'none'
    });
  };
  
  // Description styles
  const getDescriptionStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-xs)' : 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-normal)',
      color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
      lineHeight: 1.3
    });
  };
  
  // Switch labels styles (ON/OFF)
  const getSwitchLabelsStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: size === 'compact' ? '8px' : '10px',
      fontWeight: 'var(--font-weight-bold)',
      color: 'var(--color-white)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      userSelect: 'none',
      pointerEvents: 'none',
      
      ...(isChecked ? {
        left: 'var(--space-2)',
        opacity: 1
      } : {
        right: 'var(--space-2)',
        opacity: 1
      })
    });
  };
  
  return (
    <label
      className={`vistara-toggle vistara-toggle--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
    >
      <input
        ref={ref}
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        readOnly={readOnly}
        style={getInputStyles()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      />
      
      <div
        style={getTrackStyles()}
        tabIndex={disabled ? -1 : 0}
        role="switch"
        aria-checked={isChecked}
        aria-disabled={disabled}
      >
        {/* Switch labels (ON/OFF) */}
        {showLabels && (
          <span style={getSwitchLabelsStyles()}>
            {isChecked ? onLabel : offLabel}
          </span>
        )}
        
        {/* Thumb */}
        <div style={getThumbStyles()}>
          {isChecked && checkedIcon ? checkedIcon : 
           !isChecked && uncheckedIcon ? uncheckedIcon : null}
        </div>
      </div>
      
      {/* Label and description */}
      {(label || description) && (
        <div style={getLabelsContainerStyles()}>
          {label && (
            <span style={getLabelStyles()}>
              {label}
            </span>
          )}
          {description && (
            <span style={getDescriptionStyles()}>
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
});

ToggleSwitch.displayName = 'ToggleSwitch';

export default ToggleSwitch;