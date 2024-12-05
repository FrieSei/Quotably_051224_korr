"use client"

import { useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { errorTracker } from '@/lib/monitoring/error-tracker'
import { ERROR_MESSAGES } from '@/lib/constants/errors'

export function useErrorTracking() {
  const { toast } = useToast()

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    // Track the error
    errorTracker.trackError(error, {
      timestamp: Date.now(),
      ...context
    })

    // Show user-friendly toast
    toast({
      title: 'Error',
      description: ERROR_MESSAGES[error.name as keyof typeof ERROR_MESSAGES] || error.message,
      variant: 'destructive',
    })
  }, [toast])

  return { trackError }
}