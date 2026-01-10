import { useState, useEffect, useCallback } from 'react';
import { syncPendingActions, getPendingActions, isOnline } from '../utils/offlineStorage';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useOffline = () => {
  const [online, setOnline] = useState(isOnline());
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      toast.success('Back online! Syncing data...');
      sync();
    };

    const handleOffline = () => {
      setOnline(false);
      toast.error('You are offline. Changes will sync when connected.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkPendingActions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPendingActions = async () => {
    const actions = await getPendingActions();
    setPendingCount(actions.length);
  };

  const sync = useCallback(async () => {
    if (!isOnline() || syncing) return;

    setSyncing(true);
    try {
      const result = await syncPendingActions(api);
      if (result.synced > 0) {
        toast.success(`Synced ${result.synced} pending actions`);
      }
      if (result.failed > 0) {
        toast.error(`Failed to sync ${result.failed} actions`);
      }
      await checkPendingActions();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  return {
    online,
    pendingCount,
    syncing,
    sync
  };
};

export default useOffline;
