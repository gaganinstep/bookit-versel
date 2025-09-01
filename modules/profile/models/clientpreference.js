"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClientPreference extends Model {
    static associate(models) {
      ClientPreference.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  ClientPreference.init(
    {
      id: {
        allowNull: false, 
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: DataTypes.UUID,
      preferred_categories: DataTypes.STRING,
      preferred_locations: DataTypes.STRING,
      allow_notifications: DataTypes.BOOLEAN,
      preferred_days: DataTypes.STRING,
      preferred_time_slots: DataTypes.STRING,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ClientPreference",
    }
  );
  return ClientPreference;
};
