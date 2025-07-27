/**
 * 🎯 Vistara UI - HeatmapChart Component
 * "Command your Design."
 * 
 * תרשים חום מתקדם עם אינטראקטיביות ואנימציות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const HeatmapChart = forwardRef(({ 
  // Data
  data = [], // [{ x, y, value, label? }] or 2D array [[value, value, ...], ...]
  xLabels = [],
  yLabels = [],
  
  // Chart configuration
  width = 600,
  height = 400,
  cellSize = 'auto', // 'auto', number
  cellSpacing = 1,
  
  // Color scheme
  colorScheme = 'blue', // 'blue', 'red', 'green', 'purple', 'orange', 'custom'
  customColors = [],
  minColor,
  maxColor,
  neutralColor = '#f3f4f6',
  
  // Value mapping
  minValue,
  maxValue,
  threshold,
  
  // Display options
  showValues = false,
  showTooltip = true,
  showLegend = true,
  showGrid = false,
  
  // Legend
  legendPosition = 'right', // 'top', 'right', 'bottom', 'left'
  legendSteps = 5,
  
  // Animation
  animated = true,
  animationDuration = 1000,
  staggered = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'rounded', 'circular'
  
  // Callbacks
  onCellHover,
  onCellClick,
  onSelectionChange,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1);
  const containerRef = useRef(null);
  
  // Process data into consistent format
  const processedData = Array.isArray(data[0]) 
    ? data.map((row, y) => row.map((value, x) => ({ x, y, value, id: `${x}-${y}` })))
    : data.reduce((acc, point) => {
        if (!acc[point.y]) acc[point.y] = [];
        acc[point.y][point.x] = { ...point, id: `${point.x}-${point.y}` };
        return acc;
      }, []);
  
  const flatData = processedData.flat().filter(Boolean);
  
  // Calculate value range
  const values = flatData.map(d => d.value).filter(v => typeof v === 'number');
  const dataMinValue = minValue !== undefined ? minValue : Math.min(...values);
  const dataMaxValue = maxValue !== undefined ? maxValue : Math.max(...values);
  const valueRange = dataMaxValue - dataMinValue || 1;
  
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
  
  // Color schemes
  const getColorSchemes = () => {
    return {
      blue: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
      red: ['#fef2f2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
      green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
      purple: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7c3aed'],
      orange: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#dc2626'],
      custom: customColors.length > 0 ? customColors : ['#f3f4f6', '#6b7280']
    };
  };
  
  // Get color for value
  const getColor = (value) => {
    if (typeof value !== 'number') return neutralColor;
    
    const schemes = getColorSchemes();
    const colors = schemes[colorScheme] || schemes.blue;
    
    // Use custom min/max colors if provided
    if (minColor && maxColor) {
      const ratio = (value - dataMinValue) / valueRange;
      return interpolateColor(minColor, maxColor, ratio);
    }
    
    // Use threshold if provided
    if (threshold !== undefined) {
      return value >= threshold ? colors[colors.length - 1] : colors[0];
    }
    
    // Map value to color scale
    const ratio = (value - dataMinValue) / valueRange;
    const colorIndex = Math.floor(ratio * (colors.length - 1));
    const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
    const localRatio = (ratio * (colors.length - 1)) - colorIndex;
    
    return interpolateColor(colors[colorIndex], colors[nextColorIndex], localRatio);
  };
  
  // Interpolate between two colors
  const interpolateColor = (color1, color2, ratio) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    
    return `rgb(${r}, ${g}, ${b})`;
  };
  
  // Calculate dimensions
  const rows = processedData.length;
  const cols = Math.max(...processedData.map(row => row.length));
  
  const calculatedCellSize = cellSize === 'auto' 
    ? Math.min((width - (cols + 1) * cellSpacing) / cols, (height - (rows + 1) * cellSpacing) / rows)
    : cellSize;
  
  const chartWidth = cols * calculatedCellSize + (cols + 1) * cellSpacing;
  const chartHeight = rows * calculatedCellSize + (rows + 1) * cellSpacing;
  
  // Handle cell interactions
  const handleCellHover = (cell, event) => {
    setHoveredCell({ ...cell, x: event.clientX, y: event.clientY });
    onCellHover?.(cell, event);
  };
  
  const handleCellLeave = () => {
    setHoveredCell(null);
  };
  
  const handleCellClick = (cell, event) => {
    const newSelected = new Set(selectedCells);
    if (newSelected.has(cell.id)) {
      newSelected.delete(cell.id);
    } else {
      newSelected.add(cell.id);
    }
    
    setSelectedCells(newSelected);
    onSelectionChange?.(Array.from(newSelected));
    onCellClick?.(cell, event);
  };
  
  // Container styles
  const getContainerStyles = () => {
    const sizeMap = {
      compact: { maxWidth: '400px', maxHeight: '300px' },
      normal: { maxWidth: '600px', maxHeight: '400px' },
      expanded: { maxWidth: '800px', maxHeight: '600px' }
    };
    
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      display: 'flex',
      flexDirection: legendPosition === 'top' || legendPosition === 'bottom' ? 'column' : 'row',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      ...sizeMap[size]
    });
  };
  
  // Chart container styles
  const getChartContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      border: theme === 'detailed' ? '1px solid var(--color-border)' : 'none',
      borderRadius: theme === 'detailed' ? 'var(--border-radius-md)' : 0,
      padding: theme === 'detailed' ? 'var(--space-2)' : 0,
      backgroundColor: theme === 'detailed' ? 'var(--color-surface)' : 'transparent'
    });
  };
  
  // Cell styles
  const getCellStyles = (cell, index) => {
    const isSelected = selectedCells.has(cell.id);
    const isHovered = hoveredCell?.id === cell.id;
    
    // Animation delay for staggered effect
    let animationDelay = 0;
    if (staggered) {
      animationDelay = (cell.x + cell.y) * 0.02;
    }
    
    const cellProgress = Math.max(0, Math.min(1, (animationProgress - animationDelay) / (1 - animationDelay)));
    
    return normalizeStyle({
      width: `${calculatedCellSize}px`,
      height: `${calculatedCellSize}px`,
      backgroundColor: getColor(cell.value),
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      transform: `scale(${cellProgress})`,
      opacity: cellProgress,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-primary)',
      border: isSelected ? '2px solid var(--color-primary)' : 
              isHovered ? '2px solid var(--color-text-muted)' : 'none',
      
      // Variant styles
      ...(variant === 'rounded' && {
        borderRadius: 'var(--border-radius-sm)'
      }),
      
      ...(variant === 'circular' && {
        borderRadius: '50%'
      }),
      
      // Grid lines
      ...(showGrid && {
        border: '1px solid var(--color-border)'
      }),
      
      ':hover': {
        transform: `scale(${cellProgress * 1.05})`,
        zIndex: 10
      }
    });
  };
  
  // Legend styles
  const getLegendStyles = () => {
    const isHorizontal = legendPosition === 'top' || legendPosition === 'bottom';
    
    return normalizeStyle({
      display: 'flex',
      flexDirection: isHorizontal ? 'row' : 'column',
      alignItems: isHorizontal ? 'center' : 'flex-start',
      gap: 'var(--space-2)',
      padding: 'var(--space-2)',
      backgroundColor: theme === 'detailed' ? 'var(--color-surface)' : 'transparent',
      borderRadius: theme === 'detailed' ? 'var(--border-radius-md)' : 0,
      border: theme === 'detailed' ? '1px solid var(--color-border)' : 'none'
    });
  };
  
  // Render legend
  const renderLegend = () => {
    if (!showLegend) return null;
    
    const schemes = getColorSchemes();
    const colors = schemes[colorScheme] || schemes.blue;
    
    const legendItems = [];
    for (let i = 0; i < legendSteps; i++) {
      const ratio = i / (legendSteps - 1);
      const value = dataMinValue + (valueRange * ratio);
      const color = getColor(value);
      
      legendItems.push({
        value: value.toFixed(1),
        color,
        ratio
      });
    }
    
    return (
      <div style={getLegendStyles()}>
        <div style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-1)'
        }}>
          Scale
        </div>
        
        {legendItems.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: item.color,
              borderRadius: variant === 'circular' ? '50%' : 
                            variant === 'rounded' ? 'var(--border-radius-sm)' : 0,
              border: '1px solid var(--color-border)'
            }} />
            <span style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)'
            }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  // Render tooltip
  const renderTooltip = () => {
    if (!showTooltip || !hoveredCell) return null;
    
    const cell = flatData.find(d => d.id === hoveredCell.id);
    if (!cell) return null;
    
    return (
      <div
        style={normalizeStyle({
          position: 'fixed',
          left: hoveredCell.x + 10,
          top: hoveredCell.y - 60,
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
          {cell.label || `(${cell.x}, ${cell.y})`}
        </div>
        <div style={{ color: 'var(--color-text-secondary)' }}>
          Value: {typeof cell.value === 'number' ? cell.value.toFixed(2) : cell.value}
        </div>
        {xLabels[cell.x] && (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
            X: {xLabels[cell.x]}
          </div>
        )}
        {yLabels[cell.y] && (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
            Y: {yLabels[cell.y]}
          </div>
        )}
      </div>
    );
  };
  
  // Render axis labels
  const renderAxisLabels = () => {
    if (theme === 'minimal' || (!xLabels.length && !yLabels.length)) return null;
    
    return (
      <>
        {/* X-axis labels */}
        {xLabels.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '0',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            paddingLeft: `${cellSpacing}px`,
            paddingRight: `${cellSpacing}px`
          }}>
            {xLabels.map((label, i) => (
              <div key={i} style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                width: `${calculatedCellSize}px`
              }}>
                {label}
              </div>
            ))}
          </div>
        )}
        
        {/* Y-axis labels */}
        {yLabels.length > 0 && (
          <div style={{
            position: 'absolute',
            left: '-80px',
            top: '0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingTop: `${cellSpacing}px`,
            paddingBottom: `${cellSpacing}px`
          }}>
            {yLabels.map((label, i) => (
              <div key={i} style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                textAlign: 'right',
                height: `${calculatedCellSize}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 'var(--space-2)'
              }}>
                {label}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };
  
  const legendElement = renderLegend();
  
  return (
    <div
      ref={ref}
      className={`vistara-heatmap-chart vistara-heatmap-chart--${variant} vistara-heatmap-chart--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {/* Legend top */}
      {legendPosition === 'top' && legendElement}
      
      <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
        {/* Legend left */}
        {legendPosition === 'left' && legendElement}
        
        {/* Chart */}
        <div ref={containerRef} style={getChartContainerStyles()}>
          <div style={{
            position: 'relative',
            width: `${chartWidth}px`,
            height: `${chartHeight}px`
          }}>
            {/* Cells */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${calculatedCellSize}px)`,
              gap: `${cellSpacing}px`,
              padding: `${cellSpacing}px`
            }}>
              {processedData.map((row, y) => 
                row.map((cell, x) => {
                  if (!cell) return <div key={`${x}-${y}`} />;
                  
                  const cellIndex = y * cols + x;
                  
                  return (
                    <div
                      key={cell.id}
                      style={getCellStyles(cell, cellIndex)}
                      onMouseEnter={(e) => handleCellHover(cell, e)}
                      onMouseLeave={handleCellLeave}
                      onClick={(e) => handleCellClick(cell, e)}
                    >
                      {showValues && typeof cell.value === 'number' && (
                        <span style={{
                          fontSize: calculatedCellSize > 40 ? 'var(--font-size-xs)' : '10px',
                          textShadow: '0 0 2px rgba(255,255,255,0.8)'
                        }}>
                          {cell.value.toFixed(1)}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Axis labels */}
            {renderAxisLabels()}
          </div>
        </div>
        
        {/* Legend right */}
        {legendPosition === 'right' && legendElement}
      </div>
      
      {/* Legend bottom */}
      {legendPosition === 'bottom' && legendElement}
      
      {/* Tooltip */}
      {renderTooltip()}
    </div>
  );
});

HeatmapChart.displayName = 'HeatmapChart';

export default HeatmapChart;