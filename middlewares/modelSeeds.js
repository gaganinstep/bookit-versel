// seed.js
const fs = require('fs');
const path = require('path');

// Load environment variables before importing other modules
require('dotenv').config({ path: path.join(__dirname, '../env.local') });

const { Sequelize } = require('sequelize');
const { connectDatabase } = require('../config/dbConnection');
const logger = require('../config/logger');
const modules = require('../module.json');

(async () => {
  try {
    const sequelize = await connectDatabase(process.env.DB_TYPE);
    const seedFolders = [];

    modules.forEach((element) => {
      const basePath = path.join(__dirname, '../modules/');
      const moduleDir = path.join(basePath, `${element.name}`);
      if (fs.existsSync(moduleDir)) {
        const seedDir = path.join(basePath, `${element.name}/seeders`);
        if (fs.existsSync(seedDir)) {
          seedFolders.push(path.resolve(basePath, `${element.name}/seeders`));
        }
      } else {
        logger.error({
          message: `SEED MODELS: module directory not found  ${element.name}`,
        });
      }
    });

    const runSeeds = async () => {
      try {
        for (const folder of seedFolders) {
          const seeds = fs
            .readdirSync(folder)
            .filter((file) => file.endsWith('.js'));
          for (const seed of seeds) {
            const seedPath = path.join(folder, seed);
            const seedModule = require(seedPath);
            await seedModule.up(sequelize.getQueryInterface(), Sequelize);
            console.log(`Seeded: ${seed}`);
          }
        }
        await sequelize.close();
      } catch (error) {
        console.error('Error running seeds:', error);
        process.exit(1);
      }
    };

    runSeeds();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
