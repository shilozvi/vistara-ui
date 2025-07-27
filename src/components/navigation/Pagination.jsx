/**
 * 🎯 Vistara UI - Pagination Component
 * "Command your Design."
 * 
 * פייג'ינג מתקדם עם אפשרויות מגוונות
 */

import React, { forwardRef, useMemo } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Pagination = forwardRef(({ 
  // Pagination data
  currentPage = 1,
  totalPages = 1,
  totalItems,
  itemsPerPage = 10,
  
  // Display options
  siblingCount = 1, // Number of siblings shown around current page
  boundaryCount = 1, // Number of pages shown at start/end
  showFirstLast = true,
  showPrevNext = true,
  showInfo = true, // Show "Page X of Y" info
  showQuickJumper = false, // Show input to jump to page
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'outlined', // 'filled', 'outlined', 'minimal'
  shape = 'rounded', // 'rounded', 'square', 'circular'
  
  // Behavior
  disabled = false,
  hideOnSinglePage = false,
  
  // Callbacks
  onChange,
  onPageSizeChange,
  
  // Labels (for i18n)
  labels = {
    first: 'First',
    previous: 'Previous',
    next: 'Next',
    last: 'Last',
    page: 'Page',
    of: 'of',
    items: 'items',
    goTo: 'Go to page'
  },
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  // Calculate total pages if not provided
  const calculatedTotalPages = totalPages || (totalItems ? Math.ceil(totalItems / itemsPerPage) : 1);
  
  // Hide if only one page
  if (hideOnSinglePage && calculatedTotalPages <= 1) {
    return null;
  }
  
  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const range = (start, end) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, idx) => start + idx);
    };
    
    // Total page numbers to show (excluding first/last and ellipsis)
    const totalNumbers = siblingCount * 2 + 3; // current + siblings + boundary
    const totalBlocks = totalNumbers + 2; // + 2 for ellipsis
    
    if (calculatedTotalPages <= totalBlocks) {
      return range(1, calculatedTotalPages);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, calculatedTotalPages);
    
    const shouldShowLeftEllipsis = leftSiblingIndex > boundaryCount + 1;
    const shouldShowRightEllipsis = rightSiblingIndex < calculatedTotalPages - boundaryCount;
    
    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = boundaryCount + siblingCount * 2 + 1;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, '...', ...range(calculatedTotalPages - boundaryCount + 1, calculatedTotalPages)];
    }
    
    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount = boundaryCount + siblingCount * 2 + 1;
      const rightRange = range(calculatedTotalPages - rightItemCount + 1, calculatedTotalPages);
      return [...range(1, boundaryCount), '...', ...rightRange];
    }
    
    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [
        ...range(1, boundaryCount),
        '...',
        ...middleRange,
        '...',
        ...range(calculatedTotalPages - boundaryCount + 1, calculatedTotalPages)
      ];
    }
    
    return range(1, calculatedTotalPages);
  }, [currentPage, calculatedTotalPages, siblingCount, boundaryCount]);
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page === currentPage || disabled || page < 1 || page > calculatedTotalPages) {
      return;
    }
    onChange?.(page);
  };
  
  // Icons
  const FirstIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="11 17 6 12 11 7" stroke="currentColor" strokeWidth="2"/>
      <polyline points="18 17 13 12 18 7" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const PrevIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const NextIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const LastIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="13 17 18 12 13 7" stroke="currentColor" strokeWidth="2"/>
      <polyline points="6 17 11 12 6 7" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  // Base styles
  const baseStyles = normalizeStyle({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-family-base)',
    userSelect: 'none'
  });
  
  // Size variants
  const sizeStyles = {
    compact: normalizeStyle({
      fontSize: 'var(--font-size-sm)',
      gap: 'var(--space-1)'
    }),
    normal: normalizeStyle({
      fontSize: 'var(--font-size-base)',
      gap: 'var(--space-2)'
    }),
    expanded: normalizeStyle({
      fontSize: 'var(--font-size-lg)',
      gap: 'var(--space-3)'
    })
  };
  
  // Button base styles
  const getButtonStyles = (isActive = false, isDisabled = false) => {
    const baseButtonStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid transparent',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: 'var(--font-weight-medium)',
      userSelect: 'none',
      textDecoration: 'none',
      
      // Size-specific dimensions
      ...(size === 'compact' && {
        minWidth: '32px',
        height: '32px',
        padding: 'var(--space-1) var(--space-2)'
      }),
      ...(size === 'normal' && {
        minWidth: '40px',
        height: '40px',
        padding: 'var(--space-2) var(--space-3)'
      }),
      ...(size === 'expanded' && {
        minWidth: '48px',
        height: '48px',
        padding: 'var(--space-3) var(--space-4)'
      }),
      
      // Shape variants
      ...(shape === 'rounded' && {
        borderRadius: 'var(--border-radius-md)'
      }),
      ...(shape === 'square' && {
        borderRadius: 'var(--border-radius-sm)'
      }),
      ...(shape === 'circular' && {
        borderRadius: '50%'
      })
    };
    
    // Variant styles
    const variantStyles = {
      filled: {
        backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-background-secondary)',
        color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-text-primary)',
        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
        ':hover': !isDisabled && !isActive ? {
          backgroundColor: 'var(--color-background-tertiary)',
          borderColor: 'var(--color-border-hover)'
        } : {}
      },
      outlined: {
        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
        color: isActive ? 'var(--color-primary-contrast)' : 'var(--color-text-primary)',
        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
        ':hover': !isDisabled && !isActive ? {
          backgroundColor: 'var(--color-primary-light)',
          borderColor: 'var(--color-primary)'
        } : {}
      },
      minimal: {
        backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
        borderColor: 'transparent',
        ':hover': !isDisabled && !isActive ? {
          backgroundColor: 'var(--color-background-secondary)'
        } : {}
      }
    };
    
    // State styles
    const stateStyles = {
      ...(isDisabled && {
        opacity: 0.5,
        cursor: 'not-allowed'
      }),
      
      ...(theme === 'detailed' && isActive && {
        boxShadow: 'var(--shadow-md)',
        transform: 'translateY(-1px)'
      })
    };
    
    return normalizeStyle({
      ...baseButtonStyles,
      ...variantStyles[variant],
      ...stateStyles
    });
  };
  
  // Info text styles
  const infoStyles = normalizeStyle({
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-normal)',
    whiteSpace: 'nowrap'
  });
  
  // Quick jumper styles
  const jumperStyles = normalizeStyle({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    marginLeft: 'var(--space-3)'
  });
  
  const jumperInputStyles = normalizeStyle({
    width: '60px',
    padding: 'var(--space-2)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: 'var(--font-size-sm)',
    textAlign: 'center',
    ':focus': {
      outline: '2px solid var(--color-primary-light)',
      borderColor: 'var(--color-primary)'
    }
  });
  
  // Combined styles
  const paginationStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...style
  };
  
  return (
    <nav
      ref={ref}
      className={`vistara-pagination vistara-pagination--${variant} ${className || ''}`}
      style={paginationStyles}
      aria-label="Pagination navigation"
      {...props}
    >
      {/* Info text */}
      {showInfo && (
        <div style={infoStyles}>
          {labels.page} {currentPage} {labels.of} {calculatedTotalPages}
          {totalItems && ` (${totalItems.toLocaleString()} ${labels.items})`}
        </div>
      )}
      
      {/* Pagination buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'inherit' }}>
        {/* First page */}
        {showFirstLast && (
          <button
            style={getButtonStyles(false, disabled || currentPage === 1)}
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            aria-label={labels.first}
            title={labels.first}
          >
            <FirstIcon />
          </button>
        )}
        
        {/* Previous page */}
        {showPrevNext && (
          <button
            style={getButtonStyles(false, disabled || currentPage === 1)}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            aria-label={labels.previous}
            title={labels.previous}
          >
            <PrevIcon />
          </button>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                style={normalizeStyle({
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: size === 'compact' ? '32px' : size === 'expanded' ? '48px' : '40px',
                  height: size === 'compact' ? '32px' : size === 'expanded' ? '48px' : '40px',
                  color: 'var(--color-text-muted)',
                  cursor: 'default'
                })}
                aria-hidden="true"
              >
                ...
              </span>
            );
          }
          
          const isActive = pageNumber === currentPage;
          
          return (
            <button
              key={pageNumber}
              style={getButtonStyles(isActive, disabled)}
              onClick={() => handlePageChange(pageNumber)}
              disabled={disabled}
              aria-label={`${labels.page} ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
        
        {/* Next page */}
        {showPrevNext && (
          <button
            style={getButtonStyles(false, disabled || currentPage === calculatedTotalPages)}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === calculatedTotalPages}
            aria-label={labels.next}
            title={labels.next}
          >
            <NextIcon />
          </button>
        )}
        
        {/* Last page */}
        {showFirstLast && (
          <button
            style={getButtonStyles(false, disabled || currentPage === calculatedTotalPages)}
            onClick={() => handlePageChange(calculatedTotalPages)}
            disabled={disabled || currentPage === calculatedTotalPages}
            aria-label={labels.last}
            title={labels.last}
          >
            <LastIcon />
          </button>
        )}
      </div>
      
      {/* Quick jumper */}
      {showQuickJumper && calculatedTotalPages > 5 && (
        <div style={jumperStyles}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            {labels.goTo}:
          </span>
          <input
            type="number"
            min="1"
            max={calculatedTotalPages}
            style={jumperInputStyles}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= calculatedTotalPages) {
                  handlePageChange(page);
                  e.target.value = '';
                }
              }
            }}
            placeholder={currentPage.toString()}
          />
        </div>
      )}
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;