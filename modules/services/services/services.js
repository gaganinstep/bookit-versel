const { Op } = require('sequelize');
const { getAllModels } = require('../../../middlewares/loadModels');

exports.createService = async (data) => {
  const { Service } = await getAllModels(process.env.DB_TYPE); 
  
  return await Service.create(data);
};

exports.getServiceById = async (id) => {
  const { Service } = await getAllModels(process.env.DB_TYPE); 
  return await Service.findByPk(id);
};

exports.updateService = async (id, data) => {
  const { Service } = await getAllModels(process.env.DB_TYPE);
  await Service.update(data, { where: { id } });

  const service = await Service.findByPk(id);
  return service;
};

exports.deleteService = async (id) => {
  const { Service } = await getAllModels(process.env.DB_TYPE);
  await Service.update({ is_active: false }, { where: { id } });
  const service = await Service.findByPk(id,{attributes:['id','category_id', 'is_active']});
  
  return service;
};

exports.listServices = async ({ q, business_id, is_class, limit = 10, offset = 0, name, description, level, is_active }) => {
  const { Service, Category } = await getAllModels(process.env.DB_TYPE);  

  const where = {};
  if (business_id) where.business_id = business_id;
  if (is_class !== undefined) where.is_class = is_class;
  if (q) where.title = { [Op.iLike]: `%${q}%` };   

  const categoryWhere = {};
  if (name) categoryWhere.name = { [Op.iLike]: `%${name}%` };
  if (description) categoryWhere.description = { [Op.iLike]: `%${description}%` };
  if (level !== undefined) categoryWhere.level = level;
  if (is_active !== undefined) categoryWhere.is_active = is_active;

  return await Service.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['name', 'description', 'level', 'is_active'],
        where: Object.keys(categoryWhere).length ? categoryWhere : undefined,
        required: true,  
      },
    ],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
};
