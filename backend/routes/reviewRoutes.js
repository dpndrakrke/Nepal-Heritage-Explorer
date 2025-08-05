const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');
const authGuard = require('../middleware/authguagrd');

// Public routes
router.get('/heritage/:heritageId/reviews', reviewController.getHeritageReviews);
router.get('/heritage/:heritageId/reviews/stats', reviewController.getReviewStats);

// Protected routes (authenticated users)
router.post('/heritage/:heritageId/reviews', authGuard, reviewController.createReview);
router.get('/heritage/:heritageId/reviews/my', authGuard, reviewController.getUserReview);
router.put('/reviews/:reviewId', authGuard, reviewController.updateReview);
router.delete('/reviews/:reviewId', authGuard, reviewController.deleteReview);

module.exports = router; 