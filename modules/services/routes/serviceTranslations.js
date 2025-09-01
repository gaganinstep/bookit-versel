const express = require('express');
const controller = require('../controllers/serviceTranslations');
const router = express.Router();

router.post('/services/:serviceId/translations', controller.upsert);
router.get('/services/:serviceId/translations', controller.list);
router.delete('/services/:serviceId/translations/:language_code', controller.delete);

module.exports = router;
