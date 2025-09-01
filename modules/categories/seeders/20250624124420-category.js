"use strict";

const { v4: uuidv4 } = require("uuid");
const { supportedDbTypes } = require("../utils/staticData");
const { getAllModels } = require("../../../middlewares/loadModels");

const tableName = "Categories";

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const { Category, sequelize } = await getAllModels(process.env.DB_TYPE);

    await sequelize.sync();

    const transaction = await sequelize.transaction();

    try {
      const healthId = "7cb0fbb6-69d6-49c1-86b4-a524f2b6573c";
      const fitnessId = "e55a7926-103b-496f-a11f-4eb5a09a37a3";
      const beautyId = "d06d4da7-dcda-4128-846f-3d9cd5cabe01";

const categoriesData = [
  // ===== Level 0 =====
  {
    id: healthId,
    parent_id: null,
    slug: "health",
    name: "Health & Wellness",
    description: "Massage therapist, chiropractor, acupuncture, dietitian, physiotherapy...",
    level: 0,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: fitnessId,
    parent_id: null,
    slug: "fitness",
    name: "Fitness Classes",
    description: "Group training, fitness classes, personal training...",
    level: 0,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: beautyId,
    parent_id: null,
    slug: "beauty",
    name: "Beauty",
    description: "Hair stylist, nail salon, hair removal, makeup, lashes and brows, facial treatments...",
    level: 0,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },

  // ===== Health Subcategories (10) =====
  {
    id: "b68854fd-96b2-4643-9a0e-2f61a0ce87e4",
    parent_id: healthId,
    slug: "acupuncture",
    name: "Acupuncture",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "4041e82f-f1cf-4e35-b0e6-f6d1d5e9f4b5", 
    parent_id: healthId,
    slug: "audiology",
    name: "Audiology",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "9d13e51c-a9e4-4d22-9ea5-c170b4d09391",
    parent_id: healthId,
    slug: "physiotherapy",
    name: "Physiotherapy",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "e1e614c6-1d1d-4af0-b8a6-efbc8e60b7d3",
    parent_id: healthId,
    slug: "chiropractor",
    name: "Chiropractor",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "44af6b5a-6d75-4292-98c1-c2b741d10b11",
    parent_id: healthId,
    slug: "dietitian",
    name: "Dietitian",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "80b68048-0416-4646-bab2-81ea3cb0b3fd",
    parent_id: healthId,
    slug: "massage",
    name: "Massage Therapy",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "2fc942e6-dfd2-4e7c-89db-f5c8dc3b9dc1",
    parent_id: healthId,
    slug: "rehabilitation",
    name: "Rehabilitation",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "feac08a2-9334-4f58-a9ef-c374a35d6f76",
    parent_id: healthId,
    slug: "naturopath",
    name: "Naturopath",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "be622a68-ea9f-4553-b117-0f4e9d719f5e",
    parent_id: healthId,
    slug: "osteopath",
    name: "Osteopath",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ed121fe7-3e86-43f1-b3ec-d11d403a9a5a",
    parent_id: healthId,
    slug: "speech-therapy",
    name: "Speech Therapy",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },

  // ===== Fitness Subcategories (10) =====
  {
    id: "f9977cbe-badb-4dd3-b63a-162b387fa85f", // existing
    parent_id: fitnessId,
    slug: "animal-flow",
    name: "Animal Flow",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "605e4f3d-e7f6-49ee-8aa9-9e5e7bfcac5c", // existing
    parent_id: fitnessId,
    slug: "barre",
    name: "Barre",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "7dc5cf4e-403c-46c7-8105-67cb8c5a8f3f",
    parent_id: fitnessId,
    slug: "hiit",
    name: "HIIT",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "9fb95e6d-988d-4a3f-89f2-35b90d02148a",
    parent_id: fitnessId,
    slug: "crossfit",
    name: "CrossFit",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "52a99f83-f6c1-4ae4-95cb-f03080c96414",
    parent_id: fitnessId,
    slug: "kickboxing",
    name: "Kickboxing",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "47ab1986-cbd0-4fae-a4ea-276719a6ac16",
    parent_id: fitnessId,
    slug: "zumba",
    name: "Zumba",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "dcb88217-9279-47bb-bb4b-5f637e02c2b5",
    parent_id: fitnessId,
    slug: "yoga",
    name: "Yoga",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "45f3cd87-ef2b-4a63-8b93-bb0ff5b6be45",
    parent_id: fitnessId,
    slug: "pilates",
    name: "Pilates",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "33d57a86-33e7-4cb9-b17a-880973da8f4e",
    parent_id: fitnessId,
    slug: "bootcamp",
    name: "Bootcamp",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "8c00c82b-18d7-45a0-8d4e-13e5c87cfa34",
    parent_id: fitnessId,
    slug: "functional",
    name: "Functional Training",
    level: 1,
    is_active: true,
    is_class: true,
    createdAt: now,
    updatedAt: now,
  },

  // ===== Beauty Subcategories (10) =====
  {
    id: "d758eb48-8c5f-4f5c-a438-31e843a1401d", // existing
    parent_id: beautyId,
    slug: "body-treatments",
    name: "Body Treatments",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "e8c93452-d3ac-4005-bcd1-a8978ab0e340", // existing
    parent_id: beautyId,
    slug: "eyelash-eyebrow",
    name: "Eyelash and Eyebrow",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "f138e5f3-9d17-4c71-a7a9-92f9050d4a38",
    parent_id: beautyId,
    slug: "facials",
    name: "Facials",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "a750234c-bf68-4ab7-8b2f-51f98926791a",
    parent_id: beautyId,
    slug: "nails",
    name: "Nail Care",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "8fd9b44e-17ad-419b-81e3-8c8ce38c3814",
    parent_id: beautyId,
    slug: "makeup",
    name: "Makeup",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "25b02e41-3f3e-4ea3-b1f5-ded4be4de34a",
    parent_id: beautyId,
    slug: "hair-removal",
    name: "Hair Removal",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "bd1c3661-bd02-4f4c-a0a1-4b75516f9f10",
    parent_id: beautyId,
    slug: "brows",
    name: "Brows",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "6ac9f404-9977-4ee4-8dd4-2d803ef7e799",
    parent_id: beautyId,
    slug: "lashes",
    name: "Lashes",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fc6c2f1e-8e0d-4661-85be-7923edcb6e21",
    parent_id: beautyId,
    slug: "waxing",
    name: "Waxing",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "ecdc2454-7dc0-4ad1-8963-1611eb3fd78e",
    parent_id: beautyId,
    slug: "tanning",
    name: "Spray Tanning",
    level: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
    {
    id: "fe148168-841a-4ba1-923b-c1d26f7dddd6",
    parent_id: "d758eb48-8c5f-4f5c-a438-31e843a1401d",
    slug: "body-treatments-sub-1",
    name: "Body Treatments Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "35f0c893-18ff-4489-ad76-3055e523e438",
    parent_id: "d758eb48-8c5f-4f5c-a438-31e843a1401d",
    slug: "body-treatments-sub-2",
    name: "Body Treatments Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "720c8281-35e3-4ed9-a1ba-4659b33398b8",
    parent_id: "e8c93452-d3ac-4005-bcd1-a8978ab0e340",
    slug: "eyelash-eyebrow-sub-1",
    name: "Eyelash and Eyebrow Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "d8eb09b0-5edd-49fd-806f-4c9d31429ccb",
    parent_id: "e8c93452-d3ac-4005-bcd1-a8978ab0e340",
    slug: "eyelash-eyebrow-sub-2",
    name: "Eyelash and Eyebrow Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "888baa0f-cc75-42ce-bea2-07fcfcd89484",
    parent_id: "f138e5f3-9d17-4c71-a7a9-92f9050d4a38",
    slug: "facials-sub-1",
    name: "Facials Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "0e1852a2-cf9e-46ca-9582-ead09faf96df",
    parent_id: "f138e5f3-9d17-4c71-a7a9-92f9050d4a38",
    slug: "facials-sub-2",
    name: "Facials Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "07407e73-a562-46a1-b8ba-7780ca9682d1",
    parent_id: "a750234c-bf68-4ab7-8b2f-51f98926791a",
    slug: "nails-sub-1",
    name: "Nail Care Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "bcd2c307-6266-4775-8ad9-c1547b3ee4db",
    parent_id: "a750234c-bf68-4ab7-8b2f-51f98926791a",
    slug: "nails-sub-2",
    name: "Nail Care Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "766b1609-bb58-4204-9217-0ab7060ce809",
    parent_id: "8fd9b44e-17ad-419b-81e3-8c8ce38c3814",
    slug: "makeup-sub-1",
    name: "Makeup Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "e6601836-e813-4b7b-b376-ffa5a5d55998",
    parent_id: "8fd9b44e-17ad-419b-81e3-8c8ce38c3814",
    slug: "makeup-sub-2",
    name: "Makeup Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "ffc507d5-02dd-400c-9224-ca8d20b4c8b8",
    parent_id: "25b02e41-3f3e-4ea3-b1f5-ded4be4de34a",
    slug: "hair-removal-sub-1",
    name: "Hair Removal Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "16795c4a-1a86-47fb-9e2e-359b30971160",
    parent_id: "25b02e41-3f3e-4ea3-b1f5-ded4be4de34a",
    slug: "hair-removal-sub-2",
    name: "Hair Removal Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "58bdd9f4-5749-4158-b37e-bfcd0362eeba",
    parent_id: "bd1c3661-bd02-4f4c-a0a1-4b75516f9f10",
    slug: "brows-sub-1",
    name: "Brows Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "435d89b9-bf58-485a-b1d3-5c1e920ed4c3",
    parent_id: "bd1c3661-bd02-4f4c-a0a1-4b75516f9f10",
    slug: "brows-sub-2",
    name: "Brows Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "918e4fd1-5cd7-41e4-9dc0-cddc9ecc0088",
    parent_id: "6ac9f404-9977-4ee4-8dd4-2d803ef7e799",
    slug: "lashes-sub-1",
    name: "Lashes Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "afe0f651-cdcd-42f7-bc04-b6b9eff2b888",
    parent_id: "6ac9f404-9977-4ee4-8dd4-2d803ef7e799",
    slug: "lashes-sub-2",
    name: "Lashes Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "a0cddd77-70bf-4284-8b26-1e08d8090183",
    parent_id: "fc6c2f1e-8e0d-4661-85be-7923edcb6e21",
    slug: "waxing-sub-1",
    name: "Waxing Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "00342711-4c1b-490a-a974-a7225c41ba65",
    parent_id: "fc6c2f1e-8e0d-4661-85be-7923edcb6e21",
    slug: "waxing-sub-2",
    name: "Waxing Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "7e3f3e85-552b-428c-91d1-b3281fd67bc2",
    parent_id: "ecdc2454-7dc0-4ad1-8963-1611eb3fd78e",
    slug: "tanning-sub-1",
    name: "Spray Tanning Subcategory 1",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  },
  {
    id: "0bb323a5-54ab-42d7-8478-195470e0e32a",
    parent_id: "ecdc2454-7dc0-4ad1-8963-1611eb3fd78e",
    slug: "tanning-sub-2",
    name: "Spray Tanning Subcategory 2",
    level: 2,
    is_active: true,
    createdAt: "2025-07-16T04:52:54.288202Z",
    updatedAt: "2025-07-16T04:52:54.288202Z"
  }
];


      if (process.env.DB_TYPE === supportedDbTypes.mssql) {
        await queryInterface.sequelize.query(
          `SET IDENTITY_INSERT ${tableName} ON`,
          { transaction }
        );
      }

      for (const category of categoriesData) {
        const exists = await Category.findOne({
          where: { id: category.id },
        });
        if (!exists) {
          await Category.create(category, { transaction });
        }
      }

      if (process.env.DB_TYPE === supportedDbTypes.mssql) {
        await queryInterface.sequelize.query(
          `SET IDENTITY_INSERT ${tableName} OFF`,
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error) {
      console.error("Error seeding categories:", error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(tableName, null, {});
  },
};
