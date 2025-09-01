'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.belongsTo(models.Business, {
        foreignKey: 'business_id',
        onDelete: 'CASCADE',
      });

      Service.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
        onDelete: 'CASCADE',
      });

      Service.hasMany(models.ServiceTranslation, {
        foreignKey: 'service_id',
        onDelete: 'CASCADE',
      });

      Service.hasMany(models.ServiceDuration, {
        foreignKey: 'service_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Service.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      business_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      is_class: DataTypes.BOOLEAN,
      image_url: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Service',
      tableName: 'Services'
    }
  );

  return Service;
};
