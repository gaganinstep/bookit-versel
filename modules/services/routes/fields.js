exports.routeParams = [
  {
    route: 'services/',
    method: 'post',
    authRequired: true,
    tag: 'services',
    params: {
      business_id: '',
      category_id: '',
      is_class: true,
      image_url: '',
      is_active: true
    },
    queryParams: []
  },
  {
    route: 'services/',
    method: 'get',
    authRequired: true,
    tag: 'services',
    params: {},
    queryParams: [
      { name: 'q', type: 'string', required: false },
      { name: 'business_id', type: 'uuid', required: false },
      { name: 'is_class', type: 'boolean', required: false },
      { name: 'limit', type: 'integer', required: false },
      { name: 'offset', type: 'integer', required: false }
    ]
  },
  {
    route: 'services/{id}',
    method: 'get',
    authRequired: true,
    tag: 'services',
    params: {},
    queryParams: [{ name: 'id', type: 'uuid', required: true, in: 'path' }]
  },
  {
    route: 'services/{id}',
    method: 'put',
    authRequired: true,
    tag: 'services',
    params: {
      category_id: '',
      is_class: true,
      image_url: '',
      is_active: true
    },
    queryParams: [{ name: 'id', type: 'uuid', required: true, in: 'path' }]
  },
  {
    route: 'services/{id}',
    method: 'delete',
    authRequired: true,
    tag: 'services',
    params: {},
    queryParams: [{ name: 'id', type: 'uuid', required: true, in: 'path' }]
  }
];
