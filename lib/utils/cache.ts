import { openDB, DBSchema } from 'idb';

interface CacheDB extends DBSchema {
  cache: {
    key: string;
    value: {
      key: string;
      value: any;
      timestamp: number;
      ttl: number;
    };
    indexes: {
      'by-timestamp': number;
    };
  };
}

class PersistentCache {
  private memoryCache = new Map<string, any>();
  private dbPromise = openDB<CacheDB>('quotably-cache', 1, {
    upgrade(db) {
      const store = db.createObjectStore('cache', { keyPath: 'key' });
      store.createIndex('by-timestamp', 'timestamp');
    },
  });

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const timestamp = Date.now();
    const entry = { key, value, timestamp, ttl: ttl * 1000 };

    // Update memory cache
    this.memoryCache.set(key, entry);

    // Update persistent cache
    const db = await this.dbPromise;
    await db.put('cache', entry);

    // Cleanup expired entries occasionally
    if (Math.random() < 0.1) {
      this.cleanup();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memEntry = this.memoryCache.get(key);
    if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttl) {
      return memEntry.value;
    }

    // Check persistent cache
    const db = await this.dbPromise;
    const entry = await db.get('cache', key);

    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      // Update memory cache
      this.memoryCache.set(key, entry);
      return entry.value;
    }

    // Remove expired entry
    if (entry) {
      this.delete(key);
    }

    return null;
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    const db = await this.dbPromise;
    await db.delete('cache', key);
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    const db = await this.dbPromise;
    await db.clear('cache');
  }

  private async cleanup(): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction('cache', 'readwrite');
    const index = tx.store.index('by-timestamp');
    const now = Date.now();

    let cursor = await index.openCursor();
    while (cursor) {
      const entry = cursor.value;
      if (now - entry.timestamp > entry.ttl) {
        await cursor.delete();
        this.memoryCache.delete(entry.key);
      }
      cursor = await cursor.continue();
    }
  }
}

export const cache = new PersistentCache();