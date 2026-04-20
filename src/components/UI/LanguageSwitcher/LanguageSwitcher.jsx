import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button 
      className="lang-switcher" 
      onClick={toggleLanguage}
      aria-label="Toggle Language"
    >
      <span className="lang-code">
        {i18n.language === 'ar' ? 'EN' : 'ع'}
      </span>
      <span className="lang-text">
        {i18n.language === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
