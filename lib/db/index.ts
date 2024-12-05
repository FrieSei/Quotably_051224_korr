import { openDB } from 'idb'
import type { QuotablyDB } from './schema'
import { APP_VERSION } from '@/lib/constants'

const DB_NAME = 'quotably-db'
const DB_VERSION = 1

export const initDB = async () => {
  const db = await openDB<QuotablyDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion) {
      // Highlights store
      if (!db.objectStoreNames.contains('highlights')) {
        const highlightsStore = db.createObjectStore('highlights', { keyPath: 'id' })
        highlightsStore.createIndex('by-timestamp', 'timestamp')
        highlightsStore.createIndex('by-source', 'source')
        highlightsStore.createIndex('by-tags', 'tags', { multiEntry: true })
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' })
      }
    },
    blocked() {
      console.warn('Database upgrade was blocked')
    },
    blocking() {
      console.warn('Database is blocking an upgrade')
    },
    terminated() {
      console.error('Database connection was terminated')
    },
  })

  return db
}

export const db = initDB()

// Helper functions for database operations
export async function getHighlightsByTimeRange(startTime: number, endTime: number) {
  const database = await db
  const tx = database.transaction('highlights', 'readonly')
  const index = tx.store.index('by-timestamp')
  return index.getAll(IDBKeyRange.bound(startTime, endTime))
}

export async function getHighlightsBySource(source: string) {
  const database = await db
  const tx = database.transaction('highlights', 'readonly')
  const index = tx.store.index('by-source')
  return index.getAll(source)
}

export async function getHighlightsByTag(tag: string) {
  const database = await db
  const tx = database.transaction('highlights', 'readonly')
  const index = tx.store.index('by-tags')
  return index.getAll(tag)
}

export async function saveHighlight(highlight: QuotablyDB['highlights']['value']) {
  const database = await db
  const tx = database.transaction('highlights', 'readwrite')
  await tx.store.put({
    ...highlight,
    metadata: {
      ...highlight.metadata,
      deviceInfo: navigator.userAgent,
      appVersion: APP_VERSION,
      location: await getCurrentLocation(),
    },
  })
  await tx.done
}

export async function deleteHighlight(id: string) {
  const database = await db
  const tx = database.transaction('highlights', 'readwrite')
  await tx.store.delete(id)
  await tx.done
}

async function getCurrentLocation(): Promise<string | undefined> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 5000,
        maximumAge: 0,
      })
    })
    return `${position.coords.latitude},${position.coords.longitude}`
  } catch {
    return undefined
  }
}