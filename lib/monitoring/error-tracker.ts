"use client"

import { logger } from './logger'
import { metrics } from './metrics'

interface ErrorContext {
  provider?: string
  operation?: string
  timestamp: number
  metadata?: Record<string, any>
}

export class ErrorTracker {
  private static instance: ErrorTracker
  private errorCounts: Map<string, number> = new Map()
  private readonly flushInterval = 60000 // 1 minute

  private constructor() {
    this.setupPeriodicFlush()
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker()
    }
    return ErrorTracker.instance
  }

  trackError(error: Error, context: Partial<ErrorContext> = {}) {
    const errorKey = this.getErrorKey(error, context)
    const currentCount = this.errorCounts.get(errorKey) || 0
    this.errorCounts.set(errorKey, currentCount + 1)

    // Log the error
    logger.error(error.message, {
      ...context,
      errorType: error.name,
      stackTrace: error.stack,
    })

    // Update metrics
    metrics.increment(`errors.total`)
    if (context.provider) {
      metrics.increment(`errors.provider.${context.provider}`)
    }
    metrics.increment(`errors.type.${error.name}`)

    // Check for error thresholds
    this.checkErrorThresholds(errorKey, currentCount + 1)
  }

  getErrorStats(): Record<string, any> {
    const stats: Record<string, any> = {
      totalErrors: 0,
      byProvider: {},
      byType: {},
    }

    this.errorCounts.forEach((count, key) => {
      const [provider, type] = key.split(':')
      stats.totalErrors += count
      
      if (provider !== 'unknown') {
        stats.byProvider[provider] = (stats.byProvider[provider] || 0) + count
      }
      
      if (type) {
        stats.byType[type] = (stats.byType[type] || 0) + count
      }
    })

    return stats
  }

  private getErrorKey(error: Error, context: Partial<ErrorContext>): string {
    return `${context.provider || 'unknown'}:${error.name}`
  }

  private checkErrorThresholds(errorKey: string, count: number) {
    const thresholds = {
      warning: 5,
      critical: 10,
    }

    if (count === thresholds.warning) {
      logger.warn(`Error threshold warning reached for ${errorKey}`)
    } else if (count === thresholds.critical) {
      logger.error(`Error threshold critical for ${errorKey}`)
    }
  }

  private setupPeriodicFlush() {
    setInterval(() => {
      this.errorCounts.clear()
    }, this.flushInterval)
  }
}

export const errorTracker = ErrorTracker.getInstance()