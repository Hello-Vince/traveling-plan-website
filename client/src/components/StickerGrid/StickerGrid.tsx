import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../contexts/SettingsContext';
import type { Sticker } from '../../types';
import styles from './StickerGrid.module.css';

const API = '/api/stickers';

export default function StickerGrid() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [stickers, setStickers] = useState<Sticker[]>([]);

  useEffect(() => {
    fetch(API).then((r) => r.json()).then(setStickers).catch(console.error);
  }, []);

  const toggleSticker = async (sticker: Sticker) => {
    try {
      const res = await fetch(`${API}/${sticker._id}`, { method: 'PATCH' });
      const updated = await res.json();
      setStickers((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
    } catch (err) {
      console.error('Failed to toggle sticker', err);
    }
  };

  const lang = settings.language as 'en' | 'zhHK';
  const selectedCount = stickers.filter((s) => s.selected).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('stickers.title')}</h2>
        <p className={styles.subtitle}>{t('stickers.subtitle')}</p>
      </div>

      <div className={styles.grid}>
        {stickers.map((sticker) => (
          <button
            key={sticker._id}
            className={`${styles.stickerCard} ${sticker.selected ? styles.selected : ''}`}
            onClick={() => toggleSticker(sticker)}
          >
            <span className={styles.emoji}>{sticker.emoji}</span>
            <span className={styles.label}>{sticker.name[lang]}</span>
          </button>
        ))}
      </div>

      <p className={styles.counter}>
        <span className={styles.counterNum}>{selectedCount}</span> / {stickers.length}{' '}
        {t('stickers.selected')}
      </p>
    </div>
  );
}
