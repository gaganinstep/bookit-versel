const authRoute = require('./auth');

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
];

module.exports = routes;
