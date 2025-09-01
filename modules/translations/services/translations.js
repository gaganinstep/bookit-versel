const { getAllModels } = require('../../../middlewares/loadModels');

exports.upsert = async (data) => {
  const { Translation } = await getAllModels(process.env.DB_TYPE); 
  return await Translation.upsert(data);
};

exports.list = async (filters = {}) => {
  const { Translation } = await getAllModels(process.env.DB_TYPE); 
  return await Translation.findAll({ where: filters });
};

exports.delete = async (id) => {
  const { Translation } = await getAllModels(process.env.DB_TYPE); 
  return await Translation.destroy({ where: { id } });
};
