/**
 * 🎯 Vistara UI - PasswordInput Component
 * "Command your Design."
 * 
 * A secure password input with visibility toggle and strength indicator
 */

import React, { useState } from 'react';
import TextInput from './TextInput';
import { normalizeStyle } from '../../utils/normalizeStyle';

const PasswordInput = ({ 
  // Password specific props
  showStrengthIndicator = true,
  showVisibilityToggle = true,
  strengthRules = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  onStrengthChange,
  
  // All other TextInput props
  size = 'normal',
  theme = 'default',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [strength, setStrength] = useState(0);
  
  // Calculate password strength
  const calculateStrength = (password) => {
    if (!password) return 0;
    
    let score = 0;
    const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = strengthRules;
    
    // Length check
    if (password.length >= minLength) score += 20;
    if (password.length >= minLength + 4) score += 10;
    
    // Character type checks
    if (requireUppercase && /[A-Z]/.test(password)) score += 20;
    if (requireLowercase && /[a-z]/.test(password)) score += 20;
    if (requireNumbers && /[0-9]/.test(password)) score += 15;
    if (requireSpecialChars && /[^A-Za-z0-9]/.test(password)) score += 15;
    
    return Math.min(score, 100);
  };
  
  // Get strength color
  const getStrengthColor = (score) => {
    if (score < 30) return 'var(--color-danger)';
    if (score < 60) return 'var(--color-warning)';
    if (score < 80) return 'var(--color-info)';
    return 'var(--color-success)';
  };
  
  // Get strength label
  const getStrengthLabel = (score) => {
    if (score < 30) return 'Weak';
    if (score < 60) return 'Fair';
    if (score < 80) return 'Good';
    return 'Strong';
  };
  
  // Handle password change
  const handleChange = (e) => {
    const password = e.target.value;
    const newStrength = calculateStrength(password);
    setStrength(newStrength);
    onStrengthChange?.(newStrength);
    props.onChange?.(e);
  };
  
  // Toggle visibility icon
  const VisibilityIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      {isVisible ? (
        // Eye open
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        // Eye closed
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );
  
  // Strength indicator styles
  const strengthContainerStyles = normalizeStyle({
    marginTop: 'var(--space-2)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)'
  });
  
  const strengthBarStyles = normalizeStyle({
    height: '4px',
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--border-radius-sm)',
    overflow: 'hidden',
    position: 'relative'
  });
  
  const strengthFillStyles = normalizeStyle({
    height: '100%',
    backgroundColor: getStrengthColor(strength),
    width: `${strength}%`,
    transition: 'all 0.3s ease',
    borderRadius: 'var(--border-radius-sm)'
  });
  
  const strengthLabelStyles = normalizeStyle({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 'var(--font-size-xs)'
  });
  
  return (
    <div className="vistara-password-input">
      <TextInput
        {...props}
        type={isVisible ? 'text' : 'password'}
        size={size}
        theme={theme}
        onChange={handleChange}
        rightIcon={showVisibilityToggle && <VisibilityIcon />}
        onRightIconClick={showVisibilityToggle ? () => setIsVisible(!isVisible) : undefined}
        autoComplete="current-password"
      />
      
      {/* Strength Indicator */}
      {showStrengthIndicator && props.value && (
        <div style={strengthContainerStyles}>
          <div style={strengthBarStyles}>
            <div style={strengthFillStyles} />
          </div>
          {theme !== 'minimal' && (
            <div style={strengthLabelStyles}>
              <span style={{ color: getStrengthColor(strength) }}>
                {getStrengthLabel(strength)}
              </span>
              {theme === 'detailed' && (
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {strength}% strength
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Password requirements (detailed theme) */}
      {theme === 'detailed' && !props.value && (
        <div style={{ marginTop: 'var(--space-3)' }}>
          <p style={{ 
            fontSize: 'var(--font-size-xs)', 
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-2)'
          }}>
            Password requirements:
          </p>
          <ul style={{ 
            fontSize: 'var(--font-size-xs)', 
            color: 'var(--color-text-muted)',
            paddingLeft: 'var(--space-4)',
            listStyle: 'disc'
          }}>
            <li>At least {strengthRules.minLength} characters</li>
            {strengthRules.requireUppercase && <li>One uppercase letter</li>}
            {strengthRules.requireLowercase && <li>One lowercase letter</li>}
            {strengthRules.requireNumbers && <li>One number</li>}
            {strengthRules.requireSpecialChars && <li>One special character</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;