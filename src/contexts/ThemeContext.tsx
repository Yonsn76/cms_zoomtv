import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedMode = localStorage.getItem('zoom-tv-theme') as ThemeMode;
  const [themeMode, setThemeMode] = useState<ThemeMode>(savedMode || 'dark');

  useEffect(() => {
    console.log('ThemeContext: Applying theme mode:', themeMode);
    
    // Apply theme to document
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      console.log('ThemeContext: Added dark class to html element');
    } else {
      document.documentElement.classList.remove('dark');
      console.log('ThemeContext: Removed dark class from html element');
    }
    
    // Save to localStorage
    localStorage.setItem('zoom-tv-theme', themeMode);
    console.log('ThemeContext: Saved theme to localStorage:', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    console.log('ThemeContext: Toggle theme called, current mode:', themeMode);
    setThemeMode(prev => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      console.log('ThemeContext: Switching from', prev, 'to', newMode);
      return newMode;
    });
  };

  const value: ThemeContextType = {
    themeMode,
    toggleTheme,
    setThemeMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};