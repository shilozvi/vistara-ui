/**
 * 🎯 Vistara UI - TextInput Component
 * "Command your Design."
 * 
 * A flexible text input component with validation, icons, and theming support
 */

import React, { useState, useRef, forwardRef } from 'react';
import { normalizeStyle, withNormalizedStyles } from '../../utils/normalizeStyle';

const TextInput = forwardRef(({ 
  // Input props
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  placeholder = 'Enter text...',
  type = 'text',
  name,
  id,
  autoComplete,
  readOnly = false,
  disabled = false,
  required = false,
  maxLength,
  minLength,
  pattern,
  
  // Validation
  error,
  helperText,
  validateOnBlur = false,
  validator,
  
  // Appearance
  size = 'normal', // 'compact' | 'normal' | 'expanded'
  theme = 'default', // 'default' | 'minimal' | 'detailed'
  variant = 'outlined', // 'outlined' | 'filled' | 'underlined'
  
  // Icons & Addons
  leftIcon,
  rightIcon,
  prefix,
  suffix,
  onLeftIconClick,
  onRightIconClick,
  
  // Other
  label,
  className,
  style,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [validationError, setValidationError] = useState(null);
  const inputRef = ref || useRef();
  
  // Size configurations
  const sizeConfigs = {
    compact: {
      padding: 'var(--space-2) var(--space-3)',
      fontSize: 'var(--font-size-sm)',
      height: '36px',
      iconSize: '16px',
      gap: 'var(--space-2)'
    },
    normal: {
      padding: 'var(--space-3) var(--space-4)',
      fontSize: 'var(--font-size-base)',
      height: '44px',
      iconSize: '20px',
      gap: 'var(--space-3)'
    },
    expanded: {
      padding: 'var(--space-4) var(--space-5)',
      fontSize: 'var(--font-size-lg)',
      height: '52px',
      iconSize: '24px',
      gap: 'var(--space-3)'
    }
  };

  const config = sizeConfigs[size];
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;
  const hasError = error || validationError;
  
  // Handle validation
  const validate = (val) => {
    if (validator) {
      const result = validator(val);
      if (result !== true) {
        setValidationError(result);
        return false;
      }
    }
    setValidationError(null);
    return true;
  };
  
  // Handle change
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (!isControlled) {
      setInternalValue(newValue);
    }
    
    if (!validateOnBlur) {
      validate(newValue);
    }
    
    onChange?.(e);
  };
  
  // Handle blur
  const handleBlur = (e) => {
    setIsFocused(false);
    
    if (validateOnBlur) {
      validate(e.target.value);
    }
    
    onBlur?.(e);
  };
  
  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  // Container styles
  const containerStyles = normalizeStyle({
    position: 'relative',
    width: '100%'
  });
  
  // Wrapper styles (for the input + icons)
  const wrapperStyles = normalizeStyle({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: config.gap,
    height: config.height,
    borderRadius: variant === 'underlined' ? '0' : 'var(--border-radius-md)',
    backgroundColor: variant === 'filled' 
      ? 'var(--color-background-secondary)' 
      : 'transparent',
    border: variant === 'outlined' 
      ? `1px solid ${hasError ? 'var(--color-danger)' : isFocused ? 'var(--color-primary)' : 'var(--color-border)'}` 
      : 'none',
    borderBottom: variant === 'underlined' 
      ? `2px solid ${hasError ? 'var(--color-danger)' : isFocused ? 'var(--color-primary)' : 'var(--color-border)'}` 
      : undefined,
    transition: 'all 0.2s ease',
    ...style
  });
  
  // Input styles
  const inputStyles = normalizeStyle({
    flex: 1,
    height: '100%',
    padding: config.padding,
    fontSize: config.fontSize,
    color: 'var(--color-text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    '::placeholder': {
      color: 'var(--color-text-muted)'
    }
  });
  
  // Icon styles
  const iconStyles = normalizeStyle({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: config.iconSize,
    height: config.iconSize,
    color: hasError ? 'var(--color-danger)' : 'var(--color-text-secondary)',
    cursor: 'pointer',
    flexShrink: 0
  });
  
  // Label styles
  const labelStyles = normalizeStyle({
    display: 'block',
    marginBottom: 'var(--space-2)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: hasError ? 'var(--color-danger)' : 'var(--color-text-primary)'
  });
  
  // Helper text styles
  const helperTextStyles = normalizeStyle({
    marginTop: 'var(--space-2)',
    fontSize: 'var(--font-size-xs)',
    color: hasError ? 'var(--color-danger)' : 'var(--color-text-muted)'
  });
  
  return (
    <div className={`vistara-text-input ${className || ''}`} style={containerStyles}>
      {/* Label */}
      {label && (
        <label htmlFor={id} style={labelStyles}>
          {label}
          {required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
        </label>
      )}
      
      {/* Input wrapper */}
      <div style={wrapperStyles}>
        {/* Left icon/prefix */}
        {leftIcon && (
          <div 
            style={{ ...iconStyles, paddingLeft: 'var(--space-3)' }}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </div>
        )}
        {prefix && (
          <span style={{ color: 'var(--color-text-muted)', paddingLeft: 'var(--space-3)' }}>
            {prefix}
          </span>
        )}
        
        {/* Input */}
        <input
          ref={inputRef}
          type={type}
          id={id}
          name={name}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          style={inputStyles}
          {...props}
        />
        
        {/* Right icon/suffix */}
        {suffix && (
          <span style={{ color: 'var(--color-text-muted)', paddingRight: 'var(--space-3)' }}>
            {suffix}
          </span>
        )}
        {rightIcon && (
          <div 
            style={{ ...iconStyles, paddingRight: 'var(--space-3)' }}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {/* Helper text / Error */}
      {(helperText || hasError) && (
        <div style={helperTextStyles}>
          {hasError ? (error || validationError) : helperText}
        </div>
      )}
      
      {/* Character count */}
      {theme === 'detailed' && maxLength && (
        <div style={{ 
          ...helperTextStyles, 
          textAlign: 'right',
          marginTop: 'var(--space-1)'
        }}>
          {inputValue.length}/{maxLength}
        </div>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';

// Export with style normalization HOC
export default withNormalizedStyles(TextInput);