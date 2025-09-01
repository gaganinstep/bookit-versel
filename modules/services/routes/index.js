const servicesRoute = require('./services');
const serviceDurationsRoute = require('./serviceDurations');
const serviceTranslationsRoute = require('./serviceTranslations');

const routes = [
  {
    path: '/services',
    route: servicesRoute,
  },
  {
    path: '/services/duration',
    route: serviceDurationsRoute
  },
  {
    path: '/servicestranslation',
    route: serviceTranslationsRoute
  }
];

module.exports = routes;
