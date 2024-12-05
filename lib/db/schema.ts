import type { DBSchema } from 'idb'
import type { PodcastMetadata } from '@/lib/types'

export interface QuotablyDB extends DBSchema {
  highlights: {
    key: string
    value: {
      id: string
      content: string
      timestamp: number
      duration?: number
      source?: string
      notes?: string
      audioUrl?: string
      transcription?: string
      metadata?: PodcastMetadata
      tags?: string[]
      metadata?: {
        deviceInfo: string
        appVersion: string
        location?: string
        podcast?: PodcastMetadata
      }
    }
    indexes: {
      'by-timestamp': number
      'by-source': string
      'by-tags': string[]
    }
  }
  settings: {
    key: string
    value: {
      id: string
      key: string
      value: any
      updatedAt: number
    }
  }
}