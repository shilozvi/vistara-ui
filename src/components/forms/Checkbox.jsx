/**
 * 🎯 Vistara UI - Checkbox Component
 * "Command your Design."
 * 
 * תיבת סימון מתקדמת עם אנימציות ומצבים
 */

import React, { forwardRef, useState } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Checkbox = forwardRef(({ 
  // Value & state
  checked,
  defaultChecked = false,
  indeterminate = false,
  
  // Behavior
  disabled = false,
  readOnly = false,
  required = false,
  
  // Content
  label,
  description,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'rounded', 'switch'
  color = 'primary', // 'primary', 'success', 'warning', 'danger'
  
  // Layout
  labelPosition = 'right', // 'left', 'right'
  
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
  
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [focused, setFocused] = useState(false);
  
  // Use controlled or uncontrolled state
  const isChecked = checked !== undefined ? checked : internalChecked;
  
  // Handle change
  const handleChange = (event) => {
    if (disabled || readOnly) return;
    
    const newChecked = event.target.checked;
    
    if (checked === undefined) {
      setInternalChecked(newChecked);
    }
    
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
  
  // Checkmark icon
  const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  
  // Indeterminate icon
  const IndeterminateIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      display: 'inline-flex',
      alignItems: flexDirection === 'column' ? 'flex-start' : 'center',
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
  
  // Checkbox input styles (hidden)
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
  
  // Visual checkbox styles
  const getCheckboxStyles = () => {
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
      borderRadius: variant === 'rounded' ? '50%' : variant === 'switch' ? sizeMap[size] : 'var(--border-radius-sm)',
      border: `2px solid ${isChecked || indeterminate ? colorMap[color] : 'var(--color-border)'}`,
      backgroundColor: isChecked || indeterminate ? colorMap[color] : 'var(--color-surface)',
      color: 'var(--color-white)',
      transition: 'all 0.2s ease',
      position: 'relative',
      flexShrink: 0,
      
      // Switch variant adjustments
      ...(variant === 'switch' && {
        width: `calc(${sizeMap[size]} * 1.8)`,
        backgroundColor: isChecked ? colorMap[color] : 'var(--color-border)',
        border: 'none',
        ':after': {
          content: '""',
          position: 'absolute',
          width: `calc(${sizeMap[size]} - 4px)`,
          height: `calc(${sizeMap[size]} - 4px)`,
          borderRadius: '50%',
          backgroundColor: 'var(--color-white)',
          transition: 'transform 0.2s ease',
          transform: isChecked ? `translateX(calc(${sizeMap[size]} * 0.4))` : `translateX(calc(${sizeMap[size]} * -0.4))`
        }
      }),
      
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
          borderColor: isChecked || indeterminate ? colorMap[color] : 'var(--color-border-hover)',
          backgroundColor: isChecked || indeterminate ? colorMap[color] : 'var(--color-background-secondary)'
        }
      }),
      
      // Theme variations
      ...(theme === 'detailed' && (isChecked || indeterminate) && {
        boxShadow: `0 2px 4px ${colorMap[color]}40`
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
      className={`vistara-checkbox vistara-checkbox--${variant} vistara-checkbox--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
    >
      <input
        ref={ref}
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        style={getInputStyles()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      <div style={getCheckboxStyles()}>
        {variant !== 'switch' && (
          <>
            {indeterminate ? <IndeterminateIcon /> : isChecked ? <CheckIcon /> : null}
          </>
        )}
      </div>
      
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;