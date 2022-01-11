import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locale/en.json';
import fr from './locale/fr.json';

// Should we just programatically call for static files
// on the scripts side to avoid having to parse all these
// JSONs for no reason? yes, probably
export const resources = {
  en,
  fr,
} as const;

const missingKeyHandler = (
  lng: Readonly<string[]>,
  s: string,
  key: string,
  fallbackValue: string,
) => {
  if (process.env.NODE_ENV !== 'development') return;
  console.error(
    `!! TRANSLATION KEY NOT FOUND FOR LANGAUGE "${lng}", KEY "${key}". RENDERED ${fallbackValue} INSTEAD"" !!`,
  );
};

i18n.use(initReactI18next).init({
  lng: 'fr',
  // initImmediate: true,
  saveMissing: true,
  missingKeyHandler,
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});

export default i18n;
