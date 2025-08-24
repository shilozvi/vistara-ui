/**
 * 🎯 Vistara UI - AreaChart Component
 * "Command your Design."
 * 
 * רכיב גרף אזורי מתקדם עם מילוי גרדיינט ואינטראקטיביות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const AreaChart = forwardRef(({ 
  // Data
  data = [], // Single series: [value1, value2, ...] or Multi-series: [[series1], [series2], ...]
  labels = [],
  seriesNames = [],
  
  // Chart configuration
  width = 400,
  height = 300,
  margin = { top: 20, right: 30, bottom: 40, left: 40 },
  
  // Visual options
  colors = [
    'var(--color-primary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-danger)',
    'var(--color-info)'
  ],
  strokeWidth = 2,
  showGrid = true,
  showAxes = true,
  showTooltip = true,
  showLegend = true,
  
  // Area styling
  stacked = false,
  opacity = 0.7,
  gradient = true,
  smooth = true,
  
  // Animation
  animated = true,
  animationDuration = 1000,
  
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
  const [visibleSeries, setVisibleSeries] = useState(new Set());
  const svgRef = useRef(null);
  
  // Process data into series format
  const processedData = Array.isArray(data[0]) ? data : [data];
  const seriesCount = processedData.length;
  
  // Initialize visible series
  useEffect(() => {
    setVisibleSeries(new Set(Array.from({ length: seriesCount }, (_, i) => i)));
  }, [seriesCount]);
  
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
  
  // Calculate stacked data if needed
  const stackedData = stacked ? processedData.reduce((acc, series, seriesIndex) => {
    if (seriesIndex === 0) {
      acc.push([...series]);
    } else {
      const newSeries = series.map((value, index) => {
        return value + (acc[seriesIndex - 1][index] || 0);
      });
      acc.push(newSeries);
    }
    return acc;
  }, []) : processedData;
  
  const xScale = (index) => (index / Math.max(processedData[0]?.length - 1 || 0, 1)) * chartWidth;
  const yScale = (value) => chartHeight - ((value - minValue) / valueRange) * chartHeight;
  
  // Generate area path
  const generateAreaPath = (series, baselineSeries = null, progress = 1) => {
    if (!series || series.length === 0) return '';
    
    const points = series.slice(0, Math.floor(series.length * progress));
    const baselinePoints = baselineSeries?.slice(0, Math.floor(series.length * progress)) || [];
    
    if (points.length === 0) return '';
    
    // Top line
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
    
    // Bottom line (baseline or bottom)
    if (baselinePoints.length > 0) {
      // Stacked - connect to baseline series
      for (let i = baselinePoints.length - 1; i >= 0; i--) {
        const x = margin.left + xScale(i);
        const y = margin.top + yScale(baselinePoints[i]);
        path += ` L ${x} ${y}`;
      }
    } else {
      // Not stacked - connect to bottom
      const lastX = margin.left + xScale(points.length - 1);
      const firstX = margin.left + xScale(0);
      const bottomY = margin.top + yScale(0);
      path += ` L ${lastX} ${bottomY} L ${firstX} ${bottomY}`;
    }
    
    path += ' Z';
    return path;
  };
  
  // Generate stroke path
  const generateStrokePath = (series, progress = 1) => {
    if (!series || series.length === 0) return '';
    
    const points = series.slice(0, Math.floor(series.length * progress));
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
  
  // Get color for series
  const getSeriesColor = (seriesIndex) => {
    return colors[seriesIndex % colors.length];
  };
  
  // Handle point interactions
  const handlePointHover = (seriesIndex, pointIndex, value, event) => {
    setHoveredPoint({ 
      seriesIndex, 
      pointIndex, 
      value, 
      x: event.clientX, 
      y: event.clientY 
    });
    onPointHover?.(seriesIndex, pointIndex, value, event);
  };
  
  const handlePointLeave = () => {
    setHoveredPoint(null);
  };
  
  const handlePointClick = (seriesIndex, pointIndex, value, event) => {
    onPointClick?.(seriesIndex, pointIndex, value, event);
  };
  
  // Toggle series visibility
  const toggleSeries = (seriesIndex) => {
    const newVisible = new Set(visibleSeries);
    if (newVisible.has(seriesIndex)) {
      newVisible.delete(seriesIndex);
    } else {
      newVisible.add(seriesIndex);
    }
    setVisibleSeries(newVisible);
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
      display: 'flex',
      flexDirection: 'column',
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
    const stepCount = Math.min(processedData[0]?.length - 1 || 0, 10);
    for (let i = 0; i <= stepCount; i++) {
      const x = margin.left + (chartWidth / stepCount) * i;
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
          if (i % Math.ceil(labels.length / 10) !== 0) return null; // Skip some labels if too many
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
  
  // Areas
  const renderAreas = () => {
    const dataToUse = stacked ? stackedData : processedData;
    
    return dataToUse.map((series, seriesIndex) => {
      if (!visibleSeries.has(seriesIndex)) return null;
      
      const color = getSeriesColor(seriesIndex);
      const baselineSeries = stacked && seriesIndex > 0 ? dataToUse[seriesIndex - 1] : null;
      
      return (
        <g key={seriesIndex}>
          {/* Gradient definition */}
          {gradient && (
            <defs>
              <linearGradient 
                id={`areaGradient-${seriesIndex}`} 
                x1="0%" 
                y1="0%" 
                x2="0%" 
                y2="100%"
              >
                <stop offset="0%" stopColor={color} stopOpacity={opacity} />
                <stop offset="100%" stopColor={color} stopOpacity={opacity * 0.1} />
              </linearGradient>
            </defs>
          )}
          
          {/* Area fill */}
          <path
            d={generateAreaPath(series, baselineSeries, animationProgress)}
            fill={gradient ? `url(#areaGradient-${seriesIndex})` : color}
            fillOpacity={gradient ? 1 : opacity}
          />
          
          {/* Stroke line */}
          <path
            d={generateStrokePath(series, animationProgress)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    });
  };
  
  // Interactive points
  const renderPoints = () => {
    return processedData.map((series, seriesIndex) => {
      if (!visibleSeries.has(seriesIndex)) return null;
      
      return series.map((value, pointIndex) => {
        if (pointIndex >= Math.floor(series.length * animationProgress)) return null;
        
        const x = margin.left + xScale(pointIndex);
        const y = margin.top + yScale(stacked ? stackedData[seriesIndex][pointIndex] : value);
        const color = getSeriesColor(seriesIndex);
        
        return (
          <circle
            key={`${seriesIndex}-${pointIndex}`}
            cx={x}
            cy={y}
            r="4"
            fill={color}
            stroke="var(--color-surface)"
            strokeWidth="2"
            style={{ cursor: 'pointer', opacity: 0.8 }}
            onMouseEnter={(e) => handlePointHover(seriesIndex, pointIndex, value, e)}
            onMouseLeave={handlePointLeave}
            onClick={(e) => handlePointClick(seriesIndex, pointIndex, value, e)}
          />
        );
      });
    });
  };
  
  // Legend
  const renderLegend = () => {
    if (!showLegend || seriesCount <= 1) return null;
    
    return (
      <div style={normalizeStyle({
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
        marginTop: 'var(--space-3)',
        padding: 'var(--space-2)',
        borderTop: '1px solid var(--color-border)'
      })}>
        {processedData.map((_, seriesIndex) => {
          const color = getSeriesColor(seriesIndex);
          const isVisible = visibleSeries.has(seriesIndex);
          const seriesName = seriesNames[seriesIndex] || `Series ${seriesIndex + 1}`;
          
          return (
            <div
              key={seriesIndex}
              style={normalizeStyle({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                cursor: 'pointer',
                opacity: isVisible ? 1 : 0.5,
                transition: 'opacity 0.2s ease'
              })}
              onClick={() => toggleSeries(seriesIndex)}
            >
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: color,
                borderRadius: '2px'
              }} />
              <span style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-primary)'
              }}>
                {seriesName}
              </span>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Tooltip
  const renderTooltip = () => {
    if (!showTooltip || !hoveredPoint) return null;
    
    const seriesName = seriesNames[hoveredPoint.seriesIndex] || `Series ${hoveredPoint.seriesIndex + 1}`;
    
    return (
      <div
        style={normalizeStyle({
          position: 'fixed',
          left: hoveredPoint.x + 10,
          top: hoveredPoint.y - 60,
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
        <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)' }}>
          {labels[hoveredPoint.pointIndex] || `Point ${hoveredPoint.pointIndex + 1}`}
        </div>
        <div style={{ color: 'var(--color-text-secondary)' }}>
          {seriesName}: {hoveredPoint.value.toFixed(2)}
        </div>
      </div>
    );
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-area-chart vistara-area-chart--${variant} vistara-area-chart--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Grid */}
        {renderGrid()}
        
        {/* Areas */}
        {renderAreas()}
        
        {/* Interactive points */}
        {renderPoints()}
        
        {/* Axes */}
        {renderAxes()}
      </svg>
      
      {/* Legend */}
      {renderLegend()}
      
      {/* Tooltip */}
      {renderTooltip()}
    </div>
  );
});

AreaChart.displayName = 'AreaChart';

export default AreaChart;