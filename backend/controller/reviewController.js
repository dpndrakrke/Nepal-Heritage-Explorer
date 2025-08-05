const { Review, Heritage, User } = require('../model');
const { Op } = require('sequelize');

// Get reviews for a heritage site
const getHeritageReviews = async (req, res) => {
  try {
    const { heritageId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Check if heritage exists
    const heritage = await Heritage.findByPk(heritageId);
    if (!heritage) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { 
        heritageId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'username', 'profileImage']
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate average rating
    const avgRating = await Review.findOne({
      where: { 
        heritageId,
        isActive: true
      },
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('rating')), 'averageRating'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'totalReviews']
      ],
      raw: true
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        reviews,
        averageRating: parseFloat(avgRating.averageRating) || 0,
        totalReviews: parseInt(avgRating.totalReviews) || 0,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get heritage reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Create a review
const createReview = async (req, res) => {
  try {
    const { heritageId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    // Check if heritage exists
    const heritage = await Heritage.findByPk(heritageId);
    if (!heritage) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Check if user already reviewed this heritage
    const existingReview = await Review.findOne({
      where: { userId, heritageId }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this heritage site'
      });
    }

    // Create the review
    const review = await Review.create({
      userId,
      heritageId,
      rating,
      title,
      comment
    });

    // Fetch the created review with user info
    const createdReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'username', 'profileImage']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: createdReview
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { id: reviewId, userId }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to edit it'
      });
    }

    // Update the review
    await review.update({
      rating,
      title,
      comment
    });

    // Fetch the updated review with user info
    const updatedReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'username', 'profileImage']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { id: reviewId, userId }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to delete it'
      });
    }

    // Soft delete by setting isActive to false
    await review.update({ isActive: false });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Get user's review for a heritage site
const getUserReview = async (req, res) => {
  try {
    const { heritageId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { 
        heritageId,
        userId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'username', 'profileImage']
        }
      ]
    });

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Get user review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user review',
      error: error.message
    });
  }
};

// Get review statistics for a heritage site
const getReviewStats = async (req, res) => {
  try {
    const { heritageId } = req.params;

    // Check if heritage exists
    const heritage = await Heritage.findByPk(heritageId);
    if (!heritage) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Get rating distribution
    const ratingStats = await Review.findAll({
      where: { 
        heritageId,
        isActive: true
      },
      attributes: [
        'rating',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['rating'],
      raw: true
    });

    // Calculate average rating
    const avgRating = await Review.findOne({
      where: { 
        heritageId,
        isActive: true
      },
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('rating')), 'averageRating'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'totalReviews']
      ],
      raw: true
    });

    // Create rating distribution object
    const ratingDistribution = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = 0;
    }
    
    ratingStats.forEach(stat => {
      ratingDistribution[stat.rating] = parseInt(stat.count);
    });

    res.json({
      success: true,
      data: {
        averageRating: parseFloat(avgRating.averageRating) || 0,
        totalReviews: parseInt(avgRating.totalReviews) || 0,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics',
      error: error.message
    });
  }
};

module.exports = {
  getHeritageReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReview,
  getReviewStats
}; 