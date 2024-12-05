"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { WaveformVisualizer } from "./waveform-visualizer"
import { TimeControls } from "./time-controls"
import type { ContentProps } from "./types"

export function ResultContent({ episode, onTimeAdjust, onShare }: ContentProps) {
  return (
    <CardContent>
      <div className="space-y-4">
        <WaveformVisualizer className="h-24" />
        
        <div className="flex items-center justify-between">
          <TimeControls onTimeAdjust={onTimeAdjust} />
          
          {onShare && (
            <Button
              variant="outline"
              size="icon"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {episode && (
          <div className="pt-2 border-t border-border/50">
            <p className="text-sm text-muted-foreground">{episode}</p>
          </div>
        )}
      </div>
    </CardContent>
  )
}