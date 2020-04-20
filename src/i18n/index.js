import i18n from 'i18next';
import moment from 'moment';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Detector from './detector';

const languageDetector = new LanguageDetector();
languageDetector.addDetector(Detector);

i18n
  .use(Backend)
  .use(languageDetector)
  .init({
    debug: false,
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // order and from where user language should be detected
      order: ['default', 'querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain']
    },
    interpolation: {
      format: function(value, format, lng) {
        if (value instanceof Date) return moment(value).local(lng).format(format);
        if (format === 'numeric') return Number(value).toLocaleString(lng);
        return value;
      }
    }
  });

export default i18n;
