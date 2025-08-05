class NotificationService {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.registration = null;
    this.subscription = null;
    this.publicKey = null;
  }

  // Initialize service worker and request permissions
  async initialize() {
    if (!this.isSupported) {
      console.log('Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.registration);

      // Get VAPID public key from server
      await this.getVapidPublicKey();

      // Request notification permission
      const permission = await this.requestPermission();
      if (permission === 'granted') {
        await this.subscribeToPush();
        return true;
      } else if (permission === 'denied') {
        console.log('Notification permission denied by user');
      } else {
        console.log('Notification permission not granted');
      }
      return false;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  // Get VAPID public key from server
  async getVapidPublicKey() {
    try {
      const response = await fetch('/api/notifications/stats');
      if (response.ok) {
        const data = await response.json();
        this.publicKey = data.data.publicKey;
      }
    } catch (error) {
      console.error('Failed to get VAPID public key:', error);
    }
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) return 'denied';

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }

  // Subscribe to push notifications
  async subscribeToPush() {
    if (!this.registration) {
      console.error('Service Worker not registered');
      return;
    }

    if (!this.publicKey) {
      console.error('VAPID public key not available');
      return;
    }

    try {
      // Get push subscription
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicKey)
      });

      console.log('Push subscription:', this.subscription);

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPush() {
    if (this.subscription) {
      await this.subscription.unsubscribe();
      this.subscription = null;
      console.log('Unsubscribed from push notifications');
    }
  }

  // Send subscription to server
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userId: localStorage.getItem('userId') // If user is logged in
        })
      });

      if (response.ok) {
        console.log('Subscription sent to server');
      } else {
        console.error('Failed to send subscription to server');
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  }

  // Convert VAPID key to Uint8Array
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Check if notifications are enabled
  isNotificationsEnabled() {
    return this.isSupported && Notification.permission === 'granted';
  }

  // Show local notification
  showNotification(title, options = {}) {
    if (!this.isNotificationsEnabled()) {
      console.log('Notifications not enabled');
      return;
    }

    const defaultOptions = {
      body: '',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Explore Now',
          icon: '/favicon.ico'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/favicon.ico'
        }
      ]
    };

    const notificationOptions = { ...defaultOptions, ...options };
    
    if (this.registration) {
      this.registration.showNotification(title, notificationOptions);
    } else {
      new Notification(title, notificationOptions);
    }
  }

  // Get subscription status
  async getSubscriptionStatus() {
    if (!this.registration) return null;

    const subscription = await this.registration.pushManager.getSubscription();
    return {
      subscribed: !!subscription,
      subscription: subscription
    };
  }
}

export default new NotificationService(); 