/**
 * Home Screen
 * Main dashboard for mobile app
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import offlineSyncService from '../services/offlineSyncService';
import pushNotificationService from '../services/pushNotificationService';

interface DashboardData {
  farm_name: string;
  total_area: number;
  active_crops: number;
  weather: any;
  alerts: any[];
  recommendations: any[];
}

const HomeScreen = ({ navigation }: any) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = pushNotificationService.onNotification((notification) => {
      console.log('Notification received:', notification);
      // Handle notification
    });

    return unsubscribe;
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setIsOffline(offlineSyncService.isOffline());

      const data = await offlineSyncService.request(
        '/api/analytics/farm/dashboard',
        'GET'
      );

      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Offline Banner */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline Mode - Changes will sync when online</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>{dashboardData?.farm_name}</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Total Area"
          value={`${dashboardData?.total_area} ha`}
          color="#10b981"
        />
        <StatCard
          title="Active Crops"
          value={dashboardData?.active_crops.toString()}
          color="#3b82f6"
        />
      </View>

      {/* Weather Card */}
      {dashboardData?.weather && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Weather')}
        >
          <Text style={styles.cardTitle}>Weather</Text>
          <View style={styles.weatherContent}>
            <Text style={styles.temperature}>
              {dashboardData.weather.temperature}°C
            </Text>
            <Text style={styles.condition}>{dashboardData.weather.condition}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Alerts */}
      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
        <TouchableOpacity
          style={[styles.card, styles.alertCard]}
          onPress={() => navigation.navigate('Alerts')}
        >
          <Text style={styles.cardTitle}>
            Alerts ({dashboardData.alerts.length})
          </Text>
          {dashboardData.alerts.slice(0, 2).map((alert, idx) => (
            <Text key={idx} style={styles.alertText}>
              • {alert.message}
            </Text>
          ))}
        </TouchableOpacity>
      )}

      {/* Recommendations */}
      {dashboardData?.recommendations && dashboardData.recommendations.length > 0 && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Recommendations')}
        >
          <Text style={styles.cardTitle}>
            Recommendations ({dashboardData.recommendations.length})
          </Text>
          {dashboardData.recommendations.slice(0, 2).map((rec, idx) => (
            <Text key={idx} style={styles.recommendationText}>
              • {rec.title}
            </Text>
          ))}
        </TouchableOpacity>
      )}

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <QuickActionButton
          title="Analytics"
          icon="📊"
          onPress={() => navigation.navigate('Analytics')}
        />
        <QuickActionButton
          title="Market"
          icon="💰"
          onPress={() => navigation.navigate('Market')}
        />
        <QuickActionButton
          title="Community"
          icon="👥"
          onPress={() => navigation.navigate('Community')}
        />
        <QuickActionButton
          title="Settings"
          icon="⚙️"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </ScrollView>
  );
};

const StatCard = ({ title, value, color }: any) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const QuickActionButton = ({ title, icon, onPress }: any) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Text style={styles.actionIcon}>{icon}</Text>
    <Text style={styles.actionTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  offlineBanner: {
    backgroundColor: '#fca5a5',
    padding: 12,
    alignItems: 'center'
  },
  offlineText: {
    color: '#7f1d1d',
    fontSize: 14,
    fontWeight: '600'
  },
  header: {
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827'
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827'
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12
  },
  weatherContent: {
    alignItems: 'center'
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6'
  },
  condition: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },
  alertText: {
    fontSize: 14,
    color: '#ef4444',
    marginVertical: 4
  },
  recommendationText: {
    fontSize: 14,
    color: '#10b981',
    marginVertical: 4
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827'
  }
});

export default HomeScreen;
