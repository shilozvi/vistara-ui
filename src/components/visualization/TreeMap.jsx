/**
 * 🎯 Vistara UI - TreeMap Component
 * "Command your Design."
 * 
 * תצוגת מפת עץ להצגת נתונים היררכיים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const TreeMap = forwardRef(({
  // Data
  data = null, // { name, value, children?: [...] }
  
  // Display options
  showLabels = true,
  showValues = true,
  showTooltip = true,
  labelPosition = 'center', // 'center', 'top-left', 'bottom-right'
  
  // Layout
  tileMethod = 'squarify', // 'squarify', 'binary', 'slice', 'dice'
  padding = 2,
  borderRadius = 4,
  
  // Colors
  colorScheme = 'default', // 'default', 'category', 'sequential', 'diverging'
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  colorByValue = false,
  
  // Interaction
  interactive = true,
  zoomable = false,
  selectable = true,
  
  // Animation
  animated = true,
  animationDuration = 500,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'neon'
  variant = 'default', // 'default', 'flat', 'gradient', '3d'
  
  // Dimensions
  width = '100%',
  height = 400,
  
  // Callbacks
  onClick,
  onHover,
  onSelect,
  
  // Custom formatters
  formatLabel = (d) => d.name,
  formatValue = (d) => d.value?.toLocaleString(),
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
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
  
  // Calculate treemap layout
  const calculateTreemap = (node, x, y, width, height, depth = 0) => {
    if (!node || width <= 0 || height <= 0) return [];
    
    const nodes = [];
    const value = node.value || 0;
    const children = node.children || [];
    
    // Node data
    const nodeData = {
      ...node,
      x,
      y,
      width,
      height,
      depth,
      color: getNodeColor(node, depth)
    };
    
    nodes.push(nodeData);
    
    // Calculate children layout
    if (children.length > 0) {
      const childNodes = squarify(children, x + padding, y + padding, 
                                 width - padding * 2, height - padding * 2, depth + 1);
      nodes.push(...childNodes.flat());
    }
    
    return nodes;
  };
  
  // Squarify algorithm
  const squarify = (children, x, y, width, height, depth) => {
    const sorted = [...children].sort((a, b) => (b.value || 0) - (a.value || 0));
    const total = sorted.reduce((sum, child) => sum + (child.value || 0), 0);
    
    if (total === 0) return [];
    
    const nodes = [];
    let currentX = x;
    let currentY = y;
    let remainingWidth = width;
    let remainingHeight = height;
    
    sorted.forEach((child, i) => {
      const ratio = (child.value || 0) / total;
      let nodeWidth, nodeHeight, nodeX, nodeY;
      
      if (remainingWidth > remainingHeight) {
        nodeWidth = remainingWidth * ratio;
        nodeHeight = remainingHeight;
        nodeX = currentX;
        nodeY = currentY;
        currentX += nodeWidth;
        remainingWidth -= nodeWidth;
      } else {
        nodeWidth = remainingWidth;
        nodeHeight = remainingHeight * ratio;
        nodeX = currentX;
        nodeY = currentY;
        currentY += nodeHeight;
        remainingHeight -= nodeHeight;
      }
      
      const childNodes = calculateTreemap(child, nodeX, nodeY, nodeWidth, nodeHeight, depth);
      nodes.push(...childNodes);
    });
    
    return nodes;
  };
  
  // Get node color
  const getNodeColor = (node, depth) => {
    if (colorByValue && node.value) {
      // Color by value intensity
      const maxValue = getMaxValue(data);
      const intensity = node.value / maxValue;
      return `hsl(220, 70%, ${30 + intensity * 40}%)`;
    }
    
    // Color by depth or category
    const colorIndex = depth % colors.length;
    return colors[colorIndex];
  };
  
  // Get max value
  const getMaxValue = (node) => {
    if (!node) return 0;
    const values = [node.value || 0];
    if (node.children) {
      node.children.forEach(child => {
        values.push(getMaxValue(child));
      });
    }
    return Math.max(...values);
  };
  
  // Handle node click
  const handleNodeClick = (node, event) => {
    if (!interactive) return;
    
    if (selectable) {
      const newSelected = new Set(selectedNodes);
      if (newSelected.has(node.name)) {
        newSelected.delete(node.name);
      } else {
        newSelected.add(node.name);
      }
      setSelectedNodes(newSelected);
      onSelect?.(Array.from(newSelected));
    }
    
    onClick?.(node, event);
  };
  
  // Handle mouse move for tooltip
  const handleMouseMove = (event) => {
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      position: 'relative',
      width: width,
      height: height,
      backgroundColor: 'var(--color-background-secondary)',
      borderRadius: 'var(--border-radius-lg)',
      overflow: 'hidden',
      
      ...(theme === 'modern' && {
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      })
    });
  };
  
  // SVG styles
  const getSvgStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: '100%',
      cursor: interactive ? 'pointer' : 'default'
    });
  };
  
  // Rect styles
  const getRectStyles = (node) => {
    const isHovered = hoveredNode?.name === node.name;
    const isSelected = selectedNodes.has(node.name);
    
    return normalizeStyle({
      fill: node.color,
      stroke: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
      strokeWidth: isSelected ? 3 : 1,
      opacity: isHovered ? 0.9 : 1,
      transition: animated ? `all ${animationDuration}ms ease` : 'none',
      rx: borderRadius,
      ry: borderRadius,
      
      ...(variant === 'gradient' && {
        fill: `url(#gradient-${node.name.replace(/\s+/g, '-')})`
      }),
      
      ...(variant === '3d' && {
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
      })
    });
  };
  
  // Text styles
  const getTextStyles = (node) => {
    const brightness = getBrightness(node.color);
    const textColor = brightness > 128 ? 'var(--color-text-primary)' : 'var(--color-white)';
    
    return normalizeStyle({
      fill: textColor,
      fontSize: size === 'compact' ? 'var(--font-size-xs)' : 
                size === 'expanded' ? 'var(--font-size-base)' : 'var(--font-size-sm)',
      fontWeight: node.depth === 0 ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
      textAnchor: labelPosition === 'center' ? 'middle' : 
                  labelPosition.includes('right') ? 'end' : 'start',
      dominantBaseline: labelPosition === 'center' ? 'middle' : 
                       labelPosition.includes('bottom') ? 'bottom' : 'hanging',
      pointerEvents: 'none',
      userSelect: 'none'
    });
  };
  
  // Tooltip styles
  const getTooltipStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      left: tooltipPosition.x + 10,
      top: tooltipPosition.y + 10,
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--space-2) var(--space-3)',
      boxShadow: 'var(--shadow-lg)',
      pointerEvents: 'none',
      zIndex: 1000,
      fontSize: 'var(--font-size-sm)',
      whiteSpace: 'nowrap',
      
      ...(theme === 'neon' && {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid var(--color-primary)',
        color: 'var(--color-white)'
      })
    });
  };
  
  // Calculate brightness
  const getBrightness = (color) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return 128;
    return (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
  };
  
  // Calculate text position
  const getTextPosition = (node) => {
    switch (labelPosition) {
      case 'center':
        return { x: node.width / 2, y: node.height / 2 };
      case 'top-left':
        return { x: padding + 4, y: padding + 4 };
      case 'bottom-right':
        return { x: node.width - padding - 4, y: node.height - padding - 4 };
      default:
        return { x: node.width / 2, y: node.height / 2 };
    }
  };
  
  // Calculate nodes
  const nodes = data ? calculateTreemap(data, 0, 0, dimensions.width, dimensions.height) : [];
  
  return (
    <div
      ref={containerRef}
      className={`vistara-treemap vistara-treemap--${variant} vistara-treemap--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <svg style={getSvgStyles()}>
        {/* Gradients */}
        {variant === 'gradient' && (
          <defs>
            {nodes.map(node => (
              <linearGradient
                key={`gradient-${node.name}`}
                id={`gradient-${node.name.replace(/\s+/g, '-')}`}
                x1="0%" y1="0%" x2="100%" y2="100%"
              >
                <stop offset="0%" stopColor={node.color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={node.color} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>
        )}
        
        {/* Render nodes */}
        <g transform={zoomable ? `scale(${zoom.scale}) translate(${zoom.x}, ${zoom.y})` : ''}>
          {nodes.map((node, index) => (
            <g key={`${node.name}-${index}`}>
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                style={getRectStyles(node)}
                onClick={(e) => handleNodeClick(node, e)}
                onMouseEnter={() => {
                  setHoveredNode(node);
                  onHover?.(node);
                }}
                onMouseLeave={() => setHoveredNode(null)}
              />
              
              {/* Labels */}
              {showLabels && node.width > 40 && node.height > 30 && (
                <text
                  x={node.x + getTextPosition(node).x}
                  y={node.y + getTextPosition(node).y}
                  style={getTextStyles(node)}
                >
                  {formatLabel(node)}
                  {showValues && node.value && (
                    <tspan
                      x={node.x + getTextPosition(node).x}
                      dy="1.2em"
                      style={{ fontSize: '0.9em', opacity: 0.8 }}
                    >
                      {formatValue(node)}
                    </tspan>
                  )}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
      
      {/* Tooltip */}
      {showTooltip && hoveredNode && (
        <div style={getTooltipStyles()}>
          <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>
            {formatLabel(hoveredNode)}
          </div>
          {hoveredNode.value && (
            <div style={{ color: 'var(--color-text-muted)' }}>
              Value: {formatValue(hoveredNode)}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TreeMap.displayName = 'TreeMap';

export default TreeMap;