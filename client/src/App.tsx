import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsProvider } from './contexts/SettingsContext';
import Navbar from './components/Layout/Navbar';
import FallingEffects from './components/Layout/FallingEffects';
import StickerGrid from './components/StickerGrid/StickerGrid';
import ShoppingList from './components/ShoppingList/ShoppingList';
import BoardingPass from './components/BoardingPass/BoardingPass';
import Itinerary from './components/Itinerary/Itinerary';
import Ledger from './components/Ledger/Ledger';
import Settings from './components/Settings/Settings';
import './App.css';

function AppContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('stickers');

  return (
    <>
      <FallingEffects />
      <div className="app">
        <header className="appHeader">
          <h1 className="appTitle">
            <span className="sakuraLeft">🍁</span>
            {t('app.title')}
            <span className="sakuraRight">🍁</span>
          </h1>
          <p className="appSubtitle">{t('app.subtitle')}</p>
        </header>

        <main>
          {activeTab === 'stickers' && <StickerGrid />}
          {activeTab === 'shopping' && <ShoppingList />}
          {activeTab === 'flights' && <BoardingPass />}
          {activeTab === 'itinerary' && <Itinerary />}
          {activeTab === 'ledger' && <Ledger />}
          {activeTab === 'settings' && <Settings />}
        </main>

        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
