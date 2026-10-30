import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // Memberitahu react-i18next untuk menggunakan instance i18n ini
  .init({
    fallbackLng: 'id', // Bahasa default jika terjemahan tidak ditemukan
    debug: false,
    interpolation: {
      escapeValue: false, // React sudah aman dari XSS
    },
    resources: {
      en: { translation: {} },
      id: { translation: {} },
    },
  });

export default i18n;