const express = require("express");
const router = express.Router();
const controller = require('../controllers/photogallary');
const { fileUpload } = require("../../../middlewares/file");

router.post(
  '/upload',
  fileUpload.array('photos',10), 
  controller.uploadPhoto
);
 
router.get(
  '/:business_id/images',
  controller.getImagesByBusinessId
);
 
router.delete(
  '/image/:id',
  controller.deleteImageById
);


module.exports = router;
