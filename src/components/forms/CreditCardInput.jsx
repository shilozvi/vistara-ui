/**
 * 🎯 Vistara UI - CreditCardInput Component
 * "Command your Design."
 * 
 * שדה קלט כרטיס אשראי מתקדם עם זיהוי ואימות
 */

import React, { forwardRef, useState, useRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const CreditCardInput = forwardRef(({ 
  // Value & state
  value,
  defaultValue,
  
  // Behavior
  disabled = false,
  readOnly = false,
  required = false,
  
  // Display options
  showCardType = true,
  showSecurityCode = true,
  showExpiryDate = true,
  showCardholderName = false,
  
  // Layout
  layout = 'stacked', // 'stacked', 'inline', 'grid'
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'outlined', // 'outlined', 'filled', 'underlined'
  
  // Validation
  validateOnChange = true,
  allowedCards = ['visa', 'mastercard', 'amex', 'discover', 'jcb', 'diners'],
  
  // Security
  maskNumber = true,
  autoComplete = false,
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  onValidationChange,
  
  // Standard props
  id,
  name,
  className,
  style,
  ...props
}, ref) => {
  
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    ...value,
    ...defaultValue
  });
  
  const [validation, setValidation] = useState({
    number: { isValid: false, error: null },
    expiry: { isValid: false, error: null },
    cvv: { isValid: false, error: null },
    name: { isValid: true, error: null }
  });
  
  const [cardType, setCardType] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  
  const numberRef = useRef(null);
  const expiryRef = useRef(null);
  const cvvRef = useRef(null);
  const nameRef = useRef(null);
  
  // Card type patterns
  const cardPatterns = {
    visa: {
      pattern: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mask: '#### #### #### ####',
      cvvLength: 3,
      icon: '💳',
      name: 'Visa'
    },
    mastercard: {
      pattern: /^5[1-5][0-9]{14}$/,
      mask: '#### #### #### ####',
      cvvLength: 3,
      icon: '💳',
      name: 'Mastercard'
    },
    amex: {
      pattern: /^3[47][0-9]{13}$/,
      mask: '#### ###### #####',
      cvvLength: 4,
      icon: '💳',
      name: 'American Express'
    },
    discover: {
      pattern: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      mask: '#### #### #### ####',
      cvvLength: 3,
      icon: '💳',
      name: 'Discover'
    },
    jcb: {
      pattern: /^(?:2131|1800|35\d{3})\d{11}$/,
      mask: '#### #### #### ####',
      cvvLength: 3,
      icon: '💳',
      name: 'JCB'
    },
    diners: {
      pattern: /^3[0689][0-9]{12}$/,
      mask: '#### ###### ####',
      cvvLength: 3,
      icon: '💳',
      name: 'Diners Club'
    }
  };
  
  // Detect card type from number
  const detectCardType = (number) => {
    const cleaned = number.replace(/\D/g, '');
    
    for (const [type, config] of Object.entries(cardPatterns)) {
      if (allowedCards.includes(type)) {
        // Check first few digits for type detection
        if (type === 'visa' && cleaned.startsWith('4')) return type;
        if (type === 'mastercard' && /^5[1-5]/.test(cleaned)) return type;
        if (type === 'amex' && /^3[47]/.test(cleaned)) return type;
        if (type === 'discover' && /^6(?:011|5)/.test(cleaned)) return type;
        if (type === 'jcb' && /^(?:2131|1800|35)/.test(cleaned)) return type;
        if (type === 'diners' && /^3[0689]/.test(cleaned)) return type;
      }
    }
    
    return null;
  };
  
  // Format card number
  const formatCardNumber = (number, type) => {
    const cleaned = number.replace(/\D/g, '');
    const pattern = type ? cardPatterns[type]?.mask : '#### #### #### ####';
    
    let formatted = '';
    let digitIndex = 0;
    
    for (let i = 0; i < pattern.length && digitIndex < cleaned.length; i++) {
      if (pattern[i] === '#') {
        formatted += cleaned[digitIndex++];
      } else {
        formatted += pattern[i];
      }
    }
    
    return formatted;
  };
  
  // Format expiry date
  const formatExpiry = (expiry) => {
    const cleaned = expiry.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };
  
  // Validate card number using Luhn algorithm
  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    
    if (cleaned.length < 13 || cleaned.length > 19) {
      return { isValid: false, error: 'Invalid card number length' };
    }
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    const isValid = sum % 10 === 0;
    return {
      isValid,
      error: isValid ? null : 'Invalid card number'
    };
  };
  
  // Validate expiry date
  const validateExpiry = (expiry) => {
    if (!expiry || expiry.length < 5) {
      return { isValid: false, error: 'Invalid expiry date' };
    }
    
    const [month, year] = expiry.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt(`20${year}`);
    
    if (monthNum < 1 || monthNum > 12) {
      return { isValid: false, error: 'Invalid month' };
    }
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
      return { isValid: false, error: 'Card has expired' };
    }
    
    return { isValid: true, error: null };
  };
  
  // Validate CVV
  const validateCVV = (cvv, cardType) => {
    const expectedLength = cardType ? cardPatterns[cardType]?.cvvLength || 3 : 3;
    
    if (!cvv || cvv.length !== expectedLength) {
      return { isValid: false, error: `CVV must be ${expectedLength} digits` };
    }
    
    if (!/^\d+$/.test(cvv)) {
      return { isValid: false, error: 'CVV must contain only numbers' };
    }
    
    return { isValid: true, error: null };
  };
  
  // Validate cardholder name
  const validateName = (name) => {
    if (!showCardholderName) return { isValid: true, error: null };
    
    if (!name || name.trim().length < 2) {
      return { isValid: false, error: 'Please enter cardholder name' };
    }
    
    return { isValid: true, error: null };
  };
  
  // Handle field changes
  const handleFieldChange = (field, value) => {
    let newValue = value;
    let newCardType = cardType;
    
    // Format values
    switch (field) {
      case 'number':
        newCardType = detectCardType(value);
        setCardType(newCardType);
        newValue = formatCardNumber(value, newCardType);
        // Limit length based on card type
        const maxLength = newCardType ? cardPatterns[newCardType].mask.length : 19;
        if (newValue.length > maxLength) {
          newValue = newValue.substring(0, maxLength);
        }
        break;
      case 'expiry':
        newValue = formatExpiry(value);
        if (newValue.length > 5) {
          newValue = newValue.substring(0, 5);
        }
        break;
      case 'cvv':
        newValue = value.replace(/\D/g, '');
        const maxCvvLength = cardType ? cardPatterns[cardType]?.cvvLength || 4 : 4;
        if (newValue.length > maxCvvLength) {
          newValue = newValue.substring(0, maxCvvLength);
        }
        break;
    }
    
    // Update card data
    const newCardData = { ...cardData, [field]: newValue };
    setCardData(newCardData);
    
    // Validate if enabled
    if (validateOnChange) {
      let newValidation = { ...validation };
      
      switch (field) {
        case 'number':
          newValidation.number = validateCardNumber(newValue);
          break;
        case 'expiry':
          newValidation.expiry = validateExpiry(newValue);
          break;
        case 'cvv':
          newValidation.cvv = validateCVV(newValue, newCardType);
          break;
        case 'name':
          newValidation.name = validateName(newValue);
          break;
      }
      
      setValidation(newValidation);
      onValidationChange?.(newValidation);
    }
    
    onChange?.(newCardData, field, newValue);
  };
  
  // Handle key navigation
  const handleKeyDown = (field, event) => {
    if (event.key === 'Tab') return;
    
    const { value } = event.target;
    
    // Auto-advance to next field
    if (event.key !== 'Backspace' && event.key !== 'Delete') {
      let shouldAdvance = false;
      
      switch (field) {
        case 'number':
          const maxLength = cardType ? cardPatterns[cardType].mask.length : 19;
          shouldAdvance = value.length >= maxLength - 1;
          break;
        case 'expiry':
          shouldAdvance = value.length >= 4;
          break;
        case 'cvv':
          const cvvLength = cardType ? cardPatterns[cardType]?.cvvLength || 3 : 3;
          shouldAdvance = value.length >= cvvLength - 1;
          break;
      }
      
      if (shouldAdvance) {
        setTimeout(() => {
          switch (field) {
            case 'number':
              expiryRef.current?.focus();
              break;
            case 'expiry':
              cvvRef.current?.focus();
              break;
            case 'cvv':
              if (showCardholderName) nameRef.current?.focus();
              break;
          }
        }, 10);
      }
    }
  };
  
  // Get display value (masked if needed)
  const getDisplayValue = (field, value) => {
    if (field === 'number' && maskNumber && focusedField !== 'number' && value.length > 4) {
      const visibleDigits = value.slice(-4);
      const maskedPart = '**** **** **** ';
      return maskedPart + visibleDigits;
    }
    return value;
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      width: '100%'
    });
  };
  
  // Form layout styles
  const getFormLayoutStyles = () => {
    return normalizeStyle({
      display: 'flex',
      flexDirection: layout === 'stacked' ? 'column' : 'row',
      gap: 'var(--space-3)',
      
      ...(layout === 'grid' && {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
      }),
      
      ...(layout === 'inline' && {
        flexWrap: 'wrap',
        alignItems: 'flex-start'
      })
    });
  };
  
  // Field container styles
  const getFieldContainerStyles = (isFullWidth = false) => {
    return normalizeStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
      flex: isFullWidth ? '1 1 100%' : layout === 'inline' ? '1 1 auto' : '1'
    });
  };
  
  // Input container styles
  const getInputContainerStyles = (field, hasError) => {
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
    
    const isFocused = focusedField === field;
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      borderRadius: 'var(--border-radius-md)',
      transition: 'all 0.2s ease',
      position: 'relative',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'outlined' && {
        border: `1px solid ${hasError ? 'var(--color-danger)' : isFocused ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: 'var(--color-surface)'
      }),
      
      ...(variant === 'filled' && {
        border: `1px solid ${hasError ? 'var(--color-danger)' : 'transparent'}`,
        backgroundColor: isFocused ? 'var(--color-surface)' : 'var(--color-background-secondary)'
      }),
      
      ...(variant === 'underlined' && {
        border: 'none',
        borderBottom: `2px solid ${hasError ? 'var(--color-danger)' : isFocused ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 0,
        backgroundColor: 'transparent'
      }),
      
      // Focus styles
      ...(isFocused && variant === 'outlined' && {
        boxShadow: `0 0 0 3px ${hasError ? 'var(--color-danger-light)' : 'var(--color-primary-light)'}`
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
      fontFamily: 'monospace',
      
      '::placeholder': {
        color: 'var(--color-text-muted)',
        opacity: 1,
        fontFamily: 'var(--font-family-base)'
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
  
  // Error styles
  const getErrorStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-xs)',
      color: 'var(--color-danger)',
      marginTop: 'var(--space-1)'
    });
  };
  
  // Card type indicator styles
  const getCardTypeStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      marginRight: 'var(--space-2)',
      fontSize: 'var(--font-size-lg)'
    });
  };
  
  // Card icons (simplified)
  const getCardIcon = (type) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      jcb: '💳',
      diners: '💳'
    };
    return icons[type] || '💳';
  };
  
  return (
    <div
      className={`vistara-credit-card-input vistara-credit-card-input--${variant} vistara-credit-card-input--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      <div style={getFormLayoutStyles()}>
        {/* Card Number */}
        <div style={getFieldContainerStyles(layout === 'stacked')}>
          <label style={getLabelStyles()}>Card Number</label>
          <div style={getInputContainerStyles('number', !validation.number.isValid)}>
            {showCardType && (
              <div style={getCardTypeStyles()}>
                {cardType ? getCardIcon(cardType) : '💳'}
              </div>
            )}
            <input
              ref={numberRef}
              type="text"
              value={getDisplayValue('number', cardData.number)}
              placeholder="1234 5678 9012 3456"
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              autoComplete={autoComplete ? "cc-number" : "off"}
              style={getInputStyles()}
              onChange={(e) => handleFieldChange('number', e.target.value)}
              onFocus={() => setFocusedField('number')}
              onBlur={() => setFocusedField(null)}
              onKeyDown={(e) => handleKeyDown('number', e)}
            />
          </div>
          {!validation.number.isValid && validation.number.error && (
            <div style={getErrorStyles()}>{validation.number.error}</div>
          )}
        </div>
        
        {/* Expiry Date */}
        {showExpiryDate && (
          <div style={getFieldContainerStyles()}>
            <label style={getLabelStyles()}>Expiry Date</label>
            <div style={getInputContainerStyles('expiry', !validation.expiry.isValid)}>
              <input
                ref={expiryRef}
                type="text"
                value={cardData.expiry}
                placeholder="MM/YY"
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                autoComplete={autoComplete ? "cc-exp" : "off"}
                style={getInputStyles()}
                onChange={(e) => handleFieldChange('expiry', e.target.value)}
                onFocus={() => setFocusedField('expiry')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => handleKeyDown('expiry', e)}
              />
            </div>
            {!validation.expiry.isValid && validation.expiry.error && (
              <div style={getErrorStyles()}>{validation.expiry.error}</div>
            )}
          </div>
        )}
        
        {/* CVV */}
        {showSecurityCode && (
          <div style={getFieldContainerStyles()}>
            <label style={getLabelStyles()}>
              CVV {cardType === 'amex' ? '(4 digits)' : '(3 digits)'}
            </label>
            <div style={getInputContainerStyles('cvv', !validation.cvv.isValid)}>
              <input
                ref={cvvRef}
                type="text"
                value={cardData.cvv}
                placeholder={cardType === 'amex' ? '1234' : '123'}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                autoComplete={autoComplete ? "cc-csc" : "off"}
                style={getInputStyles()}
                onChange={(e) => handleFieldChange('cvv', e.target.value)}
                onFocus={() => setFocusedField('cvv')}
                onBlur={() => setFocusedField(null)}
                onKeyDown={(e) => handleKeyDown('cvv', e)}
              />
            </div>
            {!validation.cvv.isValid && validation.cvv.error && (
              <div style={getErrorStyles()}>{validation.cvv.error}</div>
            )}
          </div>
        )}
        
        {/* Cardholder Name */}
        {showCardholderName && (
          <div style={getFieldContainerStyles(layout === 'stacked')}>
            <label style={getLabelStyles()}>Cardholder Name</label>
            <div style={getInputContainerStyles('name', !validation.name.isValid)}>
              <input
                ref={nameRef}
                type="text"
                value={cardData.name}
                placeholder="John Doe"
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                autoComplete={autoComplete ? "cc-name" : "off"}
                style={{ ...getInputStyles(), fontFamily: 'var(--font-family-base)' }}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {!validation.name.isValid && validation.name.error && (
              <div style={getErrorStyles()}>{validation.name.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

CreditCardInput.displayName = 'CreditCardInput';

export default CreditCardInput;