const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en-us', 'ar'], // Add your supported locales
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en-us',
  queryParameter: 'lang', // fallback way to override
  objectNotation: true,
  autoReload: true,
  updateFiles: false, // prevent writing to files on missing keys
  syncFiles: true,
  fallbacks: {
  'en': 'en-us',
  'ar-EG': 'ar'
},
});

module.exports = i18n;
