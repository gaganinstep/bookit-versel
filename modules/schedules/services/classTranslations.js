const { getAllModels } = require('../../../middlewares/loadModels');

exports.upsert = async (class_id, data) => {
  const { ClassTranslation } = await getAllModels(process.env.DB_TYPE);
  return await ClassTranslation.upsert({ ...data, class_id });
};

exports.list = async (class_id) => {
  const { ClassTranslation } = await getAllModels(process.env.DB_TYPE);
  return await ClassTranslation.findAll({ where: { class_id } });
};

exports.delete = async (class_id, language_code) => {
  const { ClassTranslation } = await getAllModels(process.env.DB_TYPE);
  return await ClassTranslation.destroy({ where: { class_id, language_code } });
};
