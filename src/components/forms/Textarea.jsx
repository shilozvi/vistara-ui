/**
 * 🎯 Vistara UI - Textarea Component
 * "Command your Design."
 * 
 * שדה טקסט רב-שורות מתקדם עם גודל אוטומטי
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Textarea = forwardRef(({ 
  // Value & state
  value,
  defaultValue,
  
  // Behavior
  disabled = false,
  readOnly = false,
  required = false,
  
  // Display
  placeholder = 'Enter text...',
  
  // Validation
  error,
  maxLength,
  minLength,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'outlined', // 'outlined', 'filled', 'underlined'
  
  // Auto-resize behavior
  autoResize = false,
  minRows = 3,
  maxRows = 8,
  
  // Character counter
  showCounter = false,
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  
  // Standard props
  id,
  name,
  className,
  style,
  rows = 4,
  cols,
  ...props
}, ref) => {
  
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);
  const textareaRef = useRef(null);
  const internalRef = ref || textareaRef;
  
  // Auto-resize functionality
  const adjustHeight = () => {
    if (!autoResize || !internalRef.current) return;
    
    const textarea = internalRef.current;
    textarea.style.height = 'auto';
    
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    
    textarea.style.height = `${newHeight}px`;
  };
  
  useEffect(() => {
    if (autoResize) {
      adjustHeight();
    }
  }, [value, autoResize]);
  
  // Handle change
  const handleChange = (event) => {
    const newValue = event.target.value;
    setCharCount(newValue.length);
    
    if (autoResize) {
      adjustHeight();
    }
    
    onChange?.(event, newValue);
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
  
  // Handle key down
  const handleKeyDown = (event) => {
    // Prevent new lines if at maxRows and autoResize is on
    if (autoResize && event.key === 'Enter' && !event.shiftKey) {
      const textarea = internalRef.current;
      if (textarea) {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const currentRows = Math.ceil(textarea.scrollHeight / lineHeight);
        if (currentRows >= maxRows) {
          // Allow the event to proceed normally - just prevent further expansion
        }
      }
    }
    
    onKeyDown?.(event);
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      fontFamily: 'var(--font-family-base)',
      width: '100%'
    });
  };
  
  // Textarea styles
  const getTextareaStyles = () => {
    const sizeMap = {
      compact: {
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--font-size-sm)',
        lineHeight: 1.4
      },
      normal: {
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--font-size-base)',
        lineHeight: 1.5
      },
      expanded: {
        padding: 'var(--space-4) var(--space-5)',
        fontSize: 'var(--font-size-lg)',
        lineHeight: 1.6
      }
    };
    
    return normalizeStyle({
      width: '100%',
      fontFamily: 'inherit',
      borderRadius: 'var(--border-radius-md)',
      transition: 'all 0.2s ease',
      resize: autoResize ? 'none' : 'vertical',
      outline: 'none',
      
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
      }),
      
      ...(readOnly && {
        backgroundColor: 'var(--color-background-readonly)',
        cursor: 'default'
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        boxShadow: focused ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
      }),
      
      ...(theme === 'minimal' && {
        border: 'none',
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`
      }),
      
      // Text styles
      color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
      
      '::placeholder': {
        color: 'var(--color-text-muted)',
        opacity: 1
      }
    });
  };
  
  // Counter styles
  const getCounterStyles = () => {
    const isOverLimit = maxLength && charCount > maxLength;
    
    return normalizeStyle({
      position: 'absolute',
      bottom: 'var(--space-2)',
      right: 'var(--space-3)',
      fontSize: 'var(--font-size-xs)',
      color: isOverLimit ? 'var(--color-danger)' : 'var(--color-text-muted)',
      backgroundColor: 'var(--color-surface)',
      padding: 'var(--space-1) var(--space-2)',
      borderRadius: 'var(--border-radius-sm)',
      border: '1px solid var(--color-border)',
      pointerEvents: 'none'
    });
  };
  
  // Error message styles
  const getErrorStyles = () => {
    return normalizeStyle({
      marginTop: 'var(--space-1)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-danger)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)'
    });
  };
  
  // Error icon
  const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  return (
    <div
      className={`vistara-textarea vistara-textarea--${variant} vistara-textarea--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
    >
      <textarea
        ref={internalRef}
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={autoResize ? undefined : rows}
        cols={cols}
        maxLength={maxLength}
        minLength={minLength}
        style={getTextareaStyles()}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      />
      
      {/* Character counter */}
      {(showCounter || maxLength) && (
        <div style={getCounterStyles()}>
          {charCount}{maxLength && `/${maxLength}`}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div style={getErrorStyles()}>
          <ErrorIcon />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;