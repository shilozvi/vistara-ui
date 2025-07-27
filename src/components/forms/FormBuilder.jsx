/**
 * 🎯 Vistara UI - FormBuilder Component
 * "Command your Design."
 * 
 * בונה טפסים דינמי עם ואלידציה ולוגיקה
 */

import React, { forwardRef, useState, useRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const FormBuilder = forwardRef(({
  // Form schema
  fields = [], // [{ name, label, type, required?, validation?, options?, defaultValue?, conditions? }]
  
  // Layout
  layout = 'vertical', // 'vertical', 'horizontal', 'inline', 'grid'
  columns = 1,
  spacing = 'normal', // 'compact', 'normal', 'expanded'
  
  // Validation
  validateOnChange = false,
  validateOnBlur = true,
  showRequiredIndicator = true,
  
  // Submission
  submitLabel = 'Submit',
  resetLabel = 'Reset',
  showReset = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'bordered'
  variant = 'default', // 'default', 'floating', 'outlined', 'filled'
  
  // Callbacks
  onSubmit,
  onChange,
  onValidate,
  onReset,
  
  // Custom field renderers
  customFields = {},
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [formData, setFormData] = useState(() => {
    const initialData = {};
    fields.forEach(field => {
      initialData[field.name] = field.defaultValue || '';
    });
    return initialData;
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  
  // Validate field
  const validateField = (field, value) => {
    const errors = [];
    
    // Required validation
    if (field.required && !value) {
      errors.push(`${field.label || field.name} is required`);
    }
    
    // Type-specific validation
    if (value) {
      switch (field.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push('Invalid email address');
          }
          break;
        case 'phone':
          if (!/^[\d\s\-()\+]+$/.test(value)) {
            errors.push('Invalid phone number');
          }
          break;
        case 'url':
          try {
            new URL(value);
          } catch {
            errors.push('Invalid URL');
          }
          break;
        case 'number':
          if (isNaN(value)) {
            errors.push('Must be a number');
          } else {
            if (field.min !== undefined && value < field.min) {
              errors.push(`Must be at least ${field.min}`);
            }
            if (field.max !== undefined && value > field.max) {
              errors.push(`Must be at most ${field.max}`);
            }
          }
          break;
      }
    }
    
    // Custom validation
    if (field.validation) {
      const customError = field.validation(value, formData);
      if (customError) {
        errors.push(customError);
      }
    }
    
    return errors.length > 0 ? errors[0] : null;
  };
  
  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    fields.forEach(field => {
      if (!isFieldVisible(field)) return;
      
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Check if field is visible based on conditions
  const isFieldVisible = (field) => {
    if (!field.conditions) return true;
    
    return field.conditions.every(condition => {
      const { field: conditionField, operator, value } = condition;
      const fieldValue = formData[conditionField];
      
      switch (operator) {
        case 'equals':
          return fieldValue === value;
        case 'notEquals':
          return fieldValue !== value;
        case 'contains':
          return fieldValue && fieldValue.includes(value);
        case 'notEmpty':
          return !!fieldValue;
        case 'empty':
          return !fieldValue;
        default:
          return true;
      }
    });
  };
  
  // Handle field change
  const handleFieldChange = (field, value) => {
    const newData = { ...formData, [field.name]: value };
    setFormData(newData);
    onChange?.(newData);
    
    if (validateOnChange) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };
  
  // Handle field blur
  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field.name]: true }));
    
    if (validateOnBlur) {
      const error = validateField(field, formData[field.name]);
      setErrors(prev => ({ ...prev, [field.name]: error }));
    }
  };
  
  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit?.(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle form reset
  const handleReset = () => {
    const resetData = {};
    fields.forEach(field => {
      resetData[field.name] = field.defaultValue || '';
    });
    
    setFormData(resetData);
    setErrors({});
    setTouched({});
    onReset?.();
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      width: '100%',
      
      ...(theme === 'modern' && {
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-lg)'
      }),
      
      ...(theme === 'bordered' && {
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-6)'
      })
    });
  };
  
  // Form styles
  const getFormStyles = () => {
    return normalizeStyle({
      display: layout === 'grid' ? 'grid' : 'flex',
      flexDirection: layout === 'horizontal' ? 'row' : 'column',
      gap: spacing === 'compact' ? 'var(--space-2)' : 
           spacing === 'expanded' ? 'var(--space-6)' : 'var(--space-4)',
      
      ...(layout === 'grid' && {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      })
    });
  };
  
  // Field wrapper styles
  const getFieldWrapperStyles = (field) => {
    return normalizeStyle({
      display: layout === 'inline' ? 'flex' : 'block',
      flexDirection: layout === 'inline' ? 'row' : 'column',
      gap: layout === 'inline' ? 'var(--space-2)' : 0,
      alignItems: layout === 'inline' ? 'center' : 'stretch',
      
      ...(field.width && {
        gridColumn: `span ${field.width}`
      })
    });
  };
  
  // Label styles
  const getLabelStyles = () => {
    return normalizeStyle({
      display: 'block',
      marginBottom: layout === 'inline' ? 0 : 'var(--space-1)',
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-primary)',
      minWidth: layout === 'inline' ? '120px' : 'auto'
    });
  };
  
  // Input styles
  const getInputStyles = (field, hasError) => {
    return normalizeStyle({
      width: '100%',
      padding: size === 'compact' ? 'var(--space-2)' : 'var(--space-3)',
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      backgroundColor: 'var(--color-surface)',
      border: `1px solid ${hasError ? 'var(--color-danger)' : 'var(--color-border)'}`,
      borderRadius: 'var(--border-radius-md)',
      outline: 'none',
      transition: 'all 0.2s ease',
      color: 'var(--color-text-primary)',
      
      ':focus': {
        borderColor: hasError ? 'var(--color-danger)' : 'var(--color-primary)',
        boxShadow: `0 0 0 3px ${hasError ? 'var(--color-danger)' : 'var(--color-primary)'}20`
      },
      
      '::placeholder': {
        color: 'var(--color-text-muted)'
      },
      
      ...(variant === 'filled' && {
        backgroundColor: 'var(--color-background-secondary)',
        border: 'none',
        borderBottom: `2px solid ${hasError ? 'var(--color-danger)' : 'var(--color-border)'}`
      }),
      
      ...(variant === 'floating' && {
        paddingTop: 'var(--space-4)',
        paddingBottom: 'var(--space-1)'
      })
    });
  };
  
  // Error message styles
  const getErrorStyles = () => {
    return normalizeStyle({
      marginTop: 'var(--space-1)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-danger)'
    });
  };
  
  // Button container styles
  const getButtonContainerStyles = () => {
    return normalizeStyle({
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)',
      justifyContent: layout === 'horizontal' ? 'flex-start' : 'flex-end'
    });
  };
  
  // Button styles
  const getButtonStyles = (isPrimary = true) => {
    return normalizeStyle({
      padding: 'var(--space-2) var(--space-4)',
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      borderRadius: 'var(--border-radius-md)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      outline: 'none',
      
      ...(isPrimary ? {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-contrast)',
        ':hover': {
          backgroundColor: 'var(--color-primary-dark)'
        },
        ':disabled': {
          backgroundColor: 'var(--color-background-disabled)',
          cursor: 'not-allowed'
        }
      } : {
        backgroundColor: 'transparent',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
        ':hover': {
          backgroundColor: 'var(--color-background-secondary)'
        }
      })
    });
  };
  
  // Render field
  const renderField = (field) => {
    if (!isFieldVisible(field)) return null;
    
    const hasError = touched[field.name] && errors[field.name];
    const value = formData[field.name] || '';
    
    // Custom field renderer
    if (customFields[field.type]) {
      return customFields[field.type]({
        field,
        value,
        error: hasError ? errors[field.name] : null,
        onChange: (val) => handleFieldChange(field, val),
        onBlur: () => handleFieldBlur(field)
      });
    }
    
    // Built-in field types
    let inputElement;
    
    switch (field.type) {
      case 'select':
        inputElement = (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            style={getInputStyles(field, hasError)}
            disabled={field.disabled}
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
        
      case 'textarea':
        inputElement = (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            style={{
              ...getInputStyles(field, hasError),
              minHeight: '100px',
              resize: 'vertical'
            }}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={field.rows || 3}
          />
        );
        break;
        
      case 'checkbox':
        inputElement = (
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFieldChange(field, e.target.checked)}
              onBlur={() => handleFieldBlur(field)}
              disabled={field.disabled}
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            />
            <span>{field.checkboxLabel || field.label}</span>
          </label>
        );
        break;
        
      case 'radio':
        inputElement = (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {field.options?.map(option => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  disabled={field.disabled}
                  style={{
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
        break;
        
      default:
        inputElement = (
          <input
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            style={getInputStyles(field, hasError)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
          />
        );
    }
    
    return (
      <div key={field.name} style={getFieldWrapperStyles(field)}>
        {field.type !== 'checkbox' && (
          <label style={getLabelStyles()}>
            {field.label}
            {field.required && showRequiredIndicator && (
              <span style={{ color: 'var(--color-danger)', marginLeft: '4px' }}>*</span>
            )}
          </label>
        )}
        
        {inputElement}
        
        {hasError && (
          <div style={getErrorStyles()}>
            {errors[field.name]}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-form-builder vistara-form-builder--${variant} vistara-form-builder--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      <form ref={formRef} onSubmit={handleSubmit} style={getFormStyles()}>
        {fields.map(renderField)}
        
        <div style={getButtonContainerStyles()}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={getButtonStyles(true)}
          >
            {isSubmitting ? 'Submitting...' : submitLabel}
          </button>
          
          {showReset && (
            <button
              type="button"
              onClick={handleReset}
              style={getButtonStyles(false)}
            >
              {resetLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
});

FormBuilder.displayName = 'FormBuilder';

export default FormBuilder;