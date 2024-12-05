"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  const startRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported')
      return
    }

    const recognition = new webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
    setRecognition(recognition)
    setIsRecording(true)
  }, [onTranscript])

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setRecognition(null)
    }
    setIsRecording(false)
  }, [recognition])

  return (
    <Button
      size="icon"
      variant="outline"
      disabled={disabled}
      onClick={isRecording ? stopRecording : startRecording}
    >
      <Mic className={cn(
        "h-4 w-4 transition-colors",
        isRecording && "text-red-500"
      )} />
    </Button>
  )
}