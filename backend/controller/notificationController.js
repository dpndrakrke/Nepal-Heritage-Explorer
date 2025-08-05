const webpush = require('web-push');
const { User } = require('../model');

// Configure VAPID keys - use environment variables or generate new ones
let vapidKeys;
try {
  // Try to use environment variables first
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  
  if (publicKey && privateKey) {
    vapidKeys = { publicKey, privateKey };
  } else {
    // Generate new keys if not provided
    vapidKeys = webpush.generateVAPIDKeys();
    console.log('Generated new VAPID keys. For production, set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.');
  }
} catch (error) {
  console.error('Error setting up VAPID keys:', error);
  vapidKeys = webpush.generateVAPIDKeys();
}

webpush.setVapidDetails(
  'mailto:admin@nepalheritage.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Store subscriptions (in production, use database)
const subscriptions = new Map();

// Subscribe to push notifications
const subscribeToNotifications = async (req, res) => {
  try {
    const { subscription, userId } = req.body;

    if (!subscription) {
      return res.status(400).json({
        success: false,
        message: 'Subscription is required'
      });
    }

    // Store subscription
    const subscriptionId = subscription.endpoint;
    subscriptions.set(subscriptionId, {
      subscription,
      userId,
      createdAt: new Date()
    });

    // If user is logged in, associate with user
    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({
          pushSubscription: JSON.stringify(subscription)
        });
      }
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to notifications',
      data: {
        publicKey: vapidKeys.publicKey
      }
    });

  } catch (error) {
    console.error('Subscribe to notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to notifications',
      error: error.message
    });
  }
};

// Unsubscribe from push notifications
const unsubscribeFromNotifications = async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user?.id;

    if (subscription?.endpoint) {
      subscriptions.delete(subscription.endpoint);
    }

    // Remove subscription from user if logged in
    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({
          pushSubscription: null
        });
      }
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from notifications'
    });

  } catch (error) {
    console.error('Unsubscribe from notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from notifications',
      error: error.message
    });
  }
};

// Send notification to all subscribers
const sendNotificationToAll = async (req, res) => {
  try {
    const { title, body, url, icon } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'Title and body are required'
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      icon: icon || '/favicon.ico',
      timestamp: new Date().toISOString()
    });

    const notifications = [];

    for (const [endpoint, subscriptionData] of subscriptions) {
      try {
        await webpush.sendNotification(
          subscriptionData.subscription,
          payload
        );
        notifications.push({ endpoint, status: 'sent' });
      } catch (error) {
        console.error('Failed to send notification to:', endpoint, error);
        // Remove invalid subscription
        if (error.statusCode === 410) {
          subscriptions.delete(endpoint);
        }
        notifications.push({ endpoint, status: 'failed', error: error.message });
      }
    }

    res.json({
      success: true,
      message: 'Notifications sent',
      data: {
        total: notifications.length,
        sent: notifications.filter(n => n.status === 'sent').length,
        failed: notifications.filter(n => n.status === 'failed').length,
        notifications
      }
    });

  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications',
      error: error.message
    });
  }
};

// Send notification to specific user
const sendNotificationToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, body, url, icon } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'Title and body are required'
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.pushSubscription) {
      return res.status(400).json({
        success: false,
        message: 'User has no push subscription'
      });
    }

    const subscription = JSON.parse(user.pushSubscription);
    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      icon: icon || '/favicon.ico',
      timestamp: new Date().toISOString()
    });

    try {
      await webpush.sendNotification(subscription, payload);
      res.json({
        success: true,
        message: 'Notification sent to user'
      });
    } catch (error) {
      console.error('Failed to send notification to user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
        error: error.message
      });
    }

  } catch (error) {
    console.error('Send notification to user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification to user',
      error: error.message
    });
  }
};

// Get notification statistics
const getNotificationStats = async (req, res) => {
  try {
    const totalSubscriptions = subscriptions.size;
    const usersWithSubscriptions = await User.count({
      where: {
        pushSubscription: {
          [require('sequelize').Op.ne]: null
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalSubscriptions,
        usersWithSubscriptions,
        publicKey: vapidKeys.publicKey
      }
    });

  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification statistics',
      error: error.message
    });
  }
};

// Send notification for new heritage site
const sendHeritageNotification = async (heritageData) => {
  try {
    const title = 'New Heritage Site Added!';
    const body = `Discover ${heritageData.name} - ${heritageData.shortDescription}`;
    const url = `/heritage/${heritageData.id}`;

    const payload = JSON.stringify({
      title,
      body,
      url,
      icon: '/favicon.ico',
      timestamp: new Date().toISOString()
    });

    const notifications = [];

    for (const [endpoint, subscriptionData] of subscriptions) {
      try {
        await webpush.sendNotification(
          subscriptionData.subscription,
          payload
        );
        notifications.push({ endpoint, status: 'sent' });
      } catch (error) {
        console.error('Failed to send heritage notification to:', endpoint, error);
        if (error.statusCode === 410) {
          subscriptions.delete(endpoint);
        }
        notifications.push({ endpoint, status: 'failed', error: error.message });
      }
    }

    console.log(`Heritage notification sent to ${notifications.filter(n => n.status === 'sent').length} subscribers`);
    return notifications;

  } catch (error) {
    console.error('Send heritage notification error:', error);
    return [];
  }
};

module.exports = {
  subscribeToNotifications,
  unsubscribeFromNotifications,
  sendNotificationToAll,
  sendNotificationToUser,
  getNotificationStats,
  sendHeritageNotification
}; 