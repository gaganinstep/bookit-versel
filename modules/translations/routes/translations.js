const express = require('express');
const controller = require('../controllers/translations');
const router = express.Router();

router.post('/', controller.upsert);
router.get('/', controller.list);
router.delete('/:id', controller.delete);

module.exports = router;
