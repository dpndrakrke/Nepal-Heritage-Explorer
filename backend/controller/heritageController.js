const { Heritage, Image, SavedHeritage, User, Review, Comment } = require('../model');
const { Op } = require('sequelize');
const { sequelize } = require('../db/database');
const { sendHeritageNotification } = require('./notificationController');

// Get all heritages (public) with advanced filtering
const getAllHeritages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      featured,
      location,
      historicalPeriod,
      builtYearFrom,
      builtYearTo,
      entryFeeFrom,
      entryFeeTo,
      accessibility,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };

    // Add category filter
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // Add featured filter
    if (featured === 'true') {
      whereClause.featured = true;
    }

    // Add location filter
    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    // Add historical period filter
    if (historicalPeriod) {
      whereClause.historicalPeriod = { [Op.like]: `%${historicalPeriod}%` };
    }

    // Add built year range filter
    if (builtYearFrom || builtYearTo) {
      whereClause.builtYear = {};
      if (builtYearFrom) {
        whereClause.builtYear[Op.gte] = parseInt(builtYearFrom);
      }
      if (builtYearTo) {
        whereClause.builtYear[Op.lte] = parseInt(builtYearTo);
      }
    }

    // Add entry fee range filter
    if (entryFeeFrom || entryFeeTo) {
      whereClause.entryFee = {};
      if (entryFeeFrom) {
        whereClause.entryFee[Op.gte] = parseFloat(entryFeeFrom);
      }
      if (entryFeeTo) {
        whereClause.entryFee[Op.lte] = parseFloat(entryFeeTo);
      }
    }

    // Add accessibility filter (assuming we add this field to the model)
    if (accessibility) {
      whereClause.accessibility = accessibility;
    }

    // Add comprehensive search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { shortDescription: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { historicalPeriod: { [Op.like]: `%${search}%` } },
        { architect: { [Op.like]: `%${search}%` } },
        { significance: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: heritages } = await Heritage.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Image,
          as: 'images',
          where: { isPrimary: true },
          required: false,
          limit: 1,
          attributes: ['id', 'filename', 'originalName', 'path', 'size', 'mimeType', 'isPrimary', 'caption', 'heritageId', 'uploadedBy', 'createdAt', 'updatedAt']
        },
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

    // Add full URLs to images
    heritages.forEach(heritage => {
      if (heritage.images && heritage.images.length > 0) {
        heritage.images = heritage.images.map(image => {
          const imageData = image.toJSON();
          const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
          imageData.url = `${baseUrl}/uploads/${imageData.filename}`;
          console.log('Adding URL to image in list:', imageData.filename, 'URL:', imageData.url);
          return imageData;
        });
      }
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
    console.error('Get heritages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch heritages',
      error: error.message
    });
  }
};

// Get heritage by ID
const getHeritageById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const heritage = await Heritage.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: Image,
          as: 'images',
          order: [['isPrimary', 'DESC'], ['createdAt', 'ASC']],
          attributes: ['id', 'filename', 'originalName', 'path', 'size', 'mimeType', 'isPrimary', 'caption', 'heritageId', 'uploadedBy', 'createdAt', 'updatedAt']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'username']
        }
      ]
    });

    if (!heritage) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Add full URLs to images
    console.log('Processing images for heritage:', heritage.id);
    console.log('Images found:', heritage.images ? heritage.images.length : 0);
    if (heritage.images && heritage.images.length > 0) {
      heritage.images = heritage.images.map(image => {
        console.log('Processing image:', image.filename);
        const imageData = image.toJSON();
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        imageData.url = `${baseUrl}/uploads/${imageData.filename}`;
        console.log('Added URL to image:', imageData.filename, 'URL:', imageData.url);
        return imageData;
      });
      console.log('Final images array:', heritage.images);
    }

    // Check if user has saved this heritage
    let isSaved = false;
    if (userId) {
      const savedHeritage = await SavedHeritage.findOne({
        where: { userId, heritageId: id }
      });
      isSaved = !!savedHeritage;
    }

    // Get review statistics
    const reviewStats = await Review.findOne({
      where: { 
        heritageId: id,
        isActive: true
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
      ],
      raw: true
    });

    // Get comment statistics
    const commentStats = await Comment.count({
      where: { 
        heritageId: id,
        isActive: true
      }
    });

    res.json({
      success: true,
      data: {
        heritage,
        isSaved,
        reviewStats: {
          averageRating: parseFloat(reviewStats?.averageRating) || 0,
          totalReviews: parseInt(reviewStats?.totalReviews) || 0
        },
        commentStats: {
          totalComments: commentStats
        }
      }
    });

  } catch (error) {
    console.error('Get heritage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch heritage',
      error: error.message
    });
  }
};

// Create new heritage (admin only)
const createHeritage = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      category,
      visitingHours,
      entryFee,
      featured
    } = req.body;

    console.log('Received heritage data:', req.body);

    // Create the heritage site with simplified fields
    const heritage = await Heritage.create({
      name,
      shortDescription: description?.substring(0, 200) || '', // Use first 200 chars as short description
      description: description || '',
      longDescription: description || '',
      location,
      category,
      historicalPeriod: '', // Default empty
      builtYear: null, // Default null
      architect: '', // Default empty
      significance: '', // Default empty
      visitingHours: visitingHours || '',
      openingHours: visitingHours || '',
      entryFee: entryFee ? parseFloat(entryFee) : null,
      accessibility: '', // Default empty
      featured: featured === 'true' || featured === true,
      createdBy: req.user.id
    });

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      console.log('Uploaded files:', req.files);
      
      const imagePromises = req.files.map((file, index) => {
        console.log('Processing file:', file);
        return Image.create({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          isPrimary: index === 0, // First image is primary
          caption: req.body[`imageCaptions[${index}]`] || `Image ${index + 1}`,
          heritageId: heritage.id,
          uploadedBy: req.user.id
        });
      });

      const createdImages = await Promise.all(imagePromises);
      console.log('Created images:', createdImages);
    } else {
      console.log('No files uploaded');
    }

    // Send notification to all subscribers
    await sendHeritageNotification(heritage);

    // Fetch the created heritage with images
    const createdHeritage = await Heritage.findByPk(heritage.id, {
      include: [
        {
          model: Image,
          as: 'images',
          attributes: ['id', 'filename', 'originalName', 'path', 'size', 'mimeType', 'isPrimary', 'caption', 'heritageId', 'uploadedBy', 'createdAt', 'updatedAt']
        }
      ]
    });

    // Add full URLs to images
    if (createdHeritage.images) {
      console.log('Heritage images:', createdHeritage.images);
      createdHeritage.images = createdHeritage.images.map(image => {
        const imageData = image.toJSON();
        imageData.url = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${imageData.filename}`;
        console.log('Generated URL:', imageData.url);
        return imageData;
      });
    } else {
      console.log('No images found for heritage');
    }

    res.status(201).json({
      success: true,
      message: 'Heritage site created successfully',
      data: createdHeritage
    });

  } catch (error) {
    console.error('Create heritage error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create heritage site',
      error: error.message
    });
  }
};

// Update heritage (admin only)
const updateHeritage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      shortDescription,
      location,
      category,
      historicalPeriod,
      builtYear,
      architect,
      significance,
      visitingHours,
      entryFee,
      latitude,
      longitude,
      featured
    } = req.body;

    const heritage = await Heritage.findByPk(id);

    if (!heritage) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Prepare update data with proper type conversion
    const updateData = {
      name,
      description,
      shortDescription,
      location,
      category,
      historicalPeriod: historicalPeriod || null,
      builtYear: builtYear && builtYear !== '' ? parseInt(builtYear) : null,
      architect: architect || null,
      significance: significance || null,
      visitingHours: visitingHours || null,
      entryFee: entryFee ? parseInt(entryFee) : 0,
      latitude: latitude && latitude !== '' ? parseFloat(latitude) : null,
      longitude: longitude && longitude !== '' ? parseFloat(longitude) : null,
      featured: featured === 'true' || featured === true
    };

    await heritage.update(updateData);

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      console.log('Uploaded files for update:', req.files);
      
      const imagePromises = req.files.map((file, index) => {
        console.log('Processing file for update:', file);
        return Image.create({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          isPrimary: index === 0, // First image is primary
          caption: req.body[`imageCaptions[${index}]`] || `Image ${index + 1}`,
          heritageId: heritage.id,
          uploadedBy: req.user.id
        });
      });

      const createdImages = await Promise.all(imagePromises);
      console.log('Created images for update:', createdImages);
    }

    // Fetch the updated heritage with images
    const updatedHeritage = await Heritage.findByPk(heritage.id, {
      include: [
        {
          model: Image,
          as: 'images',
          attributes: ['id', 'filename', 'originalName', 'path', 'size', 'mimeType', 'isPrimary', 'caption', 'heritageId', 'uploadedBy', 'createdAt', 'updatedAt']
        }
      ]
    });

    // Add full URLs to images
    if (updatedHeritage.images) {
      console.log('Updated heritage images:', updatedHeritage.images);
      updatedHeritage.images = updatedHeritage.images.map(image => {
        const imageData = image.toJSON();
        imageData.url = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${imageData.filename}`;
        console.log('Generated URL for update:', imageData.url);
        return imageData;
      });
    } else {
      console.log('No images found for updated heritage');
    }

    res.json({
      success: true,
      message: 'Heritage site updated successfully',
      data: updatedHeritage
    });

  } catch (error) {
    console.error('Update heritage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update heritage site',
      error: error.message
    });
  }
};

// Delete heritage (admin only)
const deleteHeritage = async (req, res) => {
  try {
    const { id } = req.params;

    const heritage = await Heritage.findByPk(id);

    if (!heritage) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Soft delete by setting isActive to false
    await heritage.update({ isActive: false });

    res.json({
      success: true,
      message: 'Heritage site deleted successfully'
    });

  } catch (error) {
    console.error('Delete heritage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete heritage site',
      error: error.message
    });
  }
};

// Get heritage categories with enhanced information
const getCategories = async (req, res) => {
  try {
    const categories = [
      { 
        value: 'temple', 
        label: 'Temple',
        description: 'Religious temples and shrines',
        icon: '🕍'
      },
      { 
        value: 'palace', 
        label: 'Palace',
        description: 'Royal palaces and residences',
        icon: '🏰'
      },
      { 
        value: 'monument', 
        label: 'Monument',
        description: 'Historical monuments and memorials',
        icon: '🗽'
      },
      { 
        value: 'museum', 
        label: 'Museum',
        description: 'Museums and cultural centers',
        icon: '🏛️'
      },
      { 
        value: 'natural', 
        label: 'Natural Site',
        description: 'Natural heritage sites and landscapes',
        icon: '🌿'
      },
      { 
        value: 'fortress', 
        label: 'Fortress',
        description: 'Fortresses and defensive structures',
        icon: '🏯'
      },
      { 
        value: 'monastery', 
        label: 'Monastery',
        description: 'Buddhist monasteries and religious centers',
        icon: '⛩️'
      },
      { 
        value: 'other', 
        label: 'Other',
        description: 'Other heritage sites and landmarks',
        icon: '🏛️'
      }
    ];

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

// Get filter options for advanced search
const getFilterOptions = async (req, res) => {
  try {
    // Get unique locations
    const locations = await Heritage.findAll({
      where: { isActive: true },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('location')), 'location']],
      raw: true
    });

    // Get unique historical periods
    const historicalPeriods = await Heritage.findAll({
      where: { 
        isActive: true,
        historicalPeriod: { [Op.ne]: null }
      },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('historicalPeriod')), 'historicalPeriod']],
      raw: true
    });

    // Get built year range
    const yearRange = await Heritage.findAll({
      where: { 
        isActive: true,
        builtYear: { [Op.ne]: null }
      },
      attributes: [
        [sequelize.fn('MIN', sequelize.col('builtYear')), 'minYear'],
        [sequelize.fn('MAX', sequelize.col('builtYear')), 'maxYear']
      ],
      raw: true
    });

    // Get entry fee range
    const feeRange = await Heritage.findAll({
      where: { isActive: true },
      attributes: [
        [sequelize.fn('MIN', sequelize.col('entryFee')), 'minFee'],
        [sequelize.fn('MAX', sequelize.col('entryFee')), 'maxFee']
      ],
      raw: true
    });

    res.json({
      success: true,
      data: {
        locations: locations.map(item => item.location).filter(Boolean),
        historicalPeriods: historicalPeriods.map(item => item.historicalPeriod).filter(Boolean),
        yearRange: yearRange[0] || { minYear: 0, maxYear: 0 },
        feeRange: feeRange[0] || { minFee: 0, maxFee: 0 }
      }
    });

  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options',
      error: error.message
    });
  }
};

// Toggle save heritage (user)
const toggleSaveHeritage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if heritage exists
    const heritage = await Heritage.findByPk(id);
    if (!heritage) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Check if already saved
    const existingSave = await SavedHeritage.findOne({
      where: { userId, heritageId: id }
    });

    if (existingSave) {
      // Remove from saved
      await existingSave.destroy();
      res.json({
        success: true,
        message: 'Removed from saved heritages',
        data: { isSaved: false }
      });
    } else {
      // Add to saved
      await SavedHeritage.create({
        userId,
        heritageId: id
      });
      res.json({
        success: true,
        message: 'Added to saved heritages',
        data: { isSaved: true }
      });
    }

  } catch (error) {
    console.error('Toggle save heritage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle save heritage',
      error: error.message
    });
  }
};

// Get user's saved heritages
const getSavedHeritages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: savedHeritages } = await SavedHeritage.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Heritage,
          as: 'heritage',
          where: { isActive: true },
          include: [
            {
              model: Image,
              as: 'images',
              where: { isPrimary: true },
              required: false,
              limit: 1
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        savedHeritages,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get saved heritages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved heritages',
      error: error.message
    });
  }
};

module.exports = {
  getAllHeritages,
  getHeritageById,
  createHeritage,
  updateHeritage,
  deleteHeritage,
  getCategories,
  getFilterOptions,
  toggleSaveHeritage,
  getSavedHeritages
}; 