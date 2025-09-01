'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      // A permission belongs to many roles
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: 'permissionId',
        otherKey: 'roleId',
        as: 'roles', // ✅ must match the alias used in include()
      });
    }
  }

  Permission.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
      route: DataTypes.STRING,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      group_name: DataTypes.STRING,
      type: {
        type: DataTypes.ENUM('backend', 'frontend'),
        allowNull: false,
        defaultValue: 'backend',
      },
      action: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'Permissions',
      timestamps: true, // Ensures createdAt/updatedAt tracking
    }
  );

  return Permission;
};
