/**
 * 🎯 Vistara UI - MultiSelect Component
 * "Command your Design."
 * 
 * רכיב בחירה מרובה עם חיפוש וסינון
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const MultiSelect = forwardRef(({
  // Options
  options = [], // [{ value, label, group?, disabled?, icon? }]
  value = [],
  defaultValue = [],
  
  // Display
  label = '',
  placeholder = 'Select items...',
  helperText = '',
  error = false,
  errorMessage = '',
  
  // Features
  searchable = true,
  clearable = true,
  groupBy = null, // Field to group options by
  maxItems = null,
  
  // Behavior
  required = false,
  disabled = false,
  readOnly = false,
  closeOnSelect = false,
  
  // Display options
  showCheckboxes = true,
  showTags = true,
  tagLimit = 3,
  collapseTags = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'outlined'
  variant = 'default', // 'default', 'filled', 'bordered', 'underlined'
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  onSearch,
  
  // Custom renderers
  renderOption,
  renderTag,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState(value || defaultValue || []);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Update selected values when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);
  
  // Filter options based on search
  const filteredOptions = options.filter(option => {
    if (!searchable || !searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return option.label.toLowerCase().includes(searchLower) ||
           option.value.toString().toLowerCase().includes(searchLower);
  });
  
  // Group options if groupBy is specified
  const groupedOptions = groupBy ? filteredOptions.reduce((acc, option) => {
    const group = option[groupBy] || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {}) : { '': filteredOptions };
  
  // Handle option toggle
  const handleOptionToggle = (option) => {
    if (option.disabled || disabled || readOnly) return;
    
    const newValues = selectedValues.includes(option.value)
      ? selectedValues.filter(v => v !== option.value)
      : maxItems && selectedValues.length >= maxItems
        ? selectedValues
        : [...selectedValues, option.value];
    
    setSelectedValues(newValues);
    onChange?.(newValues);
    
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };
  
  // Handle clear all
  const handleClearAll = () => {
    setSelectedValues([]);
    onChange?.([]);
    setSearchTerm('');
  };
  
  // Handle tag remove
  const handleTagRemove = (value, event) => {
    event.stopPropagation();
    const newValues = selectedValues.filter(v => v !== value);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        setIsOpen(true);
        event.preventDefault();
      }
      return;
    }
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleOptionToggle(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        containerRef.current?.focus();
        break;
    }
  };
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);
  
  // Get selected option labels
  const getSelectedLabels = () => {
    return selectedValues.map(val => {
      const option = options.find(opt => opt.value === val);
      return option ? option.label : val;
    });
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      position: 'relative',
      width: '100%'
    });
  };
  
  // Label styles
  const getLabelStyles = () => {
    return normalizeStyle({
      display: 'block',
      marginBottom: 'var(--space-1)',
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      color: error ? 'var(--color-danger)' : 'var(--color-text-primary)'
    });
  };
  
  // Input container styles
  const getInputContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 'var(--space-1)',
      minHeight: size === 'compact' ? '32px' : size === 'expanded' ? '48px' : '40px',
      padding: 'var(--space-2)',
      backgroundColor: disabled ? 'var(--color-background-disabled)' : 'var(--color-surface)',
      borderRadius: variant === 'underlined' ? '0' : 'var(--border-radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      
      ...(variant === 'default' && {
        border: `1px solid ${error ? 'var(--color-danger)' : isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
        ':hover': !disabled && {
          borderColor: 'var(--color-primary-light)'
        }
      }),
      
      ...(variant === 'filled' && {
        backgroundColor: 'var(--color-background-secondary)',
        border: `1px solid transparent`,
        ':hover': !disabled && {
          backgroundColor: 'var(--color-background-tertiary)'
        }
      }),
      
      ...(variant === 'bordered' && {
        border: `2px solid ${error ? 'var(--color-danger)' : isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
      }),
      
      ...(variant === 'underlined' && {
        borderBottom: `2px solid ${error ? 'var(--color-danger)' : isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 0,
        paddingLeft: 0,
        paddingRight: 0
      }),
      
      ...(theme === 'modern' && {
        boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        border: 'none'
      })
    });
  };
  
  // Tag styles
  const getTagStyles = () => {
    return normalizeStyle({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      padding: '2px 8px',
      backgroundColor: 'var(--color-primary-light)',
      color: 'var(--color-primary-dark)',
      borderRadius: 'var(--border-radius-sm)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      maxWidth: '150px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    });
  };
  
  // Tag remove button styles
  const getTagRemoveStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '16px',
      height: '16px',
      marginLeft: 'var(--space-1)',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      color: 'var(--color-primary)',
      fontSize: '12px',
      transition: 'all 0.2s ease',
      
      ':hover': {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-contrast)'
      }
    });
  };
  
  // Dropdown styles
  const getDropdownStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 'var(--space-1)',
      maxHeight: '300px',
      overflowY: 'auto',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 1000,
      display: isOpen ? 'block' : 'none'
    });
  };
  
  // Search input styles
  const getSearchInputStyles = () => {
    return normalizeStyle({
      width: '100%',
      padding: 'var(--space-2) var(--space-3)',
      border: 'none',
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'transparent',
      fontSize: 'var(--font-size-sm)',
      outline: 'none',
      color: 'var(--color-text-primary)',
      
      '::placeholder': {
        color: 'var(--color-text-muted)'
      }
    });
  };
  
  // Option styles
  const getOptionStyles = (option, isSelected, isFocused) => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-2) var(--space-3)',
      cursor: option.disabled ? 'not-allowed' : 'pointer',
      opacity: option.disabled ? 0.5 : 1,
      transition: 'all 0.2s ease',
      backgroundColor: isFocused ? 'var(--color-background-secondary)' : 'transparent',
      
      ':hover': !option.disabled && {
        backgroundColor: 'var(--color-background-secondary)'
      }
    });
  };
  
  // Checkbox styles
  const getCheckboxStyles = (isChecked) => {
    return normalizeStyle({
      width: '16px',
      height: '16px',
      border: `2px solid ${isChecked ? 'var(--color-primary)' : 'var(--color-border)'}`,
      borderRadius: 'var(--border-radius-sm)',
      backgroundColor: isChecked ? 'var(--color-primary)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      flexShrink: 0
    });
  };
  
  // Helper text styles
  const getHelperTextStyles = () => {
    return normalizeStyle({
      marginTop: 'var(--space-1)',
      fontSize: 'var(--font-size-sm)',
      color: error ? 'var(--color-danger)' : 'var(--color-text-muted)'
    });
  };
  
  // Clear button styles
  const getClearButtonStyles = () => {
    return normalizeStyle({
      marginLeft: 'auto',
      padding: 'var(--space-1)',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: 'var(--border-radius-sm)',
      cursor: 'pointer',
      color: 'var(--color-text-muted)',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      
      ':hover': {
        color: 'var(--color-text-primary)',
        backgroundColor: 'var(--color-background-secondary)'
      }
    });
  };
  
  // Group header styles
  const getGroupHeaderStyles = () => {
    return normalizeStyle({
      padding: 'var(--space-2) var(--space-3)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-muted)',
      backgroundColor: 'var(--color-background-secondary)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: searchable ? '37px' : 0,
      zIndex: 1
    });
  };
  
  const selectedLabels = getSelectedLabels();
  const displayedTags = collapseTags && selectedLabels.length > tagLimit
    ? selectedLabels.slice(0, tagLimit)
    : selectedLabels;
  const hiddenCount = selectedLabels.length - displayedTags.length;
  
  return (
    <div
      ref={containerRef}
      className={`vistara-multi-select vistara-multi-select--${variant} vistara-multi-select--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {label && (
        <label style={getLabelStyles()}>
          {label}
          {required && <span style={{ color: 'var(--color-danger)' }}> *</span>}
        </label>
      )}
      
      <div
        style={getInputContainerStyles()}
        onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {/* Selected tags */}
        {showTags && displayedTags.map((label, index) => {
          const value = selectedValues[index];
          const option = options.find(opt => opt.value === value);
          
          if (renderTag) {
            return renderTag(option || { value, label }, () => handleTagRemove(value, event));
          }
          
          return (
            <div key={value} style={getTagStyles()}>
              {option?.icon && <span>{option.icon}</span>}
              <span>{label}</span>
              {!disabled && !readOnly && (
                <button
                  style={getTagRemoveStyles()}
                  onClick={(e) => handleTagRemove(value, e)}
                  tabIndex={-1}
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
        
        {/* Hidden count */}
        {hiddenCount > 0 && (
          <div style={{
            ...getTagStyles(),
            backgroundColor: 'var(--color-background-tertiary)',
            color: 'var(--color-text-secondary)'
          }}>
            +{hiddenCount}
          </div>
        )}
        
        {/* Placeholder */}
        {selectedValues.length === 0 && (
          <span style={{ color: 'var(--color-text-muted)' }}>
            {placeholder}
          </span>
        )}
        
        {/* Clear button */}
        {clearable && selectedValues.length > 0 && !disabled && !readOnly && (
          <button
            style={getClearButtonStyles()}
            onClick={(e) => {
              e.stopPropagation();
              handleClearAll();
            }}
            tabIndex={-1}
          >
            ×
          </button>
        )}
        
        {/* Dropdown arrow */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            marginLeft: clearable && selectedValues.length > 0 ? 0 : 'auto',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0
          }}
        >
          <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      
      {/* Dropdown */}
      <div style={getDropdownStyles()}>
        {/* Search input */}
        {searchable && (
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch?.(e.target.value);
            }}
            style={getSearchInputStyles()}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        
        {/* Options */}
        {filteredOptions.length === 0 ? (
          <div style={{
            padding: 'var(--space-4)',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-sm)'
          }}>
            No options found
          </div>
        ) : (
          Object.entries(groupedOptions).map(([group, groupOptions]) => (
            <div key={group}>
              {group && (
                <div style={getGroupHeaderStyles()}>
                  {group}
                </div>
              )}
              
              {groupOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                const isFocused = focusedIndex === filteredOptions.indexOf(option);
                
                if (renderOption) {
                  return renderOption(option, isSelected, () => handleOptionToggle(option));
                }
                
                return (
                  <div
                    key={option.value}
                    style={getOptionStyles(option, isSelected, isFocused)}
                    onClick={() => handleOptionToggle(option)}
                  >
                    {showCheckboxes && (
                      <div style={getCheckboxStyles(isSelected)}>
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <polyline 
                              points="20 6 9 17 4 12" 
                              stroke="white" 
                              strokeWidth="3"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                    
                    {option.icon && (
                      <span style={{ fontSize: '16px' }}>{option.icon}</span>
                    )}
                    
                    <span>{option.label}</span>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
      
      {(helperText || (error && errorMessage)) && (
        <div style={getHelperTextStyles()}>
          {error && errorMessage ? errorMessage : helperText}
        </div>
      )}
    </div>
  );
});

MultiSelect.displayName = 'MultiSelect';

export default MultiSelect;