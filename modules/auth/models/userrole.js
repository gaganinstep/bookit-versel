'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      if (models.User) {
        UserRole.belongsTo(models.User, {
          foreignKey: 'userId',
          as: 'user',
        });
      }
      if (models.Role) {
        UserRole.belongsTo(models.Role, {
          foreignKey: 'roleId',
          as: 'role',
        });
      }
    }
  }
  UserRole.init(
    {
       id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Role',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'UserRole',
    }
  );
  return UserRole;
};
