"use client"

import { Rewind, FastForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TimeControlsProps } from "./types"

export function TimeControls({ onTimeAdjust }: TimeControlsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onTimeAdjust(-5)}
      >
        <Rewind className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onTimeAdjust(5)}
      >
        <FastForward className="h-4 w-4" />
      </Button>
    </div>
  )
}