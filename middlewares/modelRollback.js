const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const { connectDatabase } = require('../config/dbConnection');
const logger = require('../config/logger');
const modules = require('../module.json');

(async () => {
  try {
    const sequelize = await connectDatabase(process.env.DB_TYPE);
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

    const runRollbacks = async () => {
      try {
        for (const folder of migrationFolders.reverse()) {
          // Reverse the order for rollbacks
          const migrations = fs
            .readdirSync(folder)
            .filter((file) => file.endsWith('.js'))
            .reverse();
          for (const migration of migrations) {
            const migrationPath = path.join(folder, migration);
            const migrationModule = require(migrationPath);
            await migrationModule.down(
              sequelize.getQueryInterface(),
              Sequelize
            );
            console.log(`Rolled back: ${migration}`);
          }
        }
        await sequelize.close();
      } catch (error) {
        console.error('Error running rollbacks:', error);
        process.exit(1);
      }
    };

    runRollbacks();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
