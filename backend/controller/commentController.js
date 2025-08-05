const { Comment, Heritage, User } = require('../model');
const { Op } = require('sequelize');

// Get comments for a heritage site
const getHeritageComments = async (req, res) => {
  try {
    const { heritageId } = req.params;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Check if heritage exists
    const heritage = await Heritage.findByPk(heritageId);
    if (!heritage) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    const { count, rows: comments } = await Comment.findAndCountAll({
      where: { 
        heritageId,
        parentId: null, // Only top-level comments
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'username', 'profileImage']
        },
        {
          model: Comment,
          as: 'replies',
          where: { isActive: true },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'username', 'profileImage']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get heritage comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message
    });
  }
};

// Create a comment
const createComment = async (req, res) => {
  try {
    const { heritageId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    // Check if heritage exists
    const heritage = await Heritage.findByPk(heritageId);
    if (!heritage) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // If this is a reply, check if parent comment exists
    if (parentId) {
      const parentComment = await Comment.findOne({
        where: { id: parentId, heritageId, isActive: true }
      });
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    // Create the comment
    const comment = await Comment.create({
      userId,
      heritageId,
      parentId: parentId || null,
      content
    });

    // Fetch the created comment with user info
    const createdComment = await Comment.findByPk(comment.id, {
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
      message: 'Comment posted successfully',
      data: createdComment
    });

  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to post comment',
      error: error.message
    });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findOne({
      where: { id: commentId, userId, isActive: true }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you are not authorized to edit it'
      });
    }

    // Update the comment
    await comment.update({ content });

    // Fetch the updated comment with user info
    const updatedComment = await Comment.findByPk(comment.id, {
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
      message: 'Comment updated successfully',
      data: updatedComment
    });

  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findOne({
      where: { id: commentId, userId, isActive: true }
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found or you are not authorized to delete it'
      });
    }

    // Soft delete by setting isActive to false
    await comment.update({ isActive: false });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

// Get replies for a comment
const getCommentReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Check if parent comment exists
    const parentComment = await Comment.findByPk(commentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }

    const { count, rows: replies } = await Comment.findAndCountAll({
      where: { 
        parentId: commentId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'username', 'profileImage']
        }
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        replies,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get comment replies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch replies',
      error: error.message
    });
  }
};

// Get comment statistics for a heritage site
const getCommentStats = async (req, res) => {
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

    // Get total comments count
    const totalComments = await Comment.count({
      where: { 
        heritageId,
        isActive: true
      }
    });

    // Get top-level comments count
    const topLevelComments = await Comment.count({
      where: { 
        heritageId,
        parentId: null,
        isActive: true
      }
    });

    // Get replies count
    const repliesCount = await Comment.count({
      where: { 
        heritageId,
        parentId: { [Op.ne]: null },
        isActive: true
      }
    });

    res.json({
      success: true,
      data: {
        totalComments,
        topLevelComments,
        repliesCount
      }
    });

  } catch (error) {
    console.error('Get comment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comment statistics',
      error: error.message
    });
  }
};

module.exports = {
  getHeritageComments,
  createComment,
  updateComment,
  deleteComment,
  getCommentReplies,
  getCommentStats
}; 