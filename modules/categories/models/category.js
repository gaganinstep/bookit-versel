"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.Category, {
        as: "parent",
        foreignKey: "parent_id",
      });
      Category.hasMany(models.Category, {
        as: "children",
        foreignKey: "parent_id",
      });
      Category.hasMany(models.BusinessCategory, {
        foreignKey: "category_id",
        onDelete: "CASCADE",
      });
      Category.hasMany(models.CategoryTranslation, {
        foreignKey: "category_id",
        onDelete: "CASCADE",
      });
      Category.hasMany(models.CategoryRelation, {
        foreignKey: "category_id",
        as: "related",
      });

      Category.hasMany(models.CategoryRelation, {
        foreignKey: "related_category_id",
        as: "related_to",
      });

    }
  }
  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      parent_id: DataTypes.UUID,
      slug: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      level: DataTypes.INTEGER,
      is_class: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
