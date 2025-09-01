'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ServiceTranslation extends Model {
    static associate(models) {
      ServiceTranslation.belongsTo(models.Service, {
        foreignKey: 'service_id',
        onDelete: 'CASCADE'
      });
    }
  }

  ServiceTranslation.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      service_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      language_code: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'ServiceTranslation',
      tableName: 'ServiceTranslations'
    }
  );

  return ServiceTranslation;
};
