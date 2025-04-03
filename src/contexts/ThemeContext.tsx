
import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
  darkMode: boolean;
  fontSize: FontSize;
  toggleDarkMode: () => void;
  setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('darkMode') === 'true' || false
  );
  const [fontSize, setFontSize] = useState<FontSize>(
    (localStorage.getItem('fontSize') as FontSize) || 'medium'
  );

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Store preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    // Apply font size
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch (fontSize) {
      case 'small':
        document.documentElement.classList.add('text-sm');
        break;
      case 'medium':
        document.documentElement.classList.add('text-base');
        break;
      case 'large':
        document.documentElement.classList.add('text-lg');
        break;
    }
    
    // Store preference
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const value = {
    darkMode,
    fontSize,
    toggleDarkMode,
    setFontSize,
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
