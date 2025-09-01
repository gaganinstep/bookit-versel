const express = require('express');
const controller = require('../controllers/services');
const router = express.Router();

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getServiceById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
