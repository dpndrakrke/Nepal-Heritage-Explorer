const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const authGuard = require('../middleware/authguagrd');

// Public routes
router.get('/heritage/:heritageId/comments', commentController.getHeritageComments);
router.get('/heritage/:heritageId/comments/stats', commentController.getCommentStats);
router.get('/comments/:commentId/replies', commentController.getCommentReplies);

// Protected routes (authenticated users)
router.post('/heritage/:heritageId/comments', authGuard, commentController.createComment);
router.put('/comments/:commentId', authGuard, commentController.updateComment);
router.delete('/comments/:commentId', authGuard, commentController.deleteComment);

module.exports = router; 