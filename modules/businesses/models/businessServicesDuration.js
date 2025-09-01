'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BusinessServiceDuration extends Model {
    static associate(models) {
      BusinessServiceDuration.belongsTo(models.Business, {
        foreignKey: 'business_id',
        onDelete: 'CASCADE',
      });

      BusinessServiceDuration.belongsTo(models.BusinessServiceDetail, {
        foreignKey: 'service_detail_id',
        as: 'service_detail',
        onDelete: 'CASCADE',
      });
    }
  }

  BusinessServiceDuration.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      service_detail_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      package_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      package_person: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'BusinessServiceDuration',
      tableName: 'BusinessServiceDurations',
    }
  );

  return BusinessServiceDuration;
};
