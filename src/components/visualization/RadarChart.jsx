/**
 * 🎯 Vistara UI - RadarChart Component
 * "Command your Design."
 * 
 * גרף רדאר להשוואת מדדים מרובים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const RadarChart = forwardRef(({
  // Data
  data = [], // [{ axis: 'Speed', value: 80, maxValue?: 100 }]
  series = [], // For multiple datasets: [{ name: 'Dataset1', data: [...], color: '#...' }]
  
  // Scales
  maxValue = 100,
  minValue = 0,
  levels = 5,
  
  // Display options
  showGrid = true,
  showAxis = true,
  showLabels = true,
  showValues = false,
  showArea = true,
  showDots = true,
  showLegend = true,
  
  // Grid options
  gridShape = 'polygon', // 'polygon', 'circle'
  gridStyle = 'solid', // 'solid', 'dashed', 'dotted'
  
  // Animation
  animated = true,
  animationDuration = 1000,
  
  // Interaction
  interactive = true,
  showTooltip = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'neon'
  variant = 'default', // 'default', 'filled', 'gradient', 'glow'
  
  // Colors
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  fillOpacity = 0.3,
  strokeWidth = 2,
  
  // Dimensions
  width = 400,
  height = 400,
  margin = 50,
  
  // Callbacks
  onPointHover,
  onPointClick,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1);
  
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
    if (!animated) return;
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      setAnimationProgress(easeOutCubic(progress));
      
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
  }, [animated, animationDuration, data, series]);
  
  // Easing function
  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };
  
  // Prepare data
  const datasets = series.length > 0 ? series : [{
    name: 'default',
    data: data,
    color: colors[0]
  }];
  
  // Get all axes
  const axes = datasets[0]?.data?.map(d => d.axis) || [];
  const numAxes = axes.length;
  
  // Calculate center and radius
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const radius = Math.min(dimensions.width, dimensions.height) / 2 - margin;
  
  // Calculate angle for each axis
  const angleSlice = (Math.PI * 2) / numAxes;
  
  // Get coordinates for a point
  const getCoordinates = (value, index, max = maxValue) => {
    const angle = angleSlice * index - Math.PI / 2;
    const normalizedValue = (value - minValue) / (max - minValue);
    const r = radius * normalizedValue * animationProgress;
    
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };
  
  // Get path for dataset
  const getPath = (dataset) => {
    return dataset.data.map((d, i) => {
      const coords = getCoordinates(d.value, i, d.maxValue || maxValue);
      return `${i === 0 ? 'M' : 'L'} ${coords.x},${coords.y}`;
    }).join(' ') + ' Z';
  };
  
  // Get grid path
  const getGridPath = (level) => {
    const r = (radius / levels) * level;
    
    if (gridShape === 'circle') {
      return `M ${centerX + r} ${centerY} A ${r} ${r} 0 1 1 ${centerX - r} ${centerY} A ${r} ${r} 0 1 1 ${centerX + r} ${centerY}`;
    }
    
    return axes.map((_, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ') + ' Z';
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      position: 'relative',
      width: width,
      height: height,
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-lg)',
      
      ...(theme === 'modern' && {
        backgroundColor: 'var(--color-background-secondary)',
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
  
  // Grid styles
  const getGridStyles = (level) => {
    return normalizeStyle({
      fill: 'none',
      stroke: 'var(--color-border)',
      strokeWidth: 1,
      strokeDasharray: gridStyle === 'dashed' ? '5,5' : gridStyle === 'dotted' ? '2,2' : 'none',
      opacity: 0.3 + (level / levels) * 0.3
    });
  };
  
  // Axis styles
  const getAxisStyles = () => {
    return normalizeStyle({
      stroke: 'var(--color-border)',
      strokeWidth: 1,
      opacity: 0.5
    });
  };
  
  // Area styles
  const getAreaStyles = (dataset, index) => {
    return normalizeStyle({
      fill: dataset.color || colors[index % colors.length],
      fillOpacity: fillOpacity,
      stroke: dataset.color || colors[index % colors.length],
      strokeWidth: strokeWidth,
      strokeLinejoin: 'round',
      transition: animated ? 'none' : 'all 0.3s ease',
      
      ...(variant === 'gradient' && {
        fill: `url(#gradient-${index})`
      }),
      
      ...(variant === 'glow' && {
        filter: `drop-shadow(0 0 8px ${dataset.color || colors[index % colors.length]})`
      })
    });
  };
  
  // Dot styles
  const getDotStyles = (dataset, index, isHovered) => {
    return normalizeStyle({
      fill: dataset.color || colors[index % colors.length],
      stroke: 'var(--color-surface)',
      strokeWidth: 2,
      r: isHovered ? 6 : 4,
      transition: 'all 0.2s ease',
      cursor: interactive ? 'pointer' : 'default',
      
      ...(theme === 'neon' && {
        fill: dataset.color || colors[index % colors.length],
        stroke: dataset.color || colors[index % colors.length],
        filter: `drop-shadow(0 0 4px ${dataset.color || colors[index % colors.length]})`
      })
    });
  };
  
  // Label styles
  const getLabelStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-xs)' : 
                size === 'expanded' ? 'var(--font-size-base)' : 'var(--font-size-sm)',
      fill: 'var(--color-text-primary)',
      textAnchor: 'middle',
      dominantBaseline: 'middle',
      userSelect: 'none'
    });
  };
  
  // Tooltip styles
  const getTooltipStyles = () => {
    if (!hoveredPoint) return { display: 'none' };
    
    const coords = getCoordinates(hoveredPoint.value, hoveredPoint.axisIndex, hoveredPoint.maxValue || maxValue);
    
    return normalizeStyle({
      position: 'absolute',
      left: coords.x,
      top: coords.y - 40,
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--space-2) var(--space-3)',
      boxShadow: 'var(--shadow-lg)',
      fontSize: 'var(--font-size-sm)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 1000
    });
  };
  
  // Legend styles
  const getLegendStyles = () => {
    return normalizeStyle({
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-3)',
      justifyContent: 'center',
      marginTop: 'var(--space-3)',
      padding: 'var(--space-3)',
      borderTop: '1px solid var(--color-border)'
    });
  };
  
  // Legend item styles
  const getLegendItemStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-secondary)'
    });
  };
  
  return (
    <div
      ref={containerRef}
      className={`vistara-radar-chart vistara-radar-chart--${variant} vistara-radar-chart--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      <svg style={getSvgStyles()}>
        {/* Gradients */}
        {variant === 'gradient' && (
          <defs>
            {datasets.map((dataset, index) => (
              <radialGradient key={index} id={`gradient-${index}`}>
                <stop offset="0%" stopColor={dataset.color || colors[index % colors.length]} stopOpacity={0.6} />
                <stop offset="100%" stopColor={dataset.color || colors[index % colors.length]} stopOpacity={0.1} />
              </radialGradient>
            ))}
          </defs>
        )}
        
        {/* Grid */}
        {showGrid && (
          <g>
            {Array.from({ length: levels }, (_, i) => (
              <path
                key={i}
                d={getGridPath(i + 1)}
                style={getGridStyles(i + 1)}
              />
            ))}
          </g>
        )}
        
        {/* Axes */}
        {showAxis && (
          <g>
            {axes.map((_, i) => {
              const angle = angleSlice * i - Math.PI / 2;
              const x2 = centerX + radius * Math.cos(angle);
              const y2 = centerY + radius * Math.sin(angle);
              
              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={x2}
                  y2={y2}
                  style={getAxisStyles()}
                />
              );
            })}
          </g>
        )}
        
        {/* Data areas */}
        {datasets.map((dataset, datasetIndex) => (
          <g key={datasetIndex}>
            {/* Area */}
            {showArea && (
              <path
                d={getPath(dataset)}
                style={getAreaStyles(dataset, datasetIndex)}
              />
            )}
            
            {/* Line */}
            <path
              d={getPath(dataset)}
              fill="none"
              style={{
                stroke: dataset.color || colors[datasetIndex % colors.length],
                strokeWidth: strokeWidth,
                strokeLinejoin: 'round'
              }}
            />
            
            {/* Dots */}
            {showDots && dataset.data.map((d, i) => {
              const coords = getCoordinates(d.value, i, d.maxValue || maxValue);
              const isHovered = hoveredPoint?.datasetIndex === datasetIndex && 
                               hoveredPoint?.axisIndex === i;
              
              return (
                <circle
                  key={i}
                  cx={coords.x}
                  cy={coords.y}
                  style={getDotStyles(dataset, datasetIndex, isHovered)}
                  onMouseEnter={() => {
                    setHoveredPoint({
                      ...d,
                      datasetIndex,
                      axisIndex: i,
                      datasetName: dataset.name
                    });
                    onPointHover?.(d, dataset.name);
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                  onClick={() => onPointClick?.(d, dataset.name)}
                />
              );
            })}
          </g>
        ))}
        
        {/* Labels */}
        {showLabels && (
          <g>
            {axes.map((axis, i) => {
              const angle = angleSlice * i - Math.PI / 2;
              const labelRadius = radius + 20;
              const x = centerX + labelRadius * Math.cos(angle);
              const y = centerY + labelRadius * Math.sin(angle);
              
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  style={getLabelStyles()}
                >
                  {axis}
                </text>
              );
            })}
          </g>
        )}
        
        {/* Values on axes */}
        {showValues && (
          <g>
            {Array.from({ length: levels }, (_, i) => {
              const value = ((i + 1) / levels) * (maxValue - minValue) + minValue;
              const r = (radius / levels) * (i + 1);
              
              return (
                <text
                  key={i}
                  x={centerX + 5}
                  y={centerY - r}
                  style={{
                    ...getLabelStyles(),
                    fontSize: '0.8em',
                    fill: 'var(--color-text-muted)'
                  }}
                >
                  {value}
                </text>
              );
            })}
          </g>
        )}
      </svg>
      
      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <div style={getTooltipStyles()}>
          <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>
            {hoveredPoint.axis}
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>
            {hoveredPoint.datasetName}: {hoveredPoint.value}
          </div>
        </div>
      )}
      
      {/* Legend */}
      {showLegend && datasets.length > 1 && (
        <div style={getLegendStyles()}>
          {datasets.map((dataset, index) => (
            <div key={index} style={getLegendItemStyles()}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                backgroundColor: dataset.color || colors[index % colors.length]
              }} />
              <span>{dataset.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

RadarChart.displayName = 'RadarChart';

export default RadarChart;