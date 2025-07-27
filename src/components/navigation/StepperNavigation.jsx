/**
 * 🎯 Vistara UI - StepperNavigation Component
 * "Command your Design."
 * 
 * ניווט צעדים מתקדם עם אינדיקטורי התקדמות ואימות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const StepperNavigation = forwardRef(({ 
  // Steps
  steps = [], // [{ id, label, description?, icon?, status?, validation? }]
  currentStep = 0,
  
  // Behavior
  allowStepSkipping = false,
  showStepNumbers = true,
  clickableSteps = true,
  
  // Layout
  orientation = 'horizontal', // 'horizontal', 'vertical'
  alignment = 'center', // 'left', 'center', 'right' (for horizontal)
  
  // Progress
  showProgress = true,
  showProgressBar = true,
  progressType = 'line', // 'line', 'dots', 'both'
  
  // Visual elements
  showDescriptions = true,
  showIcons = true,
  showValidation = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'outlined'
  variant = 'default', // 'default', 'numbered', 'dotted', 'custom'
  
  // Colors
  completedColor = 'var(--color-success)',
  activeColor = 'var(--color-primary)',
  pendingColor = 'var(--color-text-muted)',
  errorColor = 'var(--color-danger)',
  
  // Animation
  animated = true,
  animationDuration = 300,
  
  // Callbacks
  onStepClick,
  onStepChange,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [hoveredStep, setHoveredStep] = useState(null);
  const containerRef = useRef(null);
  
  // Calculate step status
  const getStepStatus = (stepIndex) => {
    const step = steps[stepIndex];
    
    // Use explicit status if provided
    if (step?.status) return step.status;
    
    // Calculate based on current step
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    return 'pending';
  };
  
  // Calculate step accessibility
  const isStepClickable = (stepIndex) => {
    if (!clickableSteps) return false;
    
    const status = getStepStatus(stepIndex);
    
    // Always allow clicking completed steps
    if (status === 'completed') return true;
    
    // Allow clicking current step
    if (status === 'active') return true;
    
    // Allow skipping if enabled
    if (allowStepSkipping) return true;
    
    return false;
  };
  
  // Handle step click
  const handleStepClick = (stepIndex, step) => {
    if (!isStepClickable(stepIndex)) return;
    
    onStepClick?.(stepIndex, step);
    onStepChange?.(stepIndex, step);
  };
  
  // Get step color
  const getStepColor = (stepIndex) => {
    const status = getStepStatus(stepIndex);
    const step = steps[stepIndex];
    
    if (step?.validation === 'error') return errorColor;
    
    switch (status) {
      case 'completed':
        return completedColor;
      case 'active':
        return activeColor;
      case 'error':
        return errorColor;
      default:
        return pendingColor;
    }
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      width: '100%',
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'column' : 'row',
      alignItems: orientation === 'horizontal' ? 'center' : 'stretch',
      justifyContent: orientation === 'horizontal' ? 
        alignment === 'left' ? 'flex-start' : 
        alignment === 'right' ? 'flex-end' : 'center' : 'flex-start',
      gap: orientation === 'vertical' ? 'var(--space-4)' : 0,
      
      // Theme variations
      ...(theme === 'modern' && {
        backgroundColor: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-xl)',
        padding: 'var(--space-4)'
      })
    });
  };
  
  // Step container styles
  const getStepContainerStyles = (stepIndex) => {
    const isLast = stepIndex === steps.length - 1;
    
    return normalizeStyle({
      display: 'flex',
      flexDirection: orientation === 'vertical' ? 'row' : 'column',
      alignItems: orientation === 'vertical' ? 'flex-start' : 'center',
      flex: orientation === 'horizontal' && !isLast ? 1 : 'none',
      position: 'relative',
      gap: orientation === 'vertical' ? 'var(--space-3)' : 'var(--space-2)',
      cursor: isStepClickable(stepIndex) ? 'pointer' : 'default',
      transition: 'all 0.2s ease',
      
      ...(isStepClickable(stepIndex) && {
        ':hover': {
          transform: 'translateY(-1px)'
        }
      })
    });
  };
  
  // Step indicator styles
  const getStepIndicatorStyles = (stepIndex) => {
    const status = getStepStatus(stepIndex);
    const color = getStepColor(stepIndex);
    const isHovered = hoveredStep === stepIndex;
    
    const sizeMap = {
      compact: { width: '32px', height: '32px', fontSize: 'var(--font-size-sm)' },
      normal: { width: '40px', height: '40px', fontSize: 'var(--font-size-base)' },
      expanded: { width: '48px', height: '48px', fontSize: 'var(--font-size-lg)' }
    };
    
    return normalizeStyle({
      ...sizeMap[size],
      borderRadius: variant === 'dotted' ? '50%' : 
                   variant === 'numbered' ? '50%' : 'var(--border-radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'var(--font-weight-bold)',
      transition: animated ? `all ${animationDuration}ms ease` : 'none',
      position: 'relative',
      flexShrink: 0,
      
      // Status-based styling
      ...(status === 'completed' && {
        backgroundColor: color,
        color: 'var(--color-white)',
        border: `2px solid ${color}`
      }),
      
      ...(status === 'active' && {
        backgroundColor: color,
        color: 'var(--color-white)',
        border: `2px solid ${color}`,
        boxShadow: `0 0 0 4px ${color}20`
      }),
      
      ...(status === 'pending' && {
        backgroundColor: 'var(--color-surface)',
        color: color,
        border: `2px solid ${color}`
      }),
      
      ...(status === 'error' && {
        backgroundColor: color,
        color: 'var(--color-white)',
        border: `2px solid ${color}`
      }),
      
      // Theme variations
      ...(theme === 'outlined' && {
        backgroundColor: 'transparent',
        color: color,
        border: `2px solid ${color}`
      }),
      
      ...(theme === 'minimal' && {
        backgroundColor: 'transparent',
        border: 'none',
        color: color
      }),
      
      // Hover effects
      ...(isHovered && isStepClickable(stepIndex) && {
        transform: 'scale(1.1)',
        boxShadow: `0 0 0 6px ${color}15`
      })
    });
  };
  
  // Progress line styles
  const getProgressLineStyles = (stepIndex) => {
    const isLast = stepIndex === steps.length - 1;
    if (isLast) return null;
    
    const isCompleted = getStepStatus(stepIndex + 1) === 'completed' || 
                       getStepStatus(stepIndex + 1) === 'active';
    
    return normalizeStyle({
      position: 'absolute',
      backgroundColor: isCompleted ? completedColor : pendingColor,
      transition: animated ? `all ${animationDuration}ms ease` : 'none',
      
      ...(orientation === 'horizontal' ? {
        top: '50%',
        left: '100%',
        right: 0,
        height: '2px',
        transform: 'translateY(-50%)'
      } : {
        left: '50%',
        top: '100%',
        bottom: 0,
        width: '2px',
        transform: 'translateX(-50%)'
      })
    });
  };
  
  // Step content styles
  const getStepContentStyles = (stepIndex) => {
    const status = getStepStatus(stepIndex);
    
    return normalizeStyle({
      textAlign: orientation === 'horizontal' ? 'center' : 'left',
      maxWidth: orientation === 'horizontal' ? '120px' : 'none',
      flex: orientation === 'vertical' ? 1 : 'none'
    });
  };
  
  // Step label styles
  const getStepLabelStyles = (stepIndex) => {
    const status = getStepStatus(stepIndex);
    const color = getStepColor(stepIndex);
    
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: status === 'active' ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)',
      color: status === 'pending' ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
      margin: 0,
      lineHeight: 1.2
    });
  };
  
  // Step description styles
  const getStepDescriptionStyles = (stepIndex) => {
    const status = getStepStatus(stepIndex);
    
    return normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-muted)',
      margin: 'var(--space-1) 0 0 0',
      lineHeight: 1.4,
      display: size === 'compact' ? 'none' : 'block'
    });
  };
  
  // Validation icon styles
  const getValidationIconStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '-4px',
      right: '-4px',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px'
    });
  };
  
  // Progress bar (overall) styles
  const getProgressBarStyles = () => {
    if (!showProgressBar) return null;
    
    const progress = steps.length > 0 ? (currentStep / (steps.length - 1)) * 100 : 0;
    
    return normalizeStyle({
      position: 'absolute',
      backgroundColor: 'var(--color-background-secondary)',
      
      ...(orientation === 'horizontal' ? {
        top: '50%',
        left: 0,
        right: 0,
        height: '2px',
        transform: 'translateY(-50%)'
      } : {
        left: '50%',
        top: 0,
        bottom: 0,
        width: '2px',
        transform: 'translateX(-50%)'
      }),
      
      '::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: activeColor,
        transition: animated ? `all ${animationDuration}ms ease` : 'none',
        
        ...(orientation === 'horizontal' ? {
          width: `${progress}%`,
          height: '100%'
        } : {
          height: `${progress}%`,
          width: '100%'
        })
      }
    });
  };
  
  // Render step indicator content
  const renderStepIndicator = (step, stepIndex) => {
    const status = getStepStatus(stepIndex);
    
    // Custom icon
    if (showIcons && step.icon) {
      return step.icon;
    }
    
    // Status icons
    if (status === 'completed') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    }
    
    if (status === 'error') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    }
    
    // Step number
    if (showStepNumbers || variant === 'numbered') {
      return stepIndex + 1;
    }
    
    // Dot
    if (variant === 'dotted') {
      return null; // Empty for dot variant
    }
    
    return stepIndex + 1;
  };
  
  // Render validation icon
  const renderValidationIcon = (step) => {
    if (!showValidation || !step.validation) return null;
    
    const validationStyles = {
      success: { backgroundColor: completedColor, color: 'white' },
      error: { backgroundColor: errorColor, color: 'white' },
      warning: { backgroundColor: 'var(--color-warning)', color: 'white' }
    };
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '!'
    };
    
    return (
      <div style={{
        ...getValidationIconStyles(),
        ...validationStyles[step.validation]
      }}>
        {icons[step.validation]}
      </div>
    );
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-stepper-navigation vistara-stepper-navigation--${variant} vistara-stepper-navigation--${size} vistara-stepper-navigation--${orientation} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {/* Progress bar */}
      {showProgressBar && progressType === 'line' && (
        <div style={getProgressBarStyles()} />
      )}
      
      {/* Steps */}
      {steps.map((step, stepIndex) => (
        <div
          key={step.id || stepIndex}
          style={getStepContainerStyles(stepIndex)}
          onClick={() => handleStepClick(stepIndex, step)}
          onMouseEnter={() => setHoveredStep(stepIndex)}
          onMouseLeave={() => setHoveredStep(null)}
        >
          {/* Step indicator */}
          <div style={{ position: 'relative' }}>
            <div style={getStepIndicatorStyles(stepIndex)}>
              {renderStepIndicator(step, stepIndex)}
            </div>
            
            {/* Validation icon */}
            {renderValidationIcon(step)}
          </div>
          
          {/* Progress line */}
          {showProgress && progressType !== 'dots' && (
            <div style={getProgressLineStyles(stepIndex)} />
          )}
          
          {/* Step content */}
          <div style={getStepContentStyles(stepIndex)}>
            <div style={getStepLabelStyles(stepIndex)}>
              {step.label}
            </div>
            
            {showDescriptions && step.description && (
              <div style={getStepDescriptionStyles(stepIndex)}>
                {step.description}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Progress indicator */}
      {showProgress && (
        <div style={{
          position: 'absolute',
          bottom: theme === 'modern' ? 'var(--space-2)' : '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          display: orientation === 'horizontal' ? 'block' : 'none'
        }}>
          Step {currentStep + 1} of {steps.length}
        </div>
      )}
    </div>
  );
});

StepperNavigation.displayName = 'StepperNavigation';

export default StepperNavigation;