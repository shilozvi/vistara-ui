/**
 * 🎯 Vistara UI - Avatar Component
 * "Command your Design."
 * 
 * אווטר משתמש מתקדם עם תמונות ותווים
 */

import React, { forwardRef, useState } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Avatar = forwardRef(({ 
  // Content
  src,
  alt,
  name,
  initials,
  icon,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'large', 'xl', '2xl'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'circular', // 'circular', 'rounded', 'square'
  color = 'auto', // 'auto', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'
  
  // Status indicator
  status, // 'online', 'offline', 'away', 'busy'
  showStatus = false,
  statusPosition = 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  
  // Behavior
  clickable = false,
  loading = false,
  
  // Group behavior (for AvatarGroup)
  grouped = false,
  overlap = false,
  
  // Callbacks
  onClick,
  onImageError,
  onImageLoad,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Handle image error
  const handleImageError = (event) => {
    setImageError(true);
    onImageError?.(event);
  };
  
  // Handle image load
  const handleImageLoad = (event) => {
    setImageLoaded(true);
    onImageLoad?.(event);
  };
  
  // Generate initials from name
  const getInitials = () => {
    if (initials) return initials;
    if (!name) return '';
    
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };
  
  // Generate background color based on name
  const getAutoColor = () => {
    if (color !== 'auto') return null;
    if (!name) return 'var(--color-gray-400)';
    
    const colors = [
      'var(--color-red-400)',
      'var(--color-orange-400)',
      'var(--color-yellow-400)',
      'var(--color-green-400)',
      'var(--color-teal-400)',
      'var(--color-blue-400)',
      'var(--color-indigo-400)',
      'var(--color-purple-400)',
      'var(--color-pink-400)'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Size mapping
  const getSizeMap = () => {
    return {
      compact: {
        size: '32px',
        fontSize: 'var(--font-size-sm)'
      },
      normal: {
        size: '40px',
        fontSize: 'var(--font-size-base)'
      },
      large: {
        size: '56px',
        fontSize: 'var(--font-size-lg)'
      },
      xl: {
        size: '80px',
        fontSize: 'var(--font-size-xl)'
      },
      '2xl': {
        size: '120px',
        fontSize: 'var(--font-size-2xl)'
      }
    };
  };
  
  // Color mapping
  const getColorStyles = () => {
    const colorMap = {
      primary: {
        bg: 'var(--color-primary)',
        text: 'var(--color-primary-contrast)'
      },
      secondary: {
        bg: 'var(--color-secondary)',
        text: 'var(--color-secondary-contrast)'
      },
      success: {
        bg: 'var(--color-success)',
        text: 'var(--color-success-contrast)'
      },
      warning: {
        bg: 'var(--color-warning)',
        text: 'var(--color-warning-contrast)'
      },
      danger: {
        bg: 'var(--color-danger)',
        text: 'var(--color-danger-contrast)'
      },
      info: {
        bg: 'var(--color-info)',
        text: 'var(--color-info-contrast)'
      }
    };
    
    if (color === 'auto') {
      return {
        bg: getAutoColor(),
        text: 'var(--color-white)'
      };
    }
    
    return colorMap[color] || {
      bg: 'var(--color-gray-400)',
      text: 'var(--color-white)'
    };
  };
  
  // Avatar styles
  const getAvatarStyles = () => {
    const sizeMap = getSizeMap();
    const colors = getColorStyles();
    
    return normalizeStyle({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: sizeMap[size].size,
      height: sizeMap[size].size,
      fontSize: sizeMap[size].fontSize,
      fontWeight: 'var(--font-weight-semibold)',
      fontFamily: 'var(--font-family-base)',
      backgroundColor: colors.bg,
      color: colors.text,
      borderRadius: variant === 'circular' ? '50%' : variant === 'rounded' ? 'var(--border-radius-lg)' : 'var(--border-radius-sm)',
      overflow: 'hidden',
      userSelect: 'none',
      position: 'relative',
      cursor: clickable ? 'pointer' : 'default',
      border: theme === 'detailed' ? '2px solid var(--color-border)' : 'none',
      transition: 'all 0.2s ease',
      flexShrink: 0,
      
      // Group behavior
      ...(grouped && overlap && {
        marginLeft: '-8px',
        border: '2px solid var(--color-surface)',
        ':first-child': {
          marginLeft: 0
        }
      }),
      
      // Clickable states
      ...(clickable && {
        ':hover': {
          transform: 'scale(1.05)',
          boxShadow: 'var(--shadow-lg)'
        }
      }),
      
      // Loading state
      ...(loading && {
        backgroundColor: 'var(--color-gray-200)',
        color: 'transparent',
        ':after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation: 'shimmer 1.5s infinite'
        }
      })
    });
  };
  
  // Image styles
  const getImageStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: imageError ? 'none' : 'block'
    });
  };
  
  // Status indicator styles
  const getStatusStyles = () => {
    const statusColors = {
      online: 'var(--color-success)',
      offline: 'var(--color-gray-400)',
      away: 'var(--color-warning)',
      busy: 'var(--color-danger)'
    };
    
    const statusSize = size === 'compact' ? '8px' : size === 'normal' ? '10px' : '12px';
    
    const positionMap = {
      'top-left': { top: '5%', left: '5%' },
      'top-right': { top: '5%', right: '5%' },
      'bottom-left': { bottom: '5%', left: '5%' },
      'bottom-right': { bottom: '5%', right: '5%' }
    };
    
    return normalizeStyle({
      position: 'absolute',
      width: statusSize,
      height: statusSize,
      borderRadius: '50%',
      backgroundColor: statusColors[status],
      border: '2px solid var(--color-surface)',
      ...positionMap[statusPosition]
    });
  };
  
  // Default icon
  const UserIcon = () => (
    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );
  
  // Determine what to display
  const showImage = src && !imageError;
  const showInitials = !showImage && getInitials();
  const showIcon = !showImage && !showInitials;
  
  return (
    <div
      ref={ref}
      className={`vistara-avatar vistara-avatar--${variant} vistara-avatar--${size} ${className || ''}`}
      style={{ ...getAvatarStyles(), ...style }}
      onClick={onClick}
      {...props}
    >
      {/* Image */}
      {src && (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          style={getImageStyles()}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {/* Initials */}
      {showInitials && (
        <span>{showInitials}</span>
      )}
      
      {/* Icon */}
      {showIcon && (
        <span>
          {icon || <UserIcon />}
        </span>
      )}
      
      {/* Status indicator */}
      {showStatus && status && (
        <div style={getStatusStyles()} />
      )}
      
      {/* Loading animation */}
      {loading && (
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;