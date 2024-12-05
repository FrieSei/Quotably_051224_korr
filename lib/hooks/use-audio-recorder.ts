"use client"

import { useState, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useAudioStore } from '@/lib/store/audio-store'
import { useHighlights } from './use-highlights'

export function useAudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const { isRecording, setIsRecording, setAudioBlob } = useAudioStore()
  const { addHighlight } = useHighlights()
  const { toast } = useToast()

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        addHighlight("New audio recording", "Voice Recording")
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      })
    }
  }, [setIsRecording, setAudioBlob, addHighlight, toast])

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }, [mediaRecorder, setIsRecording])

  return {
    isRecording,
    startRecording,
    stopRecording
  }
}