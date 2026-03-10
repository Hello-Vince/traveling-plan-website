import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import zhHK from './zhHK.json';

const savedLang = localStorage.getItem('japan-trip-lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zhHK: { translation: zhHK },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
