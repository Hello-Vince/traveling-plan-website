import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppSettings, AccentColor, FontSize, FallingEffect, ThemeMode } from '../types';

const STORAGE_KEY = 'japan-trip-settings';

const defaultSettings: AppSettings = {
  language: 'en',
  theme: 'light',
  accentColor: 'pink',
  fontSize: 'medium',
  fallingEffect: 'none',
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {}
  return defaultSettings;
}

interface SettingsContextType {
  settings: AppSettings;
  setLanguage: (lang: 'en' | 'zhHK') => void;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColor) => void;
  setFontSize: (size: FontSize) => void;
  setFallingEffect: (effect: FallingEffect) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const { i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    localStorage.setItem('japan-trip-lang', settings.language);
  }, [settings]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-accent', settings.accentColor);
    document.documentElement.style.fontSize =
      settings.fontSize === 'small' ? '14px' :
      settings.fontSize === 'large' ? '18px' : '16px';
  }, [settings.theme, settings.accentColor, settings.fontSize]);

  const update = (partial: Partial<AppSettings>) =>
    setSettings((prev) => ({ ...prev, ...partial }));

  const setLanguage = (language: 'en' | 'zhHK') => {
    i18n.changeLanguage(language);
    update({ language });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setLanguage,
        setTheme: (theme) => update({ theme }),
        setAccentColor: (accentColor) => update({ accentColor }),
        setFontSize: (fontSize) => update({ fontSize }),
        setFallingEffect: (fallingEffect) => update({ fallingEffect }),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
