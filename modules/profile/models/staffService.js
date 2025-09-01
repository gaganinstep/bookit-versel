"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StaffService extends Model {
    static associate(models) {
      StaffService.belongsTo(models.StaffProfile, {
        foreignKey: "staff_profile_id",
        as: "staff_profile_details"
      });
      StaffService.belongsTo(models.BusinessServiceDetail, {
        foreignKey: "service_id",
        as: "service_details", // Optional: alias for the service details
      });
    }
  }

  StaffService.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      staff_profile_id: DataTypes.UUID,
      service_id: DataTypes.UUID,
      is_class: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "StaffService",
    }
  );
  return StaffService;
};
