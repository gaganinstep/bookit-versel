const express = require('express');
const controller = require('../controllers/categories');
const router = express.Router();

// all tested ✅
router.post('/', controller.createCategory);
router.put('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);
router.get('/', controller.listCategories);

// ✅ New route for offering UI - get categories by level
router.get('/by-level/:level', controller.getCategoriesByLevel);
router.get('/children/:parentId', controller.getCategoryChildren);

module.exports = router;
