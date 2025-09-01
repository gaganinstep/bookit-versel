const express = require('express');
const controller = require('../controllers/schedules');
const router = express.Router();

router.post('/classes/:classId/schedules', controller.create);
router.get('/classes/:classId/schedules', controller.list);
router.put('/classes/:classId/schedules/:id', controller.update);
router.delete('/classes/:classId/schedules/:id', controller.delete);

module.exports = router;
