/**
 * 🎯 Vistara UI - RichTextEditor Component
 * "Command your Design."
 * 
 * עורך טקסט עשיר עם כלי עריכה מתקדמים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const RichTextEditor = forwardRef(({
  // Content
  value = '',
  defaultValue = '',
  placeholder = 'Start typing...',
  
  // Editor features
  toolbar = true,
  toolbarPosition = 'top', // 'top', 'bottom', 'floating'
  toolbarSticky = true,
  
  // Formatting options
  formatting = {
    bold: true,
    italic: true,
    underline: true,
    strikethrough: true,
    headings: true,
    lists: true,
    blockquote: true,
    code: true,
    link: true,
    image: true,
    color: true,
    align: true,
    table: false,
    emoji: true
  },
  
  // Behavior
  readOnly = false,
  autoFocus = false,
  autoSave = false,
  autoSaveDelay = 3000,
  maxLength,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'document'
  variant = 'default', // 'default', 'bordered', 'filled'
  
  // Dimensions
  minHeight = 200,
  maxHeight = 600,
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  onSave,
  onImageUpload,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [content, setContent] = useState(value || defaultValue || '');
  const [selectedText, setSelectedText] = useState('');
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  
  // Update content when value changes
  useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value);
    }
  }, [value]);
  
  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !content) return;
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      onSave?.(content);
    }, autoSaveDelay);
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, autoSave, autoSaveDelay]);
  
  // Word count
  useEffect(() => {
    const text = editorRef.current?.innerText || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);
  
  // Handle content change
  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      if (maxLength && editorRef.current.innerText.length > maxLength) {
        // Prevent further input
        editorRef.current.innerHTML = content;
        return;
      }
      setContent(newContent);
      onChange?.(newContent);
    }
  };
  
  // Execute command
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateActiveFormats();
  };
  
  // Update active formats
  const updateActiveFormats = () => {
    const formats = new Set();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('strikeThrough')) formats.add('strikethrough');
    setActiveFormats(formats);
  };
  
  // Handle format button click
  const handleFormat = (format, value = null) => {
    switch (format) {
      case 'bold':
        execCommand('bold');
        break;
      case 'italic':
        execCommand('italic');
        break;
      case 'underline':
        execCommand('underline');
        break;
      case 'strikethrough':
        execCommand('strikeThrough');
        break;
      case 'heading':
        execCommand('formatBlock', value || 'h2');
        break;
      case 'list-ul':
        execCommand('insertUnorderedList');
        break;
      case 'list-ol':
        execCommand('insertOrderedList');
        break;
      case 'blockquote':
        execCommand('formatBlock', 'blockquote');
        break;
      case 'code':
        execCommand('formatBlock', 'pre');
        break;
      case 'align':
        execCommand('justify' + value);
        break;
      case 'color':
        execCommand('foreColor', value);
        setCurrentColor(value);
        break;
      case 'link':
        setLinkDialogOpen(true);
        break;
      case 'image':
        handleImageInsert();
        break;
      case 'emoji':
        handleEmojiInsert();
        break;
      default:
        break;
    }
  };
  
  // Handle image insert
  const handleImageInsert = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file && onImageUpload) {
        const url = await onImageUpload(file);
        if (url) {
          execCommand('insertImage', url);
        }
      }
    };
    input.click();
  };
  
  // Handle emoji insert
  const handleEmojiInsert = () => {
    const emojis = ['😀', '😍', '🎉', '👍', '❤️', '🔥', '✨', '💯'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    execCommand('insertText', emoji);
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-lg)',
      border: variant === 'bordered' ? '1px solid var(--color-border)' : 'none',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: toolbarPosition === 'bottom' ? 'column-reverse' : 'column',
      
      ...(theme === 'modern' && {
        boxShadow: 'var(--shadow-lg)',
        border: 'none'
      }),
      
      ...(theme === 'document' && {
        backgroundColor: '#f8f8f8',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      })
    });
  };
  
  // Toolbar styles
  const getToolbarStyles = () => {
    return normalizeStyle({
      display: isToolbarVisible ? 'flex' : 'none',
      flexWrap: 'wrap',
      gap: 'var(--space-1)',
      padding: size === 'compact' ? 'var(--space-2)' : 'var(--space-3)',
      backgroundColor: 'var(--color-background-secondary)',
      borderBottom: toolbarPosition === 'top' ? '1px solid var(--color-border)' : 'none',
      borderTop: toolbarPosition === 'bottom' ? '1px solid var(--color-border)' : 'none',
      
      ...(toolbarSticky && toolbarPosition === 'top' && {
        position: 'sticky',
        top: 0,
        zIndex: 10
      }),
      
      ...(theme === 'minimal' && {
        backgroundColor: 'transparent',
        borderBottom: 'none'
      })
    });
  };
  
  // Toolbar button styles
  const getToolbarButtonStyles = (isActive = false) => {
    return normalizeStyle({
      padding: size === 'compact' ? 'var(--space-1)' : 'var(--space-2)',
      backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
      color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
      border: 'none',
      borderRadius: 'var(--border-radius-sm)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: size === 'compact' ? '14px' : '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: size === 'compact' ? '28px' : '36px',
      minHeight: size === 'compact' ? '28px' : '36px',
      
      ':hover': {
        backgroundColor: isActive ? 'var(--color-primary-light)' : 'var(--color-background-tertiary)'
      }
    });
  };
  
  // Editor styles
  const getEditorStyles = () => {
    return normalizeStyle({
      flex: 1,
      minHeight: `${minHeight}px`,
      maxHeight: `${maxHeight}px`,
      overflowY: 'auto',
      padding: size === 'compact' ? 'var(--space-3)' : 'var(--space-4)',
      outline: 'none',
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 
                size === 'expanded' ? 'var(--font-size-lg)' : 'var(--font-size-base)',
      lineHeight: 1.6,
      color: 'var(--color-text-primary)',
      
      ...(theme === 'document' && {
        backgroundColor: 'white',
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 0 20px rgba(0,0,0,0.05)',
        padding: 'var(--space-8)'
      }),
      
      '& p': { margin: '0 0 1em 0' },
      '& h1, & h2, & h3': { margin: '0 0 0.5em 0', fontWeight: 'var(--font-weight-bold)' },
      '& h1': { fontSize: '2em' },
      '& h2': { fontSize: '1.5em' },
      '& h3': { fontSize: '1.17em' },
      '& blockquote': {
        borderLeft: '4px solid var(--color-primary)',
        paddingLeft: 'var(--space-4)',
        marginLeft: 0,
        color: 'var(--color-text-secondary)',
        fontStyle: 'italic'
      },
      '& pre': {
        backgroundColor: 'var(--color-background-secondary)',
        padding: 'var(--space-3)',
        borderRadius: 'var(--border-radius-md)',
        overflowX: 'auto'
      },
      '& code': {
        backgroundColor: 'var(--color-background-secondary)',
        padding: '2px 4px',
        borderRadius: 'var(--border-radius-sm)',
        fontFamily: 'var(--font-family-mono)',
        fontSize: '0.9em'
      },
      '& a': {
        color: 'var(--color-primary)',
        textDecoration: 'underline'
      },
      '& img': {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: 'var(--border-radius-md)'
      }
    });
  };
  
  // Status bar styles
  const getStatusBarStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-2) var(--space-3)',
      backgroundColor: 'var(--color-background-secondary)',
      borderTop: '1px solid var(--color-border)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-muted)'
    });
  };
  
  // Toolbar buttons
  const ToolbarButton = ({ icon, title, format, isActive, onClick }) => (
    <button
      style={getToolbarButtonStyles(isActive)}
      onClick={onClick}
      title={title}
      disabled={readOnly}
    >
      {icon}
    </button>
  );
  
  // Icons
  const BoldIcon = () => <span style={{ fontWeight: 'bold' }}>B</span>;
  const ItalicIcon = () => <span style={{ fontStyle: 'italic' }}>I</span>;
  const UnderlineIcon = () => <span style={{ textDecoration: 'underline' }}>U</span>;
  const StrikeIcon = () => <span style={{ textDecoration: 'line-through' }}>S</span>;
  const LinkIcon = () => <span>🔗</span>;
  const ImageIcon = () => <span>🖼️</span>;
  const EmojiIcon = () => <span>😊</span>;
  
  return (
    <div
      ref={ref}
      className={`vistara-rich-text-editor vistara-rich-text-editor--${variant} vistara-rich-text-editor--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {/* Toolbar */}
      {toolbar && (
        <div ref={toolbarRef} style={getToolbarStyles()}>
          {formatting.bold && (
            <ToolbarButton
              icon={<BoldIcon />}
              title="Bold"
              format="bold"
              isActive={activeFormats.has('bold')}
              onClick={() => handleFormat('bold')}
            />
          )}
          
          {formatting.italic && (
            <ToolbarButton
              icon={<ItalicIcon />}
              title="Italic"
              format="italic"
              isActive={activeFormats.has('italic')}
              onClick={() => handleFormat('italic')}
            />
          )}
          
          {formatting.underline && (
            <ToolbarButton
              icon={<UnderlineIcon />}
              title="Underline"
              format="underline"
              isActive={activeFormats.has('underline')}
              onClick={() => handleFormat('underline')}
            />
          )}
          
          {formatting.strikethrough && (
            <ToolbarButton
              icon={<StrikeIcon />}
              title="Strikethrough"
              format="strikethrough"
              isActive={activeFormats.has('strikethrough')}
              onClick={() => handleFormat('strikethrough')}
            />
          )}
          
          {/* Separator */}
          <div style={{
            width: '1px',
            height: '24px',
            backgroundColor: 'var(--color-border)',
            margin: '0 var(--space-2)'
          }} />
          
          {formatting.link && (
            <ToolbarButton
              icon={<LinkIcon />}
              title="Insert Link"
              onClick={() => handleFormat('link')}
            />
          )}
          
          {formatting.image && (
            <ToolbarButton
              icon={<ImageIcon />}
              title="Insert Image"
              onClick={() => handleFormat('image')}
            />
          )}
          
          {formatting.emoji && (
            <ToolbarButton
              icon={<EmojiIcon />}
              title="Insert Emoji"
              onClick={() => handleFormat('emoji')}
            />
          )}
        </div>
      )}
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!readOnly}
        style={getEditorStyles()}
        onInput={handleInput}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseUp={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        dangerouslySetInnerHTML={{ __html: content }}
        placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      {/* Status Bar */}
      <div style={getStatusBarStyles()}>
        <div>{wordCount} words</div>
        {autoSave && <div>Auto-save enabled</div>}
      </div>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;