import { useTranslation } from 'react-i18next';
import styles from './Navbar.module.css';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'stickers', icon: '🌟', labelKey: 'nav.stickers' },
  { id: 'shopping', icon: '🛍️', labelKey: 'nav.shopping' },
  { id: 'flights', icon: '✈️', labelKey: 'nav.flights' },
  { id: 'itinerary', icon: '📅', labelKey: 'nav.itinerary' },
  { id: 'ledger', icon: '💰', labelKey: 'nav.ledger' },
  { id: 'settings', icon: '⚙️', labelKey: 'nav.settings' },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { t } = useTranslation();

  return (
    <nav className={styles.navbar}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className={styles.navIcon}>{tab.icon}</span>
          <span className={styles.navLabel}>{t(tab.labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
