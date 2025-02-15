import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
    >
      {language === 'ar' ? 'English' : 'عربي'}
    </button>
  );
};

export default LanguageSwitcher;