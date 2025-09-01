exports.routeParams = [
  {
    route: 'business/',
    method: 'post',
    authRequired: true,
    tag: 'businesses',
    params: {
      name: '',
      email: '',
      phone: '',
      website: '',
      slug: '',
      logo_url: '',
      cover_image_url: '',
      timezone: '',
      is_active: true,
      is_onboarding_complete: false,
      active_step: 'about_you' // valid values: about_you, locations, services, categories, service_details
    },
    queryParams: []
  },
  {
    route: 'business/{id}',
    method: 'put',
    authRequired: true,
    tag: 'businesses',
    params: {
      name: '',
      email: '',
      phone: '',
      website: '',
      slug: '',
      logo_url: '',
      cover_image_url: '',
      timezone: '',
      is_active: true,
      is_onboarding_complete: false,
      active_step: 'about_you'
    },
    queryParams: [{ name: 'id', type: 'uuid', required: true, in: 'path' }]
  },
  {
    route: 'business/onboarding',
    method: 'post',
    authRequired: true,
    tag: 'businesses',
    params: {
      step: '',
      data: {}
    },
    queryParams: []
  },
  {
    route: 'business/{id}',
    method: 'delete',
    authRequired: true,
    tag: 'businesses',
    params: {},
    queryParams: [{ name: 'id', type: 'uuid', required: true, in: 'path' }]
  },
  {
    route: 'business/',
    method: 'get',
    authRequired: true,
    tag: 'businesses',
    params: {},
    queryParams: [
      { name: 'q', type: 'string', required: false },
      { name: 'limit', type: 'integer', required: false },
      { name: 'offset', type: 'integer', required: false }
    ]
  }
];
