import { openDB } from 'idb';

const DB_NAME = 'mkulimalink-offline';
const DB_VERSION = 1;

let db = null;

export const initDB = async () => {
  if (db) return db;

  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('products')) {
        database.createObjectStore('products', { keyPath: '_id' });
      }
      if (!database.objectStoreNames.contains('prices')) {
        database.createObjectStore('prices', { keyPath: 'product' });
      }
      if (!database.objectStoreNames.contains('pendingActions')) {
        database.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
      }
      if (!database.objectStoreNames.contains('cache')) {
        database.createObjectStore('cache', { keyPath: 'key' });
      }
    }
  });

  return db;
};

export const cacheProducts = async (products) => {
  const database = await initDB();
  const tx = database.transaction('products', 'readwrite');
  for (const product of products) {
    await tx.store.put(product);
  }
  await tx.done;
};

export const getCachedProducts = async () => {
  const database = await initDB();
  return database.getAll('products');
};

export const cachePrices = async (prices) => {
  const database = await initDB();
  const tx = database.transaction('prices', 'readwrite');
  for (const price of prices) {
    await tx.store.put(price);
  }
  await tx.done;
};

export const getCachedPrices = async () => {
  const database = await initDB();
  return database.getAll('prices');
};

export const queueAction = async (action) => {
  const database = await initDB();
  await database.add('pendingActions', {
    ...action,
    timestamp: Date.now()
  });
};

export const getPendingActions = async () => {
  const database = await initDB();
  return database.getAll('pendingActions');
};

export const clearPendingAction = async (id) => {
  const database = await initDB();
  await database.delete('pendingActions', id);
};

export const setCache = async (key, value, ttl = 3600000) => {
  const database = await initDB();
  await database.put('cache', {
    key,
    value,
    expiresAt: Date.now() + ttl
  });
};

export const getCache = async (key) => {
  const database = await initDB();
  const item = await database.get('cache', key);
  if (!item) return null;
  if (item.expiresAt < Date.now()) {
    await database.delete('cache', key);
    return null;
  }
  return item.value;
};

export const isOnline = () => navigator.onLine;

export const syncPendingActions = async (api) => {
  if (!isOnline()) return { synced: 0, failed: 0 };

  const actions = await getPendingActions();
  let synced = 0;
  let failed = 0;

  for (const action of actions) {
    try {
      switch (action.type) {
        case 'CREATE_PRODUCT':
          await api.post('/products', action.data);
          break;
        case 'UPDATE_PRODUCT':
          await api.put(`/products/${action.data.id}`, action.data);
          break;
        case 'CREATE_TRANSACTION':
          await api.post('/transactions', action.data);
          break;
        default:
          console.warn('Unknown action type:', action.type);
      }
      await clearPendingAction(action.id);
      synced++;
    } catch (error) {
      console.error('Sync failed for action:', action, error);
      failed++;
    }
  }

  return { synced, failed };
};
