const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authGuard = require('../middleware/authguagrd');

// All routes are protected with authGuard
router.use(authGuard);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Get user's saved heritage sites
router.get('/savedHeritages', userController.getSavedHeritages);

// Get user's saved heritage sites summary (top 3)
router.get('/savedHeritages/summary', userController.getSavedHeritagesSummary);

// Get user statistics
router.get('/statistics', userController.getUserStatistics);

module.exports = router; 