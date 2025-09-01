'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryTranslation extends Model {
    static associate(models) {
      belongsTo(models.Category, { foreignKey: 'category_id' });
    }
  }
  CategoryTranslation.init({
    category_id: DataTypes.UUID,
    language_code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CategoryTranslation',
  });
  return CategoryTranslation;
};