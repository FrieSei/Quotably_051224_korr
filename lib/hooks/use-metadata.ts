"use client"

import { useState, useCallback } from 'react'
import { ContentMetadata, MetadataQuery } from '@/lib/types'
import { metadataService } from '@/lib/services/metadata/metadata'

export function useMetadata() {
  const [isLoading, setIsLoading] = useState(false)
  const [metadata, setMetadata] = useState<ContentMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchMetadata = useCallback(async (query: Partial<MetadataQuery>) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await metadataService.fetchMetadata(query)

      if (result.success && result.data) {
        setMetadata(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch metadata')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metadata')
      setMetadata(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMetadata = useCallback(() => {
    setMetadata(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    metadata,
    isLoading,
    error,
    fetchMetadata,
    clearMetadata
  }
}