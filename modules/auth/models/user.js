'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.StaffProfile, { foreignKey: 'user_id' });
      User.hasMany(models.Appointment, { foreignKey: 'user_id' });
      User.hasOne(models.ClientProfile, { foreignKey: 'user_id' });
      User.hasOne(models.ClientPreference, { foreignKey: 'user_id' });
      User.hasMany(models.Notification, { foreignKey: 'user_id' });

      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: 'userId',
        otherKey: 'roleId',
        as: 'roles',
      });

      User.hasMany(models.Business, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password_hash: DataTypes.STRING,
      salt: DataTypes.STRING,
      oauth_provider: DataTypes.STRING,
      oauth_uid: DataTypes.STRING,
      role: DataTypes.STRING,
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      preferred_language: DataTypes.STRING,
      timezone: DataTypes.STRING,
      otp: {
        type: DataTypes.STRING,
      },
      otp_expires: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );

  return User;
};
