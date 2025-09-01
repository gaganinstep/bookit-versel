const service = require('../services/categories');
const { sendResponse } = require('../utils/helper');

exports.createCategory = async (req, res) => {
  const category = await service.createCategory(req.body);
  return sendResponse(res, 201, true, req.__('category.created'), { category });
};

exports.updateCategory = async (req, res) => {
  const updatedCategory = await service.updateCategory(req.params.id, req.body);
  return sendResponse(res, 200, true, req.__('category.updated'), { updatedCategory });
};

exports.deleteCategory = async (req, res) => {
  const deletedCategory = await service.deleteCategory(req.params.id);
  return sendResponse(res, 200, true, req.__('category.deleted'), { deletedCategory });
};

exports.listCategories = async (req, res) => {
  const data = await service.listCategories(req.query);
  return sendResponse(res, 200, true, req.__('category.listed'),data );
};

// ✅ New manager methods for offering UI
exports.getCategoriesByLevel = async (req, res) => {
  const level = parseInt(req.params.level);
  const categories = await service.getCategoriesByLevel(level);
  return sendResponse(res, 200, true, req.__('category.listed'), { categories });
};

exports.getCategoryChildren = async (req, res) => {
  const parentId = req.params.parentId;
  const children = await service.getCategoryChildren(parentId);
  return sendResponse(res, 200, true, req.__('category.listed'), { children });
};
