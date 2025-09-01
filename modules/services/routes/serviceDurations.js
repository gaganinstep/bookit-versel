const express = require('express');
const controller = require('../controllers/serviceDurations');
const router = express.Router();

router.post('/services/:serviceId/durations', controller.create);
router.get('/services/:serviceId/durations', controller.list);
router.put('/services/:serviceId/durations/:id', controller.update);
router.delete('/services/:serviceId/durations/:id', controller.delete);

module.exports = router;
