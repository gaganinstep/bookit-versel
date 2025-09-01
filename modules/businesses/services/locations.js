 const { Op } = require('sequelize');
const { getAllModels } = require('../../../middlewares/loadModels');

exports.createLocation = async (business_id, data) => {
  const { Location } = await getAllModels(process.env.DB_TYPE);
  return await Location.create({ ...data, business_id });
};

exports.getLocationById = async (id) => {
  const { Location } = await getAllModels(process.env.DB_TYPE);
  return await Location.findByPk(id);
};

exports.updateLocation = async (id, data) => {
  const { Location } = await getAllModels(process.env.DB_TYPE);
  return await Location.update(data, { where: { id } });
};

exports.deleteLocation = async (id) => {
  const { Location } = await getAllModels(process.env.DB_TYPE);
  return await Location.update({ is_active: false }, { where: { id } });
};

exports.listLocations = async (business_id, { q, limit = 10, offset = 0 }) => {
  const { Location } = await getAllModels(process.env.DB_TYPE);
  const where = { business_id };
  if (q) where.title = { [Op.iLike]: `%${q}%` };

  return await Location.findAndCountAll({
    where,
    limit,
    offset,
    order: [['title', 'ASC']]
  });
};
