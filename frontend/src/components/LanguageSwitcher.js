import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { getLanguages, changeLanguage } from '../i18n';

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const languages = getLanguages();
  const currentLang = i18n.language?.split('-')[0] || 'en';

  const handleChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-gray-500" />
      <select
        value={currentLang}
        onChange={handleChange}
        className="bg-transparent border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};

// Compact version for mobile
export const LanguageSwitcherCompact = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const languages = getLanguages();
  const currentLang = i18n.language?.split('-')[0] || 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'sw' : 'en';
    changeLanguage(nextLang);
  };

  const currentLangData = languages.find(l => l.code === currentLang);

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors ${className}`}
      title="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{currentLangData?.code.toUpperCase()}</span>
    </button>
  );
};

export default LanguageSwitcher;
