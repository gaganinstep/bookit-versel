'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BusinessServiceDetail extends Model {
    static associate(models) {
      BusinessServiceDetail.belongsTo(models.Business, {
        foreignKey: 'business_id',
        onDelete: 'CASCADE',
      });

      BusinessServiceDetail.belongsTo(models.BusinessService, {
        foreignKey: 'service_id',
        as: 'business_service',
        onDelete: 'CASCADE',
      });

      BusinessServiceDetail.hasMany(models.BusinessServiceDuration, {
        foreignKey: 'service_detail_id',
        as: 'durations', // ✅ this must match the alias in your include
        onDelete: 'CASCADE',
      });

    }
  }

  BusinessServiceDetail.init(
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
      service_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
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
      modelName: 'BusinessServiceDetail',
      tableName: 'BusinessServiceDetails',
      underscored: true, // ✅ maps created_at/updated_at instead of camelCase
    }
  );

  return BusinessServiceDetail;
};
