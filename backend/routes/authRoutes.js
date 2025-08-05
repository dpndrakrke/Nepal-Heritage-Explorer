const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const authGuard = require('../middleware/authguagrd');
const { singleFileUpload } = require('../helper/multer');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authGuard, authController.getProfile);
router.put('/profile', authGuard, authController.updateProfile);
router.post('/profile/image', authGuard, singleFileUpload('profileImage'), authController.uploadProfileImage);
router.put('/change-password', authGuard, authController.changePassword);

module.exports = router; 