'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BusinessHour extends Model {
    static associate(models) {
      BusinessHour.belongsTo(models.Location, { foreignKey: 'location_id' });

    }
  }
  BusinessHour.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    location_id: DataTypes.UUID,
    day_of_week: DataTypes.STRING,
    open_time: DataTypes.TIME,
    close_time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'BusinessHour',
  });
  return BusinessHour;
};