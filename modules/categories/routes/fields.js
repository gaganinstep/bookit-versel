exports.routeParams = [
  {
    route: "categories/",
    method: "post",
    authRequired: true,
    tag: "categories",
    params: {
      slug: "",
      name: "",
      description: "",
      parent_id: "",
      level: 0,
    },
    queryParams: [],
  },
  {
    route: "categories/{id}",
    method: "put",
    authRequired: true,
    tag: "categories",
    params: {
      slug: "",
      parent_id: "",
      level: 0,
    },
    queryParams: [{ name: "id", type: "uuid", required: true, in: "path" }],
  },
  {
    route: "categories/{id}",
    method: "delete",
    authRequired: true,
    tag: "categories",
    params: {},
    queryParams: [{ name: "id", type: "uuid", required: true, in: "path" }],
  },
  {
    route: "categories/",
    method: "get",
    authRequired: true,
    tag: "categories",
    params: {},
    queryParams: [
      { name: "q", type: "string", required: false },
      { name: "parent_id", type: "uuid", required: false },
      { name: "level", type: "integer", required: false },
    ],
  },
];
