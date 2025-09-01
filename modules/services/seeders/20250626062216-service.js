'use strict';

const { supportedDbTypes } = require('../utils/staticData');
const { getAllModels } = require('../../../middlewares/loadModels');
const tableName = 'Services';




const servicesData = [
  {
    // health -> Acupuncture
    id: 'bc806349-1660-4592-a300-cec787eadf89',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: 'b68854fd-96b2-4643-9a0e-2f61a0ce87e4',
    is_class: false,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKgUUpHpc-JwcJiRLScAepL-T3oeaxR8T5A&s',
    is_active: true, 
  },
  {
    // health -> Audiology
    id: '98414441-4e17-4061-a76f-960a2aa23fa0',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: 'b68854fd-96b2-4643-9a0e-2f61a0ce87e4',
    is_class: false,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKgUUpHpc-JwcJiRLScAepL-T3oeaxR8T5A&s',
    is_active: true, 
  },
  {
    // fitness -> Animal Flow
    id: '521ad8b7-aba7-4f81-b7d8-60d055c1cb26',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: 'f9977cbe-badb-4dd3-b63a-162b387fa85f',
    is_class: true,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKgUUpHpc-JwcJiRLScAepL-T3oeaxR8T5A&s',
    is_active: true, 
  },
  {
    // fitness -> Barre
    id: 'fde13a85-79c0-4bd6-8027-194c07134dd0',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: '605e4f3d-e7f6-49ee-8aa9-9e5e7bfcac5c',
    is_class: false,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKgUUpHpc-JwcJiRLScAepL-T3oeaxR8T5A&s',
    is_active: true, 
  },
  {
    // beauty -> Body Treatments
    id: 'e7a3c613-2f1d-4985-b789-fda6d58e2135',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: 'd758eb48-8c5f-4f5c-a438-31e843a1401d',
    is_class: false,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKgUUpHpc-JwcJiRLScAepL-T3oeaxR8T5A&s',
    is_active: true, 
  },
  {
    // beauty -> Eyelash and Eyebrow
    id: '4f28b7e2-862c-4dd6-80b7-2b4ce29ddc5a',
    business_id: '577f80d2-0b80-4d88-bb7a-df38b9f0d7ec',
    category_id: 'e8c93452-d3ac-4005-bcd1-a8978ab0e340',
    is_class: false,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKgUUpHpc-JwcJiRLScAepL-T3oeaxR8T5A&s',
    is_active: true, 
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const { Service, sequelize } = await getAllModels(
      process.env.DB_TYPE
    );
    await sequelize.sync();  
    
    const transaction = await sequelize.transaction();

    try {
      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT ${tableName} ON`,
        { transaction }
      );}

      for (const service of servicesData) {
        const pServiceDetail = await Service.findOne({
          where: { id: service.id },
        });

        if (!pServiceDetail) {
          await Service.create(service, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql)
      {await queryInterface.sequelize.query(
        `SET IDENTITY_INSERT  ${tableName} OFF`,
        { transaction }
      );}
      await transaction.commit();
    } catch (error) {
      console.error('Error creating service', error);
      await transaction.rollback();
    }
  },


  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
