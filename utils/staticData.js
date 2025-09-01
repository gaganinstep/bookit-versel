const supportedDbTypes = {
  postgres: 'postgres',
  mysql: 'mysql',
  mssql: 'mssql',
};

const statusList = [
  {
    id: '1',
    value: 'Active',
  },
  {
    id: '2',
    value: 'Inactive',
  },
  {
    id: '3',
    value: 'Invited',
  },
  {
    id: '4',
    value: 'Paid',
  },
  {
    id: '5',
    value: 'Due',
  },
  {
    id: '6',
    value: 'Pending',
  },
  {
    id: '7',
    value: 'Approved',
  },
  {
    id: '8',
    value: 'Reject',
  },
];

const paymentMethods = [
  { id: 1, name: 'Cash' },
  { id: 2, name: 'Bank' },
  { id: 3, name: 'UPI' },
  { id: 4, name: 'Credit card' },
];

module.exports = {
  supportedDbTypes,
  statusList,
  paymentMethods,
};
