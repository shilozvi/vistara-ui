/**
 * 🎯 Vistara UI - Calendar Component
 * "Command your Design."
 * 
 * לוח שנה מתקדם עם תמיכה באירועים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const Calendar = forwardRef(({
  // Date values
  value,
  defaultValue = new Date(),
  minDate,
  maxDate,
  
  // View options
  view = 'month', // 'month', 'week', 'day', 'year'
  defaultView = 'month',
  allowViewChange = true,
  
  // Selection
  selectionMode = 'single', // 'single', 'multiple', 'range'
  disabledDates = [], // Array of dates or date ranges
  
  // Display options
  showWeekNumbers = false,
  showNeighboringMonth = true,
  firstDayOfWeek = 0, // 0 = Sunday, 1 = Monday
  
  // Events
  events = [], // [{ id, date, title, color?, allDay? }]
  showEvents = true,
  maxEventsPerDay = 3,
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'modern', 'colorful'
  variant = 'default', // 'default', 'bordered', 'filled'
  
  // Localization
  locale = 'en-US',
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'],
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  
  // Callbacks
  onChange,
  onViewChange,
  onEventClick,
  onDateHover,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [selectedDates, setSelectedDates] = useState(
    value ? (Array.isArray(value) ? value : [value]) : []
  );
  const [currentDate, setCurrentDate] = useState(defaultValue);
  const [currentView, setCurrentView] = useState(defaultView);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [rangeStart, setRangeStart] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  
  // Update selected dates when value changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedDates(Array.isArray(value) ? value : [value]);
    }
  }, [value]);
  
  // Get calendar data
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - ((firstDay.getDay() - firstDayOfWeek + 7) % 7));
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== firstDayOfWeek) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };
  
  // Get week days
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(dayNamesShort[(firstDayOfWeek + i) % 7]);
    }
    return days;
  };
  
  // Check if date is selected
  const isDateSelected = (date) => {
    return selectedDates.some(d => 
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  };
  
  // Check if date is in range
  const isDateInRange = (date) => {
    if (selectionMode !== 'range' || !rangeStart || selectedDates.length !== 1) return false;
    
    const start = rangeStart;
    const end = hoveredDate || selectedDates[0];
    
    return date >= Math.min(start, end) && date <= Math.max(start, end);
  };
  
  // Check if date is disabled
  const isDateDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    
    return disabledDates.some(d => {
      if (d instanceof Date) {
        return d.getFullYear() === date.getFullYear() &&
               d.getMonth() === date.getMonth() &&
               d.getDate() === date.getDate();
      }
      if (Array.isArray(d) && d.length === 2) {
        return date >= d[0] && date <= d[1];
      }
      return false;
    });
  };
  
  // Get events for date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  };
  
  // Handle date click
  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return;
    
    let newDates = [];
    
    switch (selectionMode) {
      case 'single':
        newDates = [date];
        break;
        
      case 'multiple':
        if (isDateSelected(date)) {
          newDates = selectedDates.filter(d => 
            !(d.getFullYear() === date.getFullYear() &&
              d.getMonth() === date.getMonth() &&
              d.getDate() === date.getDate())
          );
        } else {
          newDates = [...selectedDates, date];
        }
        break;
        
      case 'range':
        if (!rangeStart || selectedDates.length === 2) {
          newDates = [date];
          setRangeStart(date);
        } else {
          const start = rangeStart;
          const end = date;
          newDates = [start < end ? start : end, start < end ? end : start];
          setRangeStart(null);
        }
        break;
    }
    
    setSelectedDates(newDates);
    onChange?.(selectionMode === 'single' ? newDates[0] : newDates);
  };
  
  // Handle navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };
  
  // Handle view change
  const handleViewChange = (view) => {
    if (!allowViewChange) return;
    setCurrentView(view);
    onViewChange?.(view);
  };
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--border-radius-lg)',
      padding: size === 'compact' ? 'var(--space-3)' : 'var(--space-4)',
      width: size === 'compact' ? '280px' : size === 'expanded' ? '400px' : '320px',
      
      ...(variant === 'bordered' && {
        border: '1px solid var(--color-border)'
      }),
      
      ...(theme === 'modern' && {
        boxShadow: 'var(--shadow-lg)',
        border: 'none'
      })
    });
  };
  
  // Header styles
  const getHeaderStyles = () => {
    return normalizeStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-3)',
      gap: 'var(--space-2)'
    });
  };
  
  // Navigation button styles
  const getNavButtonStyles = () => {
    return normalizeStyle({
      backgroundColor: 'transparent',
      border: 'none',
      padding: 'var(--space-2)',
      borderRadius: 'var(--border-radius-sm)',
      cursor: 'pointer',
      color: 'var(--color-text-primary)',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      
      ':hover': {
        backgroundColor: 'var(--color-background-secondary)'
      }
    });
  };
  
  // Month/Year display styles
  const getMonthYearStyles = () => {
    return normalizeStyle({
      fontSize: size === 'compact' ? 'var(--font-size-base)' : 'var(--font-size-lg)',
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)',
      textAlign: 'center',
      flex: 1
    });
  };
  
  // Weekdays styles
  const getWeekdaysStyles = () => {
    return normalizeStyle({
      display: 'grid',
      gridTemplateColumns: showWeekNumbers ? 'auto repeat(7, 1fr)' : 'repeat(7, 1fr)',
      gap: 0,
      marginBottom: 'var(--space-2)'
    });
  };
  
  // Weekday styles
  const getWeekdayStyles = () => {
    return normalizeStyle({
      padding: 'var(--space-2)',
      textAlign: 'center',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    });
  };
  
  // Days grid styles
  const getDaysGridStyles = () => {
    return normalizeStyle({
      display: 'grid',
      gridTemplateColumns: showWeekNumbers ? 'auto repeat(7, 1fr)' : 'repeat(7, 1fr)',
      gap: size === 'compact' ? '2px' : '4px'
    });
  };
  
  // Day cell styles
  const getDayCellStyles = (date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = isDateSelected(date);
    const isInRange = isDateInRange(date);
    const isDisabled = isDateDisabled(date);
    const isOtherMonth = date.getMonth() !== currentDate.getMonth();
    const isHovered = hoveredDate && date.toDateString() === hoveredDate.toDateString();
    const hasEvents = getEventsForDate(date).length > 0;
    
    return normalizeStyle({
      aspectRatio: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--border-radius-md)',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.3 : isOtherMonth && !showNeighboringMonth ? 0 : isOtherMonth ? 0.5 : 1,
      fontSize: size === 'compact' ? 'var(--font-size-sm)' : 'var(--font-size-base)',
      fontWeight: isToday ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)',
      position: 'relative',
      transition: 'all 0.2s ease',
      
      backgroundColor: isSelected ? 'var(--color-primary)' : 
                      isInRange ? 'var(--color-primary-light)' :
                      isHovered ? 'var(--color-background-secondary)' : 'transparent',
      
      color: isSelected ? 'var(--color-primary-contrast)' : 
             isToday && !isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
      
      ...(theme === 'colorful' && hasEvents && {
        backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-info-light)'
      }),
      
      ':hover': !isDisabled && {
        backgroundColor: isSelected ? 'var(--color-primary-dark)' : 'var(--color-background-tertiary)'
      }
    });
  };
  
  // Event dot styles
  const getEventDotStyles = (event, index) => {
    return normalizeStyle({
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      backgroundColor: event.color || 'var(--color-primary)',
      margin: '0 1px'
    });
  };
  
  // Week number styles
  const getWeekNumberStyles = () => {
    return normalizeStyle({
      padding: 'var(--space-2)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-muted)',
      fontWeight: 'var(--font-weight-medium)',
      textAlign: 'center',
      backgroundColor: 'var(--color-background-secondary)',
      borderRadius: 'var(--border-radius-sm)'
    });
  };
  
  // Get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };
  
  // Navigation icons
  const ChevronLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  // Render calendar days
  const calendarDays = getCalendarDays();
  const weekDays = getWeekDays();
  
  // Group days by week for week numbers
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  
  return (
    <div
      ref={ref}
      className={`vistara-calendar vistara-calendar--${variant} vistara-calendar--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {/* Header */}
      <div style={getHeaderStyles()}>
        <button
          style={getNavButtonStyles()}
          onClick={() => navigateMonth(-1)}
          title="Previous month"
        >
          <ChevronLeftIcon />
        </button>
        
        <div style={getMonthYearStyles()}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        
        <button
          style={getNavButtonStyles()}
          onClick={() => navigateMonth(1)}
          title="Next month"
        >
          <ChevronRightIcon />
        </button>
      </div>
      
      {/* Weekdays */}
      <div style={getWeekdaysStyles()}>
        {showWeekNumbers && <div />}
        {weekDays.map((day, index) => (
          <div key={index} style={getWeekdayStyles()}>
            {day}
          </div>
        ))}
      </div>
      
      {/* Days grid */}
      <div style={getDaysGridStyles()}>
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {showWeekNumbers && (
              <div style={getWeekNumberStyles()}>
                {getWeekNumber(week[0])}
              </div>
            )}
            
            {week.map((date, dayIndex) => {
              const dayEvents = getEventsForDate(date);
              const isOtherMonth = date.getMonth() !== currentDate.getMonth();
              
              if (isOtherMonth && !showNeighboringMonth) {
                return <div key={dayIndex} />;
              }
              
              return (
                <div
                  key={dayIndex}
                  style={getDayCellStyles(date)}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => {
                    setHoveredDate(date);
                    onDateHover?.(date);
                  }}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <div>{date.getDate()}</div>
                  
                  {/* Event dots */}
                  {showEvents && dayEvents.length > 0 && (
                    <div style={{
                      display: 'flex',
                      position: 'absolute',
                      bottom: '4px',
                      gap: '2px'
                    }}>
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <div
                          key={idx}
                          style={getEventDotStyles(event, idx)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick?.(event, date);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
});

Calendar.displayName = 'Calendar';

export default Calendar;