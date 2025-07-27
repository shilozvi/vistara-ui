/**
 * 🎯 Vistara UI - DatePicker Component
 * "Command your Design."
 * 
 * בוחר תאריכים מתקדם עם לוח שנה וטווחים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const DatePicker = forwardRef(({ 
  // Value & state
  value,
  defaultValue,
  
  // Behavior
  disabled = false,
  readOnly = false,
  required = false,
  
  // Display
  placeholder = 'Select date...',
  format = 'DD/MM/YYYY', // 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'
  
  // Date constraints
  minDate,
  maxDate,
  disabledDates = [],
  
  // Calendar options
  showWeekNumbers = false,
  firstDayOfWeek = 1, // 0 = Sunday, 1 = Monday
  locale = 'en',
  
  // Range selection
  range = false,
  rangeSeparator = ' - ',
  
  // Time selection
  showTime = false,
  timeFormat = '24', // '12', '24'
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed'
  variant = 'outlined', // 'outlined', 'filled', 'underlined'
  
  // Validation
  error,
  
  // Callbacks
  onChange,
  onFocus,
  onBlur,
  onCalendarOpen,
  onCalendarClose,
  
  // Standard props
  id,
  name,
  className,
  style,
  ...props
}, ref) => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value || defaultValue || null);
  const [selectedRange, setSelectedRange] = useState(range ? { start: null, end: null } : null);
  const [focused, setFocused] = useState(false);
  const [tempTime, setTempTime] = useState({ hour: 12, minute: 0, period: 'PM' });
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const calendarRef = useRef(null);
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };
  
  // Get display value
  const getDisplayValue = () => {
    if (range && selectedRange) {
      const start = selectedRange.start ? formatDate(selectedRange.start) : '';
      const end = selectedRange.end ? formatDate(selectedRange.end) : '';
      if (start && end) {
        return `${start}${rangeSeparator}${end}`;
      } else if (start) {
        return start;
      }
      return '';
    }
    return selectedDate ? formatDate(selectedDate) : '';
  };
  
  // Check if date is disabled
  const isDateDisabled = (date) => {
    const dateStr = formatDate(date);
    
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    if (disabledDates.some(disabled => formatDate(disabled) === dateStr)) return true;
    
    return false;
  };
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Adjust start date to first day of week
    const dayOfWeek = (firstDay.getDay() - firstDayOfWeek + 7) % 7;
    startDate.setDate(firstDay.getDate() - dayOfWeek);
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks of days
    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      days.push(weekDays);
    }
    
    return days;
  };
  
  // Handle date selection
  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    
    if (range) {
      if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
        setSelectedRange({ start: date, end: null });
      } else {
        const start = selectedRange.start;
        const end = date;
        
        if (end < start) {
          setSelectedRange({ start: end, end: start });
        } else {
          setSelectedRange({ start, end });
        }
        
        setIsOpen(false);
        onChange?.({ start: selectedRange.start, end: date });
      }
    } else {
      setSelectedDate(date);
      setIsOpen(false);
      onChange?.(date);
    }
  };
  
  // Handle month navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  // Handle year navigation
  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        onCalendarClose?.();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCalendarClose]);
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      position: 'relative',
      fontFamily: 'var(--font-family-base)',
      width: '100%'
    });
  };
  
  // Input container styles
  const getInputContainerStyles = () => {
    const sizeMap = {
      compact: {
        height: '32px',
        padding: 'var(--space-1) var(--space-2)',
        fontSize: 'var(--font-size-sm)'
      },
      normal: {
        height: '40px',
        padding: 'var(--space-2) var(--space-3)',
        fontSize: 'var(--font-size-base)'
      },
      expanded: {
        height: '48px',
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--font-size-lg)'
      }
    };
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      cursor: disabled ? 'not-allowed' : 'pointer',
      borderRadius: 'var(--border-radius-md)',
      transition: 'all 0.2s ease',
      
      ...sizeMap[size],
      
      // Variant styles
      ...(variant === 'outlined' && {
        border: `1px solid ${error ? 'var(--color-danger)' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
        backgroundColor: 'var(--color-surface)'
      }),
      
      ...(variant === 'filled' && {
        border: `1px solid ${error ? 'var(--color-danger)' : 'transparent'}`,
        backgroundColor: focused ? 'var(--color-surface)' : 'var(--color-background-secondary)'
      }),
      
      ...(variant === 'underlined' && {
        border: 'none',
        borderBottom: `2px solid ${error ? 'var(--color-danger)' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 0,
        backgroundColor: 'transparent'
      }),
      
      // Focus styles
      ...(focused && variant === 'outlined' && {
        boxShadow: `0 0 0 3px ${error ? 'var(--color-danger-light)' : 'var(--color-primary-light)'}`
      }),
      
      // States
      ...(disabled && {
        opacity: 0.5,
        cursor: 'not-allowed'
      })
    });
  };
  
  // Input styles
  const getInputStyles = () => {
    return normalizeStyle({
      flex: 1,
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      fontSize: 'inherit',
      color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
      cursor: 'pointer',
      
      '::placeholder': {
        color: 'var(--color-text-muted)',
        opacity: 1
      }
    });
  };
  
  // Calendar styles
  const getCalendarStyles = () => {
    return normalizeStyle({
      position: 'absolute',
      top: '100%',
      left: 0,
      zIndex: 1000,
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      marginTop: 'var(--space-1)',
      padding: 'var(--space-3)',
      minWidth: '280px',
      
      // Animation
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'translateY(0)' : 'translateY(-8px)',
      transition: 'all 0.2s ease',
      visibility: isOpen ? 'visible' : 'hidden'
    });
  };
  
  // Calendar header styles
  const getCalendarHeaderStyles = () => {
    return normalizeStyle({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 'var(--space-3)',
      padding: 'var(--space-2) 0'
    });
  };
  
  // Calendar nav button styles
  const getNavButtonStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: 'var(--border-radius-md)',
      cursor: 'pointer',
      color: 'var(--color-text-muted)',
      
      ':hover': {
        backgroundColor: 'var(--color-background-secondary)',
        color: 'var(--color-text-primary)'
      }
    });
  };
  
  // Day cell styles
  const getDayCellStyles = (date, isCurrentMonth, isSelected, isInRange, isToday) => {
    const disabled = isDateDisabled(date);
    
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 'var(--font-size-sm)',
      fontWeight: isToday ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
      transition: 'all 0.2s ease',
      
      // Base colors
      color: 
        disabled ? 'var(--color-text-muted)' :
        !isCurrentMonth ? 'var(--color-text-muted)' :
        isSelected ? 'var(--color-primary-contrast)' :
        'var(--color-text-primary)',
      
      backgroundColor: 
        isSelected ? 'var(--color-primary)' :
        isInRange ? 'var(--color-primary-light)' :
        'transparent',
      
      // States
      ...(disabled && {
        opacity: 0.3
      }),
      
      ...(isToday && !isSelected && {
        border: '2px solid var(--color-primary)'
      }),
      
      ...(!disabled && !isSelected && {
        ':hover': {
          backgroundColor: 'var(--color-background-secondary)'
        }
      })
    });
  };
  
  // Icons
  const ChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div
      ref={containerRef}
      className={`vistara-date-picker vistara-date-picker--${variant} vistara-date-picker--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
    >
      <div
        style={getInputContainerStyles()}
        onClick={() => !disabled && !readOnly && (setIsOpen(!isOpen), onCalendarOpen?.())}
      >
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={getDisplayValue()}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          required={required}
          style={getInputStyles()}
          onFocus={() => (setFocused(true), onFocus?.())}
          onBlur={() => (setFocused(false), onBlur?.())}
          {...props}
        />
        
        <div style={{ color: 'var(--color-text-muted)', marginLeft: 'var(--space-2)' }}>
          <CalendarIcon />
        </div>
      </div>
      
      {/* Calendar */}
      <div ref={calendarRef} style={getCalendarStyles()}>
        {/* Header */}
        <div style={getCalendarHeaderStyles()}>
          <button
            type="button"
            style={getNavButtonStyles()}
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <button
              type="button"
              style={normalizeStyle({
                background: 'none',
                border: 'none',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer'
              })}
            >
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </button>
          </div>
          
          <button
            type="button"
            style={getNavButtonStyles()}
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight />
          </button>
        </div>
        
        {/* Day headers */}
        <div style={normalizeStyle({
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 'var(--space-1)',
          marginBottom: 'var(--space-2)'
        })}>
          {dayNames.map(day => (
            <div
              key={day}
              style={normalizeStyle({
                textAlign: 'center',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-muted)',
                padding: 'var(--space-1)'
              })}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div style={normalizeStyle({
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 'var(--space-1)'
        })}>
          {calendarDays.flat().map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = range ? 
              (selectedRange.start && date.toDateString() === selectedRange.start.toDateString()) ||
              (selectedRange.end && date.toDateString() === selectedRange.end.toDateString()) :
              selectedDate && date.toDateString() === selectedDate.toDateString();
            const isInRange = range && selectedRange.start && selectedRange.end &&
              date >= selectedRange.start && date <= selectedRange.end;
            
            return (
              <button
                key={index}
                type="button"
                style={getDayCellStyles(date, isCurrentMonth, isSelected, isInRange, isToday)}
                onClick={() => handleDateSelect(date)}
                disabled={isDateDisabled(date)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div style={normalizeStyle({
          marginTop: 'var(--space-1)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-danger)'
        })}>
          {error}
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;