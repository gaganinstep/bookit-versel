const appointmentsRoute = require('./appointments');

const routes = [
  {
    path: '/appointments',
    route: appointmentsRoute
  }
];

module.exports = routes;
