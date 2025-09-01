const express = require('express');
const controller = require('../controllers/profile');
const { fileUpload } = require('../../../middlewares/file');
const { authenticate } = require('../../../middlewares/authenticate');

const router = express.Router();

// New unified staff endpoint - create or update with schedules

router.post('/staff/add', fileUpload.any(), controller.createStaffProfiles);
router.get('/staff/list', controller.getWholeStaff);
router.get('/staff/categories', controller.getWholeStaffByBusinessServiceDetail);
router.get('/staff/user/:id', controller.getStaffProfilesByUserId);
router.get('/staff/business/:businessId', authenticate, controller.getStaffProfilesByBusinessId);
router.get('/staff/categories/:business_id', authenticate, controller.getStaffByCategoryLevel0);
router.get('/staff/location/:id', controller.getStaffProfilesByLocationsId);

router.post('/staff/:id/schedule', controller.createStaffSchedule);
router.get('/staff/:id', controller.getStaffProfile);
router.get('/staff/:id/schedule', controller.getStaffSchedule);
router.get('/staff/location/:location_id/schedule', controller.getStaffProfilesByServiceSchedules);

router.put('/staff/:id', controller.updateStaffProfile);
router.delete('/staff/:id', controller.deleteStaffProfile);

router.post('/client', controller.createClientProfile);
router.get('/client/filter', controller.listAllClientProfiles);
router.get('/client/:id', controller.getClientProfile);
router.put('/client/:id', controller.updateClientProfile);
router.delete('/client/:id', controller.deleteClientProfile);

router.post('/preference', controller.createClientPreference);
router.get('/preference/:user_id', controller.getClientPreference);
router.put('/preference/:user_id', controller.updateClientPreference);
router.delete('/preference/:user_id', controller.deleteClientPreference);


router.post('/staff/add-with-schedule', authenticate, fileUpload.single('profile_image'), controller.unifiedStaffWithSchedule);
router.get('/staff/:businessId/comprehensive', controller.getStaffWithComprehensiveData);
router.get('/staff/:businessId/:staffId/comprehensive', controller.getStaffWithComprehensiveData);


module.exports = router;
