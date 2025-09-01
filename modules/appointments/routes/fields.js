exports.routeParams = [
  {
    route: "appointments",
    params: {
      business_id: "",
      class_id: "",
      booked_by: "",
      status: "",
      status_reason: "",
      meeting_link: "",
      meeting_link_sent: "",
      rescheduled_from: "",
    },
    queryParams: [],
    authRequired: false,
    method: "post",
    tag: "appointments",
  },
  {
    route: "appointments",
    params: {},
    queryParams: [
      { name: "business_id", type: "string", in: "query", required: false },
      { name: "class_id", type: "string", in: "query", required: false },
      { name: "status", type: "string", in: "query" , required: false},
      { name: "limit", type: "number", in: "query", required: false },
      { name: "offset", type: "number", in: "query", required: false },
    ],
    authRequired: false,
    method: "get",
    tag: "appointments",
  },
  {
    route: "appointments/{id}",
    params: { phone: "", otp: "" },
    pathParams:[
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
        format: "uuid"
      },
      description: "Appointment ID"
    }
  ],
    queryParams: [],
    authRequired: false,
    method: "get",
    tag: "appointments",
  },
  {
    route: "appointments/{id}",
    params: {},
    authRequired: true,
    queryParams: [],
    method: "put",
    tag: "appointments",
  },
  {
    route: "appointments/{id}",
    params: {},
    queryParams: [],
    method: "delete",
    authRequired: true,
    tag: "appointments",
  },
];
