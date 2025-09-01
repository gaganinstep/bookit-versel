const express = require('express');
const authController = require('../controllers/auth');
const {
  authenticate,
  authorize,
} = require('../../../middlewares/authenticate');
const createMulterMiddleware = require('../../../middlewares/multer');
const upload = createMulterMiddleware('uploads/profile-images');
const router = express.Router();


router.get('/users', authenticate, authController.getAllUsers); 
router.put('/users/update/:id', authenticate, authController.updateUserById);
router.delete('/users/delete/:id', authenticate, authController.deleteUserByID);

router.delete('/delete/user', authenticate, authController.deleteUser);

router.post('/register',authController.register);
router.post('/register/user', authController.register);
router.post('/register/admin', authController.register);
router.post('/login', authController.login);

router.post('/business-register', authController.businessRegister);
router.post('/user-register', authController.userRegister);
router.post('/admin-register', authController.adminRegister);
router.get('/profile', authenticate, authController.getMe);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/refresh-token', authController.refreshToken);
router.get('/:user_id/summary', authController.getUserBusinessSummary);
router.post('/update-profile', authenticate, authController.updateUserProfile); //updated new 2
router.post('/social-login', authController.socialLogin);

// Reset password routes
router.post('/initiate-password-reset', authController.initiatePasswordReset);
router.post('/verify-reset-otp', authController.verifyResetOtp);
router.post('/reset-password', authController.resetPassword);

// Change password route (requires authentication)
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
