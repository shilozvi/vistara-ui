/**
 * 🎯 Vistara UI - PhoneInput Component
 * "Command your Design."
 * 
 * שדה קלט טלפון מתקדם עם קודי מדינות ואימות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const PhoneInput = forwardRef(({ 
  // Value & state
  value,
  defaultValue,
  
  // Behavior
  disabled = false,
  readOnly = false,
  required = false,
  
  // Display
  placeholder,
  
  // Country & formatting
  defaultCountry = 'US',
  preferredCountries = ['US', 'IL', 'GB', 'CA'],
  excludeCountries = [],
  onlyCountries = [],
  
  // Formatting options
  autoFormat = true,
  enableSearch = true,
  enableAreaCodes = false,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'outlined', // 'outlined', 'filled', 'underlined'
  
  // Validation
  error,
  validateOnChange = true,
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  onCountryChange,
  
  // Standard props
  id,
  name,
  className,
  style,
  ...props
}, ref) => {
  
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState(value || defaultValue || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focused, setFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Country data with dial codes and formatting patterns
  const countryData = {
    US: { name: 'United States', dialCode: '+1', flag: '🇺🇸', pattern: '(###) ###-####', maxLength: 14 },
    IL: { name: 'Israel', dialCode: '+972', flag: '🇮🇱', pattern: '##-###-####', maxLength: 12 },
    GB: { name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', pattern: '#### ### ####', maxLength: 13 },
    CA: { name: 'Canada', dialCode: '+1', flag: '🇨🇦', pattern: '(###) ###-####', maxLength: 14 },
    DE: { name: 'Germany', dialCode: '+49', flag: '🇩🇪', pattern: '### ### ####', maxLength: 12 },
    FR: { name: 'France', dialCode: '+33', flag: '🇫🇷', pattern: '# ## ## ## ##', maxLength: 14 },
    ES: { name: 'Spain', dialCode: '+34', flag: '🇪🇸', pattern: '### ### ###', maxLength: 11 },
    IT: { name: 'Italy', dialCode: '+39', flag: '🇮🇹', pattern: '### ### ####', maxLength: 12 },
    AU: { name: 'Australia', dialCode: '+61', flag: '🇦🇺', pattern: '#### ### ###', maxLength: 12 },
    JP: { name: 'Japan', dialCode: '+81', flag: '🇯🇵', pattern: '##-####-####', maxLength: 13 },
    KR: { name: 'South Korea', dialCode: '+82', flag: '🇰🇷', pattern: '##-####-####', maxLength: 13 },
    CN: { name: 'China', dialCode: '+86', flag: '🇨🇳', pattern: '### #### ####', maxLength: 13 },
    IN: { name: 'India', dialCode: '+91', flag: '🇮🇳', pattern: '##### #####', maxLength: 11 },
    BR: { name: 'Brazil', dialCode: '+55', flag: '🇧🇷', pattern: '(##) #####-####', maxLength: 15 },
    RU: { name: 'Russia', dialCode: '+7', flag: '🇷🇺', pattern: '(###) ###-##-##', maxLength: 16 },
    MX: { name: 'Mexico', dialCode: '+52', flag: '🇲🇽', pattern: '## #### ####', maxLength: 12 },
    AR: { name: 'Argentina', dialCode: '+54', flag: '🇦🇷', pattern: '## ####-####', maxLength: 12 },
    SE: { name: 'Sweden', dialCode: '+46', flag: '🇸🇪', pattern: '##-### ## ##', maxLength: 12 },
    NO: { name: 'Norway', dialCode: '+47', flag: '🇳🇴', pattern: '### ## ###', maxLength: 11 },
    DK: { name: 'Denmark', dialCode: '+45', flag: '🇩🇰', pattern: '## ## ## ##', maxLength: 11 },
    FI: { name: 'Finland', dialCode: '+358', flag: '🇫🇮', pattern: '## ### ####', maxLength: 12 }
  };
  
  // Get available countries
  const getAvailableCountries = () => {
    let countries = Object.keys(countryData);
    
    if (onlyCountries.length > 0) {
      countries = countries.filter(code => onlyCountries.includes(code));
    }
    
    if (excludeCountries.length > 0) {
      countries = countries.filter(code => !excludeCountries.includes(code));
    }
    
    // Sort: preferred countries first, then alphabetical
    const preferred = countries.filter(code => preferredCountries.includes(code));
    const others = countries.filter(code => !preferredCountries.includes(code))
      .sort((a, b) => countryData[a].name.localeCompare(countryData[b].name));
    
    return [...preferred, ...others];
  };
  
  // Filter countries by search
  const getFilteredCountries = () => {
    const available = getAvailableCountries();
    if (!searchTerm) return available;
    
    return available.filter(code => {
      const country = countryData[code];
      return (
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dialCode.includes(searchTerm) ||
        code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };
  
  // Format phone number according to country pattern
  const formatPhoneNumber = (number, countryCode) => {
    if (!autoFormat || !number) return number;
    
    const country = countryData[countryCode];
    if (!country) return number;
    
    // Remove all non-digits
    const digits = number.replace(/\D/g, '');
    const pattern = country.pattern;
    
    let formatted = '';
    let digitIndex = 0;
    
    for (let i = 0; i < pattern.length && digitIndex < digits.length; i++) {
      if (pattern[i] === '#') {
        formatted += digits[digitIndex++];
      } else {
        formatted += pattern[i];
      }
    }
    
    return formatted;
  };
  
  // Validate phone number
  const validatePhoneNumber = (number, countryCode) => {
    if (!number) return true; // Empty is valid (unless required)
    
    const country = countryData[countryCode];
    if (!country) return false;
    
    const digits = number.replace(/\D/g, '');
    
    // Basic length validation
    const minLength = Math.floor(country.maxLength * 0.7); // Allow some flexibility
    const maxLength = country.maxLength;
    
    return digits.length >= minLength && digits.length <= maxLength;
  };
  
  // Handle input change
  const handleInputChange = (event) => {
    let newValue = event.target.value;
    const country = countryData[selectedCountry];
    
    // Limit length
    if (country && newValue.length > country.maxLength) {
      newValue = newValue.substring(0, country.maxLength);
    }
    
    // Format if enabled
    if (autoFormat) {
      newValue = formatPhoneNumber(newValue, selectedCountry);
    }
    
    setPhoneNumber(newValue);
    
    // Validate
    if (validateOnChange) {
      const valid = validatePhoneNumber(newValue, selectedCountry);
      setIsValid(valid);
    }
    
    // Get full phone number with country code
    const fullNumber = `${country.dialCode} ${newValue}`;
    onChange?.(event, newValue, fullNumber, selectedCountry);
  };
  
  // Handle country selection
  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    // Reformat current number for new country
    if (phoneNumber && autoFormat) {
      const formatted = formatPhoneNumber(phoneNumber, countryCode);
      setPhoneNumber(formatted);
    }
    
    onCountryChange?.(countryCode, countryData[countryCode]);
    
    // Focus back to input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle focus
  const handleFocus = (event) => {
    setFocused(true);
    onFocus?.(event);
  };
  
  // Handle blur
  const handleBlur = (event) => {
    setFocused(false);
    
    // Final validation on blur
    if (validateOnChange) {
      const valid = validatePhoneNumber(phoneNumber, selectedCountry);
      setIsValid(valid);
    }
    
    onBlur?.(event);
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
        fontSize: 'var(--font-size-sm)'
      },
      normal: {
        height: '40px',
        fontSize: 'var(--font-size-base)'
      },
      expanded: {
        height: '48px',
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
      overflow: 'hidden',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'outlined' && {
        border: `1px solid ${error || !isValid ? 'var(--color-danger)' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: 'var(--color-surface)'
      }),
      
      ...(variant === 'filled' && {
        border: `1px solid ${error || !isValid ? 'var(--color-danger)' : 'transparent'}`,
        backgroundColor: focused ? 'var(--color-surface)' : 'var(--color-background-secondary)'
      }),
      
      ...(variant === 'underlined' && {
        border: 'none',
        borderBottom: `2px solid ${error || !isValid ? 'var(--color-danger)' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 0,
        backgroundColor: 'transparent'
      }),
      
      // Focus styles
      ...(focused && variant === 'outlined' && {
        boxShadow: `0 0 0 3px ${error || !isValid ? 'var(--color-danger-light)' : 'var(--color-primary-light)'}`
      }),
      
      // States
      ...(disabled && {
        opacity: 0.5,
        cursor: 'not-allowed'
      })
    });
  };
  
  // Country selector styles
  const getCountrySelectorStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-2) var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      borderRight: variant !== 'underlined' ? '1px solid var(--color-border)' : 'none',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      fontSize: 'inherit',
      
      ':hover': !disabled ? {
        backgroundColor: 'var(--color-background-secondary)'
      } : {}
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
      padding: 'var(--space-2) var(--space-3)',
      
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
  
  // Search input styles
  const getSearchInputStyles = () => {
    return normalizeStyle({
      width: '100%',
      padding: 'var(--space-2) var(--space-3)',
      border: 'none',
      borderBottom: '1px solid var(--color-border)',
      outline: 'none',
      fontSize: 'var(--font-size-sm)',
      backgroundColor: 'transparent',
      
      '::placeholder': {
        color: 'var(--color-text-muted)'
      }
    });
  };
  
  // Country list styles
  const getCountryListStyles = () => {
    return normalizeStyle({
      maxHeight: '240px',
      overflowY: 'auto',
      padding: 'var(--space-1) 0'
    });
  };
  
  // Country item styles
  const getCountryItemStyles = (countryCode) => {
    const isSelected = countryCode === selectedCountry;
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-2) var(--space-3)',
      cursor: 'pointer',
      fontSize: 'var(--font-size-sm)',
      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
      
      ':hover': {
        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'
      }
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
  
  const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const currentCountry = countryData[selectedCountry];
  const filteredCountries = getFilteredCountries();
  const displayPlaceholder = placeholder || `Enter phone number...`;
  
  return (
    <div
      ref={containerRef}
      className={`vistara-phone-input vistara-phone-input--${variant} vistara-phone-input--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
    >
      <div style={getInputContainerStyles()}>
        {/* Country Selector */}
        <button
          type="button"
          style={getCountrySelectorStyles()}
          onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled}
        >
          <span style={{ fontSize: 'var(--font-size-base)' }}>
            {currentCountry.flag}
          </span>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            {currentCountry.dialCode}
          </span>
          <div style={{ 
            color: 'var(--color-text-muted)',
            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>
            <ChevronDown />
          </div>
        </button>
        
        {/* Phone Input */}
        <input
          ref={inputRef}
          type="tel"
          id={id}
          name={name}
          value={phoneNumber}
          placeholder={displayPlaceholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          style={getInputStyles()}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </div>
      
      {/* Country Dropdown */}
      <div ref={dropdownRef} style={getDropdownStyles()}>
        {/* Search */}
        {enableSearch && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        
        {/* Country List */}
        <div style={getCountryListStyles()}>
          {filteredCountries.length === 0 ? (
            <div style={normalizeStyle({
              padding: 'var(--space-4)',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--font-size-sm)'
            })}>
              No countries found
            </div>
          ) : (
            filteredCountries.map((countryCode) => {
              const country = countryData[countryCode];
              return (
                <div
                  key={countryCode}
                  style={getCountryItemStyles(countryCode)}
                  onClick={() => handleCountrySelect(countryCode)}
                >
                  <span style={{ fontSize: 'var(--font-size-lg)' }}>
                    {country.flag}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {country.name}
                    </div>
                    <div style={{ 
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      {country.dialCode}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-muted)',
                    fontFamily: 'monospace'
                  }}>
                    {countryCode}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Error message */}
      {(error || (!isValid && phoneNumber)) && (
        <div style={getErrorStyles()}>
          <ErrorIcon />
          <span>
            {error || 'Please enter a valid phone number'}
          </span>
        </div>
      )}
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;