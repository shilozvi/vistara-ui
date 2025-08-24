/**
 * 🎯 Vistara UI - EmailInput Component
 * "Command your Design."
 * 
 * An email input with built-in validation and domain suggestions
 */

import React, { useState, useRef, useEffect } from 'react';
import TextInput from './TextInput';
import { normalizeStyle } from '../../utils/normalizeStyle';

const EmailInput = ({ 
  // Email specific props
  suggestDomains = true,
  commonDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'protonmail.com',
    'aol.com',
    'mail.com'
  ],
  validateOnType = true,
  allowedDomains = [], // Restrict to specific domains
  blockedDomains = [], // Block specific domains
  onValidEmail,
  
  // All other TextInput props
  size = 'normal',
  theme = 'default',
  ...props
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const inputRef = useRef();
  const suggestionsRef = useRef();
  
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Validate email format
  const validateEmail = (email) => {
    if (!email) return true; // Empty is valid (for optional fields)
    
    // Basic format check
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    
    // Domain restrictions
    const domain = email.split('@')[1];
    if (allowedDomains.length > 0 && !allowedDomains.includes(domain)) {
      return `Email must be from: ${allowedDomains.join(', ')}`;
    }
    if (blockedDomains.length > 0 && blockedDomains.includes(domain)) {
      return `Email domain not allowed: ${domain}`;
    }
    
    return true;
  };
  
  // Generate domain suggestions
  const generateSuggestions = (value) => {
    if (!suggestDomains || !value.includes('@')) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const [localPart, domainPart = ''] = value.split('@');
    
    if (localPart && domainPart.length < 10) {
      const filtered = commonDomains
        .filter(domain => 
          domain.toLowerCase().startsWith(domainPart.toLowerCase()) &&
          !blockedDomains.includes(domain) &&
          (allowedDomains.length === 0 || allowedDomains.includes(domain))
        )
        .slice(0, 5)
        .map(domain => `${localPart}@${domain}`);
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    
    // Generate suggestions
    generateSuggestions(value);
    
    // Validate
    const isValid = validateEmail(value) === true;
    setIsValidEmail(isValid);
    
    if (isValid && value) {
      onValidEmail?.(value);
    }
    
    props.onChange?.(e);
  };
  
  // Handle suggestion selection
  const selectSuggestion = (suggestion) => {
    // Create synthetic event
    const event = {
      target: {
        value: suggestion,
        name: props.name,
        id: props.id
      }
    };
    
    props.onChange?.(event);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsValidEmail(true);
    onValidEmail?.(suggestion);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };
  
  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Email icon
  const EmailIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
  
  // Valid email checkmark
  const ValidIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="var(--color-success)" 
      strokeWidth="2"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  
  // Suggestions dropdown styles
  const suggestionsContainerStyles = normalizeStyle({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 'var(--space-1)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 1000,
    overflow: 'hidden'
  });
  
  const suggestionItemStyles = (isSelected) => normalizeStyle({
    padding: 'var(--space-3)',
    cursor: 'pointer',
    backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-base)',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'var(--color-background-secondary)'
    }
  });
  
  return (
    <div className="vistara-email-input" style={{ position: 'relative' }}>
      <TextInput
        {...props}
        ref={inputRef}
        type="email"
        size={size}
        theme={theme}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        leftIcon={theme !== 'minimal' && <EmailIcon />}
        rightIcon={isValidEmail && props.value && <ValidIcon />}
        placeholder={props.placeholder || 'email@example.com'}
        autoComplete="email"
        validator={validateOnType ? validateEmail : props.validator}
        helperText={props.helperText || (theme === 'detailed' && 'We\'ll never share your email')}
      />
      
      {/* Email suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} style={suggestionsContainerStyles}>
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              style={suggestionItemStyles(index === selectedIndex)}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      
      {/* Email validation hints (detailed theme) */}
      {theme === 'detailed' && allowedDomains.length > 0 && !props.value && (
        <div style={{
          marginTop: 'var(--space-2)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)'
        }}>
          Allowed domains: {allowedDomains.join(', ')}
        </div>
      )}
    </div>
  );
};

export default EmailInput;