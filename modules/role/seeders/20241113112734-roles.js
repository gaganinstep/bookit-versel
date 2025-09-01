'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'Roles';
const roleData = [
  {
    id: 'ae7cfef5-57ae-4a94-8272-2e6a619c94b1',
    name: 'superadmin',
    description: 'Super Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2b17baea-0da5-4af9-bac0-e5589b42e815',
    name: 'admin',
    description: 'Admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'd9d77950-e42f-42dc-8b17-dd7bedd1a1ad',
    name: 'user',
    description: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

module.exports = {
  async up(queryInterface) {
    const { Role, sequelize } = await getAllModels(process.env.DB_TYPE);
    await sequelize.sync(); // Reset the database
    const transaction = await sequelize.transaction();
    try {
      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT ${tableName} ON`,
        { transaction }
      );}

      await Role.bulkCreate(roleData, { transaction });
      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction in case of an error
      console.error('Error creating roles:', error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
