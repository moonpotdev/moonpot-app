import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const supportedLanguages = {
  en: 'English',
  id: 'Bahasa Indonesia',
  zh: '中文',
};

const resources = Object.fromEntries(
  Object.keys(supportedLanguages).map(code => [
    code,
    { translation: require(`./locales/${code}/translation.json`) },
  ])
);

i18n
  // load translation using http -> see /public/locales
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'span', 'wbr'],
      useSuspense: true,
    },
  });

export default i18n;
