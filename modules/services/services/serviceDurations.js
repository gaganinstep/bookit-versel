const { getAllModels } = require('../../../middlewares/loadModels');

exports.create = async (service_id, data) => {
  const { ServiceDuration } = await getAllModels(process.env.DB_TYPE);
  return await ServiceDuration.create({ ...data, service_id });
};

exports.list = async (service_id) => {
  const { ServiceDuration } = await getAllModels(process.env.DB_TYPE); 
  return await ServiceDuration.findAll({ where: { service_id } });
};

exports.update = async (id, data) => {
  const { ServiceDuration } = await getAllModels(process.env.DB_TYPE); 
  return await ServiceDuration.update(data, { where: { id } });
};

exports.delete = async (id) => {
  const { ServiceDuration } = await getAllModels(process.env.DB_TYPE); 
  return await ServiceDuration.update({ is_active: false }, { where: { id } });
};
