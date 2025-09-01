const express = require('express');
const controller = require('../controllers/appointments');
const { authenticate } = require('../../../middlewares/authenticate');
const router = express.Router();

router.post('/', controller.create);
router.get('/', authenticate, controller.list);
router.get('/location/:location_id', controller.getTodaysAppointmentsByLocation);
router.get('/:id', controller.get);
router.post('/reschedule/:id', controller.rescheduledAppointment);
router.put('/cancel/:id', controller.cancelAppointment);
router.delete('/:id', controller.delete);

module.exports = router;
