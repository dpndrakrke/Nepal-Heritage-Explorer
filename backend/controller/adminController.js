const { User, Heritage, SavedHeritage, Image, Booking } = require('../model');
const { Op } = require('sequelize');
const { literal } = require('sequelize');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add role filter
    if (role && role !== 'all') {
      whereClause.role = role;
    }

    // Add active status filter
    if (isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Heritage,
          as: 'createdHeritages',
          where: { isActive: true },
          required: false
        },
        {
          model: SavedHeritage,
          as: 'savedHeritages',
          include: [
            {
              model: Heritage,
              as: 'heritage',
              where: { isActive: true }
            }
          ]
        }
      ]
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
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being updated and is unique
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: updateData.email }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    await user.update(updateData);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete by setting isActive to false
    await user.update({ isActive: false });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.count();
    const totalHeritages = await Heritage.count({ where: { isActive: true } });
    const totalBookings = await Booking.count();
    const totalSaved = await SavedHeritage.count();

    // Get active users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeUsersToday = await User.count({
      where: {
        lastLogin: {
          [Op.gte]: today
        }
      }
    });

    // Get role distribution
    const roleDistribution = await User.findAll({
      attributes: [
        'role',
        [literal('COUNT(*)'), 'count']
      ],
      group: ['role']
    });

    // Get heritage categories
    const categoryDistribution = await Heritage.findAll({
      attributes: [
        'category',
        [literal('COUNT(*)'), 'count']
      ],
      where: { isActive: true },
      group: ['category']
    });

    // Get monthly registrations for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRegistrations = await User.findAll({
      attributes: [
        [literal('DATE_FORMAT(createdAt, "%Y-%m")'), 'month'],
        [literal('COUNT(*)'), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo
        }
      },
      group: [literal('DATE_FORMAT(createdAt, "%Y-%m")')],
      order: [[literal('month'), 'ASC']]
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalHeritages,
        totalBookings,
        totalSaved,
        activeUsersToday,
        roleDistribution,
        categoryDistribution,
        monthlyRegistrations
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get heritage management data
const getHeritageManagement = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add category filter
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // Add featured filter
    if (featured !== undefined) {
      whereClause.featured = featured === 'true';
    }

    const { count, rows: heritages } = await Heritage.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'username']
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
        heritages,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get heritage management error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch heritage management data',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.count();

    // Active users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeUsersToday = await User.count({
      where: {
        lastLogin: {
          [Op.gte]: today
        }
      }
    });

    // Role distribution
    const roleDistribution = await User.findAll({
      attributes: [
        'role',
        [literal('COUNT(*)'), 'count']
      ],
      group: ['role']
    });

    // New registrations in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newRegistrations = await User.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    // Monthly registrations for chart
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRegistrations = await User.findAll({
      attributes: [
        [literal('DATE_FORMAT(createdAt, "%Y-%m")'), 'month'],
        [literal('COUNT(*)'), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: sixMonthsAgo
        }
      },
      group: [literal('DATE_FORMAT(createdAt, "%Y-%m")')],
      order: [[literal('month'), 'ASC']]
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsersToday,
        roleDistribution,
        newRegistrations,
        monthlyRegistrations
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};

// Get heritage statistics
const getHeritageStats = async (req, res) => {
  try {
    // Total heritage sites
    const totalHeritages = await Heritage.count({ where: { isActive: true } });

    // Most recent heritages
    const recentHeritages = await Heritage.findAll({
      where: { isActive: true },
      include: [
        {
          model: Image,
          as: 'images',
          where: { isPrimary: true },
          required: false,
          limit: 1
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Category distribution
    const categoryDistribution = await Heritage.findAll({
      attributes: [
        'category',
        [literal('COUNT(*)'), 'count']
      ],
      where: { isActive: true },
      group: ['category']
    });

    // Most saved heritage
    const mostSavedHeritage = await SavedHeritage.findAll({
      attributes: [
        'heritageId',
        [literal('COUNT(*)'), 'saveCount']
      ],
      include: [
        {
          model: Heritage,
          as: 'heritage',
          where: { isActive: true },
          attributes: ['id', 'name', 'location']
        }
      ],
      group: ['heritageId'],
      order: [[literal('saveCount'), 'DESC']],
      limit: 1
    });

    // Featured heritage count
    const featuredCount = await Heritage.count({
      where: { 
        isActive: true,
        featured: true 
      }
    });

    res.json({
      success: true,
      data: {
        totalHeritages,
        recentHeritages,
        categoryDistribution,
        mostSavedHeritage: mostSavedHeritage[0] || null,
        featuredCount
      }
    });

  } catch (error) {
    console.error('Get heritage stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch heritage statistics',
      error: error.message
    });
  }
};

// Get activity trends
const getActivityTrends = async (req, res) => {
  try {
    // User registrations over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyRegistrations = await User.findAll({
      attributes: [
        [literal('DATE(createdAt)'), 'date'],
        [literal('COUNT(*)'), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      },
      group: [literal('DATE(createdAt)')],
      order: [[literal('date'), 'ASC']]
    });

    // Logins over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyLogins = await User.findAll({
      attributes: [
        [literal('DATE(lastLogin)'), 'date'],
        [literal('COUNT(*)'), 'count']
      ],
      where: {
        lastLogin: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      group: [literal('DATE(lastLogin)')],
      order: [[literal('date'), 'ASC']]
    });

    // Saves over last 7 days
    const dailySaves = await SavedHeritage.findAll({
      attributes: [
        [literal('DATE(createdAt)'), 'date'],
        [literal('COUNT(*)'), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      },
      group: [literal('DATE(createdAt)')],
      order: [[literal('date'), 'ASC']]
    });

    res.json({
      success: true,
      data: {
        dailyRegistrations,
        dailyLogins,
        dailySaves
      }
    });

  } catch (error) {
    console.error('Get activity trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity trends',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
  getHeritageManagement,
  getUserStats,
  getHeritageStats,
  getActivityTrends
}; 