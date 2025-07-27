/**
 * 🎯 Vistara UI - SearchInput Component
 * "Command your Design."
 * 
 * A powerful search input with suggestions, history, and filters
 */

import React, { useState, useRef, useEffect } from 'react';
import TextInput from './TextInput';
import { normalizeStyle } from '../../utils/normalizeStyle';

const SearchInput = ({ 
  // Search specific props
  onSearch,
  searchOnType = true,
  debounceDelay = 300,
  minChars = 2,
  
  // Suggestions
  suggestions = [],
  showSuggestions = true,
  maxSuggestions = 8,
  getSuggestions, // Async function to fetch suggestions
  
  // Search history
  showHistory = true,
  searchHistory = [],
  maxHistoryItems = 5,
  onClearHistory,
  
  // Filters
  filters = [], // [{label: 'Type', value: 'type', options: ['all', 'users', 'posts']}]
  activeFilters = {},
  onFilterChange,
  
  // Loading state
  isLoading = false,
  
  // All other TextInput props
  size = 'normal',
  theme = 'default',
  placeholder = 'Search...',
  ...props
}) => {
  const [query, setQuery] = useState(props.value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [localSuggestions, setLocalSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef();
  const searchTimeout = useRef();
  
  // Combine suggestions with history
  const getDropdownItems = () => {
    const items = [];
    
    // Add search history if no query
    if (!query && showHistory && searchHistory.length > 0) {
      items.push({ type: 'header', label: 'Recent Searches' });
      searchHistory.slice(0, maxHistoryItems).forEach(item => {
        items.push({ type: 'history', value: item });
      });
    }
    
    // Add suggestions
    const suggestionsList = getSuggestions ? localSuggestions : suggestions;
    if (query && suggestionsList.length > 0) {
      if (items.length > 0) {
        items.push({ type: 'divider' });
      }
      items.push({ type: 'header', label: 'Suggestions' });
      suggestionsList.slice(0, maxSuggestions).forEach(item => {
        items.push({ type: 'suggestion', value: item });
      });
    }
    
    return items;
  };
  
  // Handle search
  const performSearch = (searchQuery) => {
    if (searchQuery.length >= minChars) {
      onSearch?.(searchQuery, activeFilters);
    }
  };
  
  // Debounced search
  const debouncedSearch = (value) => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (searchOnType) {
        performSearch(value);
      }
      
      // Get async suggestions
      if (getSuggestions && value.length >= minChars) {
        setIsSearching(true);
        getSuggestions(value).then(results => {
          setLocalSuggestions(results);
          setIsSearching(false);
        });
      }
    }, debounceDelay);
  };
  
  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(true);
    debouncedSearch(value);
    props.onChange?.(e);
  };
  
  // Handle search submit
  const handleSubmit = (searchValue = query) => {
    setQuery(searchValue);
    performSearch(searchValue);
    setShowDropdown(false);
    
    // Update synthetic event for parent
    if (props.onChange) {
      props.onChange({
        target: { value: searchValue, name: props.name }
      });
    }
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const items = getDropdownItems().filter(item => 
      item.type === 'suggestion' || item.type === 'history'
    );
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          handleSubmit(items[selectedIndex].value);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(searchTimeout.current);
    };
  }, []);
  
  // Icons
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
  
  const ClearIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
  
  const HistoryIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
  
  // Styles
  const containerStyles = normalizeStyle({
    position: 'relative',
    width: '100%'
  });
  
  const dropdownStyles = normalizeStyle({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 'var(--space-1)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-xl)',
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto'
  });
  
  const itemStyles = (isSelected) => normalizeStyle({
    padding: 'var(--space-3)',
    cursor: 'pointer',
    backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-base)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    transition: 'background-color 0.2s ease'
  });
  
  const headerStyles = normalizeStyle({
    padding: 'var(--space-2) var(--space-3)',
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    fontWeight: 'var(--font-weight-medium)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });
  
  const filterStyles = normalizeStyle({
    display: 'flex',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-3)',
    flexWrap: 'wrap'
  });
  
  const dropdownItems = getDropdownItems();
  let itemIndex = -1;
  
  return (
    <div className="vistara-search-input" style={containerStyles}>
      {/* Filters */}
      {filters.length > 0 && theme !== 'minimal' && (
        <div style={filterStyles}>
          {filters.map(filter => (
            <select
              key={filter.value}
              value={activeFilters[filter.value] || ''}
              onChange={(e) => onFilterChange?.(filter.value, e.target.value)}
              style={normalizeStyle({
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--font-size-sm)',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer'
              })}
            >
              <option value="">{filter.label}</option>
              {filter.options.map(option => (
                <option key={option.value || option} value={option.value || option}>
                  {option.label || option}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
      
      {/* Search Input */}
      <TextInput
        {...props}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(true)}
        placeholder={placeholder}
        size={size}
        theme={theme}
        leftIcon={<SearchIcon />}
        rightIcon={
          isLoading || isSearching ? (
            <div style={{ animation: 'spin 1s linear infinite' }}>⟳</div>
          ) : query ? (
            <ClearIcon />
          ) : null
        }
        onRightIconClick={query ? () => {
          setQuery('');
          props.onChange?.({ target: { value: '', name: props.name } });
        } : undefined}
      />
      
      {/* Dropdown */}
      {showDropdown && dropdownItems.length > 0 && (
        <div ref={dropdownRef} style={dropdownStyles}>
          {dropdownItems.map((item, index) => {
            if (item.type === 'header') {
              return (
                <div key={`header-${index}`} style={headerStyles}>
                  <span>{item.label}</span>
                  {item.label === 'Recent Searches' && onClearHistory && (
                    <button
                      onClick={onClearHistory}
                      style={normalizeStyle({
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-primary)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer'
                      })}
                    >
                      Clear
                    </button>
                  )}
                </div>
              );
            }
            
            if (item.type === 'divider') {
              return (
                <div 
                  key={`divider-${index}`} 
                  style={{ 
                    borderTop: '1px solid var(--color-border)',
                    margin: 'var(--space-2) 0'
                  }} 
                />
              );
            }
            
            itemIndex++;
            const isSelected = itemIndex === selectedIndex;
            
            return (
              <div
                key={`${item.type}-${item.value}`}
                style={itemStyles(isSelected)}
                onClick={() => handleSubmit(item.value)}
                onMouseEnter={() => setSelectedIndex(itemIndex)}
              >
                {item.type === 'history' && <HistoryIcon />}
                <span>{item.value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchInput;