/**
 * 🎯 Vistara UI - ProgressChart Component
 * "Command your Design."
 * 
 * רכיב גרף התקדמות עגול מתקדם עם אנימציות ומטריקות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const ProgressChart = forwardRef(({ 
  // Data
  value = 0, // 0-100
  max = 100,
  min = 0,
  
  // Display
  showValue = true,
  showPercentage = true,
  label,
  description,
  
  // Chart configuration
  size = 120,
  strokeWidth = 8,
  
  // Visual options
  color = 'var(--color-primary)',
  backgroundColor = 'var(--color-background-secondary)',
  
  // Gradient
  gradient = false,
  gradientColors = ['var(--color-primary)', 'var(--color-success)'],
  
  // Animation
  animated = true,
  animationDuration = 1000,
  
  // Visual variants
  variant = 'circular', // 'circular', 'semicircle', 'line'
  theme = 'default', // 'default', 'minimal', 'detailed'
  
  // Thresholds
  thresholds = [], // [{ value, color, label }]
  
  // Callbacks
  onAnimationComplete,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [animatedValue, setAnimatedValue] = useState(animated ? 0 : value);
  const svgRef = useRef(null);
  const animationRef = useRef(null);
  
  // Calculate percentage
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  
  // Animation effect
  useEffect(() => {
    if (!animated) {
      setAnimatedValue(value);
      return;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const startTime = Date.now();
    const startValue = animatedValue;
    const targetValue = value;
    const valueChange = targetValue - startValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (valueChange * easedProgress);
      
      setAnimatedValue(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onAnimationComplete?.();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, animated, animationDuration, onAnimationComplete]);
  
  // Get current color based on thresholds
  const getCurrentColor = () => {
    if (thresholds.length === 0) return color;
    
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (percentage >= thresholds[i].value) {
        return thresholds[i].color;
      }
    }
    
    return color;
  };
  
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calculate stroke dash offset
  const animatedPercentage = Math.min(Math.max(((animatedValue - min) / (max - min)) * 100, 0), 100);
  
  const getStrokeDashOffset = (isBackground = false) => {
    if (variant === 'semicircle') {
      const halfCircumference = circumference / 2;
      return isBackground 
        ? 0 
        : halfCircumference - (halfCircumference * animatedPercentage / 100);
    }
    
    return isBackground 
      ? 0 
      : circumference - (circumference * animatedPercentage / 100);
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'var(--font-family-base)',
      
      ...(variant === 'line' && {
        width: '100%',
        maxWidth: size * 2
      })
    });
  };
  
  // Value display styles
  const getValueDisplayStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      pointerEvents: 'none'
    });
  };
  
  // Text styles
  const getValueTextStyles = () => {
    const fontSize = Math.max(size * 0.12, 12);
    
    return normalizeStyle({
      fontSize: `${fontSize}px`,
      fontWeight: 'var(--font-weight-bold)',
      color: 'var(--color-text-primary)',
      lineHeight: 1,
      margin: 0
    });
  };
  
  const getLabelTextStyles = () => {
    const fontSize = Math.max(size * 0.08, 10);
    
    return normalizeStyle({
      fontSize: `${fontSize}px`,
      color: 'var(--color-text-muted)',
      lineHeight: 1,
      margin: 0,
      marginTop: 'var(--space-1)'
    });
  };
  
  // Render circular/semicircle variant
  const renderCircular = () => {
    const viewBoxSize = size;
    const strokeDasharray = variant === 'semicircle' 
      ? `${circumference / 2} ${circumference}`
      : circumference;
    
    const rotation = variant === 'semicircle' ? 'rotate(-90 50 50)' : 'rotate(-90 50 50)';
    
    return (
      <div style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          width={size}
          height={variant === 'semicircle' ? size / 2 + strokeWidth : size}
          viewBox={`0 0 ${viewBoxSize} ${variant === 'semicircle' ? viewBoxSize / 2 + strokeWidth : viewBoxSize}`}
          style={{ overflow: 'visible' }}
        >
          {/* Gradient definition */}
          {gradient && (
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientColors[0]} />
                <stop offset="100%" stopColor={gradientColors[1]} />
              </linearGradient>
            </defs>
          )}
          
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={variant === 'semicircle' ? circumference / 4 : 0}
            transform={rotation}
          />
          
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={gradient ? 'url(#progressGradient)' : getCurrentColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={getStrokeDashOffset()}
            strokeLinecap="round"
            transform={rotation}
            style={{
              transition: animated ? 'stroke-dashoffset 0.3s ease' : 'none'
            }}
          />
        </svg>
        
        {/* Center content */}
        {(variant !== 'semicircle' || size > 80) && (showValue || showPercentage || label) && (
          <div style={getValueDisplayStyles()}>
            {(showValue || showPercentage) && (
              <div style={getValueTextStyles()}>
                {showValue && !showPercentage ? Math.round(animatedValue) : null}
                {showPercentage ? `${Math.round(animatedPercentage)}%` : null}
              </div>
            )}
            {label && (
              <div style={getLabelTextStyles()}>
                {label}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Render line variant
  const renderLine = () => {
    return (
      <div style={{ width: '100%' }}>
        <div style={normalizeStyle({
          position: 'relative',
          height: `${strokeWidth}px`,
          backgroundColor,
          borderRadius: `${strokeWidth / 2}px`,
          overflow: 'hidden'
        })}>
          {/* Progress fill */}
          <div
            style={normalizeStyle({
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${animatedPercentage}%`,
              background: gradient 
                ? `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]})`
                : getCurrentColor(),
              borderRadius: `${strokeWidth / 2}px`,
              transition: animated ? 'width 0.3s ease' : 'none'
            })}
          />
        </div>
        
        {/* Labels */}
        {(showValue || showPercentage || label) && (
          <div style={normalizeStyle({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'var(--space-2)'
          })}>
            <div>
              {label && (
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  {label}
                </div>
              )}
              {description && (
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)'
                }}>
                  {description}
                </div>
              )}
            </div>
            
            {(showValue || showPercentage) && (
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: getCurrentColor()
              }}>
                {showValue && !showPercentage ? Math.round(animatedValue) : null}
                {showPercentage ? `${Math.round(animatedPercentage)}%` : null}
              </div>
            )}
          </div>
        )}
        
        {/* Thresholds */}
        {thresholds.length > 0 && (
          <div style={normalizeStyle({
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 'var(--space-1)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)'
          })}>
            {thresholds.map((threshold, index) => (
              <div key={index} style={{ 
                position: 'relative',
                color: animatedPercentage >= threshold.value ? threshold.color : 'var(--color-text-muted)'
              }}>
                {threshold.label || `${threshold.value}%`}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Description below chart
  const renderDescription = () => {
    if (!description || variant === 'line') return null;
    
    return (
      <div style={normalizeStyle({
        marginTop: 'var(--space-2)',
        textAlign: 'center',
        maxWidth: size * 1.2
      })}>
        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.4
        }}>
          {description}
        </div>
      </div>
    );
  };
  
  // Thresholds indicators for circular charts
  const renderThresholds = () => {
    if (thresholds.length === 0 || variant === 'line') return null;
    
    return (
      <div style={normalizeStyle({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        marginTop: 'var(--space-3)',
        fontSize: 'var(--font-size-xs)'
      })}>
        {thresholds.map((threshold, index) => (
          <div key={index} style={normalizeStyle({
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            opacity: animatedPercentage >= threshold.value ? 1 : 0.5
          })}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: threshold.color,
              borderRadius: '50%'
            }} />
            <span style={{ color: 'var(--color-text-muted)' }}>
              {threshold.label || `${threshold.value}%`}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-progress-chart vistara-progress-chart--${variant} vistara-progress-chart--${theme} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {variant === 'line' ? renderLine() : renderCircular()}
      {renderDescription()}
      {renderThresholds()}
    </div>
  );
});

ProgressChart.displayName = 'ProgressChart';

export default ProgressChart;