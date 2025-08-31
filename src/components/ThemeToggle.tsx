import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log('Current theme mode:', themeMode);
    toggleTheme();
    console.log('Theme toggle clicked');
  };

  return (
    <button
      className="p-2 rounded-lg glass-effect hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
      onClick={handleToggle}
      title={`Cambiar a modo ${themeMode === 'light' ? 'oscuro' : 'claro'}`}
    >
      {themeMode === 'light' ? (
        <Moon size={16} className="text-gray-800" />
      ) : (
        <Sun size={16} className="text-black" />
      )}
    </button>
  );
};
