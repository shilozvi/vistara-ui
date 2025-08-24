/**
 * 🎯 Vistara UI - BarChart Component
 * "Command your Design."
 * 
 * רכיב גרף עמודות מתקדם עם אינטראקטיביות ואנימציות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const BarChart = forwardRef(({ 
  // Data
  data = [],
  labels = [],
  
  // Chart configuration
  width = 400,
  height = 300,
  margin = { top: 20, right: 30, bottom: 40, left: 40 },
  
  // Visual options
  color = 'var(--color-primary)',
  colors = [], // Array of colors for multiple series
  barPadding = 0.1,
  groupPadding = 0.2,
  showValues = false,
  showGrid = true,
  showAxes = true,
  showTooltip = true,
  
  // Orientation
  orientation = 'vertical', // 'vertical', 'horizontal'
  
  // Animation
  animated = true,
  animationDuration = 1000,
  staggered = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'outlined', 'filled', 'gradient'
  
  // Callbacks
  onBarHover,
  onBarClick,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [hoveredBar, setHoveredBar] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1);
  const svgRef = useRef(null);
  
  // Process data (handle both single and multi-series)
  const processedData = Array.isArray(data[0]) ? data : [data];
  const seriesCount = processedData.length;
  
  // Animation effect
  useEffect(() => {
    if (!animated) return;
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      setAnimationProgress(progress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [animated, animationDuration, data]);
  
  // Calculate dimensions
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  // Calculate scales
  const allValues = processedData.flat();
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(0, Math.min(...allValues));
  const valueRange = maxValue - minValue || 1;
  
  const getBarDimensions = (seriesIndex, barIndex) => {
    const groupWidth = (orientation === 'vertical' ? chartWidth : chartHeight) / labels.length;
    const barWidth = (groupWidth * (1 - groupPadding)) / seriesCount;
    const groupOffset = groupWidth * (barIndex + 0.5) - groupWidth / 2;
    const barOffset = groupOffset - (seriesCount * barWidth) / 2 + seriesIndex * barWidth;
    
    return { groupWidth, barWidth, barOffset };
  };
  
  // Color management
  const getBarColor = (seriesIndex) => {
    if (colors.length > 0) {
      return colors[seriesIndex % colors.length];
    }
    
    if (seriesCount === 1) {
      return color;
    }
    
    // Generate colors for multiple series
    const hue = (seriesIndex * 360) / seriesCount;
    return `hsl(${hue}, 70%, 50%)`;
  };
  
  // Handle bar interactions
  const handleBarHover = (seriesIndex, barIndex, value, event) => {
    setHoveredBar({ seriesIndex, barIndex, value, x: event.clientX, y: event.clientY });
    onBarHover?.(seriesIndex, barIndex, value, event);
  };
  
  const handleBarLeave = () => {
    setHoveredBar(null);
  };
  
  const handleBarClick = (seriesIndex, barIndex, value, event) => {
    onBarClick?.(seriesIndex, barIndex, value, event);
  };
  
  // Container styles
  const getContainerStyles = () => {
    const sizeMap = {
      compact: { width: Math.min(width, 300), height: Math.min(height, 200) },
      normal: { width, height },
      expanded: { width: Math.max(width, 500), height: Math.max(height, 350) }
    };
    
    return normalizeStyle({
      position: 'relative',
      fontFamily: 'var(--font-family-base)',
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'outlined' && {
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-2)'
      }),
      
      ...(variant === 'filled' && {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-2)',
        boxShadow: 'var(--shadow-sm)'
      })
    });
  };
  
  // Grid lines
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const gridLines = [];
    const gridColor = 'var(--color-border)';
    
    if (orientation === 'vertical') {
      // Horizontal grid lines for vertical bars
      for (let i = 0; i <= 5; i++) {
        const y = margin.top + (chartHeight / 5) * i;
        gridLines.push(
          <line
            key={`h-${i}`}
            x1={margin.left}
            y1={y}
            x2={margin.left + chartWidth}
            y2={y}
            stroke={gridColor}
            strokeWidth="1"
            opacity="0.3"
          />
        );
      }
    } else {
      // Vertical grid lines for horizontal bars
      for (let i = 0; i <= 5; i++) {
        const x = margin.left + (chartWidth / 5) * i;
        gridLines.push(
          <line
            key={`v-${i}`}
            x1={x}
            y1={margin.top}
            x2={x}
            y2={margin.top + chartHeight}
            stroke={gridColor}
            strokeWidth="1"
            opacity="0.3"
          />
        );
      }
    }
    
    return gridLines;
  };
  
  // Axes
  const renderAxes = () => {
    if (!showAxes) return null;
    
    const axisColor = 'var(--color-text-muted)';
    
    return (
      <g>
        {/* X Axis */}
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={margin.left + chartWidth}
          y2={margin.top + chartHeight}
          stroke={axisColor}
          strokeWidth="1"
        />
        
        {/* Y Axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + chartHeight}
          stroke={axisColor}
          strokeWidth="1"
        />
        
        {/* Value Axis Labels */}
        {Array.from({ length: 6 }, (_, i) => {
          const value = minValue + (valueRange / 5) * (orientation === 'vertical' ? 5 - i : i);
          
          if (orientation === 'vertical') {
            const y = margin.top + (chartHeight / 5) * i;
            return (
              <text
                key={i}
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill={axisColor}
              >
                {value.toFixed(1)}
              </text>
            );
          } else {
            const x = margin.left + (chartWidth / 5) * i;
            return (
              <text
                key={i}
                x={x}
                y={margin.top + chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill={axisColor}
              >
                {value.toFixed(1)}
              </text>
            );
          }
        })}
        
        {/* Category Labels */}
        {labels.map((label, i) => {
          if (orientation === 'vertical') {
            const { groupWidth } = getBarDimensions(0, i);
            const x = margin.left + groupWidth * (i + 0.5);
            return (
              <text
                key={i}
                x={x}
                y={margin.top + chartHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill={axisColor}
              >
                {label}
              </text>
            );
          } else {
            const { groupWidth } = getBarDimensions(0, i);
            const y = margin.top + groupWidth * (i + 0.5);
            return (
              <text
                key={i}
                x={margin.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill={axisColor}
              >
                {label}
              </text>
            );
          }
        })}
      </g>
    );
  };
  
  // Bars
  const renderBars = () => {
    return processedData.map((series, seriesIndex) => {
      return series.map((value, barIndex) => {
        const { barWidth, barOffset } = getBarDimensions(seriesIndex, barIndex);
        const barColor = getBarColor(seriesIndex);
        
        // Animation progress for this specific bar
        let progress = animationProgress;
        if (staggered) {
          const staggerDelay = (seriesIndex * series.length + barIndex) * 0.1;
          progress = Math.max(0, Math.min(1, (animationProgress - staggerDelay) / (1 - staggerDelay)));
        }
        
        if (orientation === 'vertical') {
          const barHeight = (Math.abs(value) / valueRange) * chartHeight * progress;
          const x = margin.left + barOffset;
          const y = value >= 0 
            ? margin.top + chartHeight - barHeight
            : margin.top + chartHeight;
          
          return (
            <rect
              key={`${seriesIndex}-${barIndex}`}
              x={x}
              y={y}
              width={barWidth * (1 - barPadding)}
              height={barHeight}
              fill={variant === 'gradient' ? `url(#barGradient-${seriesIndex})` : barColor}
              stroke={variant === 'outlined' ? barColor : 'none'}
              strokeWidth={variant === 'outlined' ? 2 : 0}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => handleBarHover(seriesIndex, barIndex, value, e)}
              onMouseLeave={handleBarLeave}
              onClick={(e) => handleBarClick(seriesIndex, barIndex, value, e)}
            />
          );
        } else {
          const barLength = (Math.abs(value) / valueRange) * chartWidth * progress;
          const x = value >= 0 ? margin.left : margin.left - barLength;
          const y = margin.top + barOffset;
          
          return (
            <rect
              key={`${seriesIndex}-${barIndex}`}
              x={x}
              y={y}
              width={barLength}
              height={barWidth * (1 - barPadding)}
              fill={variant === 'gradient' ? `url(#barGradient-${seriesIndex})` : barColor}
              stroke={variant === 'outlined' ? barColor : 'none'}
              strokeWidth={variant === 'outlined' ? 2 : 0}
              style={{ cursor: 'pointer' }}
              onMouseEnter={(e) => handleBarHover(seriesIndex, barIndex, value, e)}
              onMouseLeave={handleBarLeave}
              onClick={(e) => handleBarClick(seriesIndex, barIndex, value, e)}
            />
          );
        }
      });
    });
  };
  
  // Value labels
  const renderValueLabels = () => {
    if (!showValues) return null;
    
    return processedData.map((series, seriesIndex) => {
      return series.map((value, barIndex) => {
        const { barWidth, barOffset } = getBarDimensions(seriesIndex, barIndex);
        
        if (orientation === 'vertical') {
          const x = margin.left + barOffset + (barWidth * (1 - barPadding)) / 2;
          const y = value >= 0 
            ? margin.top + chartHeight - (Math.abs(value) / valueRange) * chartHeight - 5
            : margin.top + chartHeight + 15;
          
          return (
            <text
              key={`label-${seriesIndex}-${barIndex}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-text-primary)"
              fontWeight="var(--font-weight-medium)"
            >
              {value.toFixed(1)}
            </text>
          );
        } else {
          const x = value >= 0 
            ? margin.left + (Math.abs(value) / valueRange) * chartWidth + 5
            : margin.left - 5;
          const y = margin.top + barOffset + (barWidth * (1 - barPadding)) / 2 + 4;
          
          return (
            <text
              key={`label-${seriesIndex}-${barIndex}`}
              x={x}
              y={y}
              textAnchor={value >= 0 ? "start" : "end"}
              fontSize="11"
              fill="var(--color-text-primary)"
              fontWeight="var(--font-weight-medium)"
            >
              {value.toFixed(1)}
            </text>
          );
        }
      });
    });
  };
  
  // Gradients
  const renderGradients = () => {
    if (variant !== 'gradient') return null;
    
    return (
      <defs>
        {processedData.map((_, seriesIndex) => {
          const barColor = getBarColor(seriesIndex);
          return (
            <linearGradient
              key={seriesIndex}
              id={`barGradient-${seriesIndex}`}
              x1="0%"
              y1="0%"
              x2={orientation === 'vertical' ? "0%" : "100%"}
              y2={orientation === 'vertical' ? "100%" : "0%"}
            >
              <stop offset="0%" stopColor={barColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor={barColor} stopOpacity="0.6" />
            </linearGradient>
          );
        })}
      </defs>
    );
  };
  
  // Tooltip
  const renderTooltip = () => {
    if (!showTooltip || !hoveredBar) return null;
    
    return (
      <div
        style={normalizeStyle({
          position: 'fixed',
          left: hoveredBar.x + 10,
          top: hoveredBar.y - 40,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--border-radius-md)',
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--font-size-sm)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          pointerEvents: 'none'
        })}
      >
        <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>
          {labels[hoveredBar.barIndex] || `Category ${hoveredBar.barIndex + 1}`}
        </div>
        {seriesCount > 1 && (
          <div style={{ color: 'var(--color-text-secondary)' }}>
            Series {hoveredBar.seriesIndex + 1}
          </div>
        )}
        <div style={{ color: 'var(--color-text-secondary)' }}>
          Value: {hoveredBar.value.toFixed(2)}
        </div>
      </div>
    );
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-bar-chart vistara-bar-chart--${variant} vistara-bar-chart--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Gradients */}
        {renderGradients()}
        
        {/* Grid */}
        {renderGrid()}
        
        {/* Bars */}
        {renderBars()}
        
        {/* Value labels */}
        {renderValueLabels()}
        
        {/* Axes */}
        {renderAxes()}
      </svg>
      
      {/* Tooltip */}
      {renderTooltip()}
    </div>
  );
});

BarChart.displayName = 'BarChart';

export default BarChart;