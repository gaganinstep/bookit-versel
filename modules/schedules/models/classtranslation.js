'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassTranslation extends Model {
    static associate(models) {
      ClassTranslation.belongsTo(models.Class, { foreignKey: 'class_id' });

    }
  }
  ClassTranslation.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    class_id: DataTypes.UUID,
    language_code: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ClassTranslation',
  });
  return ClassTranslation;
};