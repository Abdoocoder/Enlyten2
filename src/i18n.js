import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en.json";
import arTranslations from "./locales/ar.json";

const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("i18nextLng") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

// Handle direction change globally
const updateDirection = (lang) => {
  const dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
};

// Update direction on initial load
updateDirection(i18n.language);

// Listen for language changes
i18n.on('languageChanged', (lng) => {
  updateDirection(lng);
  localStorage.setItem("i18nextLng", lng);
});

export default i18n;
