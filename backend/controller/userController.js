const { User, SavedHeritage, Heritage } = require('../model');
const { sequelize } = require('../db/database');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'username', 'email', 'phone', 'profileImage', 'bio', 'role', 'createdAt', 'lastLogin', 'isActive']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
};

// Get user's saved heritage sites
const getSavedHeritages = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const savedHeritages = await SavedHeritage.findAll({
      where: { userId },
      include: [
        {
          model: Heritage,
          as: 'heritage',
          attributes: ['id', 'name', 'location', 'description', 'imageUrl', 'category']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: req.query.limit ? parseInt(req.query.limit) : undefined
    });

    // Transform the data to include saved date
    const transformedData = savedHeritages.map(saved => ({
      id: saved.id,
      heritageId: saved.heritageId,
      savedDate: saved.createdAt,
      heritage: {
        id: saved.heritage.id,
        name: saved.heritage.name,
        location: saved.heritage.location,
        description: saved.heritage.description,
        imageUrl: saved.heritage.imageUrl,
        category: saved.heritage.category
      }
    }));

    res.json({
      success: true,
      data: transformedData
    });

  } catch (error) {
    console.error('Get saved heritages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get saved heritage sites',
      error: error.message
    });
  }
};

// Get user's saved heritage sites summary (top 3)
const getSavedHeritagesSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const savedHeritages = await SavedHeritage.findAll({
      where: { userId },
      include: [
        {
          model: Heritage,
          as: 'heritage',
          attributes: ['id', 'name', 'location', 'imageUrl', 'category']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 3
    });

    // Transform the data
    const transformedData = savedHeritages.map(saved => ({
      id: saved.id,
      heritageId: saved.heritageId,
      savedDate: saved.createdAt,
      heritage: {
        id: saved.heritage.id,
        name: saved.heritage.name,
        location: saved.heritage.location,
        imageUrl: saved.heritage.imageUrl,
        category: saved.heritage.category
      }
    }));

    res.json({
      success: true,
      data: transformedData
    });

  } catch (error) {
    console.error('Get saved heritages summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get saved heritage sites summary',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get saved heritage count
    const savedCount = await SavedHeritage.count({
      where: { userId }
    });

    // Get total heritage sites count
    const totalHeritages = await Heritage.count({
      where: { isActive: true }
    });

    // Get popular heritage sites (most saved)
    const popularSites = await SavedHeritage.findAll({
      attributes: [
        'heritageId',
        [sequelize.fn('COUNT', sequelize.col('heritageId')), 'saveCount']
      ],
      include: [
        {
          model: Heritage,
          as: 'heritage',
          attributes: ['id', 'name', 'location', 'category']
        }
      ],
      group: ['heritageId'],
      order: [[sequelize.fn('COUNT', sequelize.col('heritageId')), 'DESC']],
      limit: 5
    });

    // For now, we'll set visited count to 0 since we don't have a visit tracking system
    const visitedCount = 0;

    res.json({
      success: true,
      data: {
        savedCount,
        visitedCount,
        totalHeritages,
        popularSites: popularSites.map(site => ({
          id: site.heritage.id,
          name: site.heritage.name,
          location: site.heritage.location,
          category: site.heritage.category,
          saveCount: site.dataValues.saveCount
        }))
      }
    });

  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics',
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  getSavedHeritages,
  getSavedHeritagesSummary,
  getUserStatistics
}; 