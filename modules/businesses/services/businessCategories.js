const { getAllModels } = require('../../../middlewares/loadModels');

exports.assignCategories = async (business_id, category_ids) => {
  const { BusinessCategory } = await getAllModels(process.env.DB_TYPE); 
  await BusinessCategory.destroy({ where: { business_id } });

  const records = category_ids.map(category_id => ({ business_id, category_id }));
  return await BusinessCategory.bulkCreate(records);
};

exports.getCategoriesByBusiness = async (business_id) => {
  const { BusinessCategory, Category, CategoryRelation } = await getAllModels(process.env.DB_TYPE); 

  return await BusinessCategory.findAll({
    where: { business_id },
    attributes: ['id'],
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'is_class', 'name', 'description'],
        include: [
          {
            model: CategoryRelation,
            as: 'related',
            attributes: ['id'],
            include: [
              {
                model: Category,
                as: 'related_category',
                attributes: ['id', 'name', 'slug', 'description', 'is_class'] 
              }
            ],
            raw: true
          }
        ]
      }
    ]
  });
};


exports.removeAllCategories = async (business_id) => {
  const { BusinessCategory } = await getAllModels(process.env.DB_TYPE); 
  return await BusinessCategory.destroy({ where: { business_id } });
};
