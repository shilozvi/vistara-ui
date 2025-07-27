/**
 * 🎯 Vistara UI - FileUploader Component
 * "Command your Design."
 * 
 * רכיב העלאת קבצים מתקדם עם גרירה ושחרור
 */

import React, { forwardRef, useState, useRef } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const FileUploader = forwardRef(({ 
  // Behavior
  multiple = false,
  disabled = false,
  
  // File constraints
  accept, // e.g., 'image/*', '.pdf,.doc,.docx'
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded', 'large'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'dashed', 'outlined', 'filled'
  
  // Display options
  showPreview = true,
  showProgress = true,
  showFileList = true,
  
  // Content customization
  placeholder = 'Drop files here or click to browse',
  browseText = 'Browse Files',
  dropText = 'Drop files here',
  
  // Validation messages
  invalidTypeText = 'Invalid file type',
  fileTooLargeText = 'File too large',
  tooManyFilesText = 'Too many files',
  
  // Upload behavior
  autoUpload = false,
  uploadUrl,
  uploadHeaders = {},
  
  // Callbacks
  onChange,
  onUpload,
  onProgress,
  onError,
  onSuccess,
  onRemove,
  
  // Standard props
  id,
  name,
  className,
  style,
  ...props
}, ref) => {
  
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Validate file
  const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(acceptedType => {
        if (acceptedType.startsWith('.')) {
          return file.name.toLowerCase().endsWith(acceptedType.toLowerCase());
        } else if (acceptedType.includes('*')) {
          const baseType = acceptedType.split('/')[0];
          return file.type.startsWith(baseType);
        } else {
          return file.type === acceptedType;
        }
      });
      
      if (!isValidType) {
        errors.push(invalidTypeText);
      }
    }
    
    // Check file size
    if (file.size > maxFileSize) {
      errors.push(`${fileTooLargeText} (max: ${formatFileSize(maxFileSize)})`);
    }
    
    return errors;
  };
  
  // Process files
  const processFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    
    // Check max files limit
    if (!multiple && newFiles.length > 1) {
      onError?.(['Only one file allowed']);
      return;
    }
    
    if (files.length + newFiles.length > maxFiles) {
      onError?.([`${tooManyFilesText} (max: ${maxFiles})`]);
      return;
    }
    
    // Validate and process each file
    const validFiles = [];
    const errors = [];
    
    newFiles.forEach((file, index) => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        const fileObject = {
          id: Date.now() + index,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: null,
          status: 'pending' // 'pending', 'uploading', 'success', 'error'
        };
        
        // Generate preview for images
        if (showPreview && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            fileObject.preview = e.target.result;
            setFiles(prev => prev.map(f => f.id === fileObject.id ? fileObject : f));
          };
          reader.readAsDataURL(file);
        }
        
        validFiles.push(fileObject);
      } else {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      }
    });
    
    if (errors.length > 0) {
      onError?.(errors);
    }
    
    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      onChange?.(updatedFiles);
      
      if (autoUpload && uploadUrl) {
        validFiles.forEach(fileObj => uploadFile(fileObj));
      }
    }
  };
  
  // Upload file
  const uploadFile = async (fileObject) => {
    if (!uploadUrl) return;
    
    setFiles(prev => prev.map(f => 
      f.id === fileObject.id ? { ...f, status: 'uploading' } : f
    ));
    
    const formData = new FormData();
    formData.append('file', fileObject.file);
    
    try {
      const xhr = new XMLHttpRequest();
      
      // Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(prev => ({ ...prev, [fileObject.id]: progress }));
          onProgress?.(fileObject, progress);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          setFiles(prev => prev.map(f => 
            f.id === fileObject.id ? { ...f, status: 'success' } : f
          ));
          onSuccess?.(fileObject, xhr.response);
        } else {
          throw new Error(`Upload failed: ${xhr.statusText}`);
        }
      };
      
      xhr.onerror = () => {
        throw new Error('Upload failed');
      };
      
      xhr.open('POST', uploadUrl);
      
      // Add headers
      Object.entries(uploadHeaders).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      
      xhr.send(formData);
      
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileObject.id ? { ...f, status: 'error' } : f
      ));
      onError?.([`Upload failed for ${fileObject.name}: ${error.message}`]);
    }
  };
  
  // Remove file
  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
    onRemove?.(fileId);
    
    // Clean up progress
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!disabled) {
      const droppedFiles = e.dataTransfer.files;
      processFiles(droppedFiles);
    }
  };
  
  // Handle file input change
  const handleFileSelect = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input value
    e.target.value = '';
  };
  
  // Drop zone styles
  const getDropZoneStyles = () => {
    const sizeMap = {
      compact: {
        padding: 'var(--space-4)',
        minHeight: '80px'
      },
      normal: {
        padding: 'var(--space-6)',
        minHeight: '120px'
      },
      expanded: {
        padding: 'var(--space-8)',
        minHeight: '160px'
      },
      large: {
        padding: 'var(--space-10)',
        minHeight: '200px'
      }
    };
    
    return normalizeStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-family-base)',
      borderRadius: 'var(--border-radius-lg)',
      transition: 'all 0.2s ease',
      cursor: disabled ? 'not-allowed' : 'pointer',
      position: 'relative',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'default' && {
        border: `2px solid ${isDragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: isDragOver ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'
      }),
      
      ...(variant === 'dashed' && {
        border: `2px dashed ${isDragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: isDragOver ? 'var(--color-primary-light)' : 'transparent'
      }),
      
      ...(variant === 'outlined' && {
        border: `2px solid ${isDragOver ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: 'var(--color-surface)'
      }),
      
      ...(variant === 'filled' && {
        border: 'none',
        backgroundColor: isDragOver ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'
      }),
      
      // States
      ...(disabled && {
        opacity: 0.5,
        cursor: 'not-allowed'
      }),
      
      // Theme variations
      ...(theme === 'detailed' && {
        boxShadow: isDragOver ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
      })
    });
  };
  
  // File item styles
  const getFileItemStyles = (file) => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      padding: 'var(--space-3)',
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      marginBottom: 'var(--space-2)',
      
      ...(file.status === 'error' && {
        borderColor: 'var(--color-danger)',
        backgroundColor: 'var(--color-danger-light)'
      }),
      
      ...(file.status === 'success' && {
        borderColor: 'var(--color-success)',
        backgroundColor: 'var(--color-success-light)'
      })
    });
  };
  
  // Progress bar styles
  const getProgressBarStyles = (progress) => {
    return normalizeStyle({
      width: '100%',
      height: '4px',
      backgroundColor: 'var(--color-background-secondary)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: 'var(--space-1)'
    });
  };
  
  const getProgressFillStyles = (progress) => {
    return normalizeStyle({
      height: '100%',
      width: `${progress}%`,
      backgroundColor: 'var(--color-primary)',
      transition: 'width 0.3s ease'
    });
  };
  
  // Icons
  const UploadIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2"/>
      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2"/>
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const FileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
      <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const RemoveIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  return (
    <div
      className={`vistara-file-uploader vistara-file-uploader--${variant} vistara-file-uploader--${size} ${className || ''}`}
      style={{ ...normalizeStyle({ fontFamily: 'var(--font-family-base)' }), ...style }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        name={name}
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        {...props}
      />
      
      {/* Drop zone */}
      <div
        ref={dropZoneRef}
        style={getDropZoneStyles()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div style={{ 
          color: isDragOver ? 'var(--color-primary)' : 'var(--color-text-muted)',
          marginBottom: 'var(--space-2)'
        }}>
          <UploadIcon />
        </div>
        
        <div style={normalizeStyle({
          textAlign: 'center',
          color: isDragOver ? 'var(--color-primary)' : 'var(--color-text-primary)'
        })}>
          <div style={{ 
            fontSize: 'var(--font-size-base)',
            fontWeight: 'var(--font-weight-medium)',
            marginBottom: 'var(--space-1)'
          }}>
            {isDragOver ? dropText : placeholder}
          </div>
          
          <div style={{ 
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)'
          }}>
            {browseText} • Max {formatFileSize(maxFileSize)}
            {accept && ` • ${accept}`}
          </div>
        </div>
      </div>
      
      {/* File list */}
      {showFileList && files.length > 0 && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          {files.map((file) => (
            <div key={file.id} style={getFileItemStyles(file)}>
              {/* File preview/icon */}
              <div style={{ marginRight: 'var(--space-3)', flexShrink: 0 }}>
                {file.preview ? (
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    style={normalizeStyle({
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: 'var(--border-radius-sm)'
                    })}
                  />
                ) : (
                  <div style={{ color: 'var(--color-text-muted)' }}>
                    <FileIcon />
                  </div>
                )}
              </div>
              
              {/* File info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={normalizeStyle({
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                })}>
                  {file.name}
                </div>
                
                <div style={normalizeStyle({
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  marginBottom: file.status === 'uploading' ? 'var(--space-1)' : 0
                })}>
                  {formatFileSize(file.size)}
                  {file.status === 'uploading' && uploadProgress[file.id] && 
                    ` • ${uploadProgress[file.id]}%`
                  }
                </div>
                
                {/* Progress bar */}
                {showProgress && file.status === 'uploading' && uploadProgress[file.id] && (
                  <div style={getProgressBarStyles()}>
                    <div style={getProgressFillStyles(uploadProgress[file.id])} />
                  </div>
                )}
              </div>
              
              {/* Status indicator */}
              <div style={{ marginLeft: 'var(--space-2)', color: 
                file.status === 'success' ? 'var(--color-success)' :
                file.status === 'error' ? 'var(--color-danger)' :
                'var(--color-text-muted)'
              }}>
                {file.status === 'success' && <CheckIcon />}
                {file.status !== 'uploading' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    style={normalizeStyle({
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 'var(--space-1)',
                      color: 'inherit'
                    })}
                  >
                    <RemoveIcon />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

FileUploader.displayName = 'FileUploader';

export default FileUploader;