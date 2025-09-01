'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NotificationTranslation extends Model {
    static associate(models) {
      belongsTo(models.Notification, { foreignKey: 'notification_id' });
    }
  }
  NotificationTranslation.init({
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