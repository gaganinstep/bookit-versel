'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BusinessServices', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      business_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Businesses',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      is_class: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Optional: Unique constraint to avoid duplicate business-category pair
    try {
      await queryInterface.addConstraint('BusinessServices', {
        fields: ['business_id', 'category_id'],
        type: 'unique',
        name: 'unique_business_category_with_offerings',
      });
    } catch (error) {
      // If constraint already exists, ignore the error
      if (error.name === 'SequelizeDatabaseError' && error.parent.code === '42P07') {
        console.log('Constraint unique_business_category_with_offerings already exists, skipping...');
      } else {
        throw error;
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BusinessServices');
  },
};
