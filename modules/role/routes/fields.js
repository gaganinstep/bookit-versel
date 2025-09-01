exports.routeParams = [
  {
    route: "role/create",
    params: {
      name: "",
      description: "",
    },
    authRequired: true,
    method: "post",
    tag: "role",
  },
  {
    route: "role/list",
    params: { offset: 1, limit: 10, active: true },
    queryParams: [
      { name: "offset", type: "integer", required: false, in: "query" },
      { name: "limit", type: "integer", required: false, in: "query" },
      { name: "active", type: "bool", required: false, in: "query" },
    ],

    authRequired: true,
    method: "get",
    tag: "role",
  },
  {
    route: "role/detail/{id}",
    params: { offset: 1, limit: 10, active: true },
    queryParams: [{ name: "id", type: "uuid", required: true, in: "query" }],
    authRequired: true,
    method: "get",
    tag: "role",
  },
  {
    route: "role/permission/list",
    params: { offset: 1, limit: 10, active: true },
    queryParams: [
      { name: "offset", type: "integer", required: false, in: "query" },
      { name: "limit", type: "integer", required: false, in: "query" },
      { name: "active", type: "bool", required: false, in: "query" },
    ],
    authRequired: true,
    method: "get",
    tag: "role",
  },
];
