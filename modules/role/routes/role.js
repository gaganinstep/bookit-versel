const express = require('express');
const roleController = require('../controllers/role');
const {
  authenticate,
  authorize,
} = require('../../../middlewares/authenticate');

const router = express.Router();

router.post('/create', authenticate, authorize, roleController.createRole);
router.get('/list', authenticate, authorize, roleController.getRoles);
router.get(
  '/detail/:id',
  authenticate,
  authorize,
  roleController.getRoleDetail
);
router.get(
  '/permission/list',
  authenticate,
  authorize,
  roleController.getRolePermissionList
);

module.exports = router;
