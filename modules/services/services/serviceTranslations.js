const { getAllModels } = require("../../../middlewares/loadModels");

exports.upsert = async (service_id, data) => {
  const { ServiceTranslation } = await getAllModels(process.env.DB_TYPE); 
  return await ServiceTranslation.upsert({
    ...data,
    service_id
  });
};

exports.list = async (service_id) => {
  const { ServiceTranslation } = await getAllModels(process.env.DB_TYPE); 
  return await ServiceTranslation.findAll({ where: { service_id } });
};

exports.delete = async (service_id, language_code) => {
  const { ServiceTranslation } = await getAllModels(process.env.DB_TYPE); 
  return await ServiceTranslation.destroy({ where: { service_id, language_code } });
};
