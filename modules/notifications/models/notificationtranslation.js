'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NotificationTranslation extends Model {
    static associate(models) {
      NotificationTranslation.belongsTo(models.Notification, { foreignKey: 'notification_id' });
    }
  }
  NotificationTranslation.init({
     id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    notification_id: DataTypes.UUID,
    language_code: DataTypes.STRING,
    title: DataTypes.STRING,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'NotificationTranslation',
  });
  return NotificationTranslation;
};