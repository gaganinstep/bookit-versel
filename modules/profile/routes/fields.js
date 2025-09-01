exports.routeParams = [
  {
    route: 'profile/',
    method: 'post',
    authRequired: true,
    tag: 'profiles',
    params: {
      user_id: '',
      business_id: '',
      bio: '',
      profile_photo_url: '',
      is_available: true
    },
    queryParams: []
  },
  {
    route: 'staff-profiles/{id}',
    method: 'put',
    authRequired: true,
    tag: 'profiles',
    params: {
      bio: '',
      profile_photo_url: '',
      is_available: true
    },
    queryParams: [{ name: 'id', type: 'uuid', required: true, in: 'path' }]
  },
  {
    route: 'staff-profiles/{id}',
    method: 'get',
    authRequired: true,
    tag: 'profiles',
    params: {},
    queryParams: [{ name: 'id', type: 'uuid', required: true, in: 'path' }]
  },
  {
    route: 'staff-profiles/{id}',
    method: 'delete',
    authRequired: true,
    tag: 'profiles',
    params: {},
    queryParams: [{ name: 'id', type: 'uuid', required: true, in: 'path' }]
  },
  {
    route: 'staff-profiles/',
    method: 'get',
    authRequired: true,
    tag: 'profiles',
    params: {},
    queryParams: [
      { name: 'q', type: 'string', required: false },
      { name: 'business_id', type: 'uuid', required: false },
      { name: 'is_available', type: 'boolean', required: false },
      { name: 'limit', type: 'integer', required: false },
      { name: 'offset', type: 'integer', required: false }
    ]
  }
];
