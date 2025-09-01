const express = require('express');
const {
  authenticate,
} = require('../../../middlewares/authenticate');
const businessesController = require('../controllers/businesses');
const locationsController = require('../controllers/locations');
const businessCategoriesController = require('../controllers/businessCategories');
const businessHoursController = require('../controllers/businessHours');
const businessTranslationsController = require('../controllers/businessTranslations');


const router = express.Router();

router.post('/',  businessesController.createBusiness);
router.get('/:id', businessesController.getBusiness);

router.put('/:id', businessesController.updateBusiness);
router.get('/', authenticate, businessesController.listBusinesses);
router.delete('/:id', businessesController.deleteBusiness);

router.post('/businesses/:businessId/locations', locationsController.createLocation);
router.get('/businesses/:businessId/locations', locationsController.listLocations);
router.get('/locations/:id', locationsController.getLocation);
router.put('/locations/:id', locationsController.updateLocation);
router.delete('/locations/:id', locationsController.deleteLocation);

router.get('/locations/:locationId/hours', businessHoursController.getHours);
router.post('/locations/:locationId/hours', businessHoursController.setHour);
router.delete('/locations/:locationId/hours/:day', businessHoursController.deleteHour);

router.post('/businesses/:businessId/categories', businessCategoriesController.assign);
router.get('/businesses/:businessId/categories', businessCategoriesController.list);
router.get('/businesses/:businessId/services', businessCategoriesController.listServices);
router.delete('/businesses/:businessId/categories', businessCategoriesController.clear);

router.post('/businesses/:businessId/translations', businessTranslationsController.upsert);
router.get('/businesses/:businessId/translations', businessTranslationsController.list);
router.delete('/businesses/:businessId/translations/:lang', businessTranslationsController.delete);

router.post('/onboarding', authenticate, businessTranslationsController.handleOnboarding);
router.get('/onboarding/:businessId', authenticate, businessTranslationsController.getOnboardingSummary);
router.get('/:slug/businesses', businessTranslationsController.getBusinessesBySlug);
router.get('/:slug/summary', businessTranslationsController.getLocationSummary);
router.get('/:businessId/other-locations/:currentLocationId', businessTranslationsController.getOtherLocations);

router.get('/:id/services', businessTranslationsController.getBusinessServicesById)
router.get('/:business_id/services/details', businessTranslationsController.getServiceDetailsByBusiness);
router.get('/:business_id/classes', businessTranslationsController.getClassBasedServices);
router.get('/:businessId/services/comprehensive', businessesController.getComprehensiveBusinessServices);
router.post('/offering', authenticate, businessTranslationsController.createOfferings);
router.get('/:business_id/offerings', authenticate, businessTranslationsController.getCreatedOfferings);
router.get('/:business_id/level0-categories', authenticate, businessTranslationsController.getLevel0CategoriesByBusinessId);
router.get('/service-detail/:service_detail_id', authenticate, businessTranslationsController.getServiceDetailById);
router.put('/service-detail/:service_detail_id', authenticate, businessTranslationsController.updateServiceDetailById);

module.exports = router;