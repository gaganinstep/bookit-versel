const express = require('express');
const controller = require('../controllers/classes');
const router = express.Router();
const {
    authenticate,
  } = require('../../../middlewares/authenticate');

router.post('/', authenticate, controller.create);
router.post('/with-schedule', authenticate, controller.unifiedClassWithSchedule);
router.get('/with-schedules', authenticate, controller.getClassesWithSchedules);
router.get('/:id/with-schedules', authenticate, controller.getClassWithSchedulesById);
router.get('/', authenticate, controller.list);
router.get('/:businessId', controller.getByBusiness);
router.get('/location/:locationId', authenticate, controller.getByLocation);
router.get('/:id', controller.get);
router.get('/:classId/schedule-ids', authenticate, controller.getScheduleIdsByClass);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.delete);
router.get('/:id/details', controller.get);


module.exports = router;
