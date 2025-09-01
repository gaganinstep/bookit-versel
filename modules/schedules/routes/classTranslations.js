const express = require('express');
const controller = require('../controllers/classTranslations');
const router = express.Router();

router.post('/classes/:classId/translations', controller.upsert);
router.get('/classes/:classId/translations', controller.list);
router.delete('/classes/:classId/translations/:language_code', controller.delete);

module.exports = router;
