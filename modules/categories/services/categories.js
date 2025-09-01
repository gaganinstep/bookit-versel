const { Op } = require("sequelize");
const { getAllModels } = require("../../../middlewares/loadModels");
const CustomError = require("../../../middlewares/customError");

exports.createCategory = async (data) => {
  const { Category, CategoryRelation } = await getAllModels(process.env.DB_TYPE);

  const slugifyBase = (str) =>
    str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

  const generateUniqueSlug = async (Model, baseName, attempt = 0) => {
    const baseSlug = slugifyBase(baseName);
    const suffix = `-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalSlug = `${baseSlug}${attempt === 0 ? '' : suffix}`;

    const exists = await Model.findOne({ where: { slug: finalSlug } });
    if (exists) return generateUniqueSlug(Model, baseName, attempt + 1);
    return finalSlug;
  };

  if (!data.slug) {
    data.slug = await generateUniqueSlug(Category, data.name);
  }

if (data.level > 0 && !data.parent_id) {
  throw new CustomError(`Parent category is required for categories with level ${data.level}`, 422);
}

  const category_info = await Category.create(data);

  if (Array.isArray(data.related_categories) && data.related_categories.length > 0 && category_info.level === 0) {
    const relations = data.related_categories.map((related_id) => ({
      category_id: category_info.id,
      related_category_id: related_id,
    }));
    await CategoryRelation.bulkCreate(relations);
  }

  return category_info;
};


exports.updateCategory = async (id, data) => {
  const { Category } = await getAllModels(process.env.DB_TYPE);

  await Category.update(data, { where: { id } });

  const updatedCategory = await Category.findByPk(id, {
    attributes: ['id', 'name', 'slug', 'description', 'level', 'is_active', 'is_class'],
  });

  return updatedCategory;
};

exports.deleteCategory = async (id) => {
  const { Category } = await getAllModels(process.env.DB_TYPE);

  const category = await Category.findByPk(id);

  if (!category) return null;

  await Category.update({ is_active: false }, { where: { id } });

  const allRelatedCategories = await Category.findAll({
    where: { parent_id: category.id },
  });

  for (const relatedCategory of allRelatedCategories) {
    await Category.update({ is_active: false }, {
      where: { id: relatedCategory.id }
    });
  }

  return category;
};


exports.listCategories = async ({ 
  q, 
  level, 
  parent_id, 
  id, 
  limit, 
  offset = 0, 
  page 
}) => {
  const { Category } = await getAllModels(process.env.DB_TYPE);
  const where = {
    is_active: true,
  };

  if(limit != undefined) limit = parseInt(limit, 10);
  offset = parseInt(offset, 10);
  page = page !== undefined ? parseInt(page, 10) : undefined;

  if (!isNaN(page) && page > 0) {
    offset = (page - 1) * limit;
  }

  if (q) where.slug = { [Op.iLike]: `%${q}%` };
  if (level !== undefined) where.level = level;
  if (parent_id) where.parent_id = parent_id;
  if (id) where.id = id;

  const { count, rows } = await Category.findAndCountAll({
    where,
    limit,
    offset,
    order: [["slug", "ASC"]],
  });

  const totalPages = limit > 0 ? Math.ceil(count / limit) : 0;
  const currentPage = limit > 0 ? Math.floor(offset / limit) + 1 : 1;

  return {
    categories: rows,
    count,
    limit,
    offset,
    currentPage,
    totalPages,
  };
};

// ✅ New service methods for offering UI
exports.getCategoriesByLevel = async (level) => {
  const { Category } = await getAllModels(process.env.DB_TYPE);
  
  const categories = await Category.findAll({
    where: {
      level: level,
      is_active: true
    },
    attributes: ['id', 'name', 'slug', 'description', 'level', 'is_class'],
    order: [['name', 'ASC']]
  });

  return categories;
};

exports.getCategoryChildren = async (parentId) => {
  const { Category } = await getAllModels(process.env.DB_TYPE);
  
  const children = await Category.findAll({
    where: {
      parent_id: parentId,
      is_active: true
    },
    attributes: ['id', 'name', 'slug', 'description', 'level', 'is_class'],
    order: [['name', 'ASC']]
  });

  return children;
};
