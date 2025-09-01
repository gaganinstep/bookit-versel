'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BusinessCategory extends Model {
    static associate(models) {
      BusinessCategory.belongsTo(models.Business, {
        foreignKey: 'business_id',
        onDelete: 'CASCADE',
      });

      BusinessCategory.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category', // ✅ important for eager loading
        onDelete: 'CASCADE',
      });
    }
  }

  BusinessCategory.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      business_id: { type: DataTypes.UUID, allowNull: false },
      category_id: { type: DataTypes.UUID, allowNull: false },
    },
    {
      sequelize,
      modelName: 'BusinessCategory',
      tableName: 'BusinessCategories',
    }
  );

  return BusinessCategory;
};
