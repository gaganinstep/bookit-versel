'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BusinessHour extends Model {
    static associate(models) {
      // ✅ Properly reference models.Location
      BusinessHour.belongsTo(models.Location, {
        foreignKey: 'location_id',
        onDelete: 'CASCADE',
      });
    }
  }

  BusinessHour.init(
    {
      location_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      day_of_week: DataTypes.STRING,
      open_time: DataTypes.TIME,
      close_time: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: 'BusinessHour',
      tableName: 'BusinessHours',
    }
  );

  return BusinessHour;
};
