"use client"

import { useState, useCallback, useRef, useEffect } from 'react'
import { DetectionState, ErrorType } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'
import { useAudioStore } from '@/lib/store/audio-store'
import { ERROR_MESSAGES } from '@/lib/constants/detection'
import { useAudioProcessor } from './use-audio-processor'
import { debounce } from '@/lib/utils/debounce'

export function useDetectionState() {
  const [detectionState, setDetectionState] = useState<DetectionState>("initial")
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout>()
  const { setIsRecording, setAudioBlob } = useAudioStore()
  const { isInitialized } = useAudioProcessor()
  const { toast } = useToast()

  const handleError = useCallback(
    debounce((type: ErrorType) => {
      setErrorType(type)
      setDetectionState("error")
      toast({
        title: "Error",
        description: ERROR_MESSAGES[type],
        variant: "destructive",
      })
    }, 300),
    [toast]
  )

  useEffect(() => {
    if (!isInitialized) {
      handleError('permission')
    }
  }, [isInitialized, handleError])

  // Rest of the existing code remains the same...
  
  return {
    detectionState,
    errorType,
    startDetection,
    stopDetection,
    resetDetection,
    isInitialized
  }
}