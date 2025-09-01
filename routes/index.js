const express = require('express');
const fs = require('fs');
const path = require('path');
const modules = require('../module.json');
const logger = require('../config/logger');

const router = express.Router();
let fields = [];
modules.forEach((element) => {
  const moduleDir = path.join(__dirname, `../modules/${element.name}`);
  if (fs.existsSync(moduleDir)) {
    const routes = require(`../modules/${element.name}/routes`);

    const fieldsDir = path.join(
      __dirname,
      `../modules/${element.name}/routes/fields.js`
    );

    routes.forEach((route) => {
      router.use(route.path, route.route);
    });
    if (fs.existsSync(fieldsDir)) {
      const {
        routeParams,
      } = require(`../modules/${element.name}/routes/fields.js`);
      fields = [...fields, ...routeParams];
    }
  } else {
    logger.error({ message: `module directory not found ${element.name}` });
  }
});

module.exports = { routes: router, fields };
