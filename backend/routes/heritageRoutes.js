const express = require('express');
const router = express.Router();
const heritageController = require('../controller/heritageController');
const authGuard = require('../middleware/authguagrd');
const isAdmin = require('../middleware/isAdmin');
const { fileUpload } = require('../helper/multer');

// Public routes
router.get('/heritages', heritageController.getAllHeritages);
router.get('/heritage/:id', heritageController.getHeritageById);
router.get('/categories', heritageController.getCategories);
router.get('/filter-options', heritageController.getFilterOptions);

// User routes (authenticated)
router.post('/saveHeritage/:id', authGuard, heritageController.toggleSaveHeritage);
router.get('/savedHeritages', authGuard, heritageController.getSavedHeritages);

// Admin routes (authenticated + admin role)
router.post('/heritage', authGuard, isAdmin, fileUpload('images', 5), heritageController.createHeritage);
router.put('/heritage/:id', authGuard, isAdmin, fileUpload('images', 5), heritageController.updateHeritage);
router.delete('/heritage/:id', authGuard, isAdmin, heritageController.deleteHeritage);

module.exports = router; 