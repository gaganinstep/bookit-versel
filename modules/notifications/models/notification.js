'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'user_id' });
      Notification.hasMany(models.NotificationTranslation, { foreignKey: 'notification_id' });
    }
  }
  Notification.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: DataTypes.UUID,
    channel: DataTypes.STRING,
    sent_at: DataTypes.DATE,
    opened_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};