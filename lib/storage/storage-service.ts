import { openDB, DBSchema } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { Highlight, ContentMetadata } from '@/lib/types';
import { logger } from '@/lib/monitoring/logger';
import { metrics } from '@/lib/monitoring/metrics';

interface StorageDB extends DBSchema {
  highlights: {
    key: string;
    value: Highlight;
    indexes: {
      'by-timestamp': number;
      'by-source': string;
    };
  };
  metadata: {
    key: string;
    value: ContentMetadata;
    indexes: {
      'by-title': string;
    };
  };
}

class StorageService {
  private dbPromise = openDB<StorageDB>('quotably-storage', 1, {
    upgrade(db) {
      // Highlights store
      const highlightsStore = db.createObjectStore('highlights', { keyPath: 'id' });
      highlightsStore.createIndex('by-timestamp', 'timestamp');
      highlightsStore.createIndex('by-source', 'source');

      // Metadata store
      const metadataStore = db.createObjectStore('metadata', { keyPath: 'id' });
      metadataStore.createIndex('by-title', 'title');
    },
  });

  async saveHighlight(content: string, metadata?: ContentMetadata): Promise<string> {
    const startTime = performance.now();
    const id = uuidv4();

    try {
      const db = await this.dbPromise;
      const highlight: Highlight = {
        id,
        content,
        timestamp: Date.now(),
        metadata,
      };

      await db.add('highlights', highlight);

      // Track metrics
      const duration = performance.now() - startTime;
      metrics.record('storage.save.duration', duration);
      metrics.increment('storage.save.success');

      logger.info('Highlight saved successfully', { id, duration });
      return id;
    } catch (error) {
      metrics.increment('storage.save.error');
      logger.error('Failed to save highlight', { error });
      throw error;
    }
  }

  async getHighlight(id: string): Promise<Highlight | undefined> {
    try {
      const db = await this.dbPromise;
      return await db.get('highlights', id);
    } catch (error) {
      logger.error('Failed to retrieve highlight', { id, error });
      throw error;
    }
  }

  async getRecentHighlights(limit: number = 5): Promise<Highlight[]> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('highlights', 'readonly');
      const index = tx.store.index('by-timestamp');
      
      const highlights: Highlight[] = [];
      let cursor = await index.openCursor(null, 'prev');
      
      while (cursor && highlights.length < limit) {
        highlights.push(cursor.value);
        cursor = await cursor.continue();
      }

      return highlights;
    } catch (error) {
      logger.error('Failed to retrieve recent highlights', { error });
      throw error;
    }
  }

  async updateHighlight(id: string, updates: Partial<Highlight>): Promise<void> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('highlights', 'readwrite');
      const store = tx.store;

      const highlight = await store.get(id);
      if (!highlight) {
        throw new Error('Highlight not found');
      }

      await store.put({
        ...highlight,
        ...updates,
      });

      logger.info('Highlight updated successfully', { id });
    } catch (error) {
      logger.error('Failed to update highlight', { id, error });
      throw error;
    }
  }

  async deleteHighlight(id: string): Promise<void> {
    try {
      const db = await this.dbPromise;
      await db.delete('highlights', id);
      logger.info('Highlight deleted successfully', { id });
    } catch (error) {
      logger.error('Failed to delete highlight', { id, error });
      throw error;
    }
  }

  async cleanup(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const db = await this.dbPromise;
      const tx = db.transaction('highlights', 'readwrite');
      const index = tx.store.index('by-timestamp');
      const cutoff = Date.now() - maxAge;

      let cursor = await index.openCursor();
      while (cursor) {
        if (cursor.value.timestamp < cutoff) {
          await cursor.delete();
        }
        cursor = await cursor.continue();
      }

      logger.info('Storage cleanup completed');
    } catch (error) {
      logger.error('Failed to cleanup storage', { error });
      throw error;
    }
  }
}

export const storageService = new StorageService();