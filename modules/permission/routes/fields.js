exports.routeParams = [
  {
    route: 'permission/create',
    params: { name: '', description: '', route: '', action: '', type: '' },
    authRequired: true,
    method: 'post',
    tag: 'permission',
  },
  {
    route: 'update/role-permission',
    params: { roleId: 0, permissions: [1, 2], removePermissions: [3] },
    authRequired: true,
    method: 'post',
    tag: 'permission',
  },
  {
    route: 'create/role-permission',
    params: { roleId: 0, permissions: [1, 2], removePermissions: [3] },
    authRequired: true,
    method: 'post',
    tag: 'permission',
  },
  {
    route: 'permission/list',
    params: { offset: 1, limit: 10, active: true },
    queryParams: [
      { name: 'offset', type: 'integer', required: false, in: 'query' },
      { name: 'limit', type: 'integer', required: false, in: 'query' },
      { name: 'active', type: 'bool', required: false, in: 'query' },
    ],
    authRequired: true,
    method: 'get',
    tag: 'permission',
  },
  {
    route: 'permission/selected',
    queryParams: [
      { name: 'group', type: 'bool', required: false, in: 'query' },
    ],
    authRequired: true,
    method: 'get',
    tag: 'permission',
  },
  {
    route: 'permission/update/{id}',
    authRequired: true,
    method: 'post',
    tag: 'permission'
  },
  {
    route: 'permission/delete/{id}',
    authRequired: true,
    method: 'delete',
    tag: 'permission'
  }
];
