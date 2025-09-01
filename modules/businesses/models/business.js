'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      Business.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'business_owner',
        onDelete: 'CASCADE',
      });

      Business.hasMany(models.BusinessCategory, {
        foreignKey: 'business_id',
        as: 'business_categories',
        onDelete: 'CASCADE',
      });

      Business.hasMany(models.Location, {
        foreignKey: 'business_id',
        as: 'locations',
        onDelete: 'CASCADE',
      });

      Business.hasMany(models.BusinessTranslation, {
        foreignKey: 'business_id',
        as: 'translations',
        onDelete: 'CASCADE',
      });

      Business.hasMany(models.BusinessService, {
        foreignKey: 'business_id',
        as: 'business_services',
        onDelete: 'CASCADE',
      });

      Business.hasMany(models.StaffProfile, {
        foreignKey: 'business_id',
        as: 'staff_profiles', // ✅ updated alias
        onDelete: 'CASCADE',
      });

      Business.hasMany(models.Class, {
        foreignKey: 'business_id',
        as: 'classes', // ✅ updated alias
        onDelete: 'CASCADE',
      });
    }
  }

  Business.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
      user_id: { type: DataTypes.UUID, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING, allowNull: false },
      website: { type: DataTypes.STRING },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      user_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: 'Users', key: 'slug' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      logo_url: DataTypes.STRING,
      cover_image_url: DataTypes.STRING,
      timezone: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      is_onboarding_complete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      active_step: {
        type: DataTypes.ENUM(
          'about_you',
          'locations',
          'services',
          'categories',
          'service_details',
          'complete_onboarding'
        ),
        defaultValue: 'about_you',
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Business',
      tableName: 'Businesses',
      underscored: true,
    }
  );

  return Business;
};
