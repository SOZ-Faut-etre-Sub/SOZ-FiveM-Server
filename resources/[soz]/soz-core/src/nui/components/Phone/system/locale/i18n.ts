import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { fr } from './fr';

i18n.use(initReactI18next).init({
    lng: 'fr',
    saveMissing: true,
    fallbackLng: 'fr',
    interpolation: {
        escapeValue: false,
    },
    resources: { fr },
});

export default i18n;
