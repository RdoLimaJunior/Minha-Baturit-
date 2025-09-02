import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Theme, FontSize } from '../types';

interface AccessibilityContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

const FONT_SIZES: FontSize[] = ['sm', 'base', 'lg', 'xl'];

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('font-size') as FontSize) || 'base';
    }
    return 'base';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
        const isDark =
          theme === 'dark' ||
          (theme === 'system' && mediaQuery.matches);
        root.classList.toggle('dark', isDark);
    };

    applyTheme();
    localStorage.setItem('theme', theme);
    
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);

  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('font-size-sm', 'font-size-base', 'font-size-lg', 'font-size-xl');
    root.classList.add(`font-size-${fontSize}`);
    localStorage.setItem('font-size', fontSize);
  }, [fontSize]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const increaseFontSize = useCallback(() => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (currentIndex < FONT_SIZES.length - 1) {
      setFontSizeState(FONT_SIZES[currentIndex + 1]);
    }
  }, [fontSize]);
  
  const decreaseFontSize = useCallback(() => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSizeState(FONT_SIZES[currentIndex - 1]);
    }
  }, [fontSize]);

  const resetFontSize = useCallback(() => {
    setFontSizeState('base');
  }, []);

  const value = { theme, setTheme, fontSize, increaseFontSize, decreaseFontSize, resetFontSize };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
