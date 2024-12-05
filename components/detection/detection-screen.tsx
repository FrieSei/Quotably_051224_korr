"use client"

import { useDetectionState } from '@/lib/hooks/use-detection-state'
import { useMetadata } from '@/lib/hooks/use-metadata'
import { DetectionCarousel } from './detection-carousel'
import { StatusDisplay } from './status-display'
import { ErrorHandler } from './error-handler'
import { MetadataDisplay } from './metadata-display'
import { RecentHighlights } from './recent-highlights'

export function DetectionScreen() {
  const { 
    detectionState, 
    errorType,
    startDetection, 
    stopDetection, 
    resetDetection,
    clearError
  } = useDetectionState()

  const {
    metadata,
    isLoading: isLoadingMetadata,
    fetchMetadata,
    clearMetadata
  } = useMetadata()

  const handleAction = async () => {
    if (detectionState === "initial" || detectionState === "error") {
      clearMetadata()
      startDetection()
      fetchMetadata()
    } else if (detectionState === "listening") {
      stopDetection()
    } else {
      resetDetection()
      clearMetadata()
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center">
      <div className="flex-1 w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Quotably</h1>
        
        <MetadataDisplay 
          metadata={metadata}
          isLoading={isLoadingMetadata}
          className="mb-8"
        />
        
        <DetectionCarousel 
          state={detectionState}
          onStateChange={resetDetection}
          onAction={handleAction}
        />
        
        <StatusDisplay 
          state={detectionState} 
          errorType={errorType} 
        />
      </div>
      
      <RecentHighlights />
      
      <ErrorHandler 
        error={errorType}
        onDismiss={clearError}
      />
    </main>
  )
}