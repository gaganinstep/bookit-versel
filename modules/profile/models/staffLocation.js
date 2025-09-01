"use strict";
const { Model } = require("sequelize");



module.exports = (sequelize, DataTypes) => {

  class StaffLocation extends Model {
    static associate(models) {
      StaffLocation.belongsTo(models.StaffProfile, {
        foreignKey: "staff_profile_id",
      });
      StaffLocation.belongsTo(models.Location, {
        foreignKey: "location_id",
        as: "location",
      });
    }
  }

  StaffLocation.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      staff_profile_id: DataTypes.UUID,
      location_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "StaffLocation",
    }
  );
  return StaffLocation;
};
