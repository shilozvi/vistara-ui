/**
 * 🎯 Vistara UI - CodeEditor Component
 * "Command your Design."
 * 
 * עורך קוד מתקדם עם תחביר צבעוני ותכונות מתקדמות
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const CodeEditor = forwardRef(({
  // Content
  value = '',
  defaultValue = '',
  
  // Language & syntax
  language = 'javascript',
  syntaxHighlighting = true,
  
  // Editor features
  showLineNumbers = true,
  showCopyButton = true,
  showLanguageLabel = true,
  highlightActiveLine = true,
  wrapLines = false,
  
  // Behavior
  readOnly = false,
  tabSize = 2,
  insertSpaces = true,
  autoIndent = true,
  
  // Themes
  theme = 'dark', // 'dark', 'light', 'monokai', 'github'
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  variant = 'default', // 'default', 'minimal', 'embedded'
  
  // Dimensions
  minHeight = 200,
  maxHeight,
  
  // Features
  enableSearch = true,
  enableReplace = false,
  enableMinimap = false,
  
  // Callbacks
  onChange,
  onCopy,
  onKeyDown,
  onFocus,
  onBlur,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [code, setCode] = useState(value || defaultValue || '');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Update code when value changes
  useEffect(() => {
    if (value !== undefined) {
      setCode(value);
    }
  }, [value]);
  
  // Handle code change
  const handleChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    onChange?.(newCode, event);
  };
  
  // Handle key down
  const handleKeyDown = (event) => {
    // Tab handling
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const newCode = code.substring(0, start) + 
                     (insertSpaces ? ' '.repeat(tabSize) : '\t') + 
                     code.substring(end);
      setCode(newCode);
      onChange?.(newCode, event);
      
      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + (insertSpaces ? tabSize : 1);
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
        }
      }, 0);
    }
    
    // Search shortcut (Ctrl/Cmd + F)
    if ((event.ctrlKey || event.metaKey) && event.key === 'f' && enableSearch) {
      event.preventDefault();
      setSearchVisible(!searchVisible);
    }
    
    onKeyDown?.(event);
  };
  
  // Handle copy
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      onCopy?.(code);
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Calculate line numbers
  const lines = code.split('\n');
  const lineCount = lines.length;
  
  // Basic syntax highlighting (simplified)
  const highlightCode = (code, language) => {
    if (!syntaxHighlighting) return code;
    
    // Very basic highlighting for demonstration
    const keywords = {
      javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'default'],
      python: ['def', 'class', 'import', 'from', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'and', 'or', 'not'],
      html: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style'],
      css: ['color', 'background', 'margin', 'padding', 'border', 'font', 'display', 'position', 'width', 'height']
    };
    
    const patterns = [
      // Strings
      { regex: /(['"`])(?:(?!\1)[^\\]|\\.)*?\1/g, className: 'string' },
      // Numbers
      { regex: /\b\d+(\.\d+)?\b/g, className: 'number' },
      // Comments
      { regex: /\/\/.*$/gm, className: 'comment' },
      { regex: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      // Keywords
      {
        regex: new RegExp(`\\b(${(keywords[language] || []).join('|')})\\b`, 'g'),
        className: 'keyword'
      }
    ];
    
    let highlighted = code;
    patterns.forEach(({ regex, className }) => {
      highlighted = highlighted.replace(regex, (match) => 
        `<span class="syntax-${className}">${match}</span>`
      );
    });
    
    return highlighted;
  };
  
  // Theme colors
  const getThemeColors = () => {
    const themes = {
      dark: {
        background: '#1e1e1e',
        color: '#d4d4d4',
        lineNumbers: '#858585',
        activeLine: '#2a2a2a',
        selection: '#264f78',
        keyword: '#569cd6',
        string: '#ce9178',
        number: '#b5cea8',
        comment: '#6a9955'
      },
      light: {
        background: '#ffffff',
        color: '#000000',
        lineNumbers: '#858585',
        activeLine: '#f0f0f0',
        selection: '#add6ff',
        keyword: '#0000ff',
        string: '#a31515',
        number: '#098658',
        comment: '#008000'
      },
      monokai: {
        background: '#272822',
        color: '#f8f8f2',
        lineNumbers: '#90908a',
        activeLine: '#3e3d32',
        selection: '#49483e',
        keyword: '#f92672',
        string: '#e6db74',
        number: '#ae81ff',
        comment: '#75715e'
      },
      github: {
        background: '#f6f8fa',
        color: '#24292e',
        lineNumbers: '#959da5',
        activeLine: '#f6f8fa',
        selection: '#c8e1ff',
        keyword: '#d73a49',
        string: '#032f62',
        number: '#005cc5',
        comment: '#6a737d'
      }
    };
    
    return themes[theme] || themes.dark;
  };
  
  const themeColors = getThemeColors();
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-mono)',
      fontSize: size === 'compact' ? '12px' : size === 'expanded' ? '16px' : '14px',
      backgroundColor: themeColors.background,
      color: themeColors.color,
      borderRadius: 'var(--border-radius-lg)',
      border: variant === 'embedded' ? 'none' : '1px solid var(--color-border)',
      overflow: 'hidden',
      position: 'relative',
      minHeight: `${minHeight}px`,
      maxHeight: maxHeight ? `${maxHeight}px` : 'none'
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 'var(--space-2) var(--space-3)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    });
  };
  
  // Editor wrapper styles
  const getEditorWrapperStyles = () => {
    return normalizeStyle({
      display: 'flex',
      position: 'relative',
      overflow: 'auto',
      maxHeight: maxHeight ? `${maxHeight - 40}px` : 'none'
    });
  };
  
  // Line numbers styles
  const getLineNumbersStyles = () => {
    return normalizeStyle({
      padding: 'var(--space-3)',
      paddingRight: 'var(--space-2)',
      textAlign: 'right',
      userSelect: 'none',
      color: themeColors.lineNumbers,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      minWidth: `${String(lineCount).length + 2}ch`
    });
  };
  
  // Editor content styles
  const getEditorContentStyles = () => {
    return normalizeStyle({
      flex: 1,
      position: 'relative'
    });
  };
  
  // Textarea styles
  const getTextareaStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      padding: 'var(--space-3)',
      margin: 0,
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      color: 'transparent',
      caretColor: themeColors.color,
      fontSize: 'inherit',
      fontFamily: 'inherit',
      lineHeight: 1.5,
      resize: 'none',
      whiteSpace: wrapLines ? 'pre-wrap' : 'pre',
      overflowWrap: wrapLines ? 'break-word' : 'normal'
    });
  };
  
  // Pre styles (for display)
  const getPreStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: 'var(--space-3)',
      margin: 0,
      fontSize: 'inherit',
      fontFamily: 'inherit',
      lineHeight: 1.5,
      whiteSpace: wrapLines ? 'pre-wrap' : 'pre',
      overflowWrap: wrapLines ? 'break-word' : 'normal',
      pointerEvents: 'none',
      
      // Syntax highlighting colors
      '.syntax-keyword': { color: themeColors.keyword },
      '.syntax-string': { color: themeColors.string },
      '.syntax-number': { color: themeColors.number },
      '.syntax-comment': { color: themeColors.comment }
    });
  };
  
  // Copy button styles
  const getCopyButtonStyles = () => {
    return normalizeStyle({
      padding: 'var(--space-1) var(--space-2)',
      backgroundColor: copySuccess ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.1)',
      color: copySuccess ? 'var(--color-success-contrast)' : themeColors.color,
      border: 'none',
      borderRadius: 'var(--border-radius-md)',
      fontSize: 'var(--font-size-sm)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      
      ':hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
      }
    });
  };
  
  // Search box styles
  const getSearchBoxStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: 'var(--space-2)',
      right: 'var(--space-2)',
      backgroundColor: themeColors.background,
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--space-2)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 10,
      display: searchVisible ? 'block' : 'none'
    });
  };
  
  // Style tag for syntax highlighting
  const syntaxStyles = `
    .syntax-keyword { color: ${themeColors.keyword}; }
    .syntax-string { color: ${themeColors.string}; }
    .syntax-number { color: ${themeColors.number}; }
    .syntax-comment { color: ${themeColors.comment}; font-style: italic; }
  `;
  
  return (
    <div
      ref={ref}
      className={`vistara-code-editor vistara-code-editor--${variant} vistara-code-editor--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: syntaxStyles }} />
      
      {/* Header */}
      {(showLanguageLabel || showCopyButton) && (
        <div style={getHeaderStyles()}>
          {showLanguageLabel && (
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              opacity: 0.8
            }}>
              {language.toUpperCase()}
            </div>
          )}
          
          {showCopyButton && (
            <button
              onClick={handleCopy}
              style={getCopyButtonStyles()}
              title="Copy code"
            >
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      )}
      
      {/* Editor */}
      <div style={getEditorWrapperStyles()}>
        {/* Line numbers */}
        {showLineNumbers && (
          <div style={getLineNumbersStyles()}>
            {lines.map((_, index) => (
              <div key={index} style={{ lineHeight: 1.5 }}>
                {index + 1}
              </div>
            ))}
          </div>
        )}
        
        {/* Editor content */}
        <div style={getEditorContentStyles()}>
          {/* Textarea for input */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            style={getTextareaStyles()}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          
          {/* Pre for display with syntax highlighting */}
          <pre
            style={getPreStyles()}
            dangerouslySetInnerHTML={{
              __html: highlightCode(code, language)
            }}
          />
        </div>
      </div>
      
      {/* Search box */}
      {enableSearch && (
        <div style={getSearchBoxStyles()}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: themeColors.background,
              color: themeColors.color,
              fontSize: 'var(--font-size-sm)',
              outline: 'none'
            }}
          />
        </div>
      )}
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;