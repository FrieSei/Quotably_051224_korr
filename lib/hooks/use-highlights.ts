"use client"

import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { db, saveHighlight, deleteHighlight, getHighlightsByTimeRange } from '@/lib/db'
import type { QuotablyDB } from '@/lib/db/schema'
import { useStorageCleanup } from './use-storage-cleanup'

export function useHighlights() {
  const [highlights, setHighlights] = useState<QuotablyDB['highlights']['value'][]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize storage cleanup
  useStorageCleanup()

  const loadHighlights = useCallback(async () => {
    setIsLoading(true)
    try {
      const database = await db
      const tx = database.transaction('highlights', 'readonly')
      const store = tx.objectStore('highlights')
      const items = await store.getAll()
      setHighlights(items)
    } catch (error) {
      console.error('Failed to load highlights:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addHighlight = useCallback(async (
    content: string,
    source?: string,
    options?: {
      notes?: string
      duration?: number
      audioUrl?: string
      transcription?: string
      tags?: string[]
    }
  ) => {
    const newHighlight: QuotablyDB['highlights']['value'] = {
      id: uuidv4(),
      content,
      timestamp: Date.now(),
      source,
      ...options,
    }

    try {
      await saveHighlight(newHighlight)
      await loadHighlights()
      return newHighlight.id
    } catch (error) {
      console.error('Failed to add highlight:', error)
      throw error
    }
  }, [loadHighlights])

  const removeHighlight = useCallback(async (id: string) => {
    try {
      await deleteHighlight(id)
      await loadHighlights()
    } catch (error) {
      console.error('Failed to remove highlight:', error)
      throw error
    }
  }, [loadHighlights])

  const getRecentHighlights = useCallback(async (hours: number = 24) => {
    const endTime = Date.now()
    const startTime = endTime - (hours * 60 * 60 * 1000)
    return getHighlightsByTimeRange(startTime, endTime)
  }, [])

  useEffect(() => {
    loadHighlights()
  }, [loadHighlights])

  return {
    highlights,
    isLoading,
    addHighlight,
    removeHighlight,
    loadHighlights,
    getRecentHighlights,
  }
}