/**
 * 🎯 Vistara UI - DataTable Component
 * "Command your Design."
 * 
 * טבלת נתונים מתקדמת עם מיון, סינון וחיפוש
 */

import React, { forwardRef, useState, useMemo } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const DataTable = forwardRef(({ 
  // Data
  data = [],
  columns = [], // [{ key, title, sortable, filterable, render, width, align }]
  
  // Features
  sortable = true,
  filterable = true,
  searchable = true,
  selectable = false,
  pagination = true,
  
  // Pagination options
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'default', // 'default', 'striped', 'bordered', 'hover'
  
  // Behavior
  loading = false,
  emptyText = 'No data available',
  loadingText = 'Loading...',
  
  // Callbacks
  onSort,
  onFilter,
  onSearch,
  onSelectionChange,
  onPageChange,
  onPageSizeChange,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  
  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply search
    if (searchable && searchTerm) {
      result = result.filter(row =>
        columns.some(col => {
          const value = row[col.key];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
    
    // Apply filters
    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue) {
        result = result.filter(row => {
          const value = row[key];
          return value && value.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [data, searchTerm, filters, sortConfig, columns, searchable]);
  
  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    
    const startIndex = (currentPage - 1) * currentPageSize;
    return filteredData.slice(startIndex, startIndex + currentPageSize);
  }, [filteredData, currentPage, currentPageSize, pagination]);
  
  const totalPages = Math.ceil(filteredData.length / currentPageSize);
  
  // Handle sorting
  const handleSort = (columnKey) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column || !column.sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key: columnKey, direction });
    onSort?.(columnKey, direction);
  };
  
  // Handle filter change
  const handleFilterChange = (columnKey, value) => {
    const newFilters = { ...filters, [columnKey]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    onFilter?.(newFilters);
  };
  
  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    onSearch?.(value);
  };
  
  // Handle row selection
  const handleRowSelection = (rowIndex, checked) => {
    const newSelection = new Set(selectedRows);
    if (checked) {
      newSelection.add(rowIndex);
    } else {
      newSelection.delete(rowIndex);
    }
    setSelectedRows(newSelection);
    onSelectionChange?.(Array.from(newSelection));
  };
  
  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIndices = paginatedData.map((_, index) => (currentPage - 1) * currentPageSize + index);
      setSelectedRows(new Set(allIndices));
      onSelectionChange?.(allIndices);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };
  
  // Table container styles
  const getTableContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      width: '100%',
      border: variant === 'bordered' ? '1px solid var(--color-border)' : 'none',
      borderRadius: variant === 'bordered' ? 'var(--border-radius-lg)' : 0,
      overflow: 'hidden',
      backgroundColor: 'var(--color-surface)',
      
      // Theme variations
      ...(theme === 'detailed' && {
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)'
      })
    });
  };
  
  // Search bar styles
  const getSearchBarStyles = () => {
    return normalizeStyle({
      padding: 'var(--space-3) var(--space-4)',
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: theme === 'detailed' ? 'var(--color-background-secondary)' : 'transparent'
    });
  };
  
  // Search input styles
  const getSearchInputStyles = () => {
    return normalizeStyle({
      width: '100%',
      maxWidth: '300px',
      padding: 'var(--space-2) var(--space-3)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      fontSize: 'var(--font-size-sm)',
      outline: 'none',
      
      ':focus': {
        borderColor: 'var(--color-primary)',
        boxShadow: '0 0 0 2px var(--color-primary-light)'
      }
    });
  };
  
  // Table styles
  const getTableStyles = () => {
    return normalizeStyle({
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : size === 'expanded' ? 'var(--font-size-base)' : 'var(--font-size-sm)'
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      backgroundColor: theme === 'detailed' ? 'var(--color-background-secondary)' : 'var(--color-background-tertiary)',
      borderBottom: '2px solid var(--color-border)'
    });
  };
  
  // Header cell styles
  const getHeaderCellStyles = (column) => {
    const sizeMap = {
      compact: { padding: 'var(--space-2) var(--space-3)' },
      normal: { padding: 'var(--space-3) var(--space-4)' },
      expanded: { padding: 'var(--space-4) var(--space-5)' }
    };
    
    return normalizeStyle({
      textAlign: column.align || 'left',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)',
      cursor: column.sortable ? 'pointer' : 'default',
      userSelect: 'none',
      width: column.width || 'auto',
      
      ...sizeMap[size],
      
      ...(column.sortable && {
        ':hover': {
          backgroundColor: 'var(--color-background-secondary)'
        }
      })
    });
  };
  
  // Row styles
  const getRowStyles = (index, isSelected) => {
    return normalizeStyle({
      backgroundColor: 
        isSelected ? 'var(--color-primary-light)' :
        variant === 'striped' && index % 2 === 1 ? 'var(--color-background-secondary)' :
        'transparent',
      
      ...(variant === 'hover' && {
        ':hover': {
          backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-background-secondary)'
        }
      }),
      
      borderBottom: '1px solid var(--color-border)'
    });
  };
  
  // Cell styles
  const getCellStyles = (column) => {
    const sizeMap = {
      compact: { padding: 'var(--space-2) var(--space-3)' },
      normal: { padding: 'var(--space-3) var(--space-4)' },
      expanded: { padding: 'var(--space-4) var(--space-5)' }
    };
    
    return normalizeStyle({
      textAlign: column.align || 'left',
      color: 'var(--color-text-secondary)',
      ...sizeMap[size]
    });
  };
  
  // Pagination styles
  const getPaginationStyles = () => {
    return normalizeStyle({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--space-3) var(--space-4)',
      borderTop: '1px solid var(--color-border)',
      backgroundColor: theme === 'detailed' ? 'var(--color-background-secondary)' : 'transparent'
    });
  };
  
  // Icons
  const SortIcon = ({ direction }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '4px' }}>
      {direction === 'asc' ? (
        <polyline points="18 15 12 9 6 15" stroke="currentColor" strokeWidth="2"/>
      ) : direction === 'desc' ? (
        <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2"/>
      ) : (
        <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      )}
    </svg>
  );
  
  const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  if (loading) {
    return (
      <div style={normalizeStyle({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-8)',
        color: 'var(--color-text-muted)'
      })}>
        {loadingText}
      </div>
    );
  }
  
  return (
    <div
      ref={ref}
      className={`vistara-data-table vistara-data-table--${variant} vistara-data-table--${size} ${className || ''}`}
      style={{ ...getTableContainerStyles(), ...style }}
      {...props}
    >
      {/* Search Bar */}
      {searchable && (
        <div style={getSearchBarStyles()}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={getSearchInputStyles()}
            />
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)'
            }}>
              <SearchIcon />
            </div>
          </div>
        </div>
      )}
      
      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={getTableStyles()}>
          <thead style={getHeaderStyles()}>
            <tr>
              {selectable && (
                <th style={getHeaderCellStyles({ align: 'center' })}>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={getHeaderCellStyles(column)}
                  onClick={() => handleSort(column.key)}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {column.title}
                    {column.sortable && (
                      <SortIcon 
                        direction={sortConfig.key === column.key ? sortConfig.direction : null}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  style={normalizeStyle({
                    textAlign: 'center',
                    padding: 'var(--space-8)',
                    color: 'var(--color-text-muted)'
                  })}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const globalIndex = (currentPage - 1) * currentPageSize + index;
                const isSelected = selectedRows.has(globalIndex);
                
                return (
                  <tr key={index} style={getRowStyles(index, isSelected)}>
                    {selectable && (
                      <td style={getCellStyles({ align: 'center' })}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelection(globalIndex, e.target.checked)}
                        />
                      </td>
                    )}
                    
                    {columns.map((column) => (
                      <td key={column.key} style={getCellStyles(column)}>
                        {column.render ? 
                          column.render(row[column.key], row, index) : 
                          row[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && filteredData.length > 0 && (
        <div style={getPaginationStyles()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              Showing {(currentPage - 1) * currentPageSize + 1} to {Math.min(currentPage * currentPageSize, filteredData.length)} of {filteredData.length} entries
            </span>
            
            {showPageSizeSelector && (
              <select
                value={currentPageSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  setCurrentPageSize(newSize);
                  setCurrentPage(1);
                  onPageSizeChange?.(newSize);
                }}
                style={normalizeStyle({
                  padding: 'var(--space-1) var(--space-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: 'var(--font-size-sm)'
                })}
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(currentPage - 1);
                onPageChange?.(currentPage - 1);
              }}
              style={normalizeStyle({
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'var(--color-surface)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              })}
            >
              Previous
            </button>
            
            <span style={{ 
              padding: 'var(--space-2) var(--space-3)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-muted)'
            }}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(currentPage + 1);
                onPageChange?.(currentPage + 1);
              }}
              style={normalizeStyle({
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'var(--color-surface)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              })}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;