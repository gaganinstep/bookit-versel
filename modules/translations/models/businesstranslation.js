'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessTranslation extends Model {
    static associate(models) {
      belongsTo(models.Business, { foreignKey: 'business_id' });
    }
  }
  BusinessTranslation.init({
    business_id: DataTypes.UUID,
    language_code: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'BusinessTranslation',
  });
  return BusinessTranslation;
};