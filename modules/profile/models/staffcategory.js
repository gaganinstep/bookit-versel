'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StaffCategory extends Model {
    static associate(models) {
      // Optional: you can define reverse associations here if needed
      StaffCategory.belongsTo(models.StaffProfile, {
        foreignKey: 'staff_profile_id',
        onDelete: 'CASCADE',
      });

      StaffCategory.belongsTo(models.Category, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
      });
    }
  }

  StaffCategory.init(
    {
      staff_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
    },
    {
      sequelize,
      modelName: 'StaffCategory',
      tableName: 'StaffCategories',
      underscored: true, // Maps created_at, updated_at instead of createdAt, updatedAt
      timestamps: true,  // Enable automatic created_at and updated_at columns
    }
  );

  return StaffCategory;
};
