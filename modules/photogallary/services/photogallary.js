const { getAllModels } = require('../../../middlewares/loadModels');

exports.uploadMultiplePhotos = async (data) => {
  const { PhotoGallery, Photo } = await getAllModels(process.env.DB_TYPE);

  let gallery = await PhotoGallery.findOne({
    where: {
      business_id: data.business_id,
      is_visible: true 
    }
  });

  if (!gallery) {
    gallery = await PhotoGallery.create({
      created_by: data.created_by,
      business_id: data.business_id,
      is_visible: data.is_visible ?? true
    });
  }

  const photos = data.photo_urls.map((url) => ({
    gallery_id: gallery.id,
    photo_url: url
  }));

  const createdPhotos = await Photo.bulkCreate(photos);

  return {
    gallery,
    photos: createdPhotos
  };
};


exports.getImagesByBusinessId = async (business_id) => {
  const { PhotoGallery, Photo } = await getAllModels(process.env.DB_TYPE);

  const gallery = await PhotoGallery.findOne({
    where: { business_id, is_visible: true }
  });

  if (!gallery) return [];

  const photos = await Photo.findAll({
    where: {
      gallery_id: gallery.id,
      is_deleted: false
    }
  });

  return photos;
};

exports.deleteImageById = async (photoId) => {
  const { Photo } = await getAllModels(process.env.DB_TYPE);

  const photo = await Photo.findOne({ where: { id: photoId } });

  if (!photo) throw new Error('Photo not found');

  photo.is_deleted = true;
  await photo.save();

  return { deleted: true, id: photoId };
};

