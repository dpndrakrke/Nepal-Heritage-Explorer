const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');
const authGuard = require('../middleware/authguagrd');
const isAdmin = require('../middleware/isAdmin');

// Public routes
router.post('/subscribe', notificationController.subscribeToNotifications);
router.post('/unsubscribe', authGuard, notificationController.unsubscribeFromNotifications);
router.get('/stats', authGuard, isAdmin, notificationController.getNotificationStats);

// Admin routes
router.post('/send-to-all', authGuard, isAdmin, notificationController.sendNotificationToAll);
router.post('/send-to-user/:userId', authGuard, isAdmin, notificationController.sendNotificationToUser);

module.exports = router; 