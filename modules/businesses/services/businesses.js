const { Op } = require('sequelize');
const { getAllModels } = require('../../../middlewares/loadModels');

exports.createBusiness = async (data) => {  
  const { Business } = await getAllModels(process.env.DB_TYPE); 
  return await Business.create(data);
};

exports.getBusinessById = async (id) => {
  const { Business } = await getAllModels(process.env.DB_TYPE); 
  return await Business.findByPk(id);
};


exports.updateBusiness = async (id, data) => {
  const { Business } = await getAllModels(process.env.DB_TYPE);
  await Business.update(data, { where: { id } });

  const business = await Business.findByPk(id, {
    attributes: [
      'id',
      'name',
      'email',
      'phone',
      'user_slug',
      'website',
      'slug',
      'logo_url',
      'cover_image_url',
      'timezone',
    ]
  });
  return business
};


exports.deleteBusiness = async (id) =>{
  const { Business } = await getAllModels(process.env.DB_TYPE); 
  await Business.update({ is_active: false }, { where: { id } });
  const data = await Business.findByPk(id, {
   attributes: [
      'id',
      'name',
      'email',
      'phone',
      'is_active'
    ]
  });
  return data;
};

exports.getComprehensiveBusinessServices = async (businessId, categoryId = null) => {
  const { 
    BusinessService, 
    BusinessServiceDetail, 
    BusinessServiceDuration,
    Category 
  } = await getAllModels(process.env.DB_TYPE);

  try {
    // Build where clause
    const whereClause = { business_id: businessId };
    
    if (categoryId) {
      // Check if this is a level 0 category (parent category)
      const parentCategory = await Category.findOne({
        where: { id: categoryId },
        attributes: ['id', 'name', 'level', 'parent_id']
      });
      
      if (parentCategory) {        
        if (parentCategory.level === 0 || parentCategory.parent_id === null) {
          // This is a level 0 category, get all child categories
          const childCategories = await Category.findAll({
            where: { parent_id: categoryId },
            attributes: ['id']
          });
          
          const childCategoryIds = childCategories.map(cat => cat.id);          
          // Filter by business_id AND any of the child category IDs
          whereClause.category_id = { [Op.in]: childCategoryIds };
        } else {
          // This is a specific category, filter by exact category_id
          whereClause.category_id = categoryId;
        }
      }
    }
    
    // Get all BusinessServices with their related data
    const businessServices = await BusinessService.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description', 'is_class', 'parent_id']
        },
        {
          model: BusinessServiceDetail,
          as: 'service_details',
          attributes: ['id', 'name', 'description'],
          include: [
            {
              model: BusinessServiceDuration,
              as: 'durations',
              attributes: ['id', 'duration_minutes', 'price', 'package_amount', 'package_person']
            }
          ]
        }
      ],
      attributes: ['id', 'business_id', 'category_id', 'is_class', 'is_active', 'createdAt', 'updatedAt']
    });
    
    // Transform the data for better structure
    const transformedData = businessServices.map(service => ({
      businessService: {
        id: service.id,
        business_id: service.business_id,
        category_id: service.category_id,
        is_class: service.is_class,
        is_active: service.is_active,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
        category: service.category
      },
      serviceDetails: service.service_details?.map(detail => ({
        id: detail.id,
        name: detail.name,
        description: detail.description,
        durations: detail.durations || []
      })) || []
    }));

    return {
      business_id: businessId,
      total_services: businessServices.length,
      services: transformedData
    };

  } catch (error) {
    console.error('❌ [SERVICE] Error getting comprehensive business services:', error);
    throw error;
  }
};


exports.listBusinesses = async ({
  q,
  id,
  limit = 10,
  offset = 0,
  page,
}) => {
  const { Business, User } = await getAllModels(process.env.DB_TYPE);

  const where = { is_active: true };

  if (id) {
    where.user_id = { [Op.ne]: id };
  } 

  if (q) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { email: { [Op.iLike]: `%${q}%` } },
      { timezone: { [Op.iLike]: `%${q}%` } },
    ];
  }


  limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  page = page !== undefined ? parseInt(page, 10) : undefined;

 if (!isNaN(page) && page > 0) {
    offset = (page - 1) * limit;
  }
    const { count, rows } = await Business.findAndCountAll({
     where,
    limit,
    offset,
    order: [["name", "ASC"]],
    attributes: [
      "id",
      "name",
      "email",
      "phone",
      "website",
      "slug",
      "logo_url",
      "cover_image_url",
      "is_active", 
      "createdAt", 
    ],
    include: [
      {
        model: User,
        as: 'business_owner',
        attributes: [
          "id",
          "full_name",
          "email"
        ]
      }
    ]
  });
   const totalPages = limit > 0 ? Math.ceil(count / limit) : 0;
  const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;


  return {
    items: rows,
    count,
    limit,
    offset,
    currentPage,
    totalPages,
  };
};
