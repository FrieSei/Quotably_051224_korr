"use client"

import { useEffect } from 'react'
import { db } from '@/lib/db'
import { DB_SETTINGS } from '@/lib/constants'

export function useStorageCleanup() {
  useEffect(() => {
    if (!DB_SETTINGS.AUTO_CLEANUP) return

    const cleanup = async () => {
      const database = await db
      const tx = database.transaction('highlights', 'readwrite')
      const store = tx.store
      const index = store.index('by-timestamp')

      // Delete old highlights
      const cutoffDate = Date.now() - (DB_SETTINGS.RETENTION_DAYS * 24 * 60 * 60 * 1000)
      const oldHighlights = await index.getAllKeys(IDBKeyRange.upperBound(cutoffDate))
      
      for (const key of oldHighlights) {
        await store.delete(key)
      }

      // Ensure we don't exceed maximum highlights
      const allKeys = await store.getAllKeys()
      if (allKeys.length > DB_SETTINGS.MAX_HIGHLIGHTS) {
        const keysToDelete = allKeys.slice(0, allKeys.length - DB_SETTINGS.MAX_HIGHLIGHTS)
        for (const key of keysToDelete) {
          await store.delete(key)
        }
      }
    }

    // Run cleanup on mount and every 24 hours
    cleanup()
    const interval = setInterval(cleanup, 24 * 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])
}