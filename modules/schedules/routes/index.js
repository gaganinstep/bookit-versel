const classesRoute = require('./classes');
const classSchedulesRoute = require('./schedules');
const classTranslationsRoute = require('./classTranslations');

const routes = [
  {
    path: '/classes',
    route: classesRoute
  },
   {
    path: '/',
    route: classSchedulesRoute
  },
   {
    path: '/translations',
    route: classTranslationsRoute
  }
];

module.exports = routes;
