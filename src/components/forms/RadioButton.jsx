/**
 * 🎯 Vistara UI - RadioButton Component
 * "Command your Design."
 * 
 * כפתור רדיו מתקדם עם תמיכה בקבוצות
 */

import React, { forwardRef, useState } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const RadioButton = forwardRef(({ 
  // Value & state
  checked,
  defaultChecked = false,
  value,
  
  // Behavior
  disabled = false,
  readOnly = false,
  required = false,
  
  // Group behavior
  name, // Required for radio groups
  
  // Content
  label,
  description,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  color = 'primary', // 'primary', 'success', 'warning', 'danger'
  
  // Layout
  labelPosition = 'right', // 'left', 'right'
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  
  // Standard props
  id,
  className,
  style,
  ...props
}, ref) => {
  
  const [focused, setFocused] = useState(false);
  
  // Handle change
  const handleChange = (event) => {
    if (disabled || readOnly) return;
    onChange?.(event, event.target.value);
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
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      display: 'inline-flex',
      alignItems: 'center',
      flexDirection: labelPosition === 'left' ? 'row-reverse' : 'row',
      gap: 'var(--space-2)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-family-base)',
      
      ...(size === 'compact' && {
        gap: 'var(--space-1)'
      }),
      
      ...(size === 'expanded' && {
        gap: 'var(--space-3)'
      })
    });
  };
  
  // Radio input styles (hidden)
  const getInputStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0,
      margin: 0,
      padding: 0,
      border: 'none',
      outline: 'none'
    });
  };
  
  // Visual radio styles
  const getRadioStyles = () => {
    const sizeMap = {
      compact: '16px',
      normal: '20px',
      expanded: '24px'
    };
    
    const colorMap = {
      primary: 'var(--color-primary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)'
    };
    
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: sizeMap[size],
      height: sizeMap[size],
      borderRadius: '50%',
      border: `2px solid ${checked ? colorMap[color] : 'var(--color-border)'}`,
      backgroundColor: 'var(--color-surface)',
      transition: 'all 0.2s ease',
      position: 'relative',
      flexShrink: 0,
      
      // Inner dot
      ':after': {
        content: '""',
        width: `calc(${sizeMap[size]} - 8px)`,
        height: `calc(${sizeMap[size]} - 8px)`,
        borderRadius: '50%',
        backgroundColor: colorMap[color],
        opacity: checked ? 1 : 0,
        transform: checked ? 'scale(1)' : 'scale(0.3)',
        transition: 'all 0.2s ease'
      },
      
      // Focus styles
      ...(focused && {
        boxShadow: `0 0 0 3px ${colorMap[color]}20`
      }),
      
      // Disabled styles
      ...(disabled && {
        opacity: 0.5,
        cursor: 'not-allowed'
      }),
      
      // Hover styles
      ...(!disabled && {
        ':hover': {
          borderColor: checked ? colorMap[color] : 'var(--color-border-hover)',
          backgroundColor: checked ? 'var(--color-surface)' : 'var(--color-background-secondary)'
        }
      }),
      
      // Theme variations
      ...(theme === 'detailed' && checked && {
        boxShadow: `0 2px 4px ${colorMap[color]}40`
      }),
      
      ...(theme === 'minimal' && {
        border: `1px solid ${checked ? colorMap[color] : 'var(--color-border)'}`
      })
    };
    
    return normalizeStyle(baseStyles);
  };
  
  // Label styles
  const getLabelStyles = () => {
    return normalizeStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: description ? 'var(--space-1)' : 0,
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
      lineHeight: 1.3,
      margin: 0
    });
  };
  
  return (
    <label
      className={`vistara-radio vistara-radio--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
    >
      <input
        ref={ref}
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        style={getInputStyles()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      <div style={getRadioStyles()} />
      
      {label && (
        <div style={getLabelStyles()}>
          <span>{label}</span>
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

RadioButton.displayName = 'RadioButton';

export default RadioButton;