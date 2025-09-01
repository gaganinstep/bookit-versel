'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceTranslation extends Model {
    static associate(models) {
      belongsTo(models.Service, { foreignKey: 'service_id' });
    }
  }
  ServiceTranslation.init({
    service_id: DataTypes.UUID,
    language_code: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ServiceTranslation',
  });
  return ServiceTranslation;
};