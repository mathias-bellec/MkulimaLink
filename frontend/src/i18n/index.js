import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en.json';
import sw from './locales/sw.json';

const resources = {
  en: { translation: en },
  sw: { translation: sw }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'sw'],
    
    interpolation: {
      escapeValue: false // React already escapes
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mkulimalink_language'
    },

    react: {
      useSuspense: true
    }
  });

export default i18n;

// Helper to change language
export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('mkulimalink_language', lang);
};

// Get current language
export const getCurrentLanguage = () => i18n.language;

// Get available languages
export const getLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' }
];
