/**
 * 🎯 Vistara UI - AudioPlayer Component
 * "Command your Design."
 * 
 * נגן אודיו מתקדם עם ויזואליזציה וקונטרולים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const AudioPlayer = forwardRef(({ 
  // Audio sources
  src,
  sources = [], // [{ src, type }]
  
  // Track info
  title,
  artist,
  album,
  artwork,
  
  // Behavior
  autoplay = false,
  loop = false,
  muted = false,
  preload = 'metadata',
  
  // Playback
  playbackRate = 1,
  volume = 1,
  currentTime = 0,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'card', 'inline', 'mini'
  
  // Features
  showWaveform = false,
  showProgress = true,
  showVolume = true,
  showPlaybackRate = false,
  showArtwork = true,
  showTrackInfo = true,
  showTimeRemaining = false,
  
  // Playlist
  playlist = [],
  currentTrack = 0,
  showPlaylist = false,
  
  // Callbacks
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  onTrackChange,
  onError,
  onLoadedData,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(currentTime);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRate, setCurrentRate] = useState(playbackRate);
  const [waveformData, setWaveformData] = useState([]);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  
  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get current track data
  const getCurrentTrack = () => {
    if (playlist.length > 0) {
      return playlist[currentTrack] || {};
    }
    return { title, artist, album, artwork, src };
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };
  
  // Handle play
  const handlePlay = () => {
    setIsPlaying(true);
    onPlay?.();
    
    // Start waveform visualization
    if (showWaveform && !audioContextRef.current) {
      initializeAudioContext();
    }
  };
  
  // Handle pause
  const handlePause = () => {
    setIsPlaying(false);
    onPause?.();
  };
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    const time = audioRef.current.currentTime;
    setCurrentAudioTime(time);
    onTimeUpdate?.(time);
  };
  
  // Handle loaded data
  const handleLoadedData = () => {
    if (!audioRef.current) return;
    
    setDuration(audioRef.current.duration);
    setIsLoading(false);
    onLoadedData?.();
  };
  
  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = newVolume;
    setCurrentVolume(newVolume);
    setIsMuted(newVolume === 0);
    onVolumeChange?.(newVolume);
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
    
    if (newMuted) {
      audioRef.current.volume = 0;
      setCurrentVolume(0);
    } else {
      audioRef.current.volume = currentVolume || 0.5;
      setCurrentVolume(currentVolume || 0.5);
    }
  };
  
  // Handle progress change
  const handleProgressChange = (e) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentAudioTime(newTime);
  };
  
  // Handle playback rate change
  const handlePlaybackRateChange = (rate) => {
    if (!audioRef.current) return;
    
    audioRef.current.playbackRate = rate;
    setCurrentRate(rate);
  };
  
  // Next track
  const nextTrack = () => {
    if (playlist.length === 0) return;
    
    const newTrack = (currentTrack + 1) % playlist.length;
    onTrackChange?.(newTrack);
  };
  
  // Previous track
  const previousTrack = () => {
    if (playlist.length === 0) return;
    
    const newTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    onTrackChange?.(newTrack);
  };
  
  // Initialize audio context for waveform
  const initializeAudioContext = () => {
    if (!audioRef.current || audioContextRef.current) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);
      
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      analyser.fftSize = 256;
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      drawWaveform();
    } catch (error) {
      console.warn('Audio visualization not supported', error);
    }
  };
  
  // Draw waveform
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!isPlaying) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;
        
        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;
        
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
      
      requestAnimationFrame(draw);
    };
    
    draw();
  };
  
  // Container styles
  const getContainerStyles = () => {
    const sizeMap = {
      compact: { padding: 'var(--space-2)' },
      normal: { padding: 'var(--space-3)' },
      expanded: { padding: 'var(--space-4)' }
    };
    
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-lg)',
      overflow: 'hidden',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'card' && {
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }),
      
      ...(variant === 'inline' && {
        backgroundColor: 'transparent',
        border: 'none',
        padding: 'var(--space-2) 0'
      }),
      
      ...(variant === 'mini' && {
        backgroundColor: 'var(--color-background-secondary)',
        padding: 'var(--space-2)',
        borderRadius: 'var(--border-radius-md)'
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      })
    });
  };
  
  // Track info styles
  const getTrackInfoStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginBottom: variant === 'mini' ? 'var(--space-1)' : 'var(--space-2)'
    });
  };
  
  // Artwork styles
  const getArtworkStyles = () => {
    const sizeMap = {
      compact: { width: '40px', height: '40px' },
      normal: { width: '60px', height: '60px' },
      expanded: { width: '80px', height: '80px' }
    };
    
    return normalizeStyle({
      borderRadius: 'var(--border-radius-md)',
      overflow: 'hidden',
      flexShrink: 0,
      backgroundColor: 'var(--color-background-secondary)',
      
      ...sizeMap[size],
      
      ...(variant === 'mini' && {
        width: '32px',
        height: '32px'
      })
    });
  };
  
  // Controls styles
  const getControlsStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      marginBottom: variant === 'mini' ? 0 : 'var(--space-2)'
    });
  };
  
  // Control button styles
  const getControlButtonStyles = (isPrimary = false) => {
    const baseSize = variant === 'mini' ? '32px' : '40px';
    const primarySize = variant === 'mini' ? '36px' : '48px';
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isPrimary ? primarySize : baseSize,
      height: isPrimary ? primarySize : baseSize,
      backgroundColor: isPrimary ? 'var(--color-primary)' : 'transparent',
      border: isPrimary ? 'none' : '1px solid var(--color-border)',
      borderRadius: '50%',
      color: isPrimary ? 'var(--color-primary-contrast)' : 'var(--color-text-primary)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      
      ':hover': {
        backgroundColor: isPrimary ? 'var(--color-primary-dark)' : 'var(--color-background-secondary)',
        transform: 'scale(1.05)'
      }
    });
  };
  
  // Progress area styles
  const getProgressAreaStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      marginBottom: variant === 'mini' ? 0 : 'var(--space-2)'
    });
  };
  
  // Progress bar styles
  const getProgressBarStyles = () => {
    return normalizeStyle({
      flex: 1,
      height: '4px',
      backgroundColor: 'var(--color-background-secondary)',
      borderRadius: '2px',
      cursor: 'pointer',
      position: 'relative'
    });
  };
  
  // Progress fill styles
  const getProgressFillStyles = () => {
    const progress = duration > 0 ? (currentAudioTime / duration) * 100 : 0;
    
    return normalizeStyle({
      height: '100%',
      backgroundColor: 'var(--color-primary)',
      borderRadius: '2px',
      width: `${progress}%`,
      transition: 'width 0.1s ease'
    });
  };
  
  // Time styles
  const getTimeStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-xs)',
      color: 'var(--color-text-muted)',
      minWidth: '40px',
      textAlign: 'center'
    });
  };
  
  // Volume area styles
  const getVolumeAreaStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    });
  };
  
  // Waveform styles
  const getWaveformStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: '60px',
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: 'var(--border-radius-sm)',
      marginBottom: 'var(--space-2)'
    });
  };
  
  // Icons
  const PlayIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    </svg>
  );
  
  const PauseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
      <rect x="14" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    </svg>
  );
  
  const SkipPrevIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polygon points="19 20 9 12 19 4 19 20" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
      <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const SkipNextIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polygon points="5 4 15 12 5 20 5 4" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
      <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const VolumeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke="currentColor" strokeWidth="2"/>
      {!isMuted && (
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2"/>
      )}
    </svg>
  );
  
  const MusicIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2"/>
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const trackData = getCurrentTrack();
  
  return (
    <div
      className={`vistara-audio-player vistara-audio-player--${variant} vistara-audio-player--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={trackData.src || src}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        preload={preload}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={() => {
          if (playlist.length > 0) {
            nextTrack();
          }
          onEnded?.();
        }}
        onError={(e) => onError?.(e)}
      >
        {sources.map((source, index) => (
          <source key={index} src={source.src} type={source.type} />
        ))}
      </audio>
      
      {/* Track Info */}
      {showTrackInfo && variant !== 'mini' && (
        <div style={getTrackInfoStyles()}>
          {showArtwork && (
            <div style={getArtworkStyles()}>
              {trackData.artwork ? (
                <img 
                  src={trackData.artwork} 
                  alt={`${trackData.title} artwork`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)'
                }}>
                  <MusicIcon />
                </div>
              )}
            </div>
          )}
          
          <div style={{ flex: 1, minWidth: 0 }}>
            {trackData.title && (
              <div style={normalizeStyle({
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-1)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              })}>
                {trackData.title}
              </div>
            )}
            
            {trackData.artist && (
              <div style={normalizeStyle({
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              })}>
                {trackData.artist}
                {trackData.album && ` • ${trackData.album}`}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Waveform */}
      {showWaveform && variant !== 'mini' && (
        <canvas
          ref={canvasRef}
          style={getWaveformStyles()}
          width="300"
          height="60"
        />
      )}
      
      {/* Progress */}
      {showProgress && (
        <div style={getProgressAreaStyles()}>
          <div style={getTimeStyles()}>
            {formatTime(currentAudioTime)}
          </div>
          
          <div
            ref={progressRef}
            style={getProgressBarStyles()}
            onClick={handleProgressChange}
          >
            <div style={getProgressFillStyles()} />
          </div>
          
          <div style={getTimeStyles()}>
            {showTimeRemaining 
              ? `-${formatTime(duration - currentAudioTime)}`
              : formatTime(duration)
            }
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div style={getControlsStyles()}>
        {/* Previous */}
        {playlist.length > 0 && (
          <button
            style={getControlButtonStyles()}
            onClick={previousTrack}
            title="Previous track"
          >
            <SkipPrevIcon />
          </button>
        )}
        
        {/* Play/Pause */}
        <button
          style={getControlButtonStyles(true)}
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          disabled={isLoading}
        >
          {isLoading ? '...' : (isPlaying ? <PauseIcon /> : <PlayIcon />)}
        </button>
        
        {/* Next */}
        {playlist.length > 0 && (
          <button
            style={getControlButtonStyles()}
            onClick={nextTrack}
            title="Next track"
          >
            <SkipNextIcon />
          </button>
        )}
        
        {/* Spacer */}
        <div style={{ flex: 1 }} />
        
        {/* Playback Rate */}
        {showPlaybackRate && variant !== 'mini' && (
          <select
            value={currentRate}
            onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
            style={normalizeStyle({
              padding: 'var(--space-1)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: 'var(--font-size-xs)',
              backgroundColor: 'var(--color-surface)'
            })}
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        )}
        
        {/* Volume */}
        {showVolume && variant !== 'mini' && (
          <div style={getVolumeAreaStyles()}>
            <button
              style={getControlButtonStyles()}
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <VolumeIcon />
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={currentVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              style={normalizeStyle({
                width: '60px'
              })}
            />
          </div>
        )}
      </div>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;