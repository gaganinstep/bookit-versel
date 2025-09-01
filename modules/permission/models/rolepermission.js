'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      // define association here
      if (models.Permission) {
        RolePermission.belongsTo(models.Permission, {
          foreignKey: 'permissionId',
          as: 'permission',
        });
      }
      if (models.Role) {
        RolePermission.belongsTo(models.Role, {
          foreignKey: 'roleId',
          as: 'role',
        });
      }
    }
  }
  RolePermission.init(
    {
       id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull:false,
        primaryKey: true,
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Permission',
          key: 'id',
        },
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Role',
          key: 'id',
        },
      },
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'RolePermission',
    }
  );
  return RolePermission;
};
