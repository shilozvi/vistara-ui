/**
 * 🎯 Vistara UI - ProgressBar Component
 * "Command your Design."
 * 
 * פס התקדמות עם אנימציות ומצבים
 */

import React, { forwardRef, useEffect, useState } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const ProgressBar = forwardRef(({ 
  // Progress value
  value = 0, // 0-100
  max = 100,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'linear', // 'linear', 'circular', 'semicircular'
  
  // Content
  label,
  showValue = true,
  showPercentage = true,
  formatValue,
  
  // States
  animated = true,
  indeterminate = false, // For unknown progress
  striped = false,
  
  // Colors
  color = 'primary', // 'primary', 'secondary', 'success', 'warning', 'danger', 'info'
  backgroundColor,
  
  // Behavior
  animationDuration = '0.3s',
  
  // Segments (for multi-step progress)
  segments = [],
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Normalize value
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;
  
  // Animate value changes
  useEffect(() => {
    if (animated && !indeterminate) {
      const timer = setTimeout(() => {
        setAnimatedValue(percentage);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(percentage);
    }
  }, [percentage, animated, indeterminate]);
  
  // Track completion
  useEffect(() => {
    setIsComplete(percentage >= 100);
  }, [percentage]);
  
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
  
  // Format display value
  const getFormattedValue = () => {
    if (formatValue) {
      return formatValue(normalizedValue, max);
    }
    if (showPercentage) {
      return `${Math.round(percentage)}%`;
    }
    return `${normalizedValue}/${max}`;
  };
  
  // Linear Progress Bar
  const LinearProgress = () => {
    const trackStyles = normalizeStyle({
      width: '100%',
      backgroundColor: backgroundColor || 'var(--color-background-secondary)',
      borderRadius: 'var(--border-radius-sm)',
      overflow: 'hidden',
      position: 'relative'
    });
    
    const fillStyles = normalizeStyle({
      height: '100%',
      backgroundColor: getColor(),
      borderRadius: 'inherit',
      transition: animated ? `width ${animationDuration} ease` : 'none',
      width: indeterminate ? '30%' : `${animatedValue}%`,
      position: 'relative',
      
      ...(indeterminate && {
        animation: 'indeterminate 2s infinite linear'
      }),
      
      ...(striped && {
        backgroundImage: `linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.15) 75%,
          transparent 75%,
          transparent
        )`,
        backgroundSize: '20px 20px',
        animation: striped ? 'stripes 1s linear infinite' : 'none'
      })
    });
    
    return (
      <div style={trackStyles}>
        <div style={fillStyles}>
          {/* Shimmer effect for detailed theme */}
          {theme === 'detailed' && !indeterminate && (
            <div
              style={normalizeStyle({
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: animatedValue > 0 ? 'shimmer 2s infinite' : 'none'
              })}
            />
          )}
        </div>
        
        {/* Segments */}
        {segments.length > 0 && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            {segments.map((segment, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${(segment.start / max) * 100}%`,
                  width: `${((segment.end - segment.start) / max) * 100}%`,
                  height: '100%',
                  backgroundColor: segment.color || getColor(),
                  opacity: percentage >= (segment.start / max) * 100 ? 1 : 0.3,
                  transition: 'opacity 0.3s ease'
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Circular Progress Bar
  const CircularProgress = () => {
    const sizeMap = {
      compact: 60,
      normal: 80,
      expanded: 120
    };
    
    const circleSize = sizeMap[size];
    const strokeWidth = circleSize / 12;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedValue / 100) * circumference;
    
    return (
      <div style={{ position: 'relative', width: circleSize, height: circleSize }}>
        <svg
          width={circleSize}
          height={circleSize}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke={backgroundColor || 'var(--color-background-secondary)'}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? 0 : strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: animated ? `stroke-dashoffset ${animationDuration} ease` : 'none',
              ...(indeterminate && {
                animation: 'spin 2s linear infinite'
              })
            }}
          />
        </svg>
        
        {/* Center content */}
        {showValue && !indeterminate && (
          <div
            style={normalizeStyle({
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            })}
          >
            {getFormattedValue()}
          </div>
        )}
      </div>
    );
  };
  
  // Get height based on size
  const getHeight = () => {
    const heights = {
      compact: '6px',
      normal: '8px',
      expanded: '12px'
    };
    return heights[size];
  };
  
  // Base container styles
  const containerStyles = normalizeStyle({
    width: '100%',
    fontFamily: 'var(--font-family-base)'
  });
  
  // Progress container styles
  const progressStyles = normalizeStyle({
    ...(variant === 'linear' && {
      height: getHeight()
    }),
    
    ...(variant === 'circular' && {
      display: 'flex',
      justifyContent: 'center'
    }),
    
    ...(variant === 'semicircular' && {
      display: 'flex',
      justifyContent: 'center'
    })
  });
  
  return (
    <div
      ref={ref}
      className={`vistara-progress-bar vistara-progress-bar--${variant} ${className || ''}`}
      style={{ ...containerStyles, ...style }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : normalizedValue}
      aria-label={label}
      {...props}
    >
      {/* Label */}
      {label && (
        <div
          style={normalizeStyle({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-2)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-primary)'
          })}
        >
          <span>{label}</span>
          {showValue && !indeterminate && variant === 'linear' && (
            <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {getFormattedValue()}
            </span>
          )}
        </div>
      )}
      
      {/* Progress */}
      <div style={progressStyles}>
        {variant === 'linear' && <LinearProgress />}
        {variant === 'circular' && <CircularProgress />}
      </div>
      
      {/* Success indicator */}
      {isComplete && theme === 'detailed' && (
        <div
          style={normalizeStyle({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 'var(--space-2)',
            color: 'var(--color-success)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)'
          })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '4px' }}>
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Complete
        </div>
      )}
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;