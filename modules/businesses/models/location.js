'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      Location.belongsTo(models.Business, {
        foreignKey: 'business_id',
        as: 'business_details',
        onDelete: 'CASCADE',
      });

      Location.hasMany(models.BusinessHour, {
        foreignKey: 'location_id',
        as: 'business_hours', // ✅ This should match your eager load alias
        onDelete: 'CASCADE',
      });
    }
  }

  Location.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: DataTypes.STRING,
      address: DataTypes.STRING,
      floor: DataTypes.STRING, // 🆕 Added
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      instructions: DataTypes.TEXT, // 🆕 Added
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      slug: {
      type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      }
    },
    {
      sequelize,
      modelName: 'Location',
      tableName: 'Locations',
    }
  );

  return Location;
};
