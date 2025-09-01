"use strict";
const { Model, ENUM } = require("sequelize");



module.exports = (sequelize, DataTypes) => {

  class StaffSchedule extends Model { 
    static associate(models) {
      StaffSchedule.belongsTo(models.StaffProfile, { foreignKey: "staff_profile_id" }); 
      StaffSchedule.belongsTo(models.Location, { foreignKey: "location_id", as: "location" }); 
    }
  }

  StaffSchedule.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      staff_profile_id: DataTypes.UUID,
      location_id: DataTypes.UUID,
      day: {
        type: DataTypes.ENUM(
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday'
        ),
        defaultValue: 'monday',
        allowNull: false,
      },
      from: DataTypes.STRING,
      to: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StaffSchedule",
    }
  );
  return StaffSchedule;
};
