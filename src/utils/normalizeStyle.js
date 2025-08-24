/**
 * 🔧 Style Normalization Utility
 * Ensures all components use CSS Variables instead of hardcoded values
 */

// Mapping of hardcoded values to CSS Variables
const STYLE_MAPPINGS = {
  // Colors
  '#6c5ce7': 'var(--color-primary)',
  '#a29bfe': 'var(--color-primary-light)',
  '#5f3dc4': 'var(--color-primary-dark)',
  '#0984e3': 'var(--color-secondary)',
  '#74b9ff': 'var(--color-secondary-light)',
  '#ffffff': 'var(--color-white)',
  '#000000': 'var(--color-black)',
  
  // Spacing
  '4px': 'var(--space-1)',
  '8px': 'var(--space-2)',
  '12px': 'var(--space-3)',
  '16px': 'var(--space-4)',
  '20px': 'var(--space-5)',
  '24px': 'var(--space-6)',
  '32px': 'var(--space-8)',
  '48px': 'var(--space-12)',
  
  // Border Radius
  '0.25rem': 'var(--border-radius-sm)',
  '0.5rem': 'var(--border-radius-md)',
  '0.75rem': 'var(--border-radius-lg)',
  '1rem': 'var(--border-radius-xl)',
  
  // Font Sizes
  '12px': 'var(--font-size-xs)',
  '14px': 'var(--font-size-sm)',
  '16px': 'var(--font-size-base)',
  '18px': 'var(--font-size-lg)',
  '20px': 'var(--font-size-xl)',
  '24px': 'var(--font-size-2xl)',
  '30px': 'var(--font-size-3xl)',
  '36px': 'var(--font-size-4xl)'
};

/**
 * Normalizes style object to use CSS Variables
 * @param {Object} styles - Style object to normalize
 * @returns {Object} - Normalized style object
 */
export const normalizeStyle = (styles) => {
  if (!styles || typeof styles !== 'object') return styles;
  
  const normalized = {};
  
  for (const [property, value] of Object.entries(styles)) {
    if (typeof value === 'string' && STYLE_MAPPINGS[value]) {
      normalized[property] = STYLE_MAPPINGS[value];
    } else {
      normalized[property] = value;
    }
  }
  
  return normalized;
};

/**
 * Validates component props for hardcoded values
 * @param {Object} props - Component props
 * @param {string} componentName - Name of component for logging
 */
export const validateProps = (props, componentName = 'Unknown') => {
  if (process.env.NODE_ENV === 'development') {
    const hardcodedValues = [];
    
    const checkValue = (key, value) => {
      if (typeof value === 'string') {
        // Check for hex colors
        if (/^#[0-9A-F]{6}$/i.test(value)) {
          hardcodedValues.push(`${key}: ${value} (use CSS variable instead)`);
        }
        // Check for pixel values
        if (/^\d+px$/.test(value)) {
          hardcodedValues.push(`${key}: ${value} (use CSS variable instead)`);
        }
      }
    };
    
    const scanObject = (obj, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          scanObject(value, fullKey);
        } else {
          checkValue(fullKey, value);
        }
      }
    };
    
    scanObject(props);
    
    if (hardcodedValues.length > 0) {
      console.warn(`⚠️ [${componentName}] Hardcoded values detected:`, hardcodedValues);
    }
  }
};

/**
 * HOC to automatically normalize styles
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} - Wrapped component
 */
export const withNormalizedStyles = (Component) => {
  return function NormalizedComponent(props) {
    if (process.env.NODE_ENV === 'development') {
      validateProps(props, Component.name || Component.displayName);
    }
    
    const normalizedProps = {
      ...props,
      style: normalizeStyle(props.style)
    };
    
    return <Component {...normalizedProps} />;
  };
};

export default normalizeStyle;