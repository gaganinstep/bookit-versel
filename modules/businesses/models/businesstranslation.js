'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BusinessTranslation extends Model {
    static associate(models) {
      BusinessTranslation.belongsTo(models.Business, {
        foreignKey: 'business_id',
        onDelete: 'CASCADE',
      });
    }
  }

  BusinessTranslation.init(
    {
      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      language_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'BusinessTranslation',
      tableName: 'BusinessTranslations',
    }
  );

  return BusinessTranslation;
};
