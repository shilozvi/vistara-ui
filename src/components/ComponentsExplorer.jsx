/**
 * 🔍 Vistara UI - Components Explorer
 * "Command your Design."
 * 
 * Advanced component search and discovery interface
 * Based on components.index.json for real-time component exploration
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Tag, Package, Code, Eye, FileText, ChevronRight } from 'lucide-react';
import { normalizeStyle, withNormalizedStyles } from '../utils/normalizeStyle';

// Import components.index.json data
import componentsIndex from '../data/components.index.json';

const ComponentsExplorer = ({ 
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default' // 'default', 'minimal', 'detailed'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'details'

  // Size configurations
  const sizeConfigs = {
    compact: {
      padding: 'var(--space-3)',
      gap: 'var(--space-2)',
      cardPadding: 'var(--space-3)',
      iconSize: '16px',
      titleSize: 'var(--font-size-sm)',
      textSize: 'var(--font-size-xs)'
    },
    normal: {
      padding: 'var(--space-4)',
      gap: 'var(--space-3)',
      cardPadding: 'var(--space-4)',
      iconSize: '20px',
      titleSize: 'var(--font-size-lg)',
      textSize: 'var(--font-size-sm)'
    },
    expanded: {
      padding: 'var(--space-6)',
      gap: 'var(--space-4)',
      cardPadding: 'var(--space-6)',
      iconSize: '24px',
      titleSize: 'var(--font-size-xl)',
      textSize: 'var(--font-size-base)'
    }
  };

  const config = sizeConfigs[size];

  // Filter components based on search criteria
  const filteredComponents = useMemo(() => {
    let filtered = Object.entries(componentsIndex.components);

    // Search by name, description, or tags
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(([name, component]) => {
        return (
          name.toLowerCase().includes(query) ||
          component.description.toLowerCase().includes(query) ||
          component.tags.some(tag => tag.toLowerCase().includes(query)) ||
          component.features.some(feature => feature.toLowerCase().includes(query))
        );
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(([name, component]) => 
        component.category === selectedCategory
      );
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(([name, component]) =>
        selectedTags.every(tag => component.tags.includes(tag))
      );
    }

    // Filter by complexity
    if (selectedComplexity !== 'all') {
      filtered = filtered.filter(([name, component]) =>
        component.complexity === selectedComplexity
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedTags, selectedComplexity]);

  // Get all available tags
  const allTags = useMemo(() => {
    const tags = new Set();
    Object.values(componentsIndex.components).forEach(component => {
      component.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Main container styles
  const containerStyles = normalizeStyle({
    backgroundColor: 'var(--color-surface)',
    borderRadius: 'var(--border-radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: config.padding,
    display: 'flex',
    flexDirection: 'column',
    gap: config.gap,
    height: '100vh',
    overflow: 'hidden'
  });

  const searchBarStyles = normalizeStyle({
    position: 'relative',
    marginBottom: config.gap
  });

  const searchInputStyles = normalizeStyle({
    width: '100%',
    padding: `${config.cardPadding} var(--space-10) ${config.cardPadding} var(--space-3)`,
    fontSize: config.textSize,
    border: `var(--border-width-1) solid var(--color-border-light)`,
    borderRadius: 'var(--border-radius-lg)',
    backgroundColor: 'var(--color-background-secondary)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    transition: 'var(--transition-base)'
  });

  const filterBarStyles = normalizeStyle({
    display: 'flex',
    gap: config.gap,
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: config.cardPadding,
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--border-radius-lg)',
    border: `var(--border-width-1) solid var(--color-border-light)`
  });

  const componentCardStyles = normalizeStyle({
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: 'var(--border-radius-lg)',
    padding: config.cardPadding,
    border: `var(--border-width-1) solid var(--color-border-light)`,
    cursor: 'pointer',
    transition: 'var(--transition-base)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  });

  const tagStyles = normalizeStyle({
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-white)',
    padding: 'var(--space-1) var(--space-2)',
    borderRadius: 'var(--border-radius-sm)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    cursor: 'pointer',
    transition: 'var(--transition-base)'
  });

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const renderComponentCard = ([componentName, component]) => (
    <div 
      key={componentName}
      style={componentCardStyles}
      onClick={() => setSelectedComponent([componentName, component])}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
    >
      <div style={normalizeStyle({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: config.gap
      })}>
        <Package size={config.iconSize} style={{ color: 'var(--color-primary)' }} />
        <span style={normalizeStyle({
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-success-light)',
          padding: 'var(--space-1) var(--space-2)',
          borderRadius: 'var(--border-radius-sm)'
        })}>
          {component.status}
        </span>
      </div>
      
      <h3 style={normalizeStyle({
        fontSize: config.titleSize,
        fontWeight: 'var(--font-weight-bold)',
        color: 'var(--color-text-primary)',
        margin: '0 0 var(--space-2) 0'
      })}>
        {componentName}
      </h3>
      
      <p style={normalizeStyle({
        fontSize: config.textSize,
        color: 'var(--color-text-secondary)',
        margin: '0 0 var(--space-3) 0',
        lineHeight: 'var(--line-height-relaxed)',
        flex: '1'
      })}>
        {component.description}
      </p>
      
      <div style={normalizeStyle({
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-1)',
        marginBottom: config.gap
      })}>
        {component.tags.slice(0, 3).map(tag => (
          <span 
            key={tag}
            style={normalizeStyle({
              ...tagStyles,
              backgroundColor: selectedTags.includes(tag) ? 'var(--color-primary)' : 'var(--color-gray-200)',
              color: selectedTags.includes(tag) ? 'var(--color-white)' : 'var(--color-text-muted)'
            })}
            onClick={(e) => {
              e.stopPropagation();
              handleTagToggle(tag);
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div style={normalizeStyle({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)'
      })}>
        <span>{component.category}</span>
        <span>{component.complexity}</span>
      </div>
    </div>
  );

  return (
    <div className="vistara-component" style={containerStyles}>
      {/* Header */}
      <div style={normalizeStyle({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: config.gap
      })}>
        <h2 style={normalizeStyle({
          fontSize: config.titleSize,
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          margin: 0
        })}>
          🔍 Components Explorer
        </h2>
        <div style={normalizeStyle({
          fontSize: config.textSize,
          color: 'var(--color-text-secondary)'
        })}>
          {filteredComponents.length} רכיבים
        </div>
      </div>

      {/* Search Bar */}
      <div style={searchBarStyles}>
        <Search 
          size={config.iconSize} 
          style={normalizeStyle({
            position: 'absolute',
            right: 'var(--space-3)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none'
          })}
        />
        <input
          type="text"
          placeholder="חפש רכיבים לפי שם, תיאור או תגיות..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyles}
        />
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyles}>
        <Filter size={config.iconSize} style={{ color: 'var(--color-text-muted)' }} />
        
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={normalizeStyle({
            padding: 'var(--space-2)',
            fontSize: config.textSize,
            border: `var(--border-width-1) solid var(--color-border-light)`,
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: 'var(--color-background-tertiary)',
            color: 'var(--color-text-primary)'
          })}
        >
          <option value="all">כל הקטגוריות</option>
          {Object.keys(componentsIndex.categories).map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Complexity Filter */}
        <select
          value={selectedComplexity}
          onChange={(e) => setSelectedComplexity(e.target.value)}
          style={normalizeStyle({
            padding: 'var(--space-2)',
            fontSize: config.textSize,
            border: `var(--border-width-1) solid var(--color-border-light)`,
            borderRadius: 'var(--border-radius-md)',
            backgroundColor: 'var(--color-background-tertiary)',
            color: 'var(--color-text-primary)'
          })}
        >
          <option value="all">כל הרמות</option>
          <option value="simple">פשוט</option>
          <option value="medium">בינוני</option>
          <option value="complex">מורכב</option>
        </select>

        {/* Selected Tags */}
        {selectedTags.map(tag => (
          <span 
            key={tag}
            style={normalizeStyle({
              ...tagStyles,
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)'
            })}
            onClick={() => handleTagToggle(tag)}
          >
            {tag} ×
          </span>
        ))}
      </div>

      {/* Components Grid */}
      <div style={normalizeStyle({
        flex: 1,
        overflow: 'auto',
        display: 'grid',
        gridTemplateColumns: size === 'compact' 
          ? 'repeat(auto-fit, minmax(250px, 1fr))'
          : 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: config.gap
      })}>
        {filteredComponents.map(renderComponentCard)}
      </div>

      {/* Component Details Modal */}
      {selectedComponent && (
        <div style={normalizeStyle({
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        })}>
          <div style={normalizeStyle({
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--border-radius-lg)',
            padding: config.padding,
            maxWidth: '80vw',
            maxHeight: '80vh',
            overflow: 'auto'
          })}>
            <div style={normalizeStyle({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: config.gap
            })}>
              <h3 style={normalizeStyle({
                fontSize: config.titleSize,
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                margin: 0
              })}>
                {selectedComponent[0]}
              </h3>
              <button
                onClick={() => setSelectedComponent(null)}
                style={normalizeStyle({
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: config.titleSize,
                  color: 'var(--color-text-muted)'
                })}
              >
                ×
              </button>
            </div>
            
            <div style={normalizeStyle({
              fontSize: config.textSize,
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-height-relaxed)'
            })}>
              <p><strong>תיאור:</strong> {selectedComponent[1].description}</p>
              <p><strong>קטגוריה:</strong> {selectedComponent[1].category}</p>
              <p><strong>מורכבות:</strong> {selectedComponent[1].complexity}</p>
              <p><strong>נתיב:</strong> <code>{selectedComponent[1].path}</code></p>
              <p><strong>תכונות:</strong></p>
              <ul>
                {selectedComponent[1].features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <p><strong>Props נדרשים:</strong> {selectedComponent[1].requiredProps.join(', ') || 'ללא'}</p>
              <p><strong>תגיות:</strong> {selectedComponent[1].tags.join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export with style normalization HOC
export default withNormalizedStyles(ComponentsExplorer);