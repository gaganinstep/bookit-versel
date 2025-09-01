'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'Users';
const userRoleTableName = 'UserRoles';

// User data to seed
const userData = [
  {
    id: '2e3ae552-f447-47d3-bca4-69e01776990a',
    phone: '+911234567890',
    full_name: 'super admin',
    slug: 'super-admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  } 
];

module.exports = {
  async up(queryInterface) {
    const { User, UserRole, sequelize } = await getAllModels(
      process.env.DB_TYPE
    );
    await sequelize.sync(); // Reset the database
    const transaction = await sequelize.transaction();
    try {
      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT ${tableName} ON`,
        { transaction }
      );}

      for (const user of userData) {
        const puserDetail = await User.findOne({
          where: { id: user.id },
        });
        if (!puserDetail) {
          const createdUser = await User.create(user, { transaction });

          await UserRole.create(
            {
              id: 'cb053848-b46a-4036-8e9d-8823ea7db2cf',
              userId: createdUser.id,
              roleId: 'ae7cfef5-57ae-4a94-8272-2e6a619c94b1', 
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { transaction }
          );
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      console.error('Error creating users and user roles:', error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(userRoleTableName, null, {});
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
