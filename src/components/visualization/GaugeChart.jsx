/**
 * 🎯 Vistara UI - GaugeChart Component
 * "Command your Design."
 * 
 * מד מחוג להצגת ערכים ומדדים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const GaugeChart = forwardRef(({
  // Value
  value = 0,
  minValue = 0,
  maxValue = 100,
  
  // Display options
  showValue = true,
  showLabel = true,
  showTicks = true,
  showMinMax = true,
  showNeedle = true,
  
  // Labels
  label = '',
  unit = '',
  decimals = 0,
  
  // Segments
  segments = [], // [{ from: 0, to: 30, color: '#10b981', label: 'Low' }]
  useGradient = false,
  
  // Gauge style
  gaugeType = 'semicircle', // 'semicircle', 'circle', 'arc'
  startAngle = -90,
  endAngle = 90,
  
  // Needle options
  needleColor = 'var(--color-text-primary)',
  needleWidth = 4,
  needleLength = 0.8, // Percentage of radius
  
  // Animation
  animated = true,
  animationDuration = 1000,
  animationEasing = 'easeOutCubic',
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'neon'
  variant = 'default', // 'default', 'filled', 'outlined', 'gradient'
  
  // Dimensions
  width = 300,
  height = 200,
  innerRadius = 0.6, // Percentage of outer radius
  
  // Colors
  trackColor = 'var(--color-background-secondary)',
  valueColor = 'var(--color-primary)',
  
  // Callbacks
  onValueChange,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [displayValue, setDisplayValue] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  
  // Calculate dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: typeof width === 'number' ? width : rect.width,
        height: typeof height === 'number' ? height : rect.height
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [width, height]);
  
  // Animation
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }
    
    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const easedProgress = animationEasing === 'easeOutCubic' 
        ? 1 - Math.pow(1 - progress, 3)
        : progress;
      
      const currentValue = startValue + (endValue - startValue) * easedProgress;
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, animated, animationDuration]);
  
  // Calculate gauge parameters
  const centerX = dimensions.width / 2;
  const centerY = gaugeType === 'semicircle' ? dimensions.height - 20 : dimensions.height / 2;
  const radius = Math.min(dimensions.width, dimensions.height) / 2 - 20;
  const innerRadiusValue = radius * innerRadius;
  
  // Convert angles to radians
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;
  const angleRange = endAngleRad - startAngleRad;
  
  // Calculate value angle
  const normalizedValue = (displayValue - minValue) / (maxValue - minValue);
  const valueAngle = startAngleRad + normalizedValue * angleRange;
  
  // Create arc path
  const createArcPath = (startAngle, endAngle, outerRadius, innerRadius) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);
    
    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);
    
    const largeArcFlag = Math.abs(endAngleRad - startAngleRad) > Math.PI ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
  };
  
  // Get segment color
  const getSegmentColor = () => {
    if (segments.length === 0) return valueColor;
    
    const segment = segments.find(s => displayValue >= s.from && displayValue <= s.to);
    return segment ? segment.color : valueColor;
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      position: 'relative',
      width: width,
      height: height,
      backgroundColor: theme === 'modern' ? 'var(--color-surface)' : 'transparent',
      borderRadius: 'var(--border-radius-lg)',
      padding: 'var(--space-3)',
      
      ...(theme === 'modern' && {
        boxShadow: 'var(--shadow-lg)'
      }),
      
      ...(theme === 'neon' && {
        backgroundColor: '#0a0a0a',
        border: '1px solid var(--color-primary)'
      })
    });
  };
  
  // SVG styles
  const getSvgStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: '100%'
    });
  };
  
  // Track styles
  const getTrackStyles = () => {
    return normalizeStyle({
      fill: trackColor,
      opacity: theme === 'minimal' ? 0.1 : 0.3
    });
  };
  
  // Value arc styles
  const getValueArcStyles = () => {
    return normalizeStyle({
      fill: getSegmentColor(),
      transition: animated ? 'none' : 'fill 0.3s ease',
      
      ...(variant === 'gradient' && {
        fill: 'url(#valueGradient)'
      }),
      
      ...(theme === 'neon' && {
        filter: `drop-shadow(0 0 10px ${getSegmentColor()})`
      })
    });
  };
  
  // Needle styles
  const getNeedleStyles = () => {
    return normalizeStyle({
      fill: needleColor,
      stroke: needleColor,
      strokeWidth: needleWidth,
      transition: animated ? 'none' : 'transform 0.3s ease',
      transformOrigin: `${centerX}px ${centerY}px`,
      
      ...(theme === 'neon' && {
        filter: `drop-shadow(0 0 4px ${needleColor})`
      })
    });
  };
  
  // Value text styles
  const getValueTextStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-2xl)' : 
                size === 'expanded' ? 'var(--font-size-4xl)' : 'var(--font-size-3xl)',
      fontWeight: 'var(--font-weight-bold)',
      fill: 'var(--color-text-primary)',
      textAnchor: 'middle',
      dominantBaseline: 'middle'
    });
  };
  
  // Label styles
  const getLabelStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 
                size === 'expanded' ? 'var(--font-size-lg)' : 'var(--font-size-base)',
      fill: 'var(--color-text-secondary)',
      textAnchor: 'middle',
      dominantBaseline: 'middle'
    });
  };
  
  // Tick styles
  const getTickStyles = (major = false) => {
    return normalizeStyle({
      stroke: 'var(--color-text-muted)',
      strokeWidth: major ? 2 : 1,
      opacity: major ? 0.8 : 0.4
    });
  };
  
  // Create needle path
  const createNeedlePath = () => {
    const needleEndX = centerX + radius * needleLength * Math.cos(valueAngle);
    const needleEndY = centerY + radius * needleLength * Math.sin(valueAngle);
    
    const baseWidth = needleWidth * 2;
    const perpAngle = valueAngle + Math.PI / 2;
    
    const baseX1 = centerX + baseWidth * Math.cos(perpAngle);
    const baseY1 = centerY + baseWidth * Math.sin(perpAngle);
    const baseX2 = centerX - baseWidth * Math.cos(perpAngle);
    const baseY2 = centerY - baseWidth * Math.sin(perpAngle);
    
    return `M ${baseX1} ${baseY1} L ${needleEndX} ${needleEndY} L ${baseX2} ${baseY2} Z`;
  };
  
  // Render ticks
  const renderTicks = () => {
    const tickCount = 11; // 0, 10, 20, ..., 100
    const ticks = [];
    
    for (let i = 0; i < tickCount; i++) {
      const tickValue = (i / (tickCount - 1)) * (maxValue - minValue) + minValue;
      const tickAngle = startAngleRad + (i / (tickCount - 1)) * angleRange;
      
      const startRadius = radius * 0.9;
      const endRadius = radius * (i % 2 === 0 ? 0.95 : 0.93);
      
      const x1 = centerX + startRadius * Math.cos(tickAngle);
      const y1 = centerY + startRadius * Math.sin(tickAngle);
      const x2 = centerX + endRadius * Math.cos(tickAngle);
      const y2 = centerY + endRadius * Math.sin(tickAngle);
      
      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          style={getTickStyles(i % 2 === 0)}
        />
      );
      
      // Tick labels
      if (showMinMax && (i === 0 || i === tickCount - 1)) {
        const labelRadius = radius * 0.75;
        const labelX = centerX + labelRadius * Math.cos(tickAngle);
        const labelY = centerY + labelRadius * Math.sin(tickAngle);
        
        ticks.push(
          <text
            key={`label-${i}`}
            x={labelX}
            y={labelY}
            style={{
              ...getLabelStyles(),
              fontSize: '0.8em',
              textAnchor: 'middle'
            }}
          >
            {tickValue}
          </text>
        );
      }
    }
    
    return ticks;
  };
  
  return (
    <div
      ref={containerRef}
      className={`vistara-gauge-chart vistara-gauge-chart--${variant} vistara-gauge-chart--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      <svg style={getSvgStyles()}>
        {/* Gradient */}
        {(variant === 'gradient' || useGradient) && (
          <defs>
            <linearGradient id="valueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {segments.length > 0 ? (
                segments.map((segment, index) => (
                  <stop
                    key={index}
                    offset={`${((segment.from - minValue) / (maxValue - minValue)) * 100}%`}
                    stopColor={segment.color}
                  />
                ))
              ) : (
                <>
                  <stop offset="0%" stopColor={valueColor} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={valueColor} stopOpacity={1} />
                </>
              )}
            </linearGradient>
          </defs>
        )}
        
        {/* Track */}
        <path
          d={createArcPath(startAngle, endAngle, radius, innerRadiusValue)}
          style={getTrackStyles()}
        />
        
        {/* Segments */}
        {segments.length > 0 ? (
          segments.map((segment, index) => {
            const segmentStartAngle = startAngle + 
              ((segment.from - minValue) / (maxValue - minValue)) * (endAngle - startAngle);
            const segmentEndAngle = startAngle + 
              ((segment.to - minValue) / (maxValue - minValue)) * (endAngle - startAngle);
            
            return (
              <path
                key={index}
                d={createArcPath(segmentStartAngle, segmentEndAngle, radius, innerRadiusValue)}
                fill={segment.color}
                opacity={displayValue >= segment.from && displayValue <= segment.to ? 1 : 0.3}
                style={{ transition: 'opacity 0.3s ease' }}
              />
            );
          })
        ) : (
          /* Value arc */
          <path
            d={createArcPath(startAngle, startAngle + (normalizedValue * (endAngle - startAngle)), 
                           radius, innerRadiusValue)}
            style={getValueArcStyles()}
          />
        )}
        
        {/* Ticks */}
        {showTicks && renderTicks()}
        
        {/* Needle */}
        {showNeedle && (
          <g>
            <path
              d={createNeedlePath()}
              style={getNeedleStyles()}
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={needleWidth * 3}
              fill={needleColor}
            />
          </g>
        )}
        
        {/* Value text */}
        {showValue && (
          <text
            x={centerX}
            y={centerY - (gaugeType === 'semicircle' ? 20 : 0)}
            style={getValueTextStyles()}
          >
            {displayValue.toFixed(decimals)}
            {unit && (
              <tspan style={{ fontSize: '0.6em' }}>{unit}</tspan>
            )}
          </text>
        )}
        
        {/* Label */}
        {showLabel && label && (
          <text
            x={centerX}
            y={centerY + (gaugeType === 'semicircle' ? 20 : 40)}
            style={getLabelStyles()}
          >
            {label}
          </text>
        )}
      </svg>
    </div>
  );
});

GaugeChart.displayName = 'GaugeChart';

export default GaugeChart;