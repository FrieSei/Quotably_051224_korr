"use client"

import { CardContent } from "@/components/ui/card"
import { TimeAdjuster } from "./time-adjuster"
import { AudioPlayer } from "./audio-player"

interface ResultContentProps {
  audioUrl: string
  onTimeAdjust: (seconds: number) => void
}

export function ResultContent({ audioUrl, onTimeAdjust }: ResultContentProps) {
  return (
    <CardContent className="space-y-4">
      <AudioPlayer url={audioUrl} />
      <TimeAdjuster onAdjust={onTimeAdjust} />
    </CardContent>
  )
}