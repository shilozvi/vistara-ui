/**
 * 🎯 Vistara UI - ImageGallery Component
 * "Command your Design."
 * 
 * גלריית תמונות מתקדמת עם תצוגת lightbox וניווט
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const ImageGallery = forwardRef(({ 
  // Content
  images = [], // [{ src, alt, title, description, thumbnail }]
  
  // Layout options
  columns = 'auto', // 'auto', number, or object for responsive
  gap = 'normal', // 'compact', 'normal', 'expanded'
  aspectRatio = 'auto', // 'auto', 'square', '16:9', '4:3', '3:2'
  
  // Display options
  showThumbnails = true,
  showCaptions = true,
  showCounter = true,
  showFullscreen = true,
  
  // Behavior
  enableLightbox = true,
  enableZoom = true,
  enableSlideshow = false,
  autoplay = false,
  autoplayInterval = 3000,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded', 'large'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'masonry', 'carousel', 'grid'
  
  // Loading
  loading = 'lazy', // 'lazy', 'eager'
  placeholder,
  
  // Callbacks
  onImageClick,
  onImageLoad,
  onImageError,
  onLightboxOpen,
  onLightboxClose,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [failedImages, setFailedImages] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(autoplay);
  
  const galleryRef = useRef(null);
  const lightboxRef = useRef(null);
  const slideshowRef = useRef(null);
  
  // Handle image click
  const handleImageClick = (index, image) => {
    setCurrentIndex(index);
    onImageClick?.(index, image);
    
    if (enableLightbox) {
      setIsLightboxOpen(true);
      onLightboxOpen?.(index, image);
    }
  };
  
  // Handle lightbox navigation
  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % images.length
      : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          setIsLightboxOpen(false);
          onLightboxClose?.();
          break;
        case 'ArrowLeft':
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          navigateLightbox('next');
          break;
        case ' ':
          e.preventDefault();
          if (enableSlideshow) {
            setIsPlaying(!isPlaying);
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentIndex, isPlaying, enableSlideshow]);
  
  // Handle slideshow
  useEffect(() => {
    if (!isPlaying || !isLightboxOpen || !enableSlideshow) return;
    
    slideshowRef.current = setInterval(() => {
      navigateLightbox('next');
    }, autoplayInterval);
    
    return () => {
      if (slideshowRef.current) {
        clearInterval(slideshowRef.current);
      }
    };
  }, [isPlaying, isLightboxOpen, currentIndex, autoplayInterval, enableSlideshow]);
  
  // Handle image load
  const handleImageLoad = (index, image) => {
    setLoadedImages(prev => new Set([...prev, index]));
    onImageLoad?.(index, image);
  };
  
  // Handle image error
  const handleImageError = (index, image) => {
    setFailedImages(prev => new Set([...prev, index]));
    onImageError?.(index, image);
  };
  
  // Get responsive columns
  const getColumns = () => {
    if (typeof columns === 'number') return columns;
    if (typeof columns === 'object') {
      // Responsive breakpoints
      const width = window.innerWidth;
      if (width < 640 && columns.sm) return columns.sm;
      if (width < 768 && columns.md) return columns.md;
      if (width < 1024 && columns.lg) return columns.lg;
      return columns.xl || columns.lg || columns.md || columns.sm || 3;
    }
    
    // Auto columns based on container width
    const containerWidth = galleryRef.current?.offsetWidth || 1200;
    const minImageWidth = size === 'compact' ? 150 : size === 'expanded' ? 300 : 200;
    return Math.max(1, Math.floor(containerWidth / minImageWidth));
  };
  
  // Gallery container styles
  const getGalleryStyles = () => {
    const gapMap = {
      compact: 'var(--space-2)',
      normal: 'var(--space-3)',
      expanded: 'var(--space-4)'
    };
    
    const cols = getColumns();
    
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      
      ...(variant === 'grid' && {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: gapMap[gap]
      }),
      
      ...(variant === 'masonry' && {
        columnCount: cols,
        columnGap: gapMap[gap],
        columnFill: 'balance'
      }),
      
      ...(variant === 'carousel' && {
        display: 'flex',
        overflowX: 'auto',
        gap: gapMap[gap],
        scrollSnapType: 'x mandatory'
      })
    });
  };
  
  // Image item styles
  const getImageItemStyles = (index) => {
    return normalizeStyle({
      position: 'relative',
      cursor: 'pointer',
      borderRadius: 'var(--border-radius-md)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      
      ...(variant === 'masonry' && {
        breakInside: 'avoid',
        marginBottom: 'var(--space-3)'
      }),
      
      ...(variant === 'carousel' && {
        flexShrink: 0,
        scrollSnapAlign: 'start',
        width: size === 'compact' ? '200px' : size === 'expanded' ? '400px' : '300px'
      }),
      
      // Aspect ratio
      ...(aspectRatio !== 'auto' && variant !== 'masonry' && {
        aspectRatio: aspectRatio === 'square' ? '1/1' : 
                    aspectRatio === '16:9' ? '16/9' :
                    aspectRatio === '4:3' ? '4/3' :
                    aspectRatio === '3:2' ? '3/2' : 'auto'
      }),
      
      // Hover effects
      ':hover': {
        transform: 'scale(1.02)',
        boxShadow: 'var(--shadow-lg)'
      },
      
      // Theme variations
      ...(theme === 'detailed' && {
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      })
    });
  };
  
  // Image styles
  const getImageStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'opacity 0.3s ease',
      backgroundColor: 'var(--color-background-secondary)'
    });
  };
  
  // Image overlay styles
  const getOverlayStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: 'var(--space-3)',
      
      '.vistara-image-item:hover &': {
        opacity: showCaptions ? 1 : 0
      }
    });
  };
  
  // Caption styles
  const getCaptionStyles = () => {
    return normalizeStyle({
      color: 'white',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      marginBottom: 'var(--space-1)'
    });
  };
  
  // Description styles
  const getDescriptionStyles = () => {
    return normalizeStyle({
      color: 'rgba(255,255,255,0.8)',
      fontSize: 'var(--font-size-xs)',
      lineHeight: 1.4
    });
  };
  
  // Lightbox styles
  const getLightboxStyles = () => {
    return normalizeStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isLightboxOpen ? 1 : 0,
      visibility: isLightboxOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease'
    });
  };
  
  // Lightbox image styles
  const getLightboxImageStyles = () => {
    return normalizeStyle({
      maxWidth: '90vw',
      maxHeight: '90vh',
      objectFit: 'contain',
      borderRadius: 'var(--border-radius-lg)'
    });
  };
  
  // Lightbox controls styles
  const getControlsStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: 'var(--space-4)',
      right: 'var(--space-4)',
      display: 'flex',
      gap: 'var(--space-2)'
    });
  };
  
  // Control button styles
  const getControlButtonStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      backgroundColor: 'rgba(255,255,255,0.1)',
      border: 'none',
      borderRadius: 'var(--border-radius-md)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backdropFilter: 'blur(10px)',
      
      ':hover': {
        backgroundColor: 'rgba(255,255,255,0.2)'
      }
    });
  };
  
  // Navigation button styles
  const getNavButtonStyles = (direction) => {
    return normalizeStyle({
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      [direction]: 'var(--space-4)',
      ...getControlButtonStyles()
    });
  };
  
  // Counter styles
  const getCounterStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      bottom: 'var(--space-4)',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      fontSize: 'var(--font-size-sm)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--border-radius-md)',
      backdropFilter: 'blur(10px)'
    });
  };
  
  // Placeholder styles
  const getPlaceholderStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-background-secondary)',
      color: 'var(--color-text-muted)',
      fontSize: 'var(--font-size-sm)'
    });
  };
  
  // Icons
  const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    </svg>
  );
  
  const PauseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
      <rect x="14" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    </svg>
  );
  
  const FullscreenIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2"/>
      <polyline points="9 21 3 21 3 15" stroke="currentColor" strokeWidth="2"/>
      <line x1="21" y1="3" x2="14" y2="10" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="21" x2="10" y2="14" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const currentImage = images[currentIndex];
  
  return (
    <div
      ref={galleryRef}
      className={`vistara-image-gallery vistara-image-gallery--${variant} vistara-image-gallery--${size} ${className || ''}`}
      style={{ ...style }}
      {...props}
    >
      {/* Gallery Grid */}
      <div style={getGalleryStyles()}>
        {images.map((image, index) => (
          <div
            key={index}
            className="vistara-image-item"
            style={getImageItemStyles(index)}
            onClick={() => handleImageClick(index, image)}
          >
            {failedImages.has(index) ? (
              <div style={{ ...getImageStyles(), ...getPlaceholderStyles() }}>
                {placeholder || 'Failed to load'}
              </div>
            ) : (
              <img
                src={showThumbnails && image.thumbnail ? image.thumbnail : image.src}
                alt={image.alt || `Image ${index + 1}`}
                style={getImageStyles()}
                loading={loading}
                onLoad={() => handleImageLoad(index, image)}
                onError={() => handleImageError(index, image)}
              />
            )}
            
            {/* Overlay with caption */}
            {showCaptions && (image.title || image.description) && (
              <div style={getOverlayStyles()}>
                {image.title && (
                  <div style={getCaptionStyles()}>
                    {image.title}
                  </div>
                )}
                {image.description && (
                  <div style={getDescriptionStyles()}>
                    {image.description}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Lightbox */}
      {enableLightbox && (
        <div
          ref={lightboxRef}
          style={getLightboxStyles()}
          onClick={(e) => {
            if (e.target === lightboxRef.current) {
              setIsLightboxOpen(false);
              onLightboxClose?.();
            }
          }}
        >
          {currentImage && (
            <>
              {/* Main Image */}
              <img
                src={currentImage.src}
                alt={currentImage.alt || `Image ${currentIndex + 1}`}
                style={getLightboxImageStyles()}
              />
              
              {/* Controls */}
              <div style={getControlsStyles()}>
                {enableSlideshow && (
                  <button
                    style={getControlButtonStyles()}
                    onClick={() => setIsPlaying(!isPlaying)}
                    title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </button>
                )}
                
                {showFullscreen && (
                  <button
                    style={getControlButtonStyles()}
                    onClick={() => {
                      if (lightboxRef.current?.requestFullscreen) {
                        lightboxRef.current.requestFullscreen();
                      }
                    }}
                    title="Fullscreen"
                  >
                    <FullscreenIcon />
                  </button>
                )}
                
                <button
                  style={getControlButtonStyles()}
                  onClick={() => {
                    setIsLightboxOpen(false);
                    onLightboxClose?.();
                  }}
                  title="Close"
                >
                  <CloseIcon />
                </button>
              </div>
              
              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    style={getNavButtonStyles('left')}
                    onClick={() => navigateLightbox('prev')}
                    title="Previous image"
                  >
                    <ChevronLeft />
                  </button>
                  
                  <button
                    style={getNavButtonStyles('right')}
                    onClick={() => navigateLightbox('next')}
                    title="Next image"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
              
              {/* Counter */}
              {showCounter && images.length > 1 && (
                <div style={getCounterStyles()}>
                  {currentIndex + 1} / {images.length}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
});

ImageGallery.displayName = 'ImageGallery';

export default ImageGallery;