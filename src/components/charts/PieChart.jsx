/**
 * 🎯 Vistara UI - PieChart Component
 * "Command your Design."
 * 
 * רכיב תרשים עגול מתקדם עם אינטראקטיביות ואנימציות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const PieChart = forwardRef(({ 
  // Data
  data = [], // [{ label, value, color? }]
  
  // Chart configuration
  width = 300,
  height = 300,
  innerRadius = 0, // Set > 0 for donut chart
  
  // Visual options
  colors = [
    'var(--color-primary)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-danger)',
    'var(--color-info)',
    '#9333ea', '#06b6d4', '#84cc16', '#f59e0b', '#ef4444'
  ],
  showLabels = true,
  showValues = true,
  showPercentages = true,
  showLegend = true,
  showTooltip = true,
  
  // Label positioning
  labelDistance = 20,
  
  // Animation
  animated = true,
  animationDuration = 1000,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'outlined', 'filled'
  
  // Callbacks
  onSliceHover,
  onSliceClick,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1);
  const svgRef = useRef(null);
  
  // Calculate total value
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  
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
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2 - 40; // Leave space for labels
  const actualInnerRadius = Math.min(innerRadius, outerRadius - 10);
  
  // Process data with angles
  const processedData = data.map((item, index) => {
    const percentage = (item.value / totalValue) * 100;
    const color = item.color || colors[index % colors.length];
    
    return {
      ...item,
      percentage,
      color,
      index
    };
  });
  
  // Calculate cumulative angles
  let cumulativeAngle = -Math.PI / 2; // Start from top
  const dataWithAngles = processedData.map((item) => {
    const startAngle = cumulativeAngle;
    const angle = (item.value / totalValue) * 2 * Math.PI * animationProgress;
    const endAngle = startAngle + angle;
    const midAngle = startAngle + angle / 2;
    
    cumulativeAngle = endAngle;
    
    return {
      ...item,
      startAngle,
      endAngle,
      midAngle,
      angle
    };
  });
  
  // Create SVG path for slice
  const createSlicePath = (item, radius) => {
    const { startAngle, endAngle } = item;
    
    if (endAngle - startAngle === 0) return '';
    
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    const x1 = centerX + Math.cos(startAngle) * radius;
    const y1 = centerY + Math.sin(startAngle) * radius;
    const x2 = centerX + Math.cos(endAngle) * radius;
    const y2 = centerY + Math.sin(endAngle) * radius;
    
    let path = `M ${centerX} ${centerY} L ${x1} ${y1}`;
    path += ` A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    if (actualInnerRadius > 0) {
      const ix1 = centerX + Math.cos(startAngle) * actualInnerRadius;
      const iy1 = centerY + Math.sin(startAngle) * actualInnerRadius;
      const ix2 = centerX + Math.cos(endAngle) * actualInnerRadius;
      const iy2 = centerY + Math.sin(endAngle) * actualInnerRadius;
      
      path = `M ${x1} ${y1}`;
      path += ` A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
      path += ` L ${ix2} ${iy2}`;
      path += ` A ${actualInnerRadius} ${actualInnerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1} Z`;
    }
    
    return path;
  };
  
  // Handle slice interactions
  const handleSliceHover = (item, event) => {
    setHoveredSlice({ ...item, x: event.clientX, y: event.clientY });
    onSliceHover?.(item, event);
  };
  
  const handleSliceLeave = () => {
    setHoveredSlice(null);
  };
  
  const handleSliceClick = (item, event) => {
    onSliceClick?.(item, event);
  };
  
  // Container styles
  const getContainerStyles = () => {
    const sizeMap = {
      compact: { width: Math.min(width, 250), height: Math.min(height, 250) },
      normal: { width, height },
      expanded: { width: Math.max(width, 400), height: Math.max(height, 400) }
    };
    
    return normalizeStyle({
      position: 'relative',
      fontFamily: 'var(--font-family-base)',
      display: 'flex',
      flexDirection: showLegend ? 'row' : 'column',
      alignItems: 'center',
      gap: 'var(--space-4)',
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'outlined' && {
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-3)'
      }),
      
      ...(variant === 'filled' && {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-3)',
        boxShadow: 'var(--shadow-sm)'
      })
    });
  };
  
  // Chart container styles
  const getChartContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      flexShrink: 0
    });
  };
  
  // Legend styles
  const getLegendStyles = () => {
    return normalizeStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      minWidth: '150px'
    });
  };
  
  const getLegendItemStyles = (isHovered) => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-1)',
      borderRadius: 'var(--border-radius-md)',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      backgroundColor: isHovered ? 'var(--color-background-secondary)' : 'transparent',
      
      ':hover': {
        backgroundColor: 'var(--color-background-secondary)'
      }
    });
  };
  
  // Center label for donut charts
  const renderCenterLabel = () => {
    if (actualInnerRadius === 0) return null;
    
    return (
      <g>
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          fontSize="24"
          fontWeight="var(--font-weight-bold)"
          fill="var(--color-text-primary)"
        >
          {totalValue.toLocaleString()}
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          fontSize="12"
          fill="var(--color-text-muted)"
        >
          Total
        </text>
      </g>
    );
  };
  
  // Slice labels
  const renderSliceLabels = () => {
    if (!showLabels && !showValues && !showPercentages) return null;
    
    return dataWithAngles.map((item) => {
      if (item.angle < 0.1) return null; // Skip very small slices
      
      const labelRadius = outerRadius + labelDistance;
      const x = centerX + Math.cos(item.midAngle) * labelRadius;
      const y = centerY + Math.sin(item.midAngle) * labelRadius;
      
      const textAnchor = Math.cos(item.midAngle) > 0 ? 'start' : 'end';
      
      return (
        <g key={item.index}>
          {/* Label line */}
          <line
            x1={centerX + Math.cos(item.midAngle) * (outerRadius + 5)}
            y1={centerY + Math.sin(item.midAngle) * (outerRadius + 5)}
            x2={x}
            y2={y}
            stroke="var(--color-border)"
            strokeWidth="1"
          />
          
          {/* Label text */}
          <text
            x={x + (textAnchor === 'start' ? 5 : -5)}
            y={y - 2}
            textAnchor={textAnchor}
            fontSize="11"
            fontWeight="var(--font-weight-medium)"
            fill="var(--color-text-primary)"
          >
            {showLabels && item.label}
          </text>
          
          {/* Value/Percentage */}
          {(showValues || showPercentages) && (
            <text
              x={x + (textAnchor === 'start' ? 5 : -5)}
              y={y + 12}
              textAnchor={textAnchor}
              fontSize="10"
              fill="var(--color-text-muted)"
            >
              {showValues && showPercentages 
                ? `${item.value} (${item.percentage.toFixed(1)}%)`
                : showValues 
                ? item.value
                : `${item.percentage.toFixed(1)}%`
              }
            </text>
          )}
        </g>
      );
    });
  };
  
  // Legend
  const renderLegend = () => {
    if (!showLegend) return null;
    
    return (
      <div style={getLegendStyles()}>
        <h4 style={{ 
          margin: 0, 
          marginBottom: 'var(--space-2)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)'
        }}>
          Legend
        </h4>
        {processedData.map((item, index) => (
          <div
            key={index}
            style={getLegendItemStyles(hoveredSlice?.index === index)}
            onMouseEnter={(e) => handleSliceHover(item, e)}
            onMouseLeave={handleSliceLeave}
            onClick={(e) => handleSliceClick(item, e)}
          >
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: item.color,
              borderRadius: '2px',
              flexShrink: 0
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
                truncate: true
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)'
              }}>
                {item.value} ({item.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Tooltip
  const renderTooltip = () => {
    if (!showTooltip || !hoveredSlice) return null;
    
    return (
      <div
        style={normalizeStyle({
          position: 'fixed',
          left: hoveredSlice.x + 10,
          top: hoveredSlice.y - 40,
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
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-1)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: hoveredSlice.color,
            borderRadius: '50%'
          }} />
          <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
            {hoveredSlice.label}
          </span>
        </div>
        <div style={{ color: 'var(--color-text-secondary)' }}>
          Value: {hoveredSlice.value.toLocaleString()}
        </div>
        <div style={{ color: 'var(--color-text-secondary)' }}>
          Percentage: {hoveredSlice.percentage.toFixed(1)}%
        </div>
      </div>
    );
  };
  
  return (
    <div
      ref={ref}
      className={`vistara-pie-chart vistara-pie-chart--${variant} vistara-pie-chart--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      <div style={getChartContainerStyles()}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          {/* Slices */}
          {dataWithAngles.map((item) => {
            const isHovered = hoveredSlice?.index === item.index;
            const sliceRadius = isHovered ? outerRadius + 5 : outerRadius;
            
            return (
              <path
                key={item.index}
                d={createSlicePath(item, sliceRadius)}
                fill={item.color}
                stroke="var(--color-surface)"
                strokeWidth="2"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => handleSliceHover(item, e)}
                onMouseLeave={handleSliceLeave}
                onClick={(e) => handleSliceClick(item, e)}
              />
            );
          })}
          
          {/* Slice labels */}
          {renderSliceLabels()}
          
          {/* Center label for donut */}
          {renderCenterLabel()}
        </svg>
      </div>
      
      {/* Legend */}
      {renderLegend()}
      
      {/* Tooltip */}
      {renderTooltip()}
    </div>
  );
});

PieChart.displayName = 'PieChart';

export default PieChart;