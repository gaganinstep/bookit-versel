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
    const sequelize = await connectDatabase(process.env.DB_TYPE || 'postgres');
    const migrationFolders = [];

    modules.forEach((element) => {
      const basePath = path.join(__dirname, '../modules/');
      const moduleDir = path.join(basePath, `${element.name}`);
      if (fs.existsSync(moduleDir)) {
        migrationFolders.push(
          path.resolve(basePath, `${element.name}/migrations`)
        );
      } else {
        logger.error({
          message: `MIGRATION MODELS: module directory not found  ${element.name}`,
        });
      }
    });

    const runMigrations = async () => {
      try {
        for (const folder of migrationFolders) {
          const migrations = fs
            .readdirSync(folder)
            .filter((file) => file.endsWith('.js'));
          for (const migration of migrations) {
            const migrationPath = path.join(folder, migration);
            const migrationModule = require(migrationPath);
            await migrationModule.up(sequelize.getQueryInterface(), Sequelize);
            console.log(`Migrated: ${migration}`);
          }
        }
        await sequelize.close();
      } catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
      }
    };

    runMigrations();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
