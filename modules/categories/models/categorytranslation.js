'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CategoryTranslation extends Model {
    static associate(models) {
      CategoryTranslation.belongsTo(models.Category, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE'
      });
    }
  }

  CategoryTranslation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      language_code: DataTypes.STRING,
      name: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'CategoryTranslation',
      tableName: 'CategoryTranslations'
    }
  );

  return CategoryTranslation;
};
