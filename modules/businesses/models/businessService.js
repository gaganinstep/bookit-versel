'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BusinessService extends Model {
    static associate(models) {
      BusinessService.belongsTo(models.Business, {
        foreignKey: 'business_id',
        onDelete: 'CASCADE',
      });

      BusinessService.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
        onDelete: 'CASCADE',
      });

      BusinessService.hasMany(models.BusinessServiceDetail, {
        foreignKey: 'service_id',
        as: 'service_details', // ✅ used only once
        onDelete: 'CASCADE',
      });

      BusinessService.hasMany(models.ClassSchedule, {
        foreignKey: 'class_id',
        as: 'schedules',
        onDelete: 'CASCADE',
      });
    }
  }

  BusinessService.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      is_class: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'BusinessService',
      tableName: 'BusinessServices',
    }
  );

  return BusinessService;
};
