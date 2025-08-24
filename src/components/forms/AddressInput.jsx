/**
 * 🎯 Vistara UI - AddressInput Component
 * "Command your Design."
 * 
 * שדה קלט כתובת מתקדם עם השלמה אוטומטית וגיאוקודינג
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const AddressInput = forwardRef(({ 
  // Value & state
  value,
  defaultValue,
  
  // Behavior
  disabled = false,
  readOnly = false,
  required = false,
  
  // Display
  placeholder = 'Enter address...',
  
  // Address components
  showFullForm = false,
  fields = ['street', 'city', 'state', 'zip', 'country'], // Which fields to show in full form
  
  // Geocoding & Autocomplete
  enableAutocomplete = true,
  enableGeocoding = false,
  geocodingProvider = 'nominatim', // 'nominatim', 'google', 'mapbox'
  apiKey, // For Google Maps or Mapbox
  
  // Country/Region
  defaultCountry = 'US',
  restrictToCountry = false,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'outlined', // 'outlined', 'filled', 'underlined'
  
  // Layout for full form
  layout = 'vertical', // 'vertical', 'horizontal', 'grid'
  
  // Validation
  error,
  validateOnChange = false,
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  onAddressSelect,
  onGeocode,
  
  // Standard props
  id,
  name,
  className,
  style,
  ...props
}, ref) => {
  
  const [inputValue, setInputValue] = useState(value || defaultValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Full address form state
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: defaultCountry,
    apartment: '',
    ...value
  });
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Mock geocoding data for demonstration
  const mockSuggestions = [
    {
      display: '123 Main Street, New York, NY 10001, USA',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      lat: 40.7128,
      lng: -74.0060
    },
    {
      display: '456 Broadway, New York, NY 10013, USA',
      street: '456 Broadway',
      city: 'New York',
      state: 'NY',
      zip: '10013',
      country: 'USA',
      lat: 40.7589,
      lng: -73.9851
    },
    {
      display: '789 Fifth Avenue, New York, NY 10022, USA',
      street: '789 Fifth Avenue',
      city: 'New York',
      state: 'NY',
      zip: '10022',
      country: 'USA',
      lat: 40.7614,
      lng: -73.9776
    }
  ];
  
  // Debounced address search
  const searchAddresses = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    
    try {
      // Mock implementation - replace with actual geocoding service
      if (enableAutocomplete) {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.display.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
      }
    } catch (error) {
      console.warn('Address search failed:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);
    
    if (!showFullForm) {
      onChange?.(event, newValue);
    }
    
    // Debounced search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (enableAutocomplete) {
        searchAddresses(newValue);
        setIsDropdownOpen(newValue.length >= 3);
      }
    }, 300);
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setInputValue(suggestion.display);
    setIsDropdownOpen(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    
    if (showFullForm) {
      setAddressForm({
        street: suggestion.street,
        city: suggestion.city,
        state: suggestion.state,
        zip: suggestion.zip,
        country: suggestion.country,
        apartment: addressForm.apartment
      });
    }
    
    onAddressSelect?.(suggestion);
    
    if (enableGeocoding && suggestion.lat && suggestion.lng) {
      onGeocode?.({
        lat: suggestion.lat,
        lng: suggestion.lng,
        address: suggestion
      });
    }
  };
  
  // Handle form field changes
  const handleFormFieldChange = (field, value) => {
    const newForm = { ...addressForm, [field]: value };
    setAddressForm(newForm);
    
    // Update main input with formatted address
    const formatted = formatAddressFromForm(newForm);
    setInputValue(formatted);
    
    onChange?.(null, newForm, formatted);
  };
  
  // Format address from form fields
  const formatAddressFromForm = (form) => {
    const parts = [];
    
    if (form.street) {
      let street = form.street;
      if (form.apartment) {
        street += `, Apt ${form.apartment}`;
      }
      parts.push(street);
    }
    
    if (form.city) parts.push(form.city);
    if (form.state) parts.push(form.state);
    if (form.zip) parts.push(form.zip);
    if (form.country && form.country !== defaultCountry) parts.push(form.country);
    
    return parts.join(', ');
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!isDropdownOpen || suggestions.length === 0) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
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
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      borderRadius: 'var(--border-radius-md)',
      transition: 'all 0.2s ease',
      
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
        cursor: 'not-allowed'
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
      
      '::placeholder': {
        color: 'var(--color-text-muted)',
        opacity: 1
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
      zIndex: 1000,
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      marginTop: 'var(--space-1)',
      maxHeight: '300px',
      overflow: 'hidden',
      
      // Animation
      opacity: isDropdownOpen ? 1 : 0,
      transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'all 0.2s ease',
      visibility: isDropdownOpen ? 'visible' : 'hidden'
    });
  };
  
  // Suggestion item styles
  const getSuggestionItemStyles = (index) => {
    const isSelected = index === selectedIndex;
    
    return normalizeStyle({
      padding: 'var(--space-3) var(--space-4)',
      cursor: 'pointer',
      fontSize: 'var(--font-size-sm)',
      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
      borderBottom: index < suggestions.length - 1 ? '1px solid var(--color-border)' : 'none',
      
      ':hover': {
        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'
      }
    });
  };
  
  // Form styles
  const getFormStyles = () => {
    return normalizeStyle({
      display: 'grid',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-3)',
      
      ...(layout === 'grid' && {
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
      }),
      
      ...(layout === 'horizontal' && {
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
      })
    });
  };
  
  // Form field styles
  const getFormFieldStyles = () => {
    return normalizeStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)'
    });
  };
  
  // Form input styles
  const getFormInputStyles = () => {
    return normalizeStyle({
      padding: 'var(--space-2) var(--space-3)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      fontSize: 'var(--font-size-sm)',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      
      ':focus': {
        borderColor: 'var(--color-primary)',
        boxShadow: '0 0 0 2px var(--color-primary-light)'
      }
    });
  };
  
  // Label styles
  const getLabelStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-primary)',
      marginBottom: 'var(--space-1)'
    });
  };
  
  // Icons
  const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const LoadingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="var(--color-border)" strokeWidth="4"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--color-primary)" strokeWidth="4"/>
    </svg>
  );
  
  return (
    <div
      ref={containerRef}
      className={`vistara-address-input vistara-address-input--${variant} vistara-address-input--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
    >
      {/* Main Address Input */}
      <div style={getInputContainerStyles()}>
        <div style={{ 
          color: 'var(--color-text-muted)', 
          marginRight: 'var(--space-2)'
        }}>
          <LocationIcon />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          style={getInputStyles()}
          onChange={handleInputChange}
          onFocus={() => (setFocused(true), onFocus?.())}
          onBlur={() => (setFocused(false), onBlur?.())}
          onKeyDown={handleKeyDown}
          {...props}
        />
        
        {loading && (
          <div style={{ 
            color: 'var(--color-text-muted)',
            marginLeft: 'var(--space-2)',
            animation: 'spin 1s linear infinite'
          }}>
            <LoadingIcon />
          </div>
        )}
      </div>
      
      {/* Autocomplete Dropdown */}
      <div ref={dropdownRef} style={getDropdownStyles()}>
        {suggestions.length === 0 && !loading ? (
          <div style={normalizeStyle({
            padding: 'var(--space-4)',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-sm)'
          })}>
            {inputValue.length >= 3 ? 'No addresses found' : 'Type to search addresses...'}
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              style={getSuggestionItemStyles(index)}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div style={{ 
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-1)'
              }}>
                {suggestion.street}
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-secondary)'
              }}>
                {suggestion.city}, {suggestion.state} {suggestion.zip}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Full Address Form */}
      {showFullForm && (
        <div style={getFormStyles()}>
          {fields.includes('street') && (
            <div style={getFormFieldStyles()}>
              <label style={getLabelStyles()}>Street Address</label>
              <input
                type="text"
                value={addressForm.street}
                placeholder="123 Main Street"
                style={getFormInputStyles()}
                onChange={(e) => handleFormFieldChange('street', e.target.value)}
              />
            </div>
          )}
          
          {fields.includes('apartment') && (
            <div style={getFormFieldStyles()}>
              <label style={getLabelStyles()}>Apartment/Unit</label>
              <input
                type="text"
                value={addressForm.apartment}
                placeholder="Apt 4B"
                style={getFormInputStyles()}
                onChange={(e) => handleFormFieldChange('apartment', e.target.value)}
              />
            </div>
          )}
          
          {fields.includes('city') && (
            <div style={getFormFieldStyles()}>
              <label style={getLabelStyles()}>City</label>
              <input
                type="text"
                value={addressForm.city}
                placeholder="New York"
                style={getFormInputStyles()}
                onChange={(e) => handleFormFieldChange('city', e.target.value)}
              />
            </div>
          )}
          
          {fields.includes('state') && (
            <div style={getFormFieldStyles()}>
              <label style={getLabelStyles()}>State/Province</label>
              <input
                type="text"
                value={addressForm.state}
                placeholder="NY"
                style={getFormInputStyles()}
                onChange={(e) => handleFormFieldChange('state', e.target.value)}
              />
            </div>
          )}
          
          {fields.includes('zip') && (
            <div style={getFormFieldStyles()}>
              <label style={getLabelStyles()}>ZIP/Postal Code</label>
              <input
                type="text"
                value={addressForm.zip}
                placeholder="10001"
                style={getFormInputStyles()}
                onChange={(e) => handleFormFieldChange('zip', e.target.value)}
              />
            </div>
          )}
          
          {fields.includes('country') && (
            <div style={getFormFieldStyles()}>
              <label style={getLabelStyles()}>Country</label>
              <select
                value={addressForm.country}
                style={getFormInputStyles()}
                onChange={(e) => handleFormFieldChange('country', e.target.value)}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="IL">Israel</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          )}
        </div>
      )}
      
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
      
      {/* Loading spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

AddressInput.displayName = 'AddressInput';

export default AddressInput;