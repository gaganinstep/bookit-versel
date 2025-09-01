const express = require('express');
const controller = require('../controllers/staffavailabilities');
const router = express.Router();

router.post('/staff/:staffId/availabilities', controller.create);
router.get('/staff/:staffId/availabilities', controller.list);
router.put('/staff/:staffId/availabilities/:id', controller.update);
router.delete('/staff/:staffId/availabilities/:id', controller.delete);

module.exports = router;
