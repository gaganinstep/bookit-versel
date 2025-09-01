'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassTranslation extends Model {
    static associate(models) {
      belongsTo(models.Class, { foreignKey: 'class_id' });
    }
  }
  ClassTranslation.init({
    class_id: DataTypes.UUID,
    language_code: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ClassTranslation',
  });
  return ClassTranslation;
};