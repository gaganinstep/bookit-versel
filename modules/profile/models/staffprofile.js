"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StaffProfile extends Model {
    static associate(models) {
      StaffProfile.belongsTo(models.User, { foreignKey: "user_id" });

      // ✅ Many-to-Many relationship with Category via StaffCategories
      StaffProfile.belongsToMany(models.Category, {
        through: "StaffCategories",
        foreignKey: "staff_profile_id",
        as: "categories",
      });

      StaffProfile.hasMany(models.StaffLocation, {
        foreignKey: "staff_profile_id",
        as: "locations",
      });

      StaffProfile.hasMany(models.StaffService, {
        foreignKey: "staff_profile_id",
      });

      StaffProfile.hasMany(models.StaffSchedule, {
        foreignKey: "staff_profile_id",
      });
    }
  }

  StaffProfile.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true, // Made optional
      },
      profile_photo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location_id: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      gender: {
        type: DataTypes.ENUM("male", "female"),
      },
      for_class: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_available: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "StaffProfile",
      tableName: "StaffProfiles",
      underscored: true, // optional but recommended for consistency
    }
  );

  return StaffProfile;
};
