/**
 * Push Notification Service
 * Manages push notifications for mobile app
 */

import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  notificationType?: 'alert' | 'recommendation' | 'market' | 'community' | 'system';
  priority?: 'high' | 'normal';
}

interface NotificationPreferences {
  alerts: boolean;
  recommendations: boolean;
  market: boolean;
  community: boolean;
  system: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

class PushNotificationService {
  private notificationPreferences: NotificationPreferences = {
    alerts: true,
    recommendations: true,
    market: true,
    community: true,
    system: true
  };

  private deviceToken: string | null = null;
  private notificationListeners: any[] = [];

  constructor() {
    this.initializePushNotifications();
  }

  /**
   * Initialize push notifications
   */
  private async initializePushNotifications() {
    try {
      // Request user permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Push notifications enabled');
        await this.setupNotificationHandlers();
        await this.getDeviceToken();
        await this.loadNotificationPreferences();
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
    }
  }

  /**
   * Get device token
   */
  private async getDeviceToken() {
    try {
      this.deviceToken = await messaging().getToken();
      console.log('Device token:', this.deviceToken);

      // Send token to backend
      if (this.deviceToken) {
        await this.registerDeviceToken(this.deviceToken);
      }

      // Listen for token refresh
      messaging().onTokenRefresh(async (token) => {
        this.deviceToken = token;
        await this.registerDeviceToken(token);
      });
    } catch (error) {
      console.error('Failed to get device token:', error);
    }
  }

  /**
   * Register device token with backend
   */
  private async registerDeviceToken(token: string) {
    try {
      await axios.post('/api/notifications/register-device', {
        device_token: token,
        platform: Platform.OS,
        app_version: '1.0.0'
      });
    } catch (error) {
      console.error('Failed to register device token:', error);
    }
  }

  /**
   * Setup notification handlers
   */
  private async setupNotificationHandlers() {
    // Handle foreground notifications
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground notification:', remoteMessage);
      await this.handleNotification(remoteMessage);
    });

    // Handle background notifications
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log('Notification opened app:', remoteMessage);
      await this.handleNotificationTap(remoteMessage);
    });

    // Handle notification when app is closed
    const initialNotification = await messaging().getInitialNotification();
    if (initialNotification) {
      await this.handleNotificationTap(initialNotification);
    }
  }

  /**
   * Handle incoming notification
   */
  private async handleNotification(remoteMessage: any) {
    const notificationType = remoteMessage.data?.notificationType || 'system';

    // Check if notification type is enabled
    if (!this.notificationPreferences[notificationType as keyof NotificationPreferences]) {
      return;
    }

    // Check quiet hours
    if (this.isInQuietHours()) {
      // Store notification silently
      await this.storeNotification(remoteMessage);
      return;
    }

    // Display notification
    this.displayNotification(remoteMessage);
  }

  /**
   * Handle notification tap
   */
  private async handleNotificationTap(remoteMessage: any) {
    const { notificationType, targetScreen, targetId } = remoteMessage.data || {};

    // Navigate based on notification type
    this.navigateToScreen(notificationType, targetScreen, targetId);
  }

  /**
   * Display notification
   */
  private displayNotification(remoteMessage: any) {
    const { title, body } = remoteMessage.notification || {};

    // Emit notification event
    this.notificationListeners.forEach(listener => {
      listener({
        title,
        body,
        data: remoteMessage.data
      });
    });
  }

  /**
   * Store notification
   */
  private async storeNotification(remoteMessage: any) {
    try {
      const notifications = await this.getStoredNotifications();
      notifications.push({
        id: `${Date.now()}`,
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
        timestamp: Date.now(),
        read: false
      });

      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(notifications.slice(-50)) // Keep last 50
      );
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }

  /**
   * Get stored notifications
   */
  async getStoredNotifications() {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string) {
    try {
      const notifications = await this.getStoredNotifications();
      const updated = notifications.map((n: any) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications() {
    try {
      await AsyncStorage.removeItem('notifications');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>) {
    this.notificationPreferences = {
      ...this.notificationPreferences,
      ...preferences
    };

    try {
      await AsyncStorage.setItem(
        'notificationPreferences',
        JSON.stringify(this.notificationPreferences)
      );

      // Sync with backend
      await axios.post('/api/notifications/preferences', this.notificationPreferences);
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
    }
  }

  /**
   * Get notification preferences
   */
  getNotificationPreferences(): NotificationPreferences {
    return this.notificationPreferences;
  }

  /**
   * Subscribe to notification events
   */
  onNotification(callback: (notification: any) => void) {
    this.notificationListeners.push(callback);

    return () => {
      this.notificationListeners = this.notificationListeners.filter(
        listener => listener !== callback
      );
    };
  }

  /**
   * Send local notification
   */
  async sendLocalNotification(payload: NotificationPayload) {
    try {
      // This would use a library like react-native-notifications
      // For now, we'll just emit the event
      this.displayNotification({
        notification: {
          title: payload.title,
          body: payload.body
        },
        data: payload.data
      });
    } catch (error) {
      console.error('Failed to send local notification:', error);
    }
  }

  // Helper methods

  private isInQuietHours(): boolean {
    if (!this.notificationPreferences.quiet_hours_start || !this.notificationPreferences.quiet_hours_end) {
      return false;
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const start = this.notificationPreferences.quiet_hours_start;
    const end = this.notificationPreferences.quiet_hours_end;

    if (start < end) {
      return currentTime >= start && currentTime < end;
    } else {
      return currentTime >= start || currentTime < end;
    }
  }

  private async loadNotificationPreferences() {
    try {
      const stored = await AsyncStorage.getItem('notificationPreferences');
      if (stored) {
        this.notificationPreferences = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  }

  private navigateToScreen(notificationType: string, targetScreen?: string, targetId?: string) {
    // Navigation logic would be implemented here
    console.log(`Navigate to: ${targetScreen} with ID: ${targetId}`);
  }

  /**
   * Get device token
   */
  getDeviceToken(): string | null {
    return this.deviceToken;
  }
}

export default new PushNotificationService();
