const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const { connectDatabase } = require('../config/dbConnection');
const { supportedDbTypes } = require('../utils/staticData');
const { unsupportedDBType } = require('../utils/messages');
const { unableConnect } = require('../utils/messages');
const modules = require('../module.json');
const logger = require('../config/logger');

const getSequelizeModels = async () => {
  const sequelize = await connectDatabase(process.env.DB_TYPE);
  const models = { sequelize };

  try {
    const modelPaths = [];

    modules.forEach((element) => {
      const basePath = path.join(__dirname, '../modules/');
      const moduleDir = path.join(basePath, `${element.name}`);
      if (fs.existsSync(moduleDir)) {
        const seedDir = path.join(basePath, `${element.name}/models`);
        if (fs.existsSync(seedDir)) {
          modelPaths.push(path.resolve(basePath, `${element.name}/models`));
        }
      } else {
        logger.error({
          message: `LOAD MODELS: module directory not found  ${element.name}`,
        });
      }
    });

    const loadModels = (dir) => {
      fs.readdirSync(dir)
        .filter((file) => file.endsWith('.js'))
        .forEach((file) => {
          const modelPath = path.join(dir, file);
          const model = require(modelPath)(sequelize, Sequelize.DataTypes);
          models[model.name] = model;
        });
    };
    // Load models from each specified model path
    modelPaths.forEach((modelsPath) => {
      loadModels(modelsPath);
    });
    Object.keys(models).forEach((modelName) => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });
  } catch (error) {
    console.error(unableConnect, error);
  }

  return models;
};

const getAllModels = async (dbType) => {
  switch (dbType) {
  case supportedDbTypes.postgres:
  case supportedDbTypes.mysql:
  case supportedDbTypes.mssql:
    return getSequelizeModels();
  default:
    throw new Error(unsupportedDBType);
  }
};
module.exports = {
  getAllModels,
};
