'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Translation extends Model {
    static associate(models) {
    }
  }
  Translation.init({
    key: DataTypes.STRING,
    language_code: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Translation',
  });
  return Translation;
};