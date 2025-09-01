"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CategoryRelation extends Model {
        static associate(models) {
            CategoryRelation.belongsTo(models.Category, {
                foreignKey: "category_id",
                as: "category",
            });
            CategoryRelation.belongsTo(models.Category, {
                foreignKey: "related_category_id",
                as: "related_category",
            });
        }
    }
    CategoryRelation.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            category_id: DataTypes.UUID,
            related_category_id: DataTypes.UUID,
        },
        {
            sequelize,
            modelName: "CategoryRelation",
        }
    );
    return CategoryRelation;
};
