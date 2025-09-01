const permissionService = require('../services/permission');
const { sendResponse } = require('../utils/helper.js');

exports.create = async (req, res) => {
  const payload = req.body;
  const result = await permissionService.create(payload);
  return sendResponse(res, 200, true, 'Permission Created', result, null);
};

exports.updateRolePermission = async (req, res) => {
  const payload = req.body;
  const result = await permissionService.updateRolePermission(payload);
  return sendResponse(res, 200, true, 'Role Permission Updated', result, null);
};

exports.createRolePermission = async (req, res) => {
  const payload = req.body;
  const result = await permissionService.createRolePermission(payload);
  return sendResponse(res, 200, true, 'Role Permission Updated', result, null);
};

exports.getPermissions = async (req, res) => {
  const { limit, offset, active } = req.query;
  const pageNumber = offset ? Number(offset) : 1;
  const pageSize = limit ? Number(limit) : 10;
  const orders = await permissionService.getPermissions({
    pageNumber,
    pageSize,
    active,
  });

  const totalPages = Math.ceil(orders.count / pageSize);
  if (totalPages > pageNumber) {
    orders['pagination'] = {
      next_page_url: `/permission/list?offset=${pageNumber + 1}`,
    };
  } else {
    orders['pagination'] = {
      next_page_url: null,
    };
  }
  return sendResponse(
    res,
    200,
    true,
    'Permissions fetched successfully',
    orders
  );
};

exports.getSelectedPermissions = async (req, res) => {
  const { group } = req.query;

  const orders = await permissionService.getSelectedPermissions({
    group,
  });

  return sendResponse(
    res,
    200,
    true,
    'Permissions all fetched successfully',
    orders
  );
};


exports.updatePermission = async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await permissionService.updatePermission(payload,id);
  return sendResponse(res, 200, true, ' Permission Updated successfully', result, null);
};

exports.deletePermission = async (req, res) => {
  const { id } = req.params;
  const permission = await permissionService.deletePermission(id);
  return sendResponse(res, 200, true, 'Permission deleted successfully', permission);
};
