/**
 * 🎯 Vistara UI - CommandPalette Component
 * "Command your Design."
 * 
 * פלט פקודות מתקדם עם חיפוש מהיר ושורטקוטים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const CommandPalette = forwardRef(({ 
  // Visibility
  open = false,
  onClose,
  
  // Commands
  commands = [], // [{ id, label, description?, icon?, keywords?, action, shortcut?, group? }]
  
  // Search
  searchPlaceholder = 'Search commands...',
  showShortcuts = true,
  fuzzySearch = true,
  
  // Groups
  groupBy = 'group', // 'group', 'none'
  showGroupLabels = true,
  
  // Recent commands
  showRecent = true,
  maxRecent = 5,
  recentCommands = [],
  onRecentUpdate,
  
  // Keyboard navigation
  enableKeyboardNavigation = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern'
  variant = 'default', // 'default', 'floating', 'fullscreen'
  
  // Positioning
  width = 600,
  maxHeight = 400,
  
  // Callbacks
  onCommandExecute,
  onSearchChange,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);
  
  // Filter and sort commands
  useEffect(() => {
    let filtered = [...commands];
    
    if (searchTerm) {
      if (fuzzySearch) {
        filtered = filtered.filter(cmd => 
          fuzzyMatch(searchTerm.toLowerCase(), cmd.label.toLowerCase()) ||
          fuzzyMatch(searchTerm.toLowerCase(), cmd.description?.toLowerCase() || '') ||
          cmd.keywords?.some(keyword => 
            fuzzyMatch(searchTerm.toLowerCase(), keyword.toLowerCase())
          )
        );
      } else {
        filtered = filtered.filter(cmd => 
          cmd.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.keywords?.some(keyword => 
            keyword.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      
      // Sort by relevance
      filtered.sort((a, b) => {
        const aScore = getRelevanceScore(a, searchTerm);
        const bScore = getRelevanceScore(b, searchTerm);
        return bScore - aScore;
      });
    } else if (showRecent && recentCommands.length > 0) {
      // Show recent commands when no search
      const recentIds = new Set(recentCommands.slice(0, maxRecent));
      const recent = commands.filter(cmd => recentIds.has(cmd.id));
      const others = commands.filter(cmd => !recentIds.has(cmd.id));
      filtered = [...recent, ...others];
    }
    
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [searchTerm, commands, recentCommands, fuzzySearch, showRecent, maxRecent]);
  
  // Focus search input when opened
  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!open || !enableKeyboardNavigation) return;
    
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          onClose?.();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, filteredCommands, enableKeyboardNavigation]);
  
  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);
  
  // Handle outside clicks
  useEffect(() => {
    if (!open) return;
    
    const handleClickOutside = (event) => {
      if (ref?.current && !ref.current.contains(event.target)) {
        onClose?.();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);
  
  // Fuzzy matching algorithm
  const fuzzyMatch = (needle, haystack) => {
    const hlen = haystack.length;
    const nlen = needle.length;
    if (nlen > hlen) return false;
    if (nlen === hlen) return needle === haystack;
    
    outer: for (let i = 0, j = 0; i < nlen; i++) {
      const nch = needle.charCodeAt(i);
      while (j < hlen) {
        if (haystack.charCodeAt(j++) === nch) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  };
  
  // Calculate relevance score
  const getRelevanceScore = (command, term) => {
    const termLower = term.toLowerCase();
    const labelLower = command.label.toLowerCase();
    const descLower = command.description?.toLowerCase() || '';
    
    let score = 0;
    
    // Exact match bonus
    if (labelLower === termLower) score += 100;
    else if (labelLower.startsWith(termLower)) score += 50;
    else if (labelLower.includes(termLower)) score += 25;
    
    // Description match
    if (descLower.includes(termLower)) score += 10;
    
    // Keywords match
    if (command.keywords) {
      command.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(termLower)) score += 15;
      });
    }
    
    return score;
  };
  
  // Execute command
  const executeCommand = (command) => {
    if (command.action) {
      command.action();
    }
    
    // Update recent commands
    if (showRecent && onRecentUpdate) {
      const newRecent = [command.id, ...recentCommands.filter(id => id !== command.id)]
        .slice(0, maxRecent);
      onRecentUpdate(newRecent);
    }
    
    onCommandExecute?.(command);
    onClose?.();
  };
  
  // Handle search change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };
  
  // Group commands
  const getGroupedCommands = () => {
    if (groupBy === 'none' || !showGroupLabels) {
      return [{ label: null, commands: filteredCommands }];
    }
    
    const groups = {};
    filteredCommands.forEach(cmd => {
      const group = cmd.group || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(cmd);
    });
    
    return Object.entries(groups).map(([label, commands]) => ({ label, commands }));
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: variant === 'fullscreen' ? 'flex-start' : 'center',
      justifyContent: 'center',
      padding: variant === 'fullscreen' ? 'var(--space-8) var(--space-4)' : 'var(--space-4)',
      zIndex: 1050,
      opacity: open ? 1 : 0,
      visibility: open ? 'visible' : 'hidden',
      transition: 'opacity 0.2s ease, visibility 0.2s ease'
    });
  };
  
  // Palette styles
  const getPaletteStyles = () => {
    const sizeMap = {
      compact: { width: Math.min(width, 400), maxHeight: Math.min(maxHeight, 300) },
      normal: { width, maxHeight },
      expanded: { width: Math.max(width, 700), maxHeight: Math.max(maxHeight, 500) }
    };
    
    return normalizeStyle({
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-xl)',
      boxShadow: 'var(--shadow-2xl)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
      fontFamily: 'var(--font-family-base)',
      transform: open ? 'scale(1)' : 'scale(0.95)',
      transition: 'transform 0.2s ease',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'floating' && {
        borderRadius: 'var(--border-radius-2xl)',
        border: 'none',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }),
      
      ...(variant === 'fullscreen' && {
        width: '100%',
        maxWidth: '800px',
        maxHeight: '80vh',
        borderRadius: 'var(--border-radius-xl)'
      }),
      
      // Theme variations
      ...(theme === 'modern' && {
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-background-secondary) 100%)',
        backdropFilter: 'blur(20px)'
      })
    });
  };
  
  // Search styles
  const getSearchStyles = () => {
    return normalizeStyle({
      position: 'relative',
      padding: 'var(--space-4)',
      borderBottom: theme !== 'minimal' ? '1px solid var(--color-border)' : 'none'
    });
  };
  
  const getSearchInputStyles = () => {
    return normalizeStyle({
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      paddingLeft: 'var(--space-10)',
      border: theme === 'minimal' ? 'none' : '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      fontSize: 'var(--font-size-base)',
      backgroundColor: theme === 'minimal' ? 'transparent' : 'var(--color-background-secondary)',
      color: 'var(--color-text-primary)',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      
      ':focus': {
        borderColor: 'var(--color-primary)',
        boxShadow: theme !== 'minimal' ? '0 0 0 3px var(--color-primary-light)' : 'none'
      },
      
      '::placeholder': {
        color: 'var(--color-text-muted)'
      }
    });
  };
  
  // List styles
  const getListStyles = () => {
    return normalizeStyle({
      maxHeight: `${maxHeight - 120}px`,
      overflowY: 'auto',
      padding: 'var(--space-2) 0'
    });
  };
  
  // Group header styles
  const getGroupHeaderStyles = () => {
    return normalizeStyle({
      padding: 'var(--space-2) var(--space-4)',
      fontSize: 'var(--font-size-xs)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      backgroundColor: theme === 'modern' ? 'var(--color-background-secondary)' : 'transparent',
      borderBottom: theme === 'modern' ? '1px solid var(--color-border)' : 'none'
    });
  };
  
  // Command item styles
  const getCommandItemStyles = (isSelected, isRecent) => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      padding: 'var(--space-3) var(--space-4)',
      border: 'none',
      outline: 'none',
      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
      color: isSelected ? 'var(--color-primary-dark)' : 'var(--color-text-primary)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      gap: 'var(--space-3)',
      textAlign: 'left',
      
      ':hover': {
        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'
      },
      
      // Recent indicator
      ...(isRecent && {
        borderLeft: '3px solid var(--color-warning)'
      })
    });
  };
  
  // Icon styles
  const getIconStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-lg)',
      flexShrink: 0,
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-text-muted)'
    });
  };
  
  // Shortcut styles
  const getShortcutStyles = () => {
    return normalizeStyle({
      fontSize: 'var(--font-size-xs)',
      color: 'var(--color-text-muted)',
      backgroundColor: 'var(--color-background-secondary)',
      padding: '2px 6px',
      borderRadius: 'var(--border-radius-sm)',
      border: '1px solid var(--color-border)',
      fontFamily: 'var(--font-family-mono)',
      marginLeft: 'auto'
    });
  };
  
  // Format shortcut
  const formatShortcut = (shortcut) => {
    if (!shortcut) return null;
    
    return shortcut.split('+').map(key => {
      const keyMap = {
        'cmd': '⌘',
        'ctrl': 'Ctrl',
        'alt': '⌥',
        'shift': '⇧',
        'enter': '↵',
        'space': 'Space',
        'tab': '⇥',
        'escape': 'Esc'
      };
      
      return keyMap[key.toLowerCase()] || key.toUpperCase();
    }).join(' + ');
  };
  
  // Icons
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  if (!open) return null;
  
  const groupedCommands = getGroupedCommands();
  let commandIndex = 0;
  
  return (
    <div style={getContainerStyles()}>
      <div
        ref={ref}
        className={`vistara-command-palette vistara-command-palette--${variant} vistara-command-palette--${size} ${className || ''}`}
        style={{ ...getPaletteStyles(), ...style }}
        {...props}
      >
        {/* Search Input */}
        <div style={getSearchStyles()}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none'
            }}>
              <SearchIcon />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={getSearchInputStyles()}
            />
          </div>
        </div>
        
        {/* Commands List */}
        <div ref={listRef} style={getListStyles()}>
          {groupedCommands.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Group Header */}
              {group.label && showGroupLabels && (
                <div style={getGroupHeaderStyles()}>
                  {group.label}
                </div>
              )}
              
              {/* Commands */}
              {group.commands.map((command) => {
                const isSelected = commandIndex === selectedIndex;
                const isRecent = showRecent && recentCommands.includes(command.id);
                const currentIndex = commandIndex++;
                
                return (
                  <button
                    key={command.id}
                    style={getCommandItemStyles(isSelected, isRecent)}
                    onClick={() => executeCommand(command)}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                  >
                    {/* Icon or Recent indicator */}
                    <div style={getIconStyles()}>
                      {isRecent && !command.icon ? (
                        <ClockIcon />
                      ) : (
                        command.icon || (
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-primary)'
                          }}>
                            {command.label.charAt(0).toUpperCase()}
                          </div>
                        )
                      )}
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {command.label}
                      </div>
                      {command.description && (
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--color-text-muted)',
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {command.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Shortcut */}
                    {showShortcuts && command.shortcut && (
                      <div style={getShortcutStyles()}>
                        {formatShortcut(command.shortcut)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          
          {/* Empty state */}
          {filteredCommands.length === 0 && (
            <div style={{
              padding: 'var(--space-8) var(--space-4)',
              textAlign: 'center',
              color: 'var(--color-text-muted)'
            }}>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                No commands found
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)' }}>
                Try a different search term
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {enableKeyboardNavigation && (
          <div style={{
            padding: 'var(--space-2) var(--space-4)',
            borderTop: '1px solid var(--color-border)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            display: 'flex',
            gap: 'var(--space-4)'
          }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
        )}
      </div>
    </div>
  );
});

CommandPalette.displayName = 'CommandPalette';

export default CommandPalette;