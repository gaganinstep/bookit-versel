'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    static associate(models) {
      Photo.belongsTo(models.PhotoGallery, { foreignKey: 'gallery_id', as: 'gallery' });
    }
  }

  Photo.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      gallery_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      photo_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Photo',
    }
  );

  return Photo;
};
