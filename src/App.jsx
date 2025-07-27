/**
 * 🎯 Vistara UI - Main App Component
 * "Command your Design."
 */

import React, { useState } from 'react';
import Showcase from './components/Showcase';
import ShowcaseAll from './components/ShowcaseAll';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('showcase-all');

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: 'var(--color-background-primary)',
      color: 'var(--color-text-primary)'
    }}>
      {/* Header */}
      <header className="vistara-surface p-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                Vistara UI
              </h1>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                Command your Design.
              </p>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg border transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border-medium)',
                color: 'var(--color-text-primary)'
              }}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('showcase-all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeView === 'showcase-all' ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: activeView === 'showcase-all' 
                  ? 'var(--color-primary)' 
                  : 'var(--color-surface)',
                color: activeView === 'showcase-all' 
                  ? 'var(--color-white)' 
                  : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              🎯 All Components (74)
            </button>
            <button
              onClick={() => setActiveView('design-system')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeView === 'design-system' ? 'font-semibold' : ''
              }`}
              style={{
                backgroundColor: activeView === 'design-system' 
                  ? 'var(--color-primary)' 
                  : 'var(--color-surface)',
                color: activeView === 'design-system' 
                  ? 'var(--color-white)' 
                  : 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)'
              }}
            >
              🎨 Design System
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6">
        {activeView === 'showcase-all' ? <ShowcaseAll /> : <Showcase />}
      </main>

      {/* Footer */}
      <footer className="mt-16 p-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
        <p>Built with ❤️ by Falcon 🦅 | AI-First UI Development</p>
      </footer>
    </div>
  );
}

export default App;