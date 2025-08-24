/**
 * 🎯 Vistara UI - NumberInput Component
 * "Command your Design."
 * 
 * שדה קלט מספרי מתקדם עם בקרות וולידציה
 */

import React, { forwardRef, useState, useRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const NumberInput = forwardRef(({ 
  // Value & state
  value,
  defaultValue,
  
  // Behavior
  disabled = false,
  readOnly = false,
  required = false,
  
  // Display
  placeholder = '0',
  
  // Number constraints
  min,
  max,
  step = 1,
  precision, // Number of decimal places
  
  // Format options
  prefix,
  suffix,
  thousandSeparator = false,
  allowNegative = true,
  
  // Validation
  error,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'outlined', // 'outlined', 'filled', 'underlined'
  
  // Controls
  showControls = true,
  controlsPosition = 'right', // 'right', 'sides'
  
  // Icons
  leftIcon,
  rightIcon,
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  onIncrement,
  onDecrement,
  
  // Standard props
  id,
  name,
  className,
  style,
  ...props
}, ref) => {
  
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const inputRef = useRef(null);
  const internalInputRef = ref || inputRef;
  
  // Format number for display
  const formatNumber = (num) => {
    if (num === '' || num === null || num === undefined) return '';
    
    let formattedNum = parseFloat(num);
    
    // Apply precision
    if (precision !== undefined) {
      formattedNum = parseFloat(formattedNum.toFixed(precision));
    }
    
    let result = formattedNum.toString();
    
    // Add thousand separator
    if (thousandSeparator && Math.abs(formattedNum) >= 1000) {
      result = formattedNum.toLocaleString();
    }
    
    return result;
  };
  
  // Parse number from string
  const parseNumber = (str) => {
    if (!str) return '';
    
    // Remove thousand separators and non-numeric characters except decimal point and minus
    let cleaned = str.toString().replace(/[^\d.-]/g, '');
    
    // Handle negative numbers
    if (!allowNegative) {
      cleaned = cleaned.replace(/-/g, '');
    }
    
    return cleaned;
  };
  
  // Validate number constraints
  const validateNumber = (num) => {
    const numValue = parseFloat(num);
    if (isNaN(numValue)) return num;
    
    let validatedNum = numValue;
    
    // Apply min/max constraints
    if (min !== undefined && validatedNum < min) {
      validatedNum = min;
    }
    if (max !== undefined && validatedNum > max) {
      validatedNum = max;
    }
    
    return validatedNum;
  };
  
  // Handle input change
  const handleChange = (event) => {
    const rawValue = event.target.value;
    const parsedValue = parseNumber(rawValue);
    
    setInternalValue(parsedValue);
    onChange?.(event, parsedValue);
  };
  
  // Handle focus
  const handleFocus = (event) => {
    setFocused(true);
    onFocus?.(event);
  };
  
  // Handle blur
  const handleBlur = (event) => {
    setFocused(false);
    
    // Validate and format on blur
    const validatedValue = validateNumber(internalValue);
    const formattedValue = formatNumber(validatedValue);
    
    if (formattedValue !== internalValue) {
      setInternalValue(formattedValue);
      onChange?.(event, validatedValue);
    }
    
    onBlur?.(event);
  };
  
  // Handle increment
  const handleIncrement = () => {
    if (disabled || readOnly) return;
    
    const currentValue = parseFloat(internalValue) || 0;
    const newValue = currentValue + step;
    const validatedValue = validateNumber(newValue);
    const formattedValue = formatNumber(validatedValue);
    
    setInternalValue(formattedValue);
    onIncrement?.(validatedValue);
    onChange?.({ target: { value: formattedValue } }, validatedValue);
  };
  
  // Handle decrement
  const handleDecrement = () => {
    if (disabled || readOnly) return;
    
    const currentValue = parseFloat(internalValue) || 0;
    const newValue = currentValue - step;
    const validatedValue = validateNumber(newValue);
    const formattedValue = formatNumber(validatedValue);
    
    setInternalValue(formattedValue);
    onDecrement?.(validatedValue);
    onChange?.({ target: { value: formattedValue } }, validatedValue);
  };
  
  // Handle keyboard
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      handleIncrement();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      handleDecrement();
    }
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      fontFamily: 'var(--font-family-base)',
      width: '100%'
    });
  };
  
  // Input container styles
  const getInputContainerStyles = () => {
    const sizeMap = {
      compact: {
        height: '32px',
        padding: 'var(--space-1) var(--space-2)',
        fontSize: 'var(--font-size-sm)'
      },
      normal: {
        height: '40px',
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--font-size-base)'
      },
      expanded: {
        height: '48px',
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--font-size-lg)'
      }
    };
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      borderRadius: 'var(--border-radius-md)',
      transition: 'all 0.2s ease',
      position: 'relative',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'outlined' && {
        border: `1px solid ${error ? 'var(--color-danger)' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: 'var(--color-surface)'
      }),
      
      ...(variant === 'filled' && {
        border: `1px solid ${error ? 'var(--color-danger)' : 'transparent'}`,
        backgroundColor: focused ? 'var(--color-surface)' : 'var(--color-background-secondary)'
      }),
      
      ...(variant === 'underlined' && {
        border: 'none',
        borderBottom: `2px solid ${error ? 'var(--color-danger)' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 0,
        backgroundColor: 'transparent'
      }),
      
      // Focus styles
      ...(focused && variant === 'outlined' && {
        boxShadow: `0 0 0 3px ${error ? 'var(--color-danger-light)' : 'var(--color-primary-light)'}`
      }),
      
      // States
      ...(disabled && {
        opacity: 0.5,
        cursor: 'not-allowed',
        backgroundColor: 'var(--color-background-disabled)'
      })
    });
  };
  
  // Input styles
  const getInputStyles = () => {
    return normalizeStyle({
      flex: 1,
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      fontSize: 'inherit',
      color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
      textAlign: 'right',
      
      '::placeholder': {
        color: 'var(--color-text-muted)',
        opacity: 1
      },
      
      // Remove default number input styling
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
      },
      
      '&[type=number]': {
        '-moz-appearance': 'textfield'
      }
    });
  };
  
  // Control button styles
  const getControlButtonStyles = (isIncrement) => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size === 'compact' ? '24px' : size === 'expanded' ? '32px' : '28px',
      height: size === 'compact' ? '16px' : size === 'expanded' ? '20px' : '18px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: 'var(--border-radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      color: 'var(--color-text-muted)',
      transition: 'all 0.2s ease',
      
      ':hover': !disabled ? {
        backgroundColor: 'var(--color-background-secondary)',
        color: 'var(--color-text-primary)'
      } : {},
      
      ':active': !disabled ? {
        backgroundColor: 'var(--color-background-tertiary)'
      } : {},
      
      ...(disabled && {
        opacity: 0.5,
        cursor: 'not-allowed'
      })
    });
  };
  
  // Icon styles
  const getIconStyles = (position) => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      color: 'var(--color-text-muted)',
      marginRight: position === 'left' ? 'var(--space-2)' : 0,
      marginLeft: position === 'right' ? 'var(--space-2)' : 0
    });
  };
  
  // Control icons
  const PlusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const MinusIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const currentValue = value !== undefined ? value : internalValue;
  
  return (
    <div
      className={`vistara-number-input vistara-number-input--${variant} vistara-number-input--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
    >
      <div style={getInputContainerStyles()}>
        {/* Left icon */}
        {leftIcon && (
          <span style={getIconStyles('left')}>
            {leftIcon}
          </span>
        )}
        
        {/* Prefix */}
        {prefix && (
          <span style={{ color: 'var(--color-text-secondary)', marginRight: 'var(--space-1)' }}>
            {prefix}
          </span>
        )}
        
        {/* Left control (for sides layout) */}
        {showControls && controlsPosition === 'sides' && (
          <button
            type="button"
            style={getControlButtonStyles(false)}
            onClick={handleDecrement}
            disabled={disabled || readOnly}
            tabIndex={-1}
          >
            <MinusIcon />
          </button>
        )}
        
        {/* Input */}
        <input
          ref={internalInputRef}
          type="text"
          id={id}
          name={name}
          value={currentValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          min={min}
          max={max}
          step={step}
          style={getInputStyles()}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          {...props}
        />
        
        {/* Suffix */}
        {suffix && (
          <span style={{ color: 'var(--color-text-secondary)', marginLeft: 'var(--space-1)' }}>
            {suffix}
          </span>
        )}
        
        {/* Right control (for sides layout) */}
        {showControls && controlsPosition === 'sides' && (
          <button
            type="button"
            style={getControlButtonStyles(true)}
            onClick={handleIncrement}
            disabled={disabled || readOnly}
            tabIndex={-1}
          >
            <PlusIcon />
          </button>
        )}
        
        {/* Right controls (for right layout) */}
        {showControls && controlsPosition === 'right' && (
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'var(--space-1)' }}>
            <button
              type="button"
              style={getControlButtonStyles(true)}
              onClick={handleIncrement}
              disabled={disabled || readOnly}
              tabIndex={-1}
            >
              <PlusIcon />
            </button>
            <button
              type="button"
              style={getControlButtonStyles(false)}
              onClick={handleDecrement}
              disabled={disabled || readOnly}
              tabIndex={-1}
            >
              <MinusIcon />
            </button>
          </div>
        )}
        
        {/* Right icon */}
        {rightIcon && (
          <span style={getIconStyles('right')}>
            {rightIcon}
          </span>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div style={normalizeStyle({
          marginTop: 'var(--space-1)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-danger)'
        })}>
          {error}
        </div>
      )}
    </div>
  );
});

NumberInput.displayName = 'NumberInput';

export default NumberInput;