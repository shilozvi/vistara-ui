/**
 * 🎯 Vistara UI - VideoPlayer Component
 * "Command your Design."
 * 
 * נגן וידאו מתקדם עם בקרות מלאות ותמיכה בפורמטים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const VideoPlayer = forwardRef(({ 
  // Video sources
  src,
  sources = [], // [{ src, type, quality }]
  poster,
  
  // Behavior
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  preload = 'metadata', // 'none', 'metadata', 'auto'
  
  // Playback
  playbackRate = 1,
  volume = 1,
  currentTime = 0,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded', 'fullwidth'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'theater', 'embedded'
  
  // Features
  showProgress = true,
  showVolume = true,
  showFullscreen = true,
  showPictureInPicture = true,
  showPlaybackRate = true,
  showQuality = false,
  showThumbnails = false,
  
  // Accessibility
  title,
  description,
  
  // Callbacks
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  onFullscreen,
  onError,
  onLoadedData,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(currentTime);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRate, setCurrentRate] = useState(playbackRate);
  const [currentQuality, setCurrentQuality] = useState(0);
  
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const progressRef = useRef(null);
  
  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };
  
  // Handle play
  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
  };
  
  // Handle pause
  const handlePause = () => {
    setIsPlaying(false);
    onPause?.();
  };
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const time = videoRef.current.currentTime;
    setCurrentVideoTime(time);
    onTimeUpdate?.(time);
  };
  
  // Handle loaded data
  const handleLoadedData = () => {
    if (!videoRef.current) return;
    
    setDuration(videoRef.current.duration);
    setIsLoading(false);
    onLoadedData?.();
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    if (!videoRef.current) return;
    
    videoRef.current.volume = newVolume;
    setCurrentVolume(newVolume);
    setIsMuted(newVolume === 0);
    onVolumeChange?.(newVolume);
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    
    if (newMuted) {
      videoRef.current.volume = 0;
      setCurrentVolume(0);
    } else {
      videoRef.current.volume = currentVolume || 0.5;
      setCurrentVolume(currentVolume || 0.5);
    }
  };
  
  // Handle progress change
  const handleProgressChange = (e) => {
    if (!videoRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentVideoTime(newTime);
  };
  
  // Handle playback rate change
  const handlePlaybackRateChange = (rate) => {
    if (!videoRef.current) return;
    
    videoRef.current.playbackRate = rate;
    setCurrentRate(rate);
  };
  
  // Handle quality change
  const handleQualityChange = (qualityIndex) => {
    if (!sources[qualityIndex] || !videoRef.current) return;
    
    const currentTime = videoRef.current.currentTime;
    const wasPlaying = isPlaying;
    
    videoRef.current.src = sources[qualityIndex].src;
    videoRef.current.currentTime = currentTime;
    setCurrentQuality(qualityIndex);
    
    if (wasPlaying) {
      videoRef.current.play();
    }
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
      onFullscreen?.(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
      onFullscreen?.(false);
    }
  };
  
  // Picture in Picture
  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.warn('Picture-in-Picture not supported', error);
    }
  };
  
  // Handle mouse movement for controls
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  // Container styles
  const getContainerStyles = () => {
    const sizeMap = {
      compact: { maxWidth: '400px' },
      normal: { maxWidth: '640px' },
      expanded: { maxWidth: '800px' },
      fullwidth: { width: '100%' }
    };
    
    return normalizeStyle({
      position: 'relative',
      fontFamily: 'var(--font-family-base)',
      backgroundColor: '#000',
      borderRadius: variant === 'embedded' ? 'var(--border-radius-lg)' : 0,
      overflow: 'hidden',
      
      ...sizeMap[size],
      
      // Aspect ratio
      aspectRatio: '16/9',
      
      // Theme variations
      ...(theme === 'detailed' && {
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)'
      }),
      
      // Variant styles
      ...(variant === 'theater' && {
        backgroundColor: '#000',
        borderRadius: 0
      })
    });
  };
  
  // Video styles
  const getVideoStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    });
  };
  
  // Controls overlay styles
  const getControlsOverlayStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
      padding: 'var(--space-4)',
      opacity: showControls ? 1 : 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: showControls ? 'auto' : 'none'
    });
  };
  
  // Progress bar styles
  const getProgressBarStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: '4px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '2px',
      cursor: 'pointer',
      marginBottom: 'var(--space-3)',
      position: 'relative'
    });
  };
  
  // Progress fill styles
  const getProgressFillStyles = () => {
    const progress = duration > 0 ? (currentVideoTime / duration) * 100 : 0;
    
    return normalizeStyle({
      height: '100%',
      backgroundColor: 'var(--color-primary)',
      borderRadius: '2px',
      width: `${progress}%`,
      transition: 'width 0.1s ease'
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
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: 'var(--border-radius-md)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      
      ':hover': {
        backgroundColor: 'rgba(255,255,255,0.2)'
      }
    });
  };
  
  // Volume slider styles
  const getVolumeSliderStyles = () => {
    return normalizeStyle({
      width: '80px',
      height: '4px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '2px',
      cursor: 'pointer',
      position: 'relative'
    });
  };
  
  // Volume fill styles
  const getVolumeFillStyles = () => {
    return normalizeStyle({
      height: '100%',
      backgroundColor: 'white',
      borderRadius: '2px',
      width: `${currentVolume * 100}%`
    });
  };
  
  // Time display styles
  const getTimeDisplayStyles = () => {
    return normalizeStyle({
      color: 'white',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      minWidth: '80px',
      textAlign: 'center'
    });
  };
  
  // Loading overlay styles
  const getLoadingOverlayStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      fontSize: 'var(--font-size-base)',
      opacity: isLoading ? 1 : 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: isLoading ? 'auto' : 'none'
    });
  };
  
  // Icons
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
  
  const VolumeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
      {!isMuted && (
        <>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2"/>
        </>
      )}
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
  
  const PipIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
      <rect x="8" y="8" width="8" height="6" rx="1" ry="1" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    </svg>
  );
  
  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
  
  return (
    <div
      ref={containerRef}
      className={`vistara-video-player vistara-video-player--${variant} vistara-video-player--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      {...props}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        style={getVideoStyles()}
        poster={poster}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        preload={preload}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={() => onEnded?.()}
        onError={(e) => onError?.(e)}
        onClick={togglePlay}
      >
        {/* Video sources */}
        {sources.length > 0 ? (
          sources.map((source, index) => (
            <source key={index} src={source.src} type={source.type} />
          ))
        ) : src && (
          <source src={src} />
        )}
      </video>
      
      {/* Loading Overlay */}
      <div style={getLoadingOverlayStyles()}>
        Loading...
      </div>
      
      {/* Controls */}
      {controls && (
        <div style={getControlsOverlayStyles()}>
          {/* Progress Bar */}
          {showProgress && (
            <div
              ref={progressRef}
              style={getProgressBarStyles()}
              onClick={handleProgressChange}
            >
              <div style={getProgressFillStyles()} />
            </div>
          )}
          
          {/* Control Bar */}
          <div style={normalizeStyle({
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          })}>
            {/* Play/Pause */}
            <button
              style={getControlButtonStyles()}
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            
            {/* Volume */}
            {showVolume && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <button
                  style={getControlButtonStyles()}
                  onClick={toggleMute}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <VolumeIcon />
                </button>
                
                <div
                  style={getVolumeSliderStyles()}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    handleVolumeChange(Math.max(0, Math.min(1, percent)));
                  }}
                >
                  <div style={getVolumeFillStyles()} />
                </div>
              </div>
            )}
            
            {/* Time Display */}
            <div style={getTimeDisplayStyles()}>
              {formatTime(currentVideoTime)} / {formatTime(duration)}
            </div>
            
            {/* Spacer */}
            <div style={{ flex: 1 }} />
            
            {/* Playback Rate */}
            {showPlaybackRate && (
              <select
                value={currentRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                style={normalizeStyle({
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: 'var(--space-1)',
                  fontSize: 'var(--font-size-xs)'
                })}
              >
                {playbackRates.map(rate => (
                  <option key={rate} value={rate} style={{ color: 'black' }}>
                    {rate}x
                  </option>
                ))}
              </select>
            )}
            
            {/* Quality */}
            {showQuality && sources.length > 1 && (
              <select
                value={currentQuality}
                onChange={(e) => handleQualityChange(parseInt(e.target.value))}
                style={normalizeStyle({
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: 'var(--space-1)',
                  fontSize: 'var(--font-size-xs)'
                })}
              >
                {sources.map((source, index) => (
                  <option key={index} value={index} style={{ color: 'black' }}>
                    {source.quality || `Quality ${index + 1}`}
                  </option>
                ))}
              </select>
            )}
            
            {/* Picture in Picture */}
            {showPictureInPicture && (
              <button
                style={getControlButtonStyles()}
                onClick={togglePictureInPicture}
                title="Picture in Picture"
              >
                <PipIcon />
              </button>
            )}
            
            {/* Fullscreen */}
            {showFullscreen && (
              <button
                style={getControlButtonStyles()}
                onClick={toggleFullscreen}
                title="Fullscreen"
              >
                <FullscreenIcon />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;