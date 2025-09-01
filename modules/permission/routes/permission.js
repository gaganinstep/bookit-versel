const express = require("express");
const permissionController = require("../controllers/permission");

const {
  authenticate,
  authorize,
} = require("../../../middlewares/authenticate");
const router = express.Router();

router.post("/create", authenticate, authorize, permissionController.create);

router.post(
  "/update/role-permission",
  authenticate,
  authorize,
  permissionController.updateRolePermission
);

router.post(
  "/create/role-permission",
  authenticate,
  authorize,
  permissionController.createRolePermission
);

router.get(
  "/list",
  authenticate,
  authorize,
  permissionController.getPermissions
);

router.get(
  "/selected",
  authenticate,
  authorize,
  permissionController.getSelectedPermissions
);

router.post(
  "/update/:id",
  authenticate,
  authorize,
  permissionController.updatePermission
);

router.delete(
  "/delete/:id",
  authenticate,
  authorize,
  permissionController.deletePermission
);
module.exports = router;
