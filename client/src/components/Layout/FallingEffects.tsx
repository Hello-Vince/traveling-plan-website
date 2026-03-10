import { useMemo } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import styles from './FallingEffects.module.css';

const effectMap = {
  snowflakes: ['❄️', '❅', '❆', '✦'],
  cherry: ['🌸', '💮', '🏵️', '✿'],
  stars: ['⭐', '✨', '💫', '🌟'],
};

export default function FallingEffects() {
  const { settings } = useSettings();

  const particles = useMemo(() => {
    if (settings.fallingEffect === 'none') return [];
    const chars = effectMap[settings.fallingEffect];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      char: chars[i % chars.length],
      left: `${Math.random() * 100}%`,
      duration: `${6 + Math.random() * 8}s`,
      delay: `${Math.random() * 10}s`,
      size: `${0.8 + Math.random() * 0.8}rem`,
    }));
  }, [settings.fallingEffect]);

  if (settings.fallingEffect === 'none') return null;

  return (
    <div className={styles.container}>
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.particle}
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            fontSize: p.size,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}
