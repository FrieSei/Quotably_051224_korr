"use client"

import { ScrollArea } from "@/components/ui/scroll-area"

interface TranscriptViewerProps {
  transcript?: string
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
  if (!transcript) return null

  return (
    <ScrollArea className="h-32 rounded-md border p-4">
      <p className="text-sm text-muted-foreground">{transcript}</p>
    </ScrollArea>
  )
}