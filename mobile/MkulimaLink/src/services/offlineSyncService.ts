/**
 * Offline Sync Service
 * Manages offline data synchronization for mobile app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

interface SyncQueue {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

interface CachedData {
  endpoint: string;
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class OfflineSyncService {
  private syncQueue: SyncQueue[] = [];
  private cachedData: Map<string, CachedData> = new Map();
  private isOnline: boolean = true;
  private isSyncing: boolean = false;

  constructor() {
    this.initializeNetworkListener();
    this.loadSyncQueue();
  }

  /**
   * Initialize network state listener
   */
  private initializeNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected ?? false;

      if (!wasOnline && this.isOnline) {
        // Went from offline to online
        this.syncOfflineData();
      }
    });
  }

  /**
   * Add request to sync queue
   */
  async addToSyncQueue(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ) {
    const queueItem: SyncQueue = {
      id: `${Date.now()}-${Math.random()}`,
      endpoint,
      method,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3
    };

    this.syncQueue.push(queueItem);
    await this.saveSyncQueue();
  }

  /**
   * Sync offline data when connection is restored
   */
  async syncOfflineData() {
    if (this.isSyncing || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;

    try {
      const itemsToSync = [...this.syncQueue];

      for (const item of itemsToSync) {
        try {
          const response = await axios({
            method: item.method,
            url: item.endpoint,
            data: item.data,
            timeout: 10000
          });

          // Remove from queue on success
          this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
          await this.saveSyncQueue();

          console.log(`Synced: ${item.endpoint}`);
        } catch (error) {
          item.retries++;

          if (item.retries >= item.maxRetries) {
            // Remove after max retries
            this.syncQueue = this.syncQueue.filter(q => q.id !== item.id);
            console.error(`Failed to sync ${item.endpoint} after ${item.maxRetries} retries`);
          }

          await this.saveSyncQueue();
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Cache data locally
   */
  async cacheData(endpoint: string, data: any, ttl: number = 3600000) {
    const cacheItem: CachedData = {
      endpoint,
      data,
      timestamp: Date.now(),
      ttl
    };

    this.cachedData.set(endpoint, cacheItem);

    try {
      await AsyncStorage.setItem(
        `cache_${endpoint}`,
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  /**
   * Get cached data
   */
  async getCachedData(endpoint: string): Promise<any | null> {
    try {
      // Check memory cache first
      const memoryCache = this.cachedData.get(endpoint);
      if (memoryCache && !this.isCacheExpired(memoryCache)) {
        return memoryCache.data;
      }

      // Check storage cache
      const storageCache = await AsyncStorage.getItem(`cache_${endpoint}`);
      if (storageCache) {
        const cacheItem: CachedData = JSON.parse(storageCache);
        if (!this.isCacheExpired(cacheItem)) {
          this.cachedData.set(endpoint, cacheItem);
          return cacheItem.data;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to get cached data:', error);
      return null;
    }
  }

  /**
   * Clear cache for endpoint
   */
  async clearCache(endpoint: string) {
    this.cachedData.delete(endpoint);
    await AsyncStorage.removeItem(`cache_${endpoint}`);
  }

  /**
   * Clear all cache
   */
  async clearAllCache() {
    this.cachedData.clear();
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith('cache_'));
    await AsyncStorage.multiRemove(cacheKeys);
  }

  /**
   * Get sync queue status
   */
  getSyncQueueStatus() {
    return {
      queueLength: this.syncQueue.length,
      isSyncing: this.isSyncing,
      isOnline: this.isOnline,
      items: this.syncQueue.map(item => ({
        endpoint: item.endpoint,
        method: item.method,
        retries: item.retries,
        timestamp: item.timestamp
      }))
    };
  }

  /**
   * Make request with offline support
   */
  async request(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<any> {
    try {
      // Try to make request
      const response = await axios({
        method,
        url: endpoint,
        data,
        timeout: 5000
      });

      // Cache successful response
      if (method === 'GET') {
        await this.cacheData(endpoint, response.data);
      }

      return response.data;
    } catch (error) {
      if (!this.isOnline) {
        // Offline - queue request and return cached data
        if (method !== 'GET') {
          await this.addToSyncQueue(endpoint, method, data);
        }

        const cachedData = await this.getCachedData(endpoint);
        if (cachedData) {
          return cachedData;
        }

        throw new Error('No cached data available');
      }

      throw error;
    }
  }

  // Helper methods

  private isCacheExpired(cacheItem: CachedData): boolean {
    const age = Date.now() - cacheItem.timestamp;
    return age > cacheItem.ttl;
  }

  private async saveSyncQueue() {
    try {
      await AsyncStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  private async loadSyncQueue() {
    try {
      const stored = await AsyncStorage.getItem('syncQueue');
      if (stored) {
        this.syncQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  /**
   * Get offline status
   */
  isOffline(): boolean {
    return !this.isOnline;
  }

  /**
   * Get online status
   */
  isConnected(): boolean {
    return this.isOnline;
  }
}

export default new OfflineSyncService();
