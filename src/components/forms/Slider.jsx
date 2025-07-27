/**
 * 🎯 Vistara UI - Slider Component
 * "Command your Design."
 * 
 * סרגל גלילה אינטראקטיבי עם תמיכה בטווחים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Slider = forwardRef(({
  // Value
  value = 0,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  
  // Range mode
  range = false,
  
  // Display
  label = '',
  showValue = true,
  showTicks = false,
  showMarks = false,
  marks = [], // [{ value: 25, label: '25%' }]
  
  // Behavior
  disabled = false,
  readOnly = false,
  
  // Orientation
  orientation = 'horizontal', // 'horizontal', 'vertical'
  reversed = false,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'colorful'
  variant = 'default', // 'default', 'filled', 'outlined', 'gradient'
  
  // Colors
  trackColor = 'var(--color-background-secondary)',
  fillColor = 'var(--color-primary)',
  thumbColor = 'var(--color-primary)',
  
  // Formatting
  formatValue = (val) => val,
  formatTooltip = (val) => val,
  
  // Callbacks
  onChange,
  onChangeCommitted,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [localValue, setLocalValue] = useState(
    range ? (value || defaultValue || [min, max]) : (value || defaultValue || min)
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const trackRef = useRef(null);
  
  // Update value when prop changes
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);
  
  // Calculate position from value
  const getPositionFromValue = (val) => {
    const percent = ((val - min) / (max - min)) * 100;
    return reversed ? 100 - percent : percent;
  };
  
  // Calculate value from position
  const getValueFromPosition = (position) => {
    if (!trackRef.current) return min;
    
    const rect = trackRef.current.getBoundingClientRect();
    let percent;
    
    if (orientation === 'horizontal') {
      percent = (position.x - rect.left) / rect.width;
    } else {
      percent = 1 - (position.y - rect.top) / rect.height;
    }
    
    if (reversed) percent = 1 - percent;
    
    percent = Math.min(Math.max(percent, 0), 1);
    const rawValue = min + percent * (max - min);
    
    // Snap to step
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  };
  
  // Handle mouse/touch start
  const handleStart = (event, thumbIndex = null) => {
    if (disabled || readOnly) return;
    
    event.preventDefault();
    setIsDragging(true);
    setActiveThumb(thumbIndex);
    setShowTooltip(true);
    
    const position = event.type.includes('touch')
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : { x: event.clientX, y: event.clientY };
    
    updateValue(position, thumbIndex);
  };
  
  // Handle mouse/touch move
  const handleMove = (event) => {
    if (!isDragging) return;
    
    const position = event.type.includes('touch')
      ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
      : { x: event.clientX, y: event.clientY };
    
    updateValue(position, activeThumb);
  };
  
  // Handle mouse/touch end
  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    setActiveThumb(null);
    setShowTooltip(false);
    
    onChangeCommitted?.(localValue);
  };
  
  // Update value
  const updateValue = (position, thumbIndex) => {
    const newValue = getValueFromPosition(position);
    
    if (range) {
      const newValues = [...localValue];
      
      if (thumbIndex === null) {
        // Click on track - move nearest thumb
        const dist0 = Math.abs(newValue - localValue[0]);
        const dist1 = Math.abs(newValue - localValue[1]);
        thumbIndex = dist0 < dist1 ? 0 : 1;
      }
      
      newValues[thumbIndex] = newValue;
      
      // Ensure min <= max
      if (thumbIndex === 0 && newValue > localValue[1]) {
        newValues[0] = localValue[1];
      } else if (thumbIndex === 1 && newValue < localValue[0]) {
        newValues[1] = localValue[0];
      }
      
      setLocalValue(newValues);
      onChange?.(newValues);
    } else {
      setLocalValue(newValue);
      onChange?.(newValue);
    }
  };
  
  // Add global event listeners
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMove = (e) => handleMove(e);
      const handleGlobalEnd = () => handleEnd();
      
      document.addEventListener('mousemove', handleGlobalMove);
      document.addEventListener('mouseup', handleGlobalEnd);
      document.addEventListener('touchmove', handleGlobalMove);
      document.addEventListener('touchend', handleGlobalEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMove);
        document.removeEventListener('mouseup', handleGlobalEnd);
        document.removeEventListener('touchmove', handleGlobalMove);
        document.removeEventListener('touchend', handleGlobalEnd);
      };
    }
  }, [isDragging, activeThumb, localValue]);
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      width: orientation === 'horizontal' ? '100%' : 'auto',
      height: orientation === 'vertical' ? '200px' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    });
  };
  
  // Label styles
  const getLabelStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-1)'
    });
  };
  
  // Track container styles
  const getTrackContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      padding: orientation === 'horizontal' 
        ? `${size === 'compact' ? 8 : 12}px 0`
        : `0 ${size === 'compact' ? 8 : 12}px`,
      width: orientation === 'horizontal' ? '100%' : 'auto',
      height: orientation === 'vertical' ? '100%' : 'auto',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    });
  };
  
  // Track styles
  const getTrackStyles = () => {
    const thickness = size === 'compact' ? 4 : size === 'expanded' ? 8 : 6;
    
    return normalizeStyle({
      position: 'relative',
      backgroundColor: trackColor,
      borderRadius: 'var(--border-radius-full)',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
      
      ...(orientation === 'horizontal' ? {
        width: '100%',
        height: `${thickness}px`
      } : {
        width: `${thickness}px`,
        height: '100%'
      }),
      
      ...(variant === 'outlined' && {
        border: '1px solid var(--color-border)'
      }),
      
      ...(theme === 'modern' && {
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
      })
    });
  };
  
  // Fill styles
  const getFillStyles = () => {
    const start = range ? getPositionFromValue(localValue[0]) : 0;
    const end = range ? getPositionFromValue(localValue[1]) : getPositionFromValue(localValue);
    
    return normalizeStyle({
      position: 'absolute',
      backgroundColor: fillColor,
      borderRadius: 'inherit',
      transition: isDragging ? 'none' : 'all 0.2s ease',
      
      ...(orientation === 'horizontal' ? {
        left: `${start}%`,
        right: `${100 - end}%`,
        top: 0,
        bottom: 0
      } : {
        bottom: `${start}%`,
        top: `${100 - end}%`,
        left: 0,
        right: 0
      }),
      
      ...(variant === 'gradient' && {
        background: `linear-gradient(${orientation === 'horizontal' ? '90deg' : '0deg'}, 
          var(--color-primary-light) 0%, var(--color-primary) 100%)`
      }),
      
      ...(theme === 'colorful' && {
        background: `linear-gradient(${orientation === 'horizontal' ? '90deg' : '0deg'}, 
          #4f46e5 0%, #7c3aed 50%, #ec4899 100%)`
      })
    });
  };
  
  // Thumb styles
  const getThumbStyles = (position, isActive) => {
    const size = isActive ? 20 : 16;
    
    return normalizeStyle({
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: thumbColor,
      borderRadius: '50%',
      border: '2px solid var(--color-surface)',
      boxShadow: 'var(--shadow-md)',
      cursor: disabled ? 'not-allowed' : 'grab',
      transition: isDragging ? 'none' : 'all 0.2s ease',
      transform: 'translate(-50%, -50%)',
      zIndex: isActive ? 2 : 1,
      
      ...(orientation === 'horizontal' ? {
        left: `${position}%`,
        top: '50%'
      } : {
        bottom: `${position}%`,
        left: '50%',
        transform: 'translate(-50%, 50%)'
      }),
      
      ':active': {
        cursor: 'grabbing'
      },
      
      ...(theme === 'modern' && {
        backgroundColor: 'var(--color-surface)',
        border: `3px solid ${thumbColor}`
      }),
      
      ...(isActive && {
        boxShadow: `0 0 0 8px ${thumbColor}20`
      })
    });
  };
  
  // Tooltip styles
  const getTooltipStyles = (position) => {
    return normalizeStyle({
      position: 'absolute',
      backgroundColor: 'var(--color-surface-inverted)',
      color: 'var(--color-text-inverted)',
      padding: 'var(--space-1) var(--space-2)',
      borderRadius: 'var(--border-radius-md)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      opacity: showTooltip ? 1 : 0,
      transition: 'opacity 0.2s ease',
      transform: 'translate(-50%, -100%)',
      
      ...(orientation === 'horizontal' ? {
        left: `${position}%`,
        bottom: '100%',
        marginBottom: 'var(--space-2)'
      } : {
        bottom: `${position}%`,
        left: '100%',
        marginLeft: 'var(--space-2)',
        transform: 'translateY(50%)'
      })
    });
  };
  
  // Mark styles
  const getMarkStyles = (position, isActive) => {
    return normalizeStyle({
      position: 'absolute',
      backgroundColor: isActive ? fillColor : 'var(--color-border)',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      
      ...(orientation === 'horizontal' ? {
        left: `${position}%`,
        top: '50%',
        width: '8px',
        height: '8px'
      } : {
        bottom: `${position}%`,
        left: '50%',
        width: '8px',
        height: '8px',
        transform: 'translate(-50%, 50%)'
      })
    });
  };
  
  // Mark label styles
  const getMarkLabelStyles = (position) => {
    return normalizeStyle({
      position: 'absolute',
      fontSize: 'var(--font-size-xs)',
      color: 'var(--color-text-muted)',
      transform: 'translateX(-50%)',
      whiteSpace: 'nowrap',
      
      ...(orientation === 'horizontal' ? {
        left: `${position}%`,
        top: '100%',
        marginTop: 'var(--space-2)'
      } : {
        bottom: `${position}%`,
        left: '100%',
        marginLeft: 'var(--space-3)',
        transform: 'translateY(50%)'
      })
    });
  };
  
  // Render marks
  const renderMarks = () => {
    if (!showMarks || marks.length === 0) return null;
    
    return marks.map((mark, index) => {
      const position = getPositionFromValue(mark.value);
      const isActive = range
        ? mark.value >= localValue[0] && mark.value <= localValue[1]
        : mark.value <= localValue;
      
      return (
        <React.Fragment key={index}>
          <div style={getMarkStyles(position, isActive)} />
          {mark.label && (
            <div style={getMarkLabelStyles(position)}>
              {mark.label}
            </div>
          )}
        </React.Fragment>
      );
    });
  };
  
  // Render ticks
  const renderTicks = () => {
    if (!showTicks) return null;
    
    const tickCount = Math.floor((max - min) / step) + 1;
    const ticks = [];
    
    for (let i = 0; i < tickCount; i++) {
      const value = min + i * step;
      const position = getPositionFromValue(value);
      const isActive = range
        ? value >= localValue[0] && value <= localValue[1]
        : value <= localValue;
      
      ticks.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            backgroundColor: isActive ? fillColor : 'var(--color-border)',
            opacity: 0.3,
            ...(orientation === 'horizontal' ? {
              left: `${position}%`,
              top: '50%',
              width: '2px',
              height: '8px',
              transform: 'translate(-50%, -50%)'
            } : {
              bottom: `${position}%`,
              left: '50%',
              width: '8px',
              height: '2px',
              transform: 'translate(-50%, 50%)'
            })
          }}
        />
      );
    }
    
    return ticks;
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-slider vistara-slider--${variant} vistara-slider--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {(label || showValue) && (
        <div style={getLabelStyles()}>
          {label && <span>{label}</span>}
          {showValue && (
            <span style={{ color: 'var(--color-text-secondary)' }}>
              {range
                ? `${formatValue(localValue[0])} - ${formatValue(localValue[1])}`
                : formatValue(localValue)
              }
            </span>
          )}
        </div>
      )}
      
      <div style={getTrackContainerStyles()}>
        <div
          ref={trackRef}
          style={getTrackStyles()}
          onMouseDown={(e) => handleStart(e)}
          onTouchStart={(e) => handleStart(e)}
        >
          {/* Fill */}
          <div style={getFillStyles()} />
          
          {/* Ticks */}
          {renderTicks()}
          
          {/* Marks */}
          {renderMarks()}
          
          {/* Thumbs */}
          {range ? (
            <>
              <div
                style={getThumbStyles(getPositionFromValue(localValue[0]), activeThumb === 0)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleStart(e, 0);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleStart(e, 0);
                }}
              />
              <div
                style={getThumbStyles(getPositionFromValue(localValue[1]), activeThumb === 1)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleStart(e, 1);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleStart(e, 1);
                }}
              />
              
              {/* Tooltips */}
              {activeThumb === 0 && (
                <div style={getTooltipStyles(getPositionFromValue(localValue[0]))}>
                  {formatTooltip(localValue[0])}
                </div>
              )}
              {activeThumb === 1 && (
                <div style={getTooltipStyles(getPositionFromValue(localValue[1]))}>
                  {formatTooltip(localValue[1])}
                </div>
              )}
            </>
          ) : (
            <>
              <div
                style={getThumbStyles(getPositionFromValue(localValue), isDragging)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleStart(e, 0);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleStart(e, 0);
                }}
              />
              
              {/* Tooltip */}
              {isDragging && (
                <div style={getTooltipStyles(getPositionFromValue(localValue))}>
                  {formatTooltip(localValue)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider;