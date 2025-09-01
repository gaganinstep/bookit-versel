const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
let fields = [];

// Try to load modules with error handling
try {
  const modules = require('../module.json');
  console.log('[Routes] Module configuration loaded successfully');
  
  modules.forEach((element) => {
    try {
      const moduleDir = path.join(__dirname, `../modules/${element.name}`);
      if (fs.existsSync(moduleDir)) {
        console.log(`[Routes] Loading module: ${element.name}`);
        
        // Try to load routes
        try {
          const routes = require(`../modules/${element.name}/routes`);
          routes.forEach((route) => {
            router.use(route.path, route.route);
            console.log(`[Routes] Mounted route: ${route.path} for module: ${element.name}`);
          });
        } catch (routeError) {
          console.error(`[Routes] Failed to load routes for module ${element.name}:`, routeError.message);
        }

        // Try to load fields
        try {
          const fieldsDir = path.join(__dirname, `../modules/${element.name}/routes/fields.js`);
          if (fs.existsSync(fieldsDir)) {
            const { routeParams } = require(`../modules/${element.name}/routes/fields.js`);
            if (routeParams && Array.isArray(routeParams)) {
              fields = [...fields, ...routeParams];
              console.log(`[Routes] Loaded ${routeParams.length} fields for module: ${element.name}`);
            }
          }
        } catch (fieldsError) {
          console.error(`[Routes] Failed to load fields for module ${element.name}:`, fieldsError.message);
        }
      } else {
        console.error(`[Routes] Module directory not found: ${element.name}`);
      }
    } catch (moduleError) {
      console.error(`[Routes] Error processing module ${element.name}:`, moduleError.message);
    }
  });
  
  console.log(`[Routes] Successfully loaded ${fields.length} fields and mounted routes`);
} catch (error) {
  console.error('[Routes] Failed to load module configuration:', error.message);
  
  // Create fallback routes if module loading fails
  router.get('/', (req, res) => {
    res.json({
      status: 'warning',
      message: 'Routes module loading failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  });
}

module.exports = { routes: router, fields };
