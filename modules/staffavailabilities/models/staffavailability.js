'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StaffAvailability extends Model {
    static associate(models) {
      StaffAvailability.belongsTo(models.StaffProfile, { foreignKey: 'staff_profile_id' });
      StaffAvailability.belongsTo(models.Location, { foreignKey: 'location_id' });
    }
  }
  StaffAvailability.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    staff_profile_id: DataTypes.UUID,
    location_id: DataTypes.UUID,
    weekday: DataTypes.INTEGER,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'StaffAvailability',
  });
  return StaffAvailability;
};