/**
 * 🎯 Vistara UI - LoadingSpinner Component
 * "Command your Design."
 * 
 * ספינרים מגוונים לטעינה
 */

import React, { forwardRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const LoadingSpinner = forwardRef(({ 
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'spinner', // 'spinner', 'dots', 'bars', 'pulse', 'ripple'
  
  // Content
  text,
  showText = true,
  
  // Behavior
  speed = 'normal', // 'slow', 'normal', 'fast'
  
  // Colors
  color = 'primary', // 'primary', 'secondary', 'success', 'warning', 'danger', 'info'
  
  // Overlay
  overlay = false,
  backdrop = false,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  // Size mappings
  const sizeMap = {
    compact: { size: 16, text: 'var(--font-size-sm)' },
    normal: { size: 24, text: 'var(--font-size-base)' },
    expanded: { size: 40, text: 'var(--font-size-lg)' }
  };
  
  const currentSize = sizeMap[size];
  
  // Speed mappings
  const speedMap = {
    slow: '2s',
    normal: '1s',
    fast: '0.5s'
  };
  
  const animationDuration = speedMap[speed];
  
  // Color mappings
  const getColor = () => {
    const colors = {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger: 'var(--color-danger)',
      info: 'var(--color-info)'
    };
    return colors[color] || colors.primary;
  };
  
  // Spinner variants
  const SpinnerVariant = () => (
    <svg 
      width={currentSize.size} 
      height={currentSize.size} 
      viewBox="0 0 24 24" 
      fill="none"
      style={{
        animation: `spin ${animationDuration} linear infinite`
      }}
    >
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="8"
        opacity={theme === 'minimal' ? 0.6 : 1}
      />
    </svg>
  );
  
  const DotsVariant = () => (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: currentSize.size / 4,
            height: currentSize.size / 4,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            animation: `bounce ${animationDuration} infinite ease-in-out ${i * 0.16}s`
          }}
        />
      ))}
    </div>
  );
  
  const BarsVariant = () => (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'end', height: currentSize.size }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            width: currentSize.size / 8,
            backgroundColor: 'currentColor',
            borderRadius: '1px',
            animation: `bars ${animationDuration} infinite ease-in-out ${i * 0.1}s`,
            height: '60%'
          }}
        />
      ))}
    </div>
  );
  
  const PulseVariant = () => (
    <div
      style={{
        width: currentSize.size,
        height: currentSize.size,
        borderRadius: '50%',
        backgroundColor: 'currentColor',
        animation: `pulse ${animationDuration} infinite ease-in-out`
      }}
    />
  );
  
  const RippleVariant = () => (
    <div style={{ 
      position: 'relative', 
      width: currentSize.size, 
      height: currentSize.size 
    }}>
      {[0, 1].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid currentColor',
            animation: `ripple ${animationDuration} infinite ease-out ${i * 0.5}s`
          }}
        />
      ))}
    </div>
  );
  
  // Get current variant component
  const getVariantComponent = () => {
    const variants = {
      spinner: SpinnerVariant,
      dots: DotsVariant,
      bars: BarsVariant,
      pulse: PulseVariant,
      ripple: RippleVariant
    };
    
    const VariantComponent = variants[variant] || SpinnerVariant;
    return <VariantComponent />;
  };
  
  // Base styles
  const baseStyles = normalizeStyle({
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: text && showText ? 'var(--space-2)' : 0,
    color: getColor(),
    fontFamily: 'var(--font-family-base)'
  });
  
  // Overlay styles
  const overlayStyles = overlay ? normalizeStyle({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backgroundColor: backdrop ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
    backdropFilter: backdrop ? 'blur(2px)' : 'none'
  }) : {};
  
  // Theme-specific enhancements
  const getThemeStyles = () => {
    const themes = {
      default: {},
      minimal: {
        opacity: 0.7
      },
      detailed: {
        filter: `drop-shadow(0 0 8px ${getColor()})`,
        position: 'relative'
      }
    };
    
    return normalizeStyle(themes[theme]);
  };
  
  // Combined styles
  const spinnerStyles = {
    ...baseStyles,
    ...overlayStyles,
    ...getThemeStyles(),
    ...style
  };
  
  const containerElement = (
    <div
      ref={ref}
      className={`vistara-loading-spinner vistara-loading-spinner--${variant} ${className || ''}`}
      style={spinnerStyles}
      role="status"
      aria-label={text || 'Loading'}
      {...props}
    >
      {/* Spinner */}
      <div style={{ position: 'relative' }}>
        {getVariantComponent()}
        
        {/* Glow effect for detailed theme */}
        {theme === 'detailed' && (
          <div
            style={normalizeStyle({
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: '120%',
              borderRadius: '50%',
              backgroundColor: getColor(),
              opacity: 0.2,
              filter: 'blur(8px)',
              animation: `pulse ${animationDuration} infinite ease-in-out`,
              pointerEvents: 'none'
            })}
          />
        )}
      </div>
      
      {/* Text */}
      {text && showText && (
        <span
          style={{
            fontSize: currentSize.text,
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            marginTop: 'var(--space-1)'
          }}
        >
          {text}
        </span>
      )}
      
      {/* Screen reader text */}
      <span className="sr-only">
        {text || 'Loading content, please wait...'}
      </span>
    </div>
  );
  
  return containerElement;
});

LoadingSpinner.displayName = 'LoadingSpinner';

// CSS animations (should be added to global CSS)
const animations = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

@keyframes bars {
  0%, 40%, 100% { height: 60%; }
  20% { height: 100%; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

@keyframes ripple {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}
`;

export default LoadingSpinner;