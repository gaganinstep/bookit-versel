'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Role ↔ User (Many-to-Many via UserRole)
      Role.belongsToMany(models.User, {
        through: models.UserRole,
        foreignKey: 'roleId',
        otherKey: 'userId',
        as: 'users',
      });

      // Role ↔ Permission (Many-to-Many via RolePermission)
      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: 'roleId',
        otherKey: 'permissionId',
        as: 'permissions',
      });
    }
  }

  Role.init(
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
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'Roles',
      timestamps: true, // Adds createdAt and updatedAt
    }
  );

  return Role;
};
