const express = require('express');
const controller = require('../controllers/notifications');
const router = express.Router();

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.get);
router.delete('/:id', controller.delete);

module.exports = router;
