const fs = require('fs');
const path = require('path');

function dynamicModuleLoader(app) {
  const pluginsDir = path.join(__dirname, 'modules');

  fs.readdirSync(pluginsDir).forEach((file) => {
    if (file.endsWith('.js')) {
      const plugin = require(path.join(pluginsDir, file));
      plugin(app);
    }
  });
}

module.exports = { dynamicModuleLoader };
