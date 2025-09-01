'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PhotoGallery extends Model {
    static associate(models) {
      PhotoGallery.belongsTo(models.User, { foreignKey: 'created_by' });
      PhotoGallery.hasMany(models.Photo, { foreignKey: 'gallery_id', as: 'photos' });
    }
  }

  PhotoGallery.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      business_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      is_visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull:false
      },
    },
    {
      sequelize,
      modelName: 'PhotoGallery',
    }
  );

  return PhotoGallery;
};
