/**
 * 🎯 Vistara UI - ColorPicker Component
 * "Command your Design."
 * 
 * בוחר צבעים מתקדם עם פלטות ושליטה מלאה
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const ColorPicker = forwardRef(({ 
  // Value & state
  value = '#000000',
  defaultValue,
  
  // Behavior
  disabled = false,
  
  // Format
  format = 'hex', // 'hex', 'rgb', 'hsl'
  showAlpha = false,
  
  // Presets
  presets = [],
  showPresets = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'button', 'input'
  
  // Display options
  showInput = true,
  showEyeDropper = false,
  
  // Callbacks
  onChange,
  onOpen,
  onClose,
  
  // Standard props
  id,
  name,
  className,
  style,
  ...props
}, ref) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value || defaultValue || '#000000');
  const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100 });
  const [alpha, setAlpha] = useState(1);
  
  const containerRef = useRef(null);
  const pickerRef = useRef(null);
  const saturationRef = useRef(null);
  const hueRef = useRef(null);
  const alphaRef = useRef(null);
  
  // Default presets
  const defaultPresets = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  
  const colorPresets = presets.length > 0 ? presets : (showPresets ? defaultPresets : []);
  
  // Convert hex to HSV
  const hexToHsv = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    if (diff !== 0) {
      switch (max) {
        case r: h = ((g - b) / diff) % 6; break;
        case g: h = (b - r) / diff + 2; break;
        case b: h = (r - g) / diff + 4; break;
      }
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    const s = max === 0 ? 0 : Math.round((diff / max) * 100);
    const v = Math.round(max * 100);
    
    return { h, s, v };
  };
  
  // Convert HSV to hex
  const hsvToHex = (h, s, v) => {
    const c = (v / 100) * (s / 100);
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = (v / 100) - c;
    
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };
  
  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };
  
  // Format color output
  const formatColor = (hex, alpha = 1) => {
    switch (format) {
      case 'rgb': {
        const { r, g, b } = hexToRgb(hex);
        return showAlpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
      }
      case 'hsl': {
        const { r, g, b } = hexToRgb(hex);
        const { h, s, l } = rgbToHsl(r, g, b);
        return showAlpha ? `hsla(${h}, ${s}%, ${l}%, ${alpha})` : `hsl(${h}, ${s}%, ${l}%)`;
      }
      default:
        return showAlpha ? `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` : hex;
    }
  };
  
  // Update color from HSV
  const updateFromHsv = (newHsv, newAlpha = alpha) => {
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    const formattedColor = formatColor(hex, newAlpha);
    setCurrentColor(hex);
    setHsv(newHsv);
    setAlpha(newAlpha);
    onChange?.(formattedColor, hex);
  };
  
  // Handle saturation/value change
  const handleSaturationChange = (event) => {
    if (disabled) return;
    
    const rect = saturationRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
    
    const s = (x / rect.width) * 100;
    const v = 100 - (y / rect.height) * 100;
    
    updateFromHsv({ ...hsv, s, v });
  };
  
  // Handle hue change
  const handleHueChange = (event) => {
    if (disabled) return;
    
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const h = (x / rect.width) * 360;
    
    updateFromHsv({ ...hsv, h });
  };
  
  // Handle alpha change
  const handleAlphaChange = (event) => {
    if (disabled) return;
    
    const rect = alphaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const newAlpha = x / rect.width;
    
    updateFromHsv(hsv, newAlpha);
  };
  
  // Handle preset selection
  const handlePresetSelect = (color) => {
    const newHsv = hexToHsv(color);
    setCurrentColor(color);
    setHsv(newHsv);
    const formattedColor = formatColor(color, alpha);
    onChange?.(formattedColor, color);
  };
  
  // Handle manual input
  const handleInputChange = (inputValue) => {
    let hex = inputValue;
    
    // Try to parse different formats
    if (inputValue.startsWith('#')) {
      hex = inputValue;
    } else if (inputValue.startsWith('rgb')) {
      // Parse RGB/RGBA
      const matches = inputValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (matches) {
        const r = parseInt(matches[1]);
        const g = parseInt(matches[2]);
        const b = parseInt(matches[3]);
        hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        if (matches[4] && showAlpha) {
          setAlpha(parseFloat(matches[4]));
        }
      }
    }
    
    // Validate hex
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      const newHsv = hexToHsv(hex);
      setCurrentColor(hex);
      setHsv(newHsv);
      const formattedColor = formatColor(hex, alpha);
      onChange?.(formattedColor, hex);
    }
  };
  
  // Initialize HSV from current color
  useEffect(() => {
    if (currentColor) {
      const newHsv = hexToHsv(currentColor);
      setHsv(newHsv);
    }
  }, [currentColor]);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        onClose?.();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      fontFamily: 'var(--font-family-base)'
    });
  };
  
  // Trigger styles
  const getTriggerStyles = () => {
    const sizeMap = {
      compact: { width: '32px', height: '32px' },
      normal: { width: '40px', height: '40px' },
      expanded: { width: '48px', height: '48px' }
    };
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      
      ...(variant === 'button' && {
        padding: 'var(--space-2)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-md)',
        backgroundColor: 'var(--color-surface)'
      })
    });
  };
  
  // Color preview styles
  const getColorPreviewStyles = () => {
    const sizeMap = {
      compact: { width: '32px', height: '32px' },
      normal: { width: '40px', height: '40px' },
      expanded: { width: '48px', height: '48px' }
    };
    
    return normalizeStyle({
      borderRadius: 'var(--border-radius-md)',
      border: '2px solid var(--color-border)',
      cursor: 'inherit',
      position: 'relative',
      overflow: 'hidden',
      
      ...sizeMap[size],
      
      // Checkerboard background for transparency
      background: `
        linear-gradient(45deg, #ccc 25%, transparent 25%), 
        linear-gradient(-45deg, #ccc 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #ccc 75%), 
        linear-gradient(-45deg, transparent 75%, #ccc 75%)
      `,
      backgroundSize: '8px 8px',
      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
    });
  };
  
  // Color overlay styles
  const getColorOverlayStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: currentColor,
      opacity: showAlpha ? alpha : 1
    });
  };
  
  // Picker panel styles
  const getPickerPanelStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '100%',
      left: 0,
      zIndex: 1000,
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      padding: 'var(--space-4)',
      marginTop: 'var(--space-1)',
      width: '280px',
      
      // Animation
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'all 0.2s ease',
      visibility: isOpen ? 'visible' : 'hidden'
    });
  };
  
  // Saturation/Value area styles
  const getSaturationAreaStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: '150px',
      position: 'relative',
      borderRadius: 'var(--border-radius-md)',
      cursor: 'crosshair',
      marginBottom: 'var(--space-3)',
      background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hsv.h}, 100%, 50%))`
    });
  };
  
  // Saturation pointer styles
  const getSaturationPointerStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: '2px solid white',
      borderRadius: '50%',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
      transform: 'translate(-50%, -50%)',
      left: `${hsv.s}%`,
      top: `${100 - hsv.v}%`,
      pointerEvents: 'none'
    });
  };
  
  // Slider styles
  const getSliderStyles = (type) => {
    let background = '';
    
    switch (type) {
      case 'hue':
        background = 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
        break;
      case 'alpha':
        background = `
          linear-gradient(45deg, #ccc 25%, transparent 25%), 
          linear-gradient(-45deg, #ccc 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #ccc 75%), 
          linear-gradient(-45deg, transparent 75%, #ccc 75%),
          linear-gradient(to right, transparent, ${currentColor})
        `;
        break;
    }
    
    return normalizeStyle({
      width: '100%',
      height: '12px',
      borderRadius: '6px',
      position: 'relative',
      cursor: 'pointer',
      marginBottom: 'var(--space-2)',
      background,
      backgroundSize: type === 'alpha' ? '8px 8px, 8px 8px, 8px 8px, 8px 8px, 100% 100%' : '100% 100%'
    });
  };
  
  // Slider thumb styles
  const getSliderThumbStyles = (position) => {
    return normalizeStyle({
      position: 'absolute',
      width: '16px',
      height: '16px',
      border: '2px solid white',
      borderRadius: '50%',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
      transform: 'translate(-50%, -50%)',
      left: `${position}%`,
      top: '50%',
      pointerEvents: 'none',
      backgroundColor: 'white'
    });
  };
  
  // Input styles
  const getInputStyles = () => {
    return normalizeStyle({
      width: '100%',
      padding: 'var(--space-2)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-sm)',
      fontSize: 'var(--font-size-sm)',
      textAlign: 'center',
      fontFamily: 'monospace'
    });
  };
  
  // Preset grid styles
  const getPresetGridStyles = () => {
    return normalizeStyle({
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-3)'
    });
  };
  
  // Preset item styles
  const getPresetItemStyles = (color) => {
    return normalizeStyle({
      width: '24px',
      height: '24px',
      borderRadius: 'var(--border-radius-sm)',
      border: '2px solid var(--color-border)',
      cursor: 'pointer',
      backgroundColor: color,
      transition: 'transform 0.2s ease',
      
      ':hover': {
        transform: 'scale(1.1)'
      }
    });
  };
  
  return (
    <div
      ref={containerRef}
      className={`vistara-color-picker vistara-color-picker--${variant} vistara-color-picker--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {/* Trigger */}
      <div
        style={getTriggerStyles()}
        onClick={() => !disabled && (setIsOpen(!isOpen), onOpen?.())}
      >
        <div style={getColorPreviewStyles()}>
          <div style={getColorOverlayStyles()} />
        </div>
        
        {showInput && variant !== 'button' && (
          <input
            type="text"
            value={formatColor(currentColor, alpha)}
            onChange={(e) => handleInputChange(e.target.value)}
            style={getInputStyles()}
            readOnly={disabled}
          />
        )}
      </div>
      
      {/* Picker Panel */}
      <div ref={pickerRef} style={getPickerPanelStyles()}>
        {/* Saturation/Value Area */}
        <div
          ref={saturationRef}
          style={getSaturationAreaStyles()}
          onMouseDown={(e) => {
            handleSaturationChange(e);
            const handleMouseMove = (e) => handleSaturationChange(e);
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div style={getSaturationPointerStyles()} />
        </div>
        
        {/* Hue Slider */}
        <div
          ref={hueRef}
          style={getSliderStyles('hue')}
          onMouseDown={(e) => {
            handleHueChange(e);
            const handleMouseMove = (e) => handleHueChange(e);
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div style={getSliderThumbStyles((hsv.h / 360) * 100)} />
        </div>
        
        {/* Alpha Slider */}
        {showAlpha && (
          <div
            ref={alphaRef}
            style={getSliderStyles('alpha')}
            onMouseDown={(e) => {
              handleAlphaChange(e);
              const handleMouseMove = (e) => handleAlphaChange(e);
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div style={getSliderThumbStyles(alpha * 100)} />
          </div>
        )}
        
        {/* Input */}
        {showInput && (
          <input
            type="text"
            value={formatColor(currentColor, alpha)}
            onChange={(e) => handleInputChange(e.target.value)}
            style={normalizeStyle({
              ...getInputStyles(),
              marginTop: 'var(--space-2)'
            })}
          />
        )}
        
        {/* Presets */}
        {colorPresets.length > 0 && (
          <div style={getPresetGridStyles()}>
            {colorPresets.map((preset, index) => (
              <div
                key={index}
                style={getPresetItemStyles(preset)}
                onClick={() => handlePresetSelect(preset)}
                title={preset}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

ColorPicker.displayName = 'ColorPicker';

export default ColorPicker;