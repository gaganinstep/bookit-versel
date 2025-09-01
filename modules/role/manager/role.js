const roleService = require('../services/role');
const { sendResponse } = require('../utils/helper.js');

exports.createRole = async (req, res) => {
  const payload = req.body;
  const result = await roleService.createRole(payload);
  return sendResponse(res, 200, true, 'Role Created', result, null);
};
exports.getRoles = async (req, res) => {
  const { limit, offset, active } = req.query;
  const pageNumber = offset ? Number(offset) : 1;
  const pageSize = limit ? Number(limit) : 10;
  const orders = await roleService.getRoles({
    pageNumber,
    pageSize,
    active,
  });
  const totalPages = Math.ceil(orders.count / pageSize);
  if (totalPages > pageNumber) {
    orders['pagination'] = {
      next_page_url: `/role/list?offset=${pageNumber + 1}`,
    };
  } else {
    orders['pagination'] = {
      next_page_url: null,
    };
  }
  return sendResponse(res, 200, true, 'Roles fetched successfully', orders);
};

exports.getRolePermissionList = async (req, res) => {
  const { limit, offset, active } = req.query;
  const pageNumber = offset ? Number(offset) : 1;
  const pageSize = limit ? Number(limit) : 10;
  const orders = await roleService.getRolePermissionList({
    pageNumber,
    pageSize,
    active,
  });
  const totalPages = Math.ceil(orders.count / pageSize);
  if (totalPages > pageNumber) {
    orders['pagination'] = {
      next_page_url: `/role/permission/list?offset=${pageNumber + 1}`,
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
    'Roles permission fetched successfully',
    orders
  );
};

exports.getRoleDetail = async (req, res) => {
  const { id } = req.params;

  const role = await roleService.getRoleDetail(id);
  return sendResponse(
    res,
    200,
    true,
    'Roles detail fetched successfully',
    role
  );
};
