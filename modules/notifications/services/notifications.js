const { getAllModels } = require('../../../middlewares/loadModels');

exports.create = async ({ user_id, channel, language_code, title, message }) => {
  const { Notification, NotificationTranslation } = await getAllModels(process.env.DB_TYPE); 
  const notification = await Notification.create({ user_id, channel, sent_at: new Date() });

  await NotificationTranslation.create({
    notification_id: notification.id,
    language_code,
    title,
    message
  });

  return notification;
};

exports.list = async () => {
  const { Notification, NotificationTranslation } = await getAllModels(process.env.DB_TYPE); 
  return await Notification.findAll({
    include: [{ model: NotificationTranslation }]
  });
};

exports.get = async (id) => {
  const { Notification, NotificationTranslation } = await getAllModels(process.env.DB_TYPE); 
  return await Notification.findByPk(id, {
    include: [{ model: NotificationTranslation }]
  });
};

exports.delete = async (id) => {
  const { Notification,NotificationTranslation } = await getAllModels(process.env.DB_TYPE); 
  await NotificationTranslation.destroy({ where: { notification_id: id } });
  return await Notification.destroy({ where: { id } });
};
