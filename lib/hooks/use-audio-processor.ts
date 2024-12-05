"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { createAudioProcessor } from '@/lib/utils/audio-utils'
import { debounce } from '@/lib/utils/debounce'
import { useAudioStore } from '@/lib/store/audio-store'

const AUDIO_THRESHOLD = 15
const DEBOUNCE_MS = 300

export function useAudioProcessor() {
  const [isInitialized, setIsInitialized] = useState(false)
  const processorRef = useRef(createAudioProcessor())
  const { setIsRecording } = useAudioStore()

  const handleAudioLevel = useCallback(
    debounce((level: number) => {
      if (level > AUDIO_THRESHOLD) {
        setIsRecording(true)
      }
    }, DEBOUNCE_MS),
    [setIsRecording]
  )

  useEffect(() => {
    const processor = processorRef.current
    let animationFrame: number
    let isProcessing = false

    const processAudio = () => {
      if (!isProcessing) return
      
      const level = processor.getAudioLevel()
      handleAudioLevel(level)
      animationFrame = requestAnimationFrame(processAudio)
    }

    const initializeProcessor = async () => {
      const success = await processor.initialize()
      if (success) {
        setIsInitialized(true)
        isProcessing = true
        processAudio()
      }
    }

    initializeProcessor()

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isProcessing = false
        cancelAnimationFrame(animationFrame)
      } else {
        isProcessing = true
        processAudio()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isProcessing = false
      cancelAnimationFrame(animationFrame)
      processor.cleanup()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleAudioLevel])

  return { isInitialized }
}