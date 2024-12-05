"use client"

import { Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudioRecorder } from '@/lib/hooks/use-audio-recorder'

export function AudioCapture() {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder()

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Button
        size="lg"
        variant={isRecording ? "destructive" : "default"}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <>
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </>
        )}
      </Button>
    </div>
  )
}