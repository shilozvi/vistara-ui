/**
 * 🎯 Vistara UI - SelectDropdown Component
 * "Command your Design."
 * 
 * רכיב בחירה מתקדם עם חיפוש ופילטרים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const SelectDropdown = forwardRef(({ 
  // Options
  options = [], // [{ value, label, disabled, group }]
  value,
  defaultValue,
  
  // Behavior
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  readOnly = false,
  required = false,
  
  // Display
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  noOptionsText = 'No options found',
  loadingText = 'Loading...',
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'outlined', // 'outlined', 'filled', 'underlined'
  
  // State
  loading = false,
  error,
  
  // Callbacks
  onChange,
  onSearch,
  onOpen,
  onClose,
  onFocus,
  onBlur,
  
  // Standard props
  id,
  name,
  className,
  style,
  ...props
}, ref) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValues, setSelectedValues] = useState(
    multiple ? (value || defaultValue || []) : (value !== undefined ? [value] : (defaultValue ? [defaultValue] : []))
  );
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Filter options based on search
  const filteredOptions = searchable && searchTerm
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;
  
  // Handle selection
  const handleSelect = (option) => {
    if (option.disabled) return;
    
    let newValues;
    if (multiple) {
      const isSelected = selectedValues.some(v => v === option.value);
      if (isSelected) {
        newValues = selectedValues.filter(v => v !== option.value);
      } else {
        newValues = [...selectedValues, option.value];
      }
      setSelectedValues(newValues);
      onChange?.(newValues, option);
    } else {
      newValues = [option.value];
      setSelectedValues(newValues);
      setIsOpen(false);
      onChange?.(option.value, option);
    }
  };
  
  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    const newValues = [];
    setSelectedValues(newValues);
    onChange?.(multiple ? newValues : null, null);
  };
  
  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch?.(term);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        onOpen?.();
      }
      return;
    }
    
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        onClose?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
    }
  };
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        onClose?.();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Get selected option labels
  const getSelectedLabels = () => {
    return selectedValues
      .map(val => options.find(opt => opt.value === val)?.label)
      .filter(Boolean);
  };
  
  // Icons
  const ChevronDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
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
        minHeight: '32px',
        padding: 'var(--space-1) var(--space-2)',
        fontSize: 'var(--font-size-sm)'
      },
      normal: {
        minHeight: '40px',
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--font-size-base)'
      },
      expanded: {
        minHeight: '48px',
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--font-size-lg)'
      }
    };
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      cursor: disabled ? 'not-allowed' : 'pointer',
      borderRadius: 'var(--border-radius-md)',
      transition: 'all 0.2s ease',
      position: 'relative',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'outlined' && {
        border: `1px solid ${error ? 'var(--color-danger)' : isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: 'var(--color-surface)'
      }),
      
      ...(variant === 'filled' && {
        border: `1px solid ${error ? 'var(--color-danger)' : 'transparent'}`,
        backgroundColor: isOpen ? 'var(--color-surface)' : 'var(--color-background-secondary)'
      }),
      
      ...(variant === 'underlined' && {
        border: 'none',
        borderBottom: `2px solid ${error ? 'var(--color-danger)' : isOpen ? 'var(--color-primary)' : 'var(--color-border)'}`
      }),
      
      // States
      ...(disabled && {
        opacity: 0.5,
        cursor: 'not-allowed'
      }),
      
      ...(isOpen && {
        boxShadow: variant === 'outlined' ? `0 0 0 3px ${error ? 'var(--color-danger-light)' : 'var(--color-primary-light)'}` : 'none'
      })
    });
  };
  
  // Selected values display styles
  const getSelectedDisplayStyles = () => {
    return normalizeStyle({
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-1)',
      color: selectedValues.length > 0 ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
      fontSize: 'inherit'
    });
  };
  
  // Tag styles for multiple selection
  const getTagStyles = () => {
    return normalizeStyle({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      backgroundColor: 'var(--color-primary-light)',
      color: 'var(--color-primary)',
      padding: 'var(--space-1) var(--space-2)',
      borderRadius: 'var(--border-radius-sm)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)'
    });
  };
  
  // Controls styles
  const getControlsStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      color: 'var(--color-text-muted)'
    });
  };
  
  // Dropdown styles
  const getDropdownStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      boxShadow: 'var(--shadow-xl)',
      marginTop: 'var(--space-1)',
      maxHeight: '300px',
      overflow: 'hidden',
      
      // Animation
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'all 0.2s ease',
      visibility: isOpen ? 'visible' : 'hidden'
    });
  };
  
  // Search input styles
  const getSearchInputStyles = () => {
    return normalizeStyle({
      width: '100%',
      padding: 'var(--space-2) var(--space-3)',
      border: 'none',
      borderBottom: '1px solid var(--color-border)',
      outline: 'none',
      fontSize: 'var(--font-size-sm)',
      backgroundColor: 'transparent'
    });
  };
  
  // Options container styles
  const getOptionsContainerStyles = () => {
    return normalizeStyle({
      maxHeight: searchable ? '250px' : '300px',
      overflowY: 'auto',
      padding: 'var(--space-1) 0'
    });
  };
  
  // Option styles
  const getOptionStyles = (option, index) => {
    const isSelected = selectedValues.includes(option.value);
    const isFocused = index === focusedIndex;
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-2) var(--space-3)',
      cursor: option.disabled ? 'not-allowed' : 'pointer',
      fontSize: 'var(--font-size-sm)',
      color: option.disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
      backgroundColor: isFocused ? 'var(--color-background-secondary)' : isSelected ? 'var(--color-primary-light)' : 'transparent',
      
      ':hover': !option.disabled ? {
        backgroundColor: 'var(--color-background-secondary)'
      } : {}
    });
  };
  
  const selectedLabels = getSelectedLabels();
  
  return (
    <div
      ref={containerRef}
      className={`vistara-select vistara-select--${variant} vistara-select--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
    >
      <div
        ref={inputRef}
        style={getInputContainerStyles()}
        onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        {...props}
      >
        <div style={getSelectedDisplayStyles()}>
          {selectedLabels.length === 0 ? (
            <span>{placeholder}</span>
          ) : multiple ? (
            selectedLabels.map((label, index) => (
              <span key={index} style={getTagStyles()}>
                {label}
              </span>
            ))
          ) : (
            <span>{selectedLabels[0]}</span>
          )}
        </div>
        
        <div style={getControlsStyles()}>
          {clearable && selectedLabels.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              style={normalizeStyle({
                display: 'flex',
                alignItems: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                padding: 'var(--space-1)'
              })}
            >
              <CloseIcon />
            </button>
          )}
          
          <div style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>
            <ChevronDown />
          </div>
        </div>
      </div>
      
      <div ref={dropdownRef} style={getDropdownStyles()}>
        {searchable && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              style={getSearchInputStyles()}
            />
            <div style={{
              position: 'absolute',
              right: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)'
            }}>
              <SearchIcon />
            </div>
          </div>
        )}
        
        <div style={getOptionsContainerStyles()}>
          {loading ? (
            <div style={normalizeStyle({
              padding: 'var(--space-4)',
              textAlign: 'center',
              color: 'var(--color-text-muted)'
            })}>
              {loadingText}
            </div>
          ) : filteredOptions.length === 0 ? (
            <div style={normalizeStyle({
              padding: 'var(--space-4)',
              textAlign: 'center',
              color: 'var(--color-text-muted)'
            })}>
              {noOptionsText}
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                style={getOptionStyles(option, index)}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setFocusedIndex(index)}
                role="option"
                aria-selected={selectedValues.includes(option.value)}
              >
                <span>{option.label}</span>
                {multiple && selectedValues.includes(option.value) && (
                  <CheckIcon />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

SelectDropdown.displayName = 'SelectDropdown';

export default SelectDropdown;