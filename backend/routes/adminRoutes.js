const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const authGuard = require('../middleware/authguagrd');
const isAdmin = require('../middleware/isAdmin');

// All routes are protected by authGuard and isAdmin middleware
router.use(authGuard);
router.use(isAdmin);

// User management routes
router.get('/allUsers', adminController.getAllUsers);
router.get('/user/:id', adminController.getUserById);
router.put('/user/:id', adminController.updateUser);
router.delete('/deleteUser/:id', adminController.deleteUser);

// Dashboard and statistics routes
router.get('/dashboard', adminController.getDashboardStats);
router.get('/heritageManagement', adminController.getHeritageManagement);

// Analytics and statistics routes
router.get('/userStats', adminController.getUserStats);
router.get('/heritageStats', adminController.getHeritageStats);
router.get('/activityTrends', adminController.getActivityTrends);

module.exports = router; 