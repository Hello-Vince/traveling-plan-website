import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import type { AccentColor, FontSize, FallingEffect } from '../../types';
import styles from './Settings.module.css';

const accentColors: { id: AccentColor; hex: string }[] = [
  { id: 'pink', hex: '#F4A7BB' },
  { id: 'sage', hex: '#B8D4A3' },
  { id: 'lavender', hex: '#D4B8E0' },
  { id: 'sky', hex: '#A8D8EA' },
];

export default function Settings() {
  const { t } = useTranslation();
  const {
    settings,
    setLanguage,
    setTheme,
    setAccentColor,
    setFontSize,
    setFallingEffect,
    setDestination,
    setYear,
  } = useSettings();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('settings.title')}</h2>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>{t('settings.language')}</p>
        <div className={styles.optionRow}>
          <button
            className={`${styles.optionBtn} ${settings.language === 'en' ? styles.active : ''}`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button
            className={`${styles.optionBtn} ${settings.language === 'zhHK' ? styles.active : ''}`}
            onClick={() => setLanguage('zhHK')}
          >
            廣東話
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>{t('settings.theme')}</p>
        <div className={styles.optionRow}>
          <button
            className={`${styles.optionBtn} ${settings.theme === 'light' ? styles.active : ''}`}
            onClick={() => setTheme('light')}
          >
            ☀️ {t('settings.light')}
          </button>
          <button
            className={`${styles.optionBtn} ${settings.theme === 'dark' ? styles.active : ''}`}
            onClick={() => setTheme('dark')}
          >
            🌙 {t('settings.dark')}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>{t('settings.accentColor')}</p>
        <div className={styles.optionRow}>
          {accentColors.map((c) => (
            <button
              key={c.id}
              className={`${styles.colorSwatch} ${settings.accentColor === c.id ? styles.active : ''}`}
              style={{ background: c.hex }}
              onClick={() => setAccentColor(c.id)}
              aria-label={c.id}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>{t('settings.fontSize')}</p>
        <div className={styles.optionRow}>
          {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
            <button
              key={size}
              className={`${styles.optionBtn} ${settings.fontSize === size ? styles.active : ''}`}
              onClick={() => setFontSize(size)}
            >
              {t(`settings.${size}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>{t('settings.fallingEffect')}</p>
        <div className={styles.optionRow}>
          {(['none', 'snowflakes', 'cherry', 'stars'] as FallingEffect[]).map((effect) => (
            <button
              key={effect}
              className={`${styles.optionBtn} ${settings.fallingEffect === effect ? styles.active : ''}`}
              onClick={() => setFallingEffect(effect)}
            >
              {effect === 'snowflakes' && '❄️ '}
              {effect === 'cherry' && '🌸 '}
              {effect === 'stars' && '⭐ '}
              {t(`settings.${effect}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>{t('settings.destination')}</p>
        <input
          type="text"
          className={styles.textInput}
          value={settings.destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}>{t('settings.year')}</p>
        <input
          type="number"
          className={styles.textInput}
          value={settings.year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
