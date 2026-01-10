import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOffline } from '../hooks/useOffline';

function OfflineIndicator() {
  const { online, pendingCount, syncing, sync } = useOffline();

  if (online && pendingCount === 0) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 rounded-lg shadow-lg z-50 ${
      online ? 'bg-yellow-100 border border-yellow-300' : 'bg-red-100 border border-red-300'
    }`}>
      <div className="flex items-center gap-3">
        {!online ? (
          <>
            <WifiOff className="text-red-600" size={24} />
            <div className="flex-1">
              <p className="font-semibold text-red-800">You're Offline</p>
              <p className="text-sm text-red-700">Changes will sync when connected</p>
            </div>
          </>
        ) : (
          <>
            <RefreshCw className={`text-yellow-600 ${syncing ? 'animate-spin' : ''}`} size={24} />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">{pendingCount} Pending Actions</p>
              <p className="text-sm text-yellow-700">
                {syncing ? 'Syncing...' : 'Tap to sync now'}
              </p>
            </div>
            {!syncing && (
              <button
                onClick={sync}
                className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
              >
                Sync
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OfflineIndicator;
