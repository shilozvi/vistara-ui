/**
 * 🎯 Vistara UI - LineChart Component
 * "Command your Design."
 * 
 * רכיב גרף קווי מתקדם עם אינטראקטיביות ואנימציות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const LineChart = forwardRef(({ 
  // Data
  data = [],
  labels = [],
  
  // Chart configuration
  width = 400,
  height = 300,
  margin = { top: 20, right: 30, bottom: 40, left: 40 },
  
  // Visual options
  color = 'var(--color-primary)',
  strokeWidth = 2,
  pointRadius = 4,
  showPoints = true,
  showGrid = true,
  showAxes = true,
  showTooltip = true,
  
  // Animation
  animated = true,
  animationDuration = 1000,
  
  // Styling
  fill = false,
  gradient = false,
  smooth = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'outlined', 'filled'
  
  // Callbacks
  onPointHover,
  onPointClick,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1);
  const svgRef = useRef(null);
  
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
  const maxValue = Math.max(...data.map(d => Array.isArray(d) ? Math.max(...d) : d));
  const minValue = Math.min(...data.map(d => Array.isArray(d) ? Math.min(...d) : d));
  const valueRange = maxValue - minValue || 1;
  
  const xScale = (index) => (index / Math.max(data.length - 1, 1)) * chartWidth;
  const yScale = (value) => chartHeight - ((value - minValue) / valueRange) * chartHeight;
  
  // Generate path data
  const generatePath = (values, progress = 1) => {
    if (!values || values.length === 0) return '';
    
    const points = values.slice(0, Math.floor(values.length * progress));
    if (points.length === 0) return '';
    
    let path = `M ${margin.left + xScale(0)} ${margin.top + yScale(points[0])}`;
    
    for (let i = 1; i < points.length; i++) {
      const x = margin.left + xScale(i);
      const y = margin.top + yScale(points[i]);
      
      if (smooth && i > 0) {
        const prevX = margin.left + xScale(i - 1);
        const prevY = margin.top + yScale(points[i - 1]);
        const cpx1 = prevX + (x - prevX) / 3;
        const cpy1 = prevY;
        const cpx2 = x - (x - prevX) / 3;
        const cpy2 = y;
        path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    return path;
  };
  
  // Generate fill path
  const generateFillPath = (values, progress = 1) => {
    const linePath = generatePath(values, progress);
    if (!linePath) return '';
    
    const lastIndex = Math.floor(values.length * progress) - 1;
    const lastX = margin.left + xScale(lastIndex);
    const bottomY = margin.top + chartHeight;
    const firstX = margin.left + xScale(0);
    
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };
  
  // Handle point interactions
  const handlePointHover = (index, value, event) => {
    setHoveredPoint({ index, value, x: event.clientX, y: event.clientY });
    onPointHover?.(index, value, event);
  };
  
  const handlePointLeave = () => {
    setHoveredPoint(null);
  };
  
  const handlePointClick = (index, value, event) => {
    onPointClick?.(index, value, event);
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
    
    // Horizontal grid lines
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
    
    // Vertical grid lines
    for (let i = 0; i <= Math.min(data.length - 1, 10); i++) {
      const x = margin.left + (chartWidth / Math.min(data.length - 1, 10)) * i;
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
        
        {/* Y Axis Labels */}
        {Array.from({ length: 6 }, (_, i) => {
          const value = minValue + (valueRange / 5) * (5 - i);
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
        })}
        
        {/* X Axis Labels */}
        {labels.map((label, i) => {
          const x = margin.left + xScale(i);
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
        })}
      </g>
    );
  };
  
  // Points
  const renderPoints = () => {
    if (!showPoints) return null;
    
    return data.map((value, index) => {
      if (index >= Math.floor(data.length * animationProgress)) return null;
      
      const x = margin.left + xScale(index);
      const y = margin.top + yScale(value);
      
      return (
        <circle
          key={index}
          cx={x}
          cy={y}
          r={pointRadius}
          fill={color}
          stroke="var(--color-surface)"
          strokeWidth="2"
          style={{ cursor: 'pointer' }}
          onMouseEnter={(e) => handlePointHover(index, value, e)}
          onMouseLeave={handlePointLeave}
          onClick={(e) => handlePointClick(index, value, e)}
        />
      );
    });
  };
  
  // Tooltip
  const renderTooltip = () => {
    if (!showTooltip || !hoveredPoint) return null;
    
    return (
      <div
        style={normalizeStyle({
          position: 'fixed',
          left: hoveredPoint.x + 10,
          top: hoveredPoint.y - 40,
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
          {labels[hoveredPoint.index] || `Point ${hoveredPoint.index + 1}`}
        </div>
        <div style={{ color: 'var(--color-text-secondary)' }}>
          Value: {hoveredPoint.value.toFixed(2)}
        </div>
      </div>
    );
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-line-chart vistara-line-chart--${variant} vistara-line-chart--${size} ${className || ''}`}
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
        {/* Gradient definition */}
        {gradient && (
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
        )}
        
        {/* Grid */}
        {renderGrid()}
        
        {/* Fill area */}
        {fill && (
          <path
            d={generateFillPath(data, animationProgress)}
            fill={gradient ? 'url(#lineGradient)' : color}
            fillOpacity={gradient ? 1 : 0.1}
          />
        )}
        
        {/* Line */}
        <path
          d={generatePath(data, animationProgress)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {renderPoints()}
        
        {/* Axes */}
        {renderAxes()}
      </svg>
      
      {/* Tooltip */}
      {renderTooltip()}
    </div>
  );
});

LineChart.displayName = 'LineChart';

export default LineChart;